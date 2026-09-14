'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';

import { CLUBS } from '@/content/clubs';
import { leerNombre, reasignarNombre } from '@/lib/dispositivo';
import { sortearClubPorDestino } from '@/lib/sorteo-club';
import {
  LEAGUES,
  MODOS,
  type Country,
  type LeagueId,
  type Club,
  type Modo,
} from '@/lib/engine/types';
import { useTintaClub } from '@/lib/tema';
import { Volanta } from './ui';
import { AvisoRecorrido } from './aviso-recorrido';
import { Bandera } from './bandera';
import { BarraSuperior } from './barra-superior';
import { CampoNombre } from './campo-nombre';
import { CampoSelect } from './campo-select';
import { Plegable } from './plegable';
import type { PasoRecorrido } from './recorrido';
import { PresidenciaDelDia } from './presidencia-del-dia';
import { Ranking } from './ranking';
import { SelectorClub } from './selector-club';
import { VitrinaPanel } from './vitrina';
import { IconoAjustes, IconoDado } from './iconos';

const PAISES: Country[] = ['argentina', 'uruguay', 'peru', 'colombia', 'chile', 'paraguay', 'bolivia', 'ecuador', 'venezuela', 'brasil'];

const PAIS_LABEL: Record<Country, string> = {
  argentina: 'Argentina', uruguay: 'Uruguay', peru: 'Perú', colombia: 'Colombia', chile: 'Chile',
  paraguay: 'Paraguay', bolivia: 'Bolivia', ecuador: 'Ecuador', venezuela: 'Venezuela', brasil: 'Brasil',
};

const LIGAS_POR_PAIS: Record<Country, LeagueId[]> = {
  argentina: ['ar-primera', 'ar-nacional', 'ar-b'],
  uruguay: ['uy-primera', 'uy-segunda'],
  peru: ['pe-primera', 'pe-segunda'],
  colombia: ['co-primera', 'co-segunda'],
  chile: ['cl-primera', 'cl-segunda'],
  paraguay: ['py-primera', 'py-segunda'],
  bolivia: ['bo-primera', 'bo-segunda'],
  ecuador: ['ec-primera', 'ec-segunda'],
  venezuela: ['ve-primera', 've-segunda'],
  brasil: ['br-primera', 'br-segunda'],
};

const PARTIDAS: Record<Modo, string> = {
  corta: 'Corta · 8 temporadas, 5 minutos',
  normal: 'Normal · 16 temporadas, 10 minutos',
  larga: 'Larga · 32 temporadas, 20 minutos',
  llamas: 'En llamas · 16 temporadas, brutal',
};

const PASOS_INICIO: PasoRecorrido[] = [
  {
    sel: '[data-recorrido="padron"]',
    titulo: 'Elegí tu club',
    cuerpo:
      'Elegí país, liga y club, o tocá Al azar para sortear los tres en ese orden.',
  },
  {
    sel: '[data-recorrido="nombre"]',
    titulo: 'Tu nombre',
    cuerpo:
      'Con este nombre firmás el acta y figurás en la tabla. Si lo dejás vacío firmás con el que te tocó; tocá el dado para sortear otro.',
  },
  {
    sel: '[data-recorrido="ajustes"]',
    titulo: 'Ajustes de la partida',
    cuerpo:
      'Abrí Personalizar partida para cambiar la duración o probar el modo En llamas.',
  },
  {
    sel: '[data-recorrido="diaria"]',
    titulo: 'La del día',
    cuerpo:
      'Una partida por día, la misma para todo el mundo, con su propio ranking. Se juega una sola vez: cuando la jugás, queda jugada hasta mañana.',
  },
  {
    sel: '[data-recorrido="asumir"]',
    titulo: 'Asumí el cargo',
    cuerpo: 'Con el club elegido, desde acá arrancás la presidencia.',
  },
];

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
  onAjustes,
}: {
  onEmpezar: (clubId: string, modo: Modo) => void;
  onEmpezarDiaria: () => void;
  enCurso?: EnCurso | null;
  onContinuar?: () => void;
  onAbandonar?: () => void;
  onAjustes?: () => void;
}) {
  const [elegido, setElegido] = useState<string | null>(null);
  const [pais, setPais] = useState<Country>('argentina');
  const [liga, setLiga] = useState<LeagueId>('ar-primera');
  const [modo, setModo] = useState<Modo>('normal');
  const [sorteo, setSorteo] = useState<{ paso: number; rodillos: string[][] } | null>(null);

  useEffect(() => {
    if (!sorteo) return;
    const terminar = () => setSorteo(null);
    const temporizador = window.setTimeout(() => {
      setSorteo((actual) => actual && actual.paso < 2 ? { ...actual, paso: actual.paso + 1 } : null);
    }, 800);
    const preferencia = window.matchMedia('(prefers-reduced-motion: reduce)');
    preferencia.addEventListener('change', terminar);
    return () => {
      window.clearTimeout(temporizador);
      preferencia.removeEventListener('change', terminar);
    };
  }, [sorteo]);

  const ligasDelPais = LIGAS_POR_PAIS[pais];

  const deLaLiga = useMemo(
    () => CLUBS.filter((c) => c.league === liga).sort((a, b) => b.size - a.size),
    [liga],
  );

  const club = elegido ? (CLUBS.find((c) => c.id === elegido) ?? null) : null;

  const cambiarPais = (valor: string) => {
    const nuevo = valor as Country;
    const nuevaLiga = LIGAS_POR_PAIS[nuevo][0];
    setPais(nuevo);
    setLiga(nuevaLiga);
    setElegido((actual) => {
      const c = actual ? CLUBS.find((x) => x.id === actual) : null;
      return c && c.league === nuevaLiga ? actual : null;
    });
  };

  const cambiarLiga = (valor: string) => {
    const nueva = valor as LeagueId;
    setLiga(nueva);
    setElegido((actual) => {
      const c = actual ? CLUBS.find((x) => x.id === actual) : null;
      return c && c.league === nueva ? actual : null;
    });
  };

  const sortear = () => {
    if (sorteo) {
      setSorteo(null);
      return;
    }
    const destino = sortearClubPorDestino(Math.random);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const rodillo = (opciones: string[], final: string) => [
        ...Array.from({ length: 11 }, () => opciones[Math.floor(Math.random() * opciones.length)]),
        final,
      ];
      setSorteo({ paso: 0, rodillos: [
        rodillo(PAISES.map((id) => PAIS_LABEL[id]), PAIS_LABEL[destino.pais]),
        rodillo(LIGAS_POR_PAIS[destino.pais].map((id) => LEAGUES[id].label), LEAGUES[destino.liga].label),
        rodillo(CLUBS.filter((c) => c.league === destino.liga).map((c) => c.name), destino.club.name),
      ] });
    }
    setPais(destino.pais);
    setLiga(destino.liga);
    setElegido(destino.club.id);
    if (!leerNombre().trim()) reasignarNombre(destino.pais);
  };

  return (
    <div className="palco-inicio">
      <div className="palco-cabecera">
      <div className="palco-navegacion">
        <BarraSuperior onAjustes={onAjustes} />
      </div>

      <header className="portada-inicio">
        <p className="portada-volanta">Tu club. Tu firma. Todo en juego.</p>
        <h1
          className="font-titular text-[clamp(2.75rem,11vw,4.5rem)] leading-[0.9] font-black tracking-[-0.03em] text-tinta uppercase"
          style={{ fontStretch: '80%' }}
        >
          El <span className="portada-nombre">Presidente</span>
        </h1>

        <p className="mt-2 font-cuerpo text-[1.0625rem] leading-snug text-tinta-2">
          Dirigí tu club. Ganá títulos. Que no te echen.
        </p>
      </header>

      </div>
      <div className="palco-contenido">
        <div className="min-w-0">
          {enCurso && onContinuar && onAbandonar && (
            <PanelEnCurso enCurso={enCurso} onContinuar={onContinuar} onAbandonar={onAbandonar} />
          )}
          <section className="ticket-inicio" aria-label="Nueva presidencia" data-sorteando={!!sorteo} data-club={club?.id}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-titular text-[1rem] font-black uppercase">Tu próximo club</h2>
              <button
                type="button"
                onClick={sortear}
                className="boton-sorteo flex min-h-11 shrink-0 items-center gap-2 px-3 font-tabla text-[0.75rem] tracking-[0.06em] uppercase"
              >
                <IconoDado />
                {sorteo ? 'Revelar' : 'Al azar'}
              </button>
            </div>

            <div data-recorrido="padron" className="mt-3 space-y-3" aria-busy={!!sorteo}>
              <div className="grid gap-3">
                <CampoSorteo etiqueta="País" paso={0} sorteo={sorteo}>
                  <CampoSelect etiqueta="País" valor={pais} onChange={cambiarPais} icono={<Bandera pais={pais} />}>
                    {PAISES.map((id) => <option key={id} value={id}>{PAIS_LABEL[id]}</option>)}
                  </CampoSelect>
                </CampoSorteo>
                <CampoSorteo etiqueta="Liga" paso={1} sorteo={sorteo}>
                  <CampoSelect etiqueta="Liga" valor={liga} onChange={cambiarLiga}>
                    {ligasDelPais.map((id) => <option key={id} value={id}>{LEAGUES[id].label}</option>)}
                  </CampoSelect>
                </CampoSorteo>
              </div>
              <CampoSorteo etiqueta="Club" paso={2} sorteo={sorteo}>
                <SelectorClub key={liga} clubes={deLaLiga} elegido={club} onElegir={setElegido} />
              </CampoSorteo>
            </div>
            <p className="mt-2 min-h-4 font-tabla text-[0.75rem] text-acento" role="status">
              {sorteo ? `${['Sorteando país…', `${PAIS_LABEL[pais]}: sorteando liga…`, `${PAIS_LABEL[pais]} · ${LEAGUES[liga].label}: sorteando club…`][sorteo.paso]} Tocá Revelar para saltear.` : club ? 'Todo listo para asumir.' : 'Elegí tu destino o sorteá país, liga y club.'}
            </p>

            <CampoNombre pais={pais} />

            <div data-recorrido="asumir" className="mt-6 pt-2">
              <button
                type="button"
                disabled={!club || !!sorteo}
                onClick={() => club && onEmpezar(club.id, modo)}
                className="boton-jugar w-full px-4 py-3.5 font-titular text-[0.9375rem] font-black tracking-[0.06em] uppercase"
              >
                Empezar mi presidencia <span className="flecha-accion" aria-hidden>→</span>
              </button>
              <p className="mt-2 text-center font-tabla text-[0.75rem] text-tinta-2" aria-live="polite">
                {club ? PARTIDAS[modo] : 'Elegí un club o probá Al azar'}
              </p>
            </div>

            <details data-recorrido="ajustes" className="personalizar-partida mt-4">
              <summary className="flex min-h-11 cursor-pointer items-center gap-3 p-3">
                <IconoAjustes />
                <span className="min-w-0 flex-1">
                  <span className="block font-tabla text-[0.75rem] text-tinta uppercase">Personalizar partida</span>
                  <span className="mt-1 block font-cuerpo text-[0.875rem] leading-snug text-tinta-2">Duración y dificultad</span>
                </span>
                <span className="indicador-mas" aria-hidden>+</span>
              </summary>
              <div className="personalizar-contenido p-3" inert={!!sorteo}>
                <CampoSelect etiqueta="Partida" valor={modo} onChange={(v) => setModo(v as Modo)}>
                  {MODOS.map((m) => (
                    <option key={m} value={m}>
                      {PARTIDAS[m]}
                    </option>
                  ))}
                </CampoSelect>

                {modo === 'llamas' && (
                  <p className="mt-2 border-l-2 border-alerta pl-3 font-cuerpo text-[0.875rem] leading-snug text-tinta-2">
                    Arrancás con 22 millones de deuda, sin poder comprar y con la gente en contra.
                    Vender jugadores es tu primera salida.
                  </p>
                )}

              </div>
            </details>
          </section>
          <AvisoRecorrido id="inicio" pasos={PASOS_INICIO} etiqueta="¿Primera vez?" />
        </div>

        <aside className="palco-secundario">
          <PresidenciaDelDia onJugar={onEmpezarDiaria} />
          <Plegable titulo="Tabla de posiciones" resumen="Quién llegó más lejos">
            <Ranking />
          </Plegable>

          <VitrinaPanel />
        </aside>
      </div>

      <PieDePagina />
    </div>
  );
}

function CampoSorteo({ etiqueta, paso, sorteo, children }: {
  etiqueta: string;
  paso: number;
  sorteo: { paso: number; rodillos: string[][] } | null;
  children: ReactNode;
}) {
  const pendiente = sorteo !== null && sorteo.paso <= paso;
  const girando = sorteo?.paso === paso;
  return (
    <div className="selector-sorteo relative min-w-0" data-paso={paso} data-estado={pendiente ? girando ? 'girando' : 'esperando' : 'resuelto'}>
      <div inert={!!sorteo} aria-hidden={pendiente} className={pendiente ? 'invisible' : undefined}>{children}</div>
      {pendiente && (
        <div className="absolute inset-0" aria-hidden="true">
          <p className="font-tabla text-[0.75rem] font-bold tracking-[0.1em] text-tinta-2 uppercase">{etiqueta}</p>
          <div className="sorteo-ventana">
            {girando ? (
              <div className="sorteo-rodillo">
                {sorteo.rodillos[paso].map((texto, i) => <div className="sorteo-club" key={i}><span>{texto}</span></div>)}
              </div>
            ) : <div className="sorteo-club text-tinta-2">{paso === 1 ? 'Esperando país…' : 'Esperando liga…'}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function PieDePagina() {
  const fuente = process.env.NEXT_PUBLIC_SOURCE_URL;

  return (
    <footer className="palco-pie">
      <p className="font-tabla text-[0.75rem] leading-relaxed tracking-[0.06em] text-tinta-2 uppercase">
        <Link
          href="/privacidad"
          className="-mx-2 -my-1 inline-block min-h-11 px-2 py-3 underline underline-offset-4 transition-colors hover:text-tinta"
        >
          Privacidad
        </Link>
        {fuente && (
          <>
            {' '}
            · Software libre bajo AGPL v3 ·{' '}
            <a
              href={fuente}
              target="_blank"
              rel="noreferrer"
              className="-mx-2 -my-1 inline-block min-h-11 px-2 py-3 underline underline-offset-4 transition-colors hover:text-tinta"
            >
              Código fuente
            </a>
          </>
        )}
      </p>
    </footer>
  );
}

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
  const tintaClub = useTintaClub(club);

  return (
    <div
      className="mb-6 border-b border-corondel pb-4"
      style={{ '--club': tintaClub } as CSSProperties}
    >
      <div className="grid gap-x-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Volanta>
          {terminada ? 'Tu última presidencia' : 'Presidencia en curso'}
          {diaria && ' · la del día'}
        </Volanta>

        <p className="mt-2 font-titular text-[20px] leading-tight font-black text-tinta sm:col-start-1">
          {club.name}
        </p>
        <p className="mt-1 font-tabla text-[0.75rem] text-tinta-2 tabular-nums sm:col-start-1">
          Temporada {season} · {year}
        </p>


        <button
          type="button"
          onClick={onContinuar}
          className="mt-3 min-h-11 border border-acento px-4 py-2 font-titular text-[0.875rem] font-bold text-acento sm:col-start-2 sm:row-start-2 sm:row-span-2 sm:mt-0"
        >
          {terminada ? 'Ver el epílogo' : 'Continuar'}
        </button>

        {confirmando ? (
          <div className="mt-3 border-t border-corondel pt-3 sm:col-span-2">
            <p className="font-cuerpo text-[0.875rem] leading-snug text-tinta">
              Si renunciás, esta presidencia se borra y no se puede recuperar.
            </p>
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={onAbandonar}
                className="min-h-11 flex-1 border border-alerta px-3 font-tabla text-[0.75rem] tracking-[0.1em] text-alerta uppercase transition-colors hover:bg-alerta/10"
              >
                Renunciar
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="min-h-11 flex-1 border border-corondel px-3 font-tabla text-[0.75rem] tracking-[0.1em] text-tinta-2 uppercase transition-colors hover:text-tinta"
              >
                Seguir
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="min-h-11 text-left font-tabla text-[0.75rem] text-tinta-2 underline underline-offset-4 hover:text-tinta sm:col-span-2"
          >
            Renunciar y empezar otra
          </button>
        )}
      </div>
    </div>
  );
}
