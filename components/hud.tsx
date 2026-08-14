'use client';

/**
 * El carnet: la barra fija de arriba.
 *
 * Está armada como un carnet de socio —banda con los colores del club, número
 * de temporada, y las cinco cifras como renglones de balance— en vez de como
 * un marcador deportivo. El jugador es dirigente, no futbolista, y lo primero
 * que ve tiene que decirlo.
 *
 * Cada cifra se puede tocar para desplegar qué significa. Es la alternativa
 * correcta al tooltip: el juego se juega en el celular, y en touch el hover no
 * existe.
 */

import { useState } from 'react';

import { CATEGORY_RULES, type Club, type Resources } from '@/lib/engine/types';
import { entero, plataCorta, socios } from '@/lib/format';
import { RECURSOS_POR_ID } from '@/lib/recursos';
import { Cifra } from './ui';

export interface HudProps {
  club: Club;
  resources: Resources;
  previas: Resources | null;
  season: number;
  year: number;
  mandate: number;
  category: Club['category'];
  inhibido: boolean;
}

export function Hud({
  club,
  resources,
  previas,
  season,
  year,
  mandate,
  category,
  inhibido,
}: HudProps) {
  const [abierto, setAbierto] = useState<keyof Resources | null>(null);

  const delta = (campo: keyof Resources) =>
    previas ? Math.round((resources[campo] - previas[campo]) * 10) / 10 : undefined;

  const alternar = (campo: keyof Resources) =>
    setAbierto((actual) => (actual === campo ? null : campo));

  const detalle = abierto ? RECURSOS_POR_ID[abierto] : null;

  return (
    <header className="sticky top-0 z-20 border-b border-pano-borde bg-pano-alto/97 backdrop-blur">
      <div className="mx-auto max-w-xl">
        {/* Banda de color del club: lo único del club que no es su nombre. */}
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
          {CATEGORY_RULES[category].label} · Mandato {mandate}
          {inhibido && <span className="ml-2 text-sello-claro">· inhibido</span>}
        </p>

        {/* Columnas proporcionales al contenido, no iguales entre sí: "Caja"
            tiene que alojar su cifra con la flecha y "Socios" apenas 12k. Con
            cinco columnas iguales, "Influencia" se corta en un 375px. */}
        <div className="grid grid-cols-[1.1fr_1fr_0.95fr_0.85fr_1.1fr] gap-1 px-2 py-2 sm:gap-2 sm:px-3">
          <Cifra
            label="Caja US$"
            valor={plataCorta(resources.caja)}
            delta={delta('caja')}
            alerta={resources.caja < 0}
            abierta={abierto === 'caja'}
            onToggle={() => alternar('caja')}
          />
          <Cifra
            label="Hinchada"
            valor={entero(resources.hinchada)}
            delta={delta('hinchada')}
            alerta={resources.hinchada < 25}
            abierta={abierto === 'hinchada'}
            onToggle={() => alternar('hinchada')}
          />
          <Cifra
            label="Socios"
            valor={socios(resources.socios)}
            delta={delta('socios')}
            abierta={abierto === 'socios'}
            onToggle={() => alternar('socios')}
          />
          <Cifra
            label="Plantel"
            valor={entero(resources.plantel)}
            delta={delta('plantel')}
            abierta={abierto === 'plantel'}
            onToggle={() => alternar('plantel')}
          />
          <Cifra
            label="Influencia"
            valor={entero(resources.influencia)}
            delta={delta('influencia')}
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
