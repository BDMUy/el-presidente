'use client';

/**
 * Pantalla de arranque: la asamblea que te elige presidente.
 *
 * El padrón pasó por tres formas. Primero fue una lista de 64 clubes en una
 * columna: 5,7 pantallas de scroll en el celular y ninguna forma de encontrar
 * el tuyo. Después fue buscador más pestañas más una grilla de 64 celdas, que
 * arreglaba el encontrar pero seguía ocupando media pantalla de alto y dejaba
 * todo lo demás empujado hacia abajo.
 *
 * Ahora son dos campos: categoría y club. La lista la muestra el sistema
 * operativo encima de la página en vez de estirarla, y en escritorio escribir
 * las primeras letras salta a la opción, que era para lo que estaba el
 * buscador. El número que iba en cada celda —la posición que se espera del
 * club— va en el texto de cada opción, así que no se pierde nada al elegir.
 *
 * En escritorio se abre en dos paneles: identidad y decisiones a la izquierda,
 * el padrón y el club elegido a la derecha, porque una sola columna centrada
 * desperdiciaba el 58% del ancho.
 */

import { useMemo, useState } from 'react';

import { CLUBS } from '@/content/clubs';
import { mandatosDe } from '@/lib/engine/election';
import { expectedPosition } from '@/lib/engine/season';
import {
  CATEGORY_RULES,
  MODOS,
  TEMPORADAS_POR_MODO,
  type Category,
  type Club,
  type Modo,
} from '@/lib/engine/types';
import { Membrete, Sello } from './ui';
import { CampoNombre } from './campo-nombre';
import { CampoSelect } from './campo-select';
import { Plegable } from './plegable';
import { PresidenciaDelDia } from './presidencia-del-dia';
import { Ranking } from './ranking';
import { SelectorClub } from './selector-club';
import { VitrinaPanel } from './vitrina';

const CATEGORIAS: Category[] = ['primera', 'nacional', 'b'];

/**
 * Cada tipo de partida con su costo real al lado.
 *
 * El dato con el que se elige no es "corta" sino cuántas temporadas y cuánto
 * tiempo: nadie sabe qué significa una presidencia corta hasta que le decís
 * que son ocho temporadas y unos cinco minutos.
 *
 * En llamas dura lo mismo que la normal, así que lo que hay que decir al lado
 * no es el tiempo sino a qué se está entrando. Se dice sin vueltas: quien lo
 * elige tiene que saber que arranca perdiendo.
 *
 * Los cuatro textos están cortos por una razón medida: en un teléfono de 375
 * el select tiene 267px de ancho útil —el resto se lo llevan el padding y la
 * flecha— y las tres duraciones, con el "unos" adelante, medían 271, 301 y
 * 290. O sea que **las tres venían truncándose desde siempre** y nadie lo
 * había visto, porque lo que se corta es la cola: "unos 5 minu…". Sin el
 * "unos" quedan en 232, 262 y 252, y la cuarta en 243.
 */
const PARTIDAS: Record<Modo, string> = {
  corta: 'Corta · 8 temporadas, 5 minutos',
  normal: 'Normal · 16 temporadas, 10 minutos',
  larga: 'Larga · 32 temporadas, 20 minutos',
  llamas: 'En llamas · 16 temporadas, brutal',
};

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
  onEmpezar: (clubId: string, modo: Modo) => void;
  onEmpezarDiaria: () => void;
  enCurso?: EnCurso | null;
  onContinuar?: () => void;
  onAbandonar?: () => void;
}) {
  const [elegido, setElegido] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<Category>('primera');
  const [modo, setModo] = useState<Modo>('normal');

  // Ordenados por tamaño: el que abre la lista busca casi siempre un grande, y
  // alfabético dejaba a Boca en la mitad y a River al fondo.
  const deLaCategoria = useMemo(
    () => CLUBS.filter((c) => c.category === categoria).sort((a, b) => b.size - a.size),
    [categoria],
  );

  const club = elegido ? (CLUBS.find((c) => c.id === elegido) ?? null) : null;

  const cambiarCategoria = (valor: string) => {
    const nueva = valor as Category;
    setCategoria(nueva);
    // Se limpia el club si era de otra categoría: dejarlo elegido mientras la
    // lista de abajo muestra otra cosa es un campo que se contradice solo.
    setElegido((actual) => {
      const c = actual ? CLUBS.find((x) => x.id === actual) : null;
      return c && c.category === nueva ? actual : null;
    });
  };

  const sortear = () => {
    const sorteado = CLUBS[Math.floor(Math.random() * CLUBS.length)];
    setCategoria(sorteado.category);
    setElegido(sorteado.id);
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-10 lg:grid lg:grid-cols-[minmax(340px,420px)_1fr] lg:gap-10 lg:px-8">
      {/* ── Identidad y decisiones ───────────────────────────── */}
      {/* Alineado arriba, no centrado: con los dos paneles empezando en la
          misma línea se leen como una sola composición. */}
      <div className="pt-8 lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:pt-10 lg:pb-10">
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

        {/* Lo primero después de la presentación: si dejaste una presidencia a
            medias, retomarla es lo que viniste a hacer. */}
        {enCurso && onContinuar && onAbandonar && (
          <PanelEnCurso enCurso={enCurso} onContinuar={onContinuar} onAbandonar={onAbandonar} />
        )}

        {/* La del día no se pliega. Es lo que hace volver al otro día y tiene un
            reloj corriendo: escondida detrás de un "+" deja de existir. */}
        <div className="mt-6">
          <p className="font-acta text-[12px] font-bold tracking-[0.1em] text-papel-2 uppercase">
            Presidencia del día
          </p>
          <PresidenciaDelDia onJugar={onEmpezarDiaria} />
        </div>
      </div>

      {/* ── El padrón ────────────────────────────────────────── */}
      <div className="mt-8 lg:mt-0 lg:pt-10 lg:pb-10">
        {/* Centrado y no por línea de base: el botón necesita 44px de alto para
            ser tocable, y alineado por la base del texto ese alto lo empujaba
            fuera de eje contra el membrete. */}
        <div className="flex items-center justify-between gap-3">
          <Membrete sobrePano>El padrón</Membrete>
          <button
            type="button"
            onClick={sortear}
            className="flex min-h-11 shrink-0 items-center border border-linea px-4 font-acta text-[11px] tracking-[0.06em] text-bronce-claro uppercase transition-colors hover:border-bronce-claro hover:text-papel"
          >
            Al azar
          </button>
        </div>

        <div className="mt-3 border border-linea p-3 sm:p-4">
          {/* El tipo de partida va arriba y solo: es lo primero que se
              decide, y de todas las opciones del padrón es la única que cambia
              cuánto tiempo te va a llevar lo que estás por empezar —y, en el
              caso de la partida en llamas, con qué club te sentás. */}
          <CampoSelect
            etiqueta="Partida"
            valor={modo}
            onChange={(v) => setModo(v as Modo)}
          >
            {MODOS.map((m) => (
              <option key={m} value={m}>
                {PARTIDAS[m]}
              </option>
            ))}
          </CampoSelect>

          {modo === 'llamas' && (
            // Lo que estas cuatro líneas evitan: que alguien lo elija por
            // curiosidad, pierda en la temporada tres sin entender por qué, y
            // crea que el juego está roto. La dificultad avisada es un desafío;
            // la misma dificultad sin avisar es un error.
            <p className="mt-2 border-l-2 border-sello pl-3 font-body text-[14px] leading-snug text-papel-2">
              Recibís el club con 22 millones de deuda —inhibido, no podés
              comprar a nadie—, la hinchada en 40 cuando con menos de 45 perdés
              la elección, y un plantel demasiado bueno para lo que el club
              puede pagar. Venderlo es la única caja que hay.
            </p>
          )}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <CampoSelect etiqueta="Categoría" valor={categoria} onChange={cambiarCategoria}>
              {CATEGORIAS.map((id) => (
                <option key={id} value={id}>
                  {CATEGORY_RULES[id].label}
                </option>
              ))}
            </CampoSelect>

            {/* Este no es un select nativo: lleva la banda de colores de cada
                club, que en un `<option>` no entra —son dos colores, y encima
                en el celular la lista la dibuja el sistema operativo—. */}
            <SelectorClub clubes={deLaCategoria} elegido={club} onElegir={setElegido} />
          </div>

          {/* El nombre va acá y no arriba de todo: el orden del padrón es el
              de un trámite —de qué categoría, qué club, quién firma— y así lo
              último que se completa queda pegado al botón de asumir. */}
          <CampoNombre />
        </div>

        <div className="mt-4">
          {club ? (
            <PanelElegido club={club} modo={modo} onEmpezar={() => onEmpezar(club.id, modo)} />
          ) : (
            <PanelVacio />
          )}
        </div>

        {/* La tabla y la vitrina viven en esta columna y no en la de la
            izquierda por dos razones que apuntan al mismo lado. En escritorio,
            el padrón dejó de ser una grilla de 64 celdas y pasó a ser dos
            campos, así que la columna quedaba con 433px muertos abajo: más de
            la mitad vacía. Y en celular, quedan después del padrón, que es a
            lo que uno vino: primero elegís club, después mirás quién anduvo
            bien. */}
        <Plegable titulo="Tabla de posiciones" resumen="Quién llegó más lejos">
          <Ranking />
        </Plegable>

        {/* La vitrina no va adentro de un plegable: ya es uno. Tiene su propio
            botón, arranca cerrada y desaparece sola si todavía no jugaste
            ninguna presidencia. */}
        <VitrinaPanel />
      </div>
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
      <BandaSuperior club={club} />

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
function BandaSuperior({ club }: { club: Club }) {
  return (
    <div className="flex h-1.5" aria-hidden>
      <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
      <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
    </div>
  );
}

/** El estado antes de elegir: enseña qué significa el número de la lista. */
function PanelVacio() {
  return (
    <div className="border border-linea px-4 py-5">
      <p className="font-body text-[15px] leading-relaxed text-papel-2">
        Elegí un club del padrón. El número que ves al lado de cada uno es la posición que su gente
        espera: <span className="text-papel">contra eso te van a medir</span> durante dieciséis
        temporadas.
      </p>
    </div>
  );
}

function PanelElegido({
  club,
  modo,
  onEmpezar,
}: {
  club: Club;
  modo: Modo;
  onEmpezar: () => void;
}) {
  return (
    <div className="border border-bronce-claro/40 bg-pano-alto/60">
      <BandaSuperior club={club} />

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-[22px] leading-tight font-black text-papel sm:text-[26px]">
              {club.name}
            </h2>
            {club.nickname && (
              <p className="mt-0.5 font-body text-[14px] text-papel-2">{club.nickname}</p>
            )}
          </div>
          <Sello tono="bronce" sobrePano className="shrink-0">
            Elegido
          </Sello>
        </div>

        <dl className="mt-5 flex gap-8 border-t border-linea pt-4">
          <div>
            <dt className="font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
              Te esperan
            </dt>
            <dd className="font-display text-[26px] leading-none font-black text-papel tabular-nums">
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
            <dd className="truncate font-display text-[17px] leading-tight font-bold text-papel">
              {CATEGORY_RULES[club.category].label}
            </dd>
          </div>
          {/* La duración se repite acá, pegada al botón: es el campo de más
              arriba del padrón y lo elegís antes que el club, así que para
              cuando llegás a asumir ya no lo tenés a la vista. */}
          <div className="min-w-0">
            <dt className="font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
              Mandatos
            </dt>
            <dd className="font-display text-[17px] leading-tight font-bold text-papel tabular-nums">
              {mandatosDe(modo)}
              <span className="ml-1 font-acta text-[12px] font-normal text-papel-2">
                de {TEMPORADAS_POR_MODO[modo]} temp.
              </span>
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onEmpezar}
          className="mt-5 w-full bg-papel py-4 font-display text-[15px] font-black tracking-[0.1em] text-tinta uppercase transition-transform active:scale-[0.99]"
        >
          Asumir el cargo
        </button>
      </div>
    </div>
  );
}
