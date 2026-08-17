'use client';

/**
 * Pantalla de arranque: la asamblea que te elige presidente.
 *
 * El problema que resuelve este layout: había 64 clubes en una sola columna,
 * 5,7 pantallas de scroll en el celular, y ninguna forma de encontrar el tuyo.
 * Nadie quiere recorrer 64 filas para llegar a Excursionistas. La búsqueda es
 * la afordancia principal, no un extra: el caso común es que ya sabés qué club
 * querés y solo hace falta escribir tres letras.
 *
 * En escritorio se abre en dos paneles —identidad y decisión a la izquierda,
 * padrón a la derecha— porque una sola columna centrada desperdiciaba el 58%
 * del ancho y dejaba el botón de asumir lejísimos de la lista.
 */

import { useDeferredValue, useMemo, useState } from 'react';

import { CLUBS } from '@/content/clubs';
import { expectedPosition } from '@/lib/engine/season';
import { CATEGORY_RULES, type Category, type Club } from '@/lib/engine/types';
import { Membrete, Sello } from './ui';
import { CampoNombre } from './campo-nombre';
import { Plegable } from './plegable';
import { PresidenciaDelDia } from './presidencia-del-dia';
import { Ranking } from './ranking';
import { VitrinaPanel } from './vitrina';

const PESTANAS: { id: Category; corto: string }[] = [
  { id: 'primera', corto: 'Primera' },
  { id: 'nacional', corto: 'Nacional' },
  { id: 'b', corto: 'Primera B' },
];

/** Quita acentos y mayúsculas: buscar "velez" tiene que encontrar "Vélez". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** La presidencia que quedó a medias, si hay alguna. */
export interface EnCurso {
  club: Club;
  season: number;
  year: number;
  diaria: boolean;
  terminada: boolean;
}

export function Arranque({
  onEmpezar,
  onEmpezarDiaria,
  enCurso = null,
  onContinuar,
  onAbandonar,
}: {
  onEmpezar: (clubId: string) => void;
  onEmpezarDiaria: () => void;
  enCurso?: EnCurso | null;
  onContinuar?: () => void;
  onAbandonar?: () => void;
}) {
  const [elegido, setElegido] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<Category>('primera');

  // El filtrado corre sobre 64 items en cada tecla; diferirlo mantiene el
  // input fluido aunque el dispositivo sea lento.
  const consulta = useDeferredValue(busqueda);

  /**
   * Buscar manda sobre la pestaña: si escribís "quilmes" estando en Primera,
   * querés encontrarlo igual. Una búsqueda que respeta el filtro activo
   * devuelve "sin resultados" para algo que sí existe, y eso se siente roto.
   */
  const { visibles, buscando } = useMemo(() => {
    const q = normalizar(consulta.trim());
    if (q.length > 0) {
      return {
        buscando: true,
        visibles: CLUBS.filter(
          (c) => normalizar(c.name).includes(q) || normalizar(c.nickname ?? '').includes(q),
        ),
      };
    }
    return {
      buscando: false,
      visibles: CLUBS.filter((c) => c.category === categoria).sort((a, b) => b.size - a.size),
    };
  }, [consulta, categoria]);

  const club = elegido ? (CLUBS.find((c) => c.id === elegido) ?? null) : null;

  const sortear = () => {
    const sorteado = CLUBS[Math.floor(Math.random() * CLUBS.length)];
    setElegido(sorteado.id);
    setBusqueda('');
    setCategoria(sorteado.category);
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-28 lg:grid lg:grid-cols-[minmax(340px,420px)_1fr] lg:gap-10 lg:px-8 lg:pb-8">
      {/* ── Identidad y decisión ─────────────────────────────── */}
      {/* Alineado arriba, no centrado: con los dos paneles empezando en la
          misma línea se leen como una sola composición. Centrado vertical,
          el título flotaba a media altura contra una grilla que arrancaba
          arriba y parecían dos páginas distintas. */}
      <div className="pt-8 lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:pt-10">
        <Membrete sobrePano>Asamblea ordinaria de socios</Membrete>

        {/* El techo de 3rem no es estético: "PRESIDENTE" a 4,5rem se desbordaba
            de una columna de 380px. El ancho de la columna es parte del tamaño
            tipográfico. */}
        <h1 className="mt-3 font-display text-[clamp(2.5rem,11vw,3.75rem)] leading-[0.86] font-black tracking-[-0.03em] text-papel uppercase lg:text-[3rem] xl:text-[3.5rem]">
          El
          <br />
          Presidente
        </h1>

        {/* El énfasis va por peso, no por color: cambiar de color dentro de un
            párrafo obliga a un segundo tono que compita con el primario. */}
        <p className="mt-4 max-w-[46ch] font-body text-[15px] leading-relaxed text-papel lg:mt-6 lg:text-[16px]">
          Ganás la elección y tenés cuatro mandatos para que no te echen. Manejás la caja, la
          hinchada y la influencia.{' '}
          <span className="font-semibold">Vos armás el plantel; el plantel juega.</span>
        </p>

        <CampoNombre />

        {/* Lo primero después del título: si dejaste una presidencia a medias,
            retomarla es lo que viniste a hacer. Va antes que la del día. */}
        {enCurso && onContinuar && onAbandonar && (
          <PanelEnCurso enCurso={enCurso} onContinuar={onContinuar} onAbandonar={onAbandonar} />
        )}

        <Plegable
          titulo="Presidencia del día"
          resumen="La misma partida para todos, hasta la medianoche"
          abiertoPorDefecto
        >
          <PresidenciaDelDia onJugar={onEmpezarDiaria} />
        </Plegable>

        <Plegable titulo="Tabla de posiciones" resumen="Quién llegó más lejos">
          <Ranking />
        </Plegable>

        {/* La vitrina no va adentro de un plegable: ya es uno. Tiene su propio
            botón, arranca cerrada y desaparece sola si todavía no jugaste
            ninguna presidencia. Envolverla dejaba dos controles anidados para
            abrir la misma cosa. */}
        <VitrinaPanel />

        {/* En escritorio la decisión vive acá, al lado del padrón. En celular
            se muestra en la barra fija de abajo. */}
        <div className="mt-6 hidden pb-10 lg:block">
          {club ? <PanelElegido club={club} onEmpezar={() => onEmpezar(club.id)} /> : <PanelVacio />}
        </div>
      </div>

      {/* ── El padrón ────────────────────────────────────────── */}
      <div className="mt-8 lg:mt-0 lg:pt-10 lg:pb-10">
        <div className="sticky top-0 z-20 -mx-4 bg-pano/95 px-4 pt-3 pb-3 backdrop-blur lg:-mx-2 lg:px-2">
          <div className="flex items-center gap-2">
            <label className="relative flex-1">
              <span className="sr-only">Buscar club por nombre o apodo</span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscá tu club"
                autoComplete="off"
                className="w-full border border-linea bg-pano-alto px-3 py-2.5 font-body text-[15px] text-papel placeholder:text-papel-2 focus:border-bronce-claro focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={sortear}
              className="shrink-0 border border-linea px-3 py-2.5 font-acta text-[12px] tracking-[0.06em] text-bronce-claro uppercase transition-colors hover:border-bronce-claro hover:text-papel"
            >
              Al azar
            </button>
          </div>

          {/* Las pestañas se ocultan mientras buscás: la búsqueda ya barre
              todas las categorías y dos filtros a la vez confunden. */}
          {!buscando && (
            <div className="mt-2.5 flex gap-1.5" role="tablist" aria-label="Categoría">
              {PESTANAS.map((p) => {
                const activa = p.id === categoria;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={activa}
                    onClick={() => setCategoria(p.id)}
                    className={`flex-1 border px-2 py-2.5 font-acta text-[11px] tracking-[0.04em] uppercase transition-colors ${
                      activa
                        ? 'border-bronce-claro bg-bronce-claro/15 text-papel'
                        : 'border-linea text-papel-2 hover:border-papel-2 hover:text-papel'
                    }`}
                  >
                    {p.corto}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-3 font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
          {buscando
            ? `${visibles.length} ${visibles.length === 1 ? 'club' : 'clubes'}`
            : CATEGORY_RULES[categoria].label}
        </p>

        {visibles.length === 0 ? (
          <p className="mt-8 font-body text-[15px] text-papel-2">
            No hay ningún club con ese nombre. Probá con el apodo, o tocá{' '}
            <span className="text-papel">Al azar</span>.
          </p>
        ) : (
          <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-4">
            {visibles.map((c) => (
              <CeldaClub
                key={c.id}
                club={c}
                elegido={c.id === elegido}
                onElegir={() => setElegido(c.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* ── Barra fija, solo en celular ──────────────────────── */}
      {club && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-pano-borde bg-pano-alto/97 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <BandaClub club={club} className="h-9 w-1.5" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[15px] leading-tight font-black text-papel">
                {club.name}
              </p>
              <p className="font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
                Te esperan {expectedPosition(club, club.category)}° de{' '}
                {CATEGORY_RULES[club.category].teams}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEmpezar(club.id)}
              className="shrink-0 bg-papel px-5 py-3 font-display text-[14px] font-black tracking-[0.1em] text-tinta uppercase transition-transform active:scale-[0.98]"
            >
              Asumir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * La presidencia a medias, para retomarla.
 *
 * Renunciar vive acá y no adentro del juego: es la única pantalla donde se ve
 * qué se está por tirar —el club, la temporada, si era la del día— antes de
 * tirarlo. Y pide confirmación, porque es la única acción del juego que
 * destruye algo y no se puede deshacer.
 */
function PanelEnCurso({
  enCurso,
  onContinuar,
  onAbandonar,
}: {
  enCurso: EnCurso;
  onContinuar: () => void;
  onAbandonar: () => void;
}) {
  const [confirmando, setConfirmando] = useState(false);
  const { club, season, year, diaria, terminada } = enCurso;

  return (
    <div className="mt-6 border border-bronce-claro/40 bg-pano-alto/60">
      <div className="flex h-1.5" aria-hidden>
        <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
        <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
      </div>

      <div className="px-4 py-4">
        <Membrete sobrePano>
          {terminada ? 'Tu última presidencia' : 'Presidencia en curso'}
          {diaria && ' · la del día'}
        </Membrete>

        <p className="mt-2 font-display text-[20px] leading-tight font-black text-papel">
          {club.name}
        </p>
        <p className="mt-0.5 font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase tabular-nums">
          Temporada {season} · {year}
        </p>

        <button
          type="button"
          onClick={onContinuar}
          className="mt-4 w-full bg-papel py-3.5 font-display text-[14px] font-black tracking-[0.1em] text-tinta uppercase transition-transform active:scale-[0.99]"
        >
          {terminada ? 'Ver el epílogo' : 'Continuar'}
        </button>

        {confirmando ? (
          <div className="mt-3 border-t border-linea pt-3">
            <p className="font-body text-[14px] leading-snug text-papel">
              Si renunciás, esta presidencia se borra y no se puede recuperar.
            </p>
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={onAbandonar}
                className="min-h-11 flex-1 border border-sello-claro px-3 font-acta text-[11px] tracking-[0.1em] text-sello-claro uppercase transition-colors hover:bg-sello-claro/10"
              >
                Renunciar
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="min-h-11 flex-1 border border-linea px-3 font-acta text-[11px] tracking-[0.1em] text-papel-2 uppercase transition-colors hover:text-papel"
              >
                Seguir
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="mt-2 min-h-11 w-full font-acta text-[11px] tracking-[0.14em] text-papel-2 uppercase underline underline-offset-4 transition-colors hover:text-papel"
          >
            Renunciar y empezar otra
          </button>
        )}
      </div>
    </div>
  );
}

/** La banda con los colores del club: lo único suyo que no es su nombre. */
function BandaClub({ club, className = '' }: { club: Club; className?: string }) {
  return (
    <span className={`flex shrink-0 flex-col overflow-hidden rounded-full ${className}`} aria-hidden>
      <span className="flex-1" style={{ backgroundColor: club.colors[0] }} />
      <span className="flex-1" style={{ backgroundColor: club.colors[1] }} />
    </span>
  );
}

function CeldaClub({
  club,
  elegido,
  onElegir,
}: {
  club: Club;
  elegido: boolean;
  onElegir: () => void;
}) {
  const esperada = expectedPosition(club, club.category);
  const { teams } = CATEGORY_RULES[club.category];

  return (
    <li>
      <button
        type="button"
        onClick={onElegir}
        aria-pressed={elegido}
        className={`flex h-full w-full items-center gap-2.5 border px-2.5 py-2.5 text-left transition-colors ${
          elegido
            ? 'border-bronce-claro bg-bronce-claro/15'
            : 'border-linea hover:border-papel-2 hover:bg-papel/5'
        }`}
      >
        <BandaClub club={club} className="h-8 w-1.5" />
        <span className="min-w-0 flex-1">
          {/* En la grilla va el nombre corto: "Estudiantes de La Plata" no
              entra en media pantalla de celular y truncado se lee peor que
              abreviado. El nombre completo aparece al elegirlo. */}
          <span className="block truncate font-display text-[14px] leading-tight font-bold tracking-tight text-papel">
            {club.short}
          </span>
          <span className="mt-0.5 block font-acta text-[11px] tracking-[0.04em] text-papel-2 tabular-nums">
            {esperada}° de {teams}
          </span>
        </span>
      </button>
    </li>
  );
}

/** El estado del panel de escritorio antes de elegir: enseña qué significa el número. */
function PanelVacio() {
  return (
    <div className="border border-linea px-4 py-5">
      <p className="font-body text-[14px] leading-relaxed text-papel-2">
        Elegí un club del padrón. El número que ves al lado de cada uno es la posición que su
        gente espera: <span className="text-papel">contra eso te van a medir</span> durante
        dieciséis temporadas.
      </p>
    </div>
  );
}

function PanelElegido({ club, onEmpezar }: { club: Club; onEmpezar: () => void }) {
  return (
    <div className="border border-bronce-claro/40 bg-pano-alto/60">
      <div className="flex h-1.5" aria-hidden>
        <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
        <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
      </div>

      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-[20px] leading-tight font-black text-papel">
              {club.name}
            </h2>
            {club.nickname && (
              <p className="mt-0.5 font-body text-[13px] text-papel-2">{club.nickname}</p>
            )}
          </div>
          <Sello tono="bronce" sobrePano className="shrink-0">
            Elegido
          </Sello>
        </div>

        <dl className="mt-4 flex gap-6 border-t border-linea pt-3">
          <div>
            <dt className="font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
              Te esperan
            </dt>
            <dd className="font-display text-[22px] leading-none font-black tabular-nums text-papel">
              {expectedPosition(club, club.category)}°
              <span className="ml-1 font-acta text-[12px] font-normal text-papel-2">
                de {CATEGORY_RULES[club.category].teams}
              </span>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
              Categoría
            </dt>
            <dd className="truncate font-display text-[15px] leading-tight font-bold text-papel">
              {CATEGORY_RULES[club.category].label}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onEmpezar}
          className="mt-4 w-full bg-papel py-3.5 font-display text-[14px] font-black tracking-[0.1em] text-tinta uppercase transition-transform active:scale-[0.99]"
        >
          Asumir el cargo
        </button>
      </div>
    </div>
  );
}
