'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';

import { CLUBS } from '@/content/clubs';
import { leerNombre, reasignarNombre } from '@/lib/dispositivo';
import { mandatosDe } from '@/lib/engine/election';
import { expectedPosition } from '@/lib/engine/season';
import {
  countryOf,
  LEAGUES,
  MODOS,
  TEMPORADAS_POR_MODO,
  type Country,
  type LeagueId,
  type Club,
  type Modo,
} from '@/lib/engine/types';
import { useTintaClub } from '@/lib/tema';
import { Bajada, Ladillo, Volanta } from './ui';
import { AvisoRecorrido } from './aviso-recorrido';
import { BarraSuperior } from './barra-superior';
import { CampoNombre } from './campo-nombre';
import { CampoSelect } from './campo-select';
import { Plegable } from './plegable';
import type { PasoRecorrido } from './recorrido';
import { PresidenciaDelDia } from './presidencia-del-dia';
import { Ranking } from './ranking';
import { SelectorClub } from './selector-club';
import { VitrinaPanel } from './vitrina';

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

const MODO_LABEL: Record<Modo, string> = {
  corta: 'Corta',
  normal: 'Normal',
  larga: 'Larga',
  llamas: 'En llamas',
};

const PASOS_INICIO: PasoRecorrido[] = [
  {
    sel: '[data-recorrido="padron"]',
    titulo: 'Elegí tu club',
    cuerpo:
      'Buscá en el padrón el club que vas a dirigir. El número al lado es la posición que su gente espera: contra eso te miden. "Al azar" te sortea uno.',
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
      'Acá elegís cuánto dura la presidencia —de 8 a 32 temporadas— y el país y la categoría del padrón.',
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
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    setFecha(new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  const ligasDelPais = LIGAS_POR_PAIS[pais];

  const deLaLiga = useMemo(
    () => CLUBS.filter((c) => c.league === liga).sort((a, b) => b.size - a.size),
    [liga],
  );

  const club = elegido ? (CLUBS.find((c) => c.id === elegido) ?? null) : null;

  const resumenAjustes = `${MODO_LABEL[modo]} · ${PAIS_LABEL[pais]} · ${LEAGUES[liga].label}`;

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
    const sorteado = CLUBS[Math.floor(Math.random() * CLUBS.length)];
    setPais(countryOf(sorteado.league));
    setLiga(sorteado.league);
    setElegido(sorteado.id);
    if (!leerNombre().trim()) reasignarNombre();
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-10 pl-[max(1rem,var(--sae-left))] pr-[max(1rem,var(--sae-right))] lg:px-8">
      <div className="pt-3 lg:pt-4">
        <BarraSuperior onAjustes={onAjustes} />
      </div>

      <AvisoRecorrido id="inicio" pasos={PASOS_INICIO} etiqueta="Primera vez acá" />

      <header className="pt-8 lg:pt-10">
        <p className="border-b border-corondel pb-1.5 font-tabla text-[11px] tracking-[0.14em] text-tinta-2 uppercase">
          {fecha || '···'} · Asamblea ordinaria de socios
        </p>

        <h1
          className="mt-4 border-t-4 border-b-2 border-tinta py-3 font-titular text-[clamp(2.75rem,11vw,4.5rem)] leading-[0.86] font-black tracking-[-0.03em] text-tinta uppercase"
          style={{ fontStretch: '80%' }}
        >
          El Presidente
        </h1>

        <Bajada className="mt-4 max-w-[52ch]">
          Ganás la elección y tenés cuatro mandatos para que no te echen. Manejás la caja, la
          hinchada y la influencia. Vos armás el plantel; el plantel juega.
        </Bajada>
      </header>

      {enCurso && onContinuar && onAbandonar && (
        <PanelEnCurso enCurso={enCurso} onContinuar={onContinuar} onAbandonar={onAbandonar} />
      )}

      <PresidenciaDelDia onJugar={onEmpezarDiaria} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(300px,360px)] lg:items-start lg:divide-x lg:divide-corondel">
        <div className="min-w-0 lg:pr-10">
          <div data-recorrido="padron" className="flex items-center justify-between gap-3">
            <Volanta as="h2">El padrón</Volanta>
            <button
              type="button"
              onClick={sortear}
              className="flex min-h-11 shrink-0 items-center border border-corondel px-4 font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase transition-colors hover:border-tinta hover:text-tinta"
            >
              Al azar
            </button>
          </div>

          <div className="mt-3">
            <SelectorClub clubes={deLaLiga} elegido={club} onElegir={setElegido} />
          </div>

          <Plegable titulo="Ajustes de la partida" resumen={resumenAjustes} ancla="ajustes">
            <CampoSelect etiqueta="Partida" valor={modo} onChange={(v) => setModo(v as Modo)}>
              {MODOS.map((m) => (
                <option key={m} value={m}>
                  {PARTIDAS[m]}
                </option>
              ))}
            </CampoSelect>

            {modo === 'llamas' && (
              <p className="mt-2 border-l-2 border-alerta pl-3 font-cuerpo text-[14px] leading-snug text-tinta-2">
                Recibís el club con 22 millones de deuda —inhibido, no podés
                comprar a nadie—, la hinchada en 40 cuando con menos de 45 perdés
                la elección, y un plantel demasiado bueno para lo que el club
                puede pagar. Venderlo es la única caja que hay.
              </p>
            )}

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <CampoSelect etiqueta="País" valor={pais} onChange={cambiarPais}>
                {PAISES.map((id) => (
                  <option key={id} value={id}>
                    {PAIS_LABEL[id]}
                  </option>
                ))}
              </CampoSelect>

              <CampoSelect etiqueta="Categoría" valor={liga} onChange={cambiarLiga}>
                {ligasDelPais.map((id) => (
                  <option key={id} value={id}>
                    {LEAGUES[id].label}
                  </option>
                ))}
              </CampoSelect>
            </div>
          </Plegable>

          <CampoNombre pais={pais} />

          <div data-recorrido="asumir" className="mt-7">
            {club ? (
              <PanelElegido club={club} modo={modo} onEmpezar={() => onEmpezar(club.id, modo)} />
            ) : (
              <PanelVacio modo={modo} />
            )}
          </div>
        </div>

        <div className="min-w-0 lg:pl-10">
          <Volanta as="h2">Antecedentes</Volanta>
          <Plegable titulo="Tabla de posiciones" resumen="Quién llegó más lejos" abiertoPorDefecto>
            <Ranking />
          </Plegable>

          <VitrinaPanel />
        </div>
      </div>

      <PieDePagina />
    </div>
  );
}

function PieDePagina() {
  const fuente = process.env.NEXT_PUBLIC_SOURCE_URL;

  return (
    <footer className="mt-10 border-t border-corondel pt-4">
      <p className="font-tabla text-[11px] leading-relaxed tracking-[0.06em] text-tinta-2 uppercase">
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
      className="mt-6 border border-[var(--club)]/50 bg-fondo-2/60"
      style={{ '--club': tintaClub } as CSSProperties}
    >
      <div className="px-4 py-4">
        <Volanta>
          {terminada ? 'Tu última presidencia' : 'Presidencia en curso'}
          {diaria && ' · la del día'}
        </Volanta>

        <p className="mt-2 font-titular text-[20px] leading-tight font-black text-tinta">
          {club.name}
        </p>
        <p className="mt-0.5 font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase tabular-nums">
          Temporada {season} · {year}
        </p>

        {!terminada && (
          <p className="mt-2 font-cuerpo text-[13px] leading-snug text-tinta-2">
            Tu presidencia queda guardada.
          </p>
        )}

        <button
          type="button"
          onClick={onContinuar}
          className="mt-4 w-full bg-[var(--club)] py-3.5 font-titular text-[14px] font-black tracking-[0.1em] text-fondo uppercase transition-opacity active:opacity-90"
        >
          {terminada ? 'Ver el epílogo' : 'Continuar'}
        </button>

        {confirmando ? (
          <div className="mt-3 border-t border-corondel pt-3">
            <p className="font-cuerpo text-[14px] leading-snug text-tinta">
              Si renunciás, esta presidencia se borra y no se puede recuperar.
            </p>
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={onAbandonar}
                className="min-h-11 flex-1 border border-alerta px-3 font-tabla text-[11px] tracking-[0.1em] text-alerta uppercase transition-colors hover:bg-alerta/10"
              >
                Renunciar
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="min-h-11 flex-1 border border-corondel px-3 font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase transition-colors hover:text-tinta"
              >
                Seguir
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="mt-2 min-h-11 w-full font-tabla text-[11px] tracking-[0.14em] text-tinta-2 uppercase underline underline-offset-4 transition-colors hover:text-tinta"
          >
            Renunciar y empezar otra
          </button>
        )}
      </div>
    </div>
  );
}

function PanelVacio({ modo }: { modo: Modo }) {
  return (
    <div className="border border-corondel px-4 py-4 sm:px-5 sm:py-5">
      <p className="font-cuerpo text-[15px] leading-relaxed text-tinta-2">
        Elegí un club del padrón. El número que ves al lado de cada uno es la posición que su gente
        espera: <span className="text-tinta">contra eso te van a medir</span> durante{' '}
        {TEMPORADAS_POR_MODO[modo]} temporadas.
      </p>

      <button
        type="button"
        disabled
        className="mt-5 w-full cursor-not-allowed border border-corondel py-4 font-titular text-[15px] font-black tracking-[0.1em] text-tinta-3 uppercase"
      >
        Asumir el cargo
      </button>
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
  const tintaClub = useTintaClub(club);

  return (
    <div
      className="border border-[var(--club)]/50 bg-fondo-2/60"
      style={{ '--club': tintaClub } as CSSProperties}
    >
      <div className="border-t-4 border-[var(--club)] px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-titular text-[22px] leading-tight font-black text-tinta sm:text-[26px]">
              {club.name}
            </h2>
            {club.nickname && (
              <p className="mt-0.5 font-cuerpo text-[14px] text-tinta-2">{club.nickname}</p>
            )}
          </div>
          <Ladillo tono="club" className="shrink-0">
            Elegido
          </Ladillo>
        </div>

        <dl className="mt-5 flex gap-8 border-t border-corondel pt-4">
          <div>
            <dt className="font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
              Te esperan
            </dt>
            <dd className="font-titular text-[26px] leading-none font-black text-tinta tabular-nums">
              {expectedPosition(club, club.league)}°
              <span className="ml-1 font-tabla text-[12px] font-normal text-tinta-2">
                de {LEAGUES[club.league].teams}
              </span>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
              Categoría
            </dt>
            <dd className="truncate font-titular text-[17px] leading-tight font-bold text-tinta">
              {LEAGUES[club.league].label}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
              Mandatos
            </dt>
            <dd className="font-titular text-[17px] leading-tight font-bold text-tinta tabular-nums">
              {mandatosDe(modo)}
              <span className="ml-1 font-tabla text-[12px] font-normal text-tinta-2">
                de {TEMPORADAS_POR_MODO[modo]} temp.
              </span>
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onEmpezar}
          className="mt-5 w-full bg-[var(--club)] py-4 font-titular text-[15px] font-black tracking-[0.1em] text-fondo uppercase transition-opacity active:opacity-90"
        >
          Asumir el cargo
        </button>
      </div>
    </div>
  );
}
