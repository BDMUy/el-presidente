'use client';

import { useState } from 'react';

import { LEAGUES, type Club, type Resources } from '@/lib/engine/types';
import { entero, plataCorta, socios } from '@/lib/format';
import { RECURSOS_POR_ID } from '@/lib/recursos';
import { Cifra } from './ui';

export interface HudProps {
  club: Club;
  resources: Resources;
  season: number;
  year: number;
  mandate: number;
  league: Club['league'];
  inhibido: boolean;
}

export function Hud({
  club,
  resources,
  season,
  year,
  mandate,
  league,
  inhibido,
}: HudProps) {
  const [abierto, setAbierto] = useState<keyof Resources | null>(null);

  const alternar = (campo: keyof Resources) =>
    setAbierto((actual) => (actual === campo ? null : campo));

  const detalle = abierto ? RECURSOS_POR_ID[abierto] : null;

  return (
    <header className="sticky top-0 z-20 border-b border-pano-borde bg-pano-alto/97 backdrop-blur">
      <div className="mx-auto max-w-xl">
        <div className="flex h-1.5" aria-hidden>
          <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
          <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
        </div>

        <div className="flex items-baseline justify-between gap-3 px-3 pt-2.5 sm:px-4">
          <h2 className="truncate font-display text-[15px] leading-none font-black tracking-tight text-papel">
            {club.name}
          </h2>
          <p className="shrink-0 font-acta text-[11px] font-bold tracking-[0.06em] text-papel-2 uppercase tabular-nums">
            T{season} · {year}
          </p>
        </div>

        <p className="mt-1 px-3 font-acta text-[11px] font-bold tracking-[0.06em] text-bronce-claro uppercase sm:px-4">
          {LEAGUES[league].label} · Mandato {mandate}
          {inhibido && <span className="ml-2 text-sello-claro">· inhibido</span>}
        </p>

        <div
          className="grid gap-1 px-2 py-2 sm:gap-2 sm:px-3"
          style={{ gridTemplateColumns: 'minmax(76px, 1fr) 1fr 0.85fr 0.9fr 1.15fr' }}
        >
          <Cifra
            label="Caja"
            valor={plataCorta(resources.caja)}
            alerta={resources.caja < 0}
            abierta={abierto === 'caja'}
            onToggle={() => alternar('caja')}
          />
          <Cifra
            label="Hinchada"
            valor={entero(resources.hinchada)}
            alerta={resources.hinchada < 25}
            abierta={abierto === 'hinchada'}
            onToggle={() => alternar('hinchada')}
          />
          <Cifra
            label="Socios"
            valor={socios(resources.socios)}
            abierta={abierto === 'socios'}
            onToggle={() => alternar('socios')}
          />
          <Cifra
            label="Plantel"
            valor={entero(resources.plantel)}
            abierta={abierto === 'plantel'}
            onToggle={() => alternar('plantel')}
          />
          <Cifra
            label="Influencia"
            valor={entero(resources.influencia)}
            abierta={abierto === 'influencia'}
            onToggle={() => alternar('influencia')}
          />
        </div>

        {detalle && (
          <div className="border-t border-linea bg-pano/60 px-3 py-3 sm:px-4">
            <p className="font-acta text-[11px] font-bold tracking-[0.1em] text-bronce-claro uppercase">
              {detalle.label}
            </p>
            <p className="mt-1.5 font-body text-[14px] leading-snug text-papel">{detalle.texto}</p>
            {detalle.limite && (
              <p className="mt-2 border-l-2 border-sello-claro pl-2.5 font-body text-[13px] leading-snug text-papel-2">
                {detalle.limite}
              </p>
            )}
            <button
              type="button"
              onClick={() => setAbierto(null)}
              className="mt-2.5 font-acta text-[11px] font-bold tracking-[0.1em] text-papel-2 uppercase underline underline-offset-4 hover:text-papel"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
