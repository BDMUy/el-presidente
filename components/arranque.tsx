'use client';

import { useMemo, useState } from 'react';

import { CLUBS } from '@/content/clubs';
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
import { Membrete, Sello } from './ui';
import { CampoNombre } from './campo-nombre';
import { CampoSelect } from './campo-select';
import { Plegable } from './plegable';
import { PresidenciaDelDia } from './presidencia-del-dia';
import { Ranking } from './ranking';
import { SelectorClub } from './selector-club';
import { VitrinaPanel } from './vitrina';

const PAISES: Country[] = ['argentina', 'uruguay', 'peru'];

const PAIS_LABEL: Record<Country, string> = { argentina: 'Argentina', uruguay: 'Uruguay', peru: 'Perú' };

const LIGAS_POR_PAIS: Record<Country, LeagueId[]> = {
  argentina: ['ar-primera', 'ar-nacional', 'ar-b'],
  uruguay: ['uy-primera', 'uy-segunda'],
  peru: ['pe-primera', 'pe-segunda'],
};

const PARTIDAS: Record<Modo, string> = {
  corta: 'Corta · 8 temporadas, 5 minutos',
  normal: 'Normal · 16 temporadas, 10 minutos',
  larga: 'Larga · 32 temporadas, 20 minutos',
  llamas: 'En llamas · 16 temporadas, brutal',
};

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
  const [pais, setPais] = useState<Country>('argentina');
  const [liga, setLiga] = useState<LeagueId>('ar-primera');
  const [modo, setModo] = useState<Modo>('normal');

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
    const sorteado = CLUBS[Math.floor(Math.random() * CLUBS.length)];
    setPais(countryOf(sorteado.league));
    setLiga(sorteado.league);
    setElegido(sorteado.id);
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-10 lg:grid lg:grid-cols-[minmax(340px,420px)_1fr] lg:gap-10 lg:px-8">
      <div className="pt-8 lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:pt-10 lg:pb-10">
        <Membrete sobrePano>Asamblea ordinaria de socios</Membrete>

        <h1 className="mt-3 font-display text-[clamp(2.5rem,11vw,3.75rem)] leading-[0.86] font-black tracking-[-0.03em] text-papel uppercase lg:text-[3rem] xl:text-[3.5rem]">
          El
          <br />
          Presidente
        </h1>

        <p className="mt-4 max-w-[46ch] font-body text-[15px] leading-relaxed text-papel lg:mt-6 lg:text-[16px]">
          Ganás la elección y tenés cuatro mandatos para que no te echen. Manejás la caja, la
          hinchada y la influencia.{' '}
          <span className="font-semibold">Vos armás el plantel; el plantel juega.</span>
        </p>

        {enCurso && onContinuar && onAbandonar && (
          <PanelEnCurso enCurso={enCurso} onContinuar={onContinuar} onAbandonar={onAbandonar} />
        )}

        <div className="mt-6">
          <p className="font-acta text-[12px] font-bold tracking-[0.1em] text-papel-2 uppercase">
            Presidencia del día
          </p>
          <PresidenciaDelDia onJugar={onEmpezarDiaria} />
        </div>
      </div>

      <div className="mt-8 lg:mt-0 lg:pt-10 lg:pb-10">
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
            <p className="mt-2 border-l-2 border-sello pl-3 font-body text-[14px] leading-snug text-papel-2">
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

          <div className="mt-3">
            <SelectorClub clubes={deLaLiga} elegido={club} onElegir={setElegido} />
          </div>

          <CampoNombre />
        </div>

        <div className="mt-4">
          {club ? (
            <PanelElegido club={club} modo={modo} onEmpezar={() => onEmpezar(club.id, modo)} />
          ) : (
            <PanelVacio />
          )}
        </div>

        <Plegable titulo="Tabla de posiciones" resumen="Quién llegó más lejos">
          <Ranking />
        </Plegable>

        <VitrinaPanel />

        <PieDeLicencia />
      </div>
    </div>
  );
}

function PieDeLicencia() {
  const fuente = process.env.NEXT_PUBLIC_SOURCE_URL;
  if (!fuente) return null;

  return (
    <p className="mt-4 font-acta text-[11px] leading-relaxed tracking-[0.06em] text-papel-2 uppercase">
      Software libre bajo AGPL v3 ·{' '}
      <a
        href={fuente}
        target="_blank"
        rel="noreferrer"
        className="-mx-2 -my-1 inline-block px-2 py-3 underline underline-offset-4 transition-colors hover:text-papel"
      >
        Código fuente
      </a>
    </p>
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

function BandaSuperior({ club }: { club: Club }) {
  return (
    <div className="flex h-1.5" aria-hidden>
      <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
      <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
    </div>
  );
}

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
              {expectedPosition(club, club.league)}°
              <span className="ml-1 font-acta text-[12px] font-normal text-papel-2">
                de {LEAGUES[club.league].teams}
              </span>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
              Categoría
            </dt>
            <dd className="truncate font-display text-[17px] leading-tight font-bold text-papel">
              {LEAGUES[club.league].label}
            </dd>
          </div>
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
