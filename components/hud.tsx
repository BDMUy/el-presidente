/**
 * El carnet: la barra fija de arriba.
 *
 * Está armada como un carnet de socio —banda con los colores del club, número
 * de temporada, y las cinco cifras como renglones de balance— en vez de como
 * un marcador deportivo. El jugador es dirigente, no futbolista, y lo primero
 * que ve tiene que decirlo.
 */

import { CATEGORY_RULES, type Club, type Resources } from '@/lib/engine/types';
import { entero, plataCorta, socios } from '@/lib/format';
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
  const delta = (campo: keyof Resources) =>
    previas ? Math.round((resources[campo] - previas[campo]) * 10) / 10 : undefined;

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
            tiene que alojar US$ 12,4M con su flecha y "Socios" apenas 12k.
            Con cinco columnas iguales, "Influencia" se corta en un 375px. */}
        <div className="grid grid-cols-[1.1fr_1fr_0.95fr_0.85fr_1.1fr] gap-1.5 px-3 py-2.5 sm:gap-2 sm:px-4">
          <Cifra
            label="Caja US$"
            valor={plataCorta(resources.caja)}
            delta={delta('caja')}
            alerta={resources.caja < 0}
          />
          <Cifra
            label="Hinchada"
            valor={entero(resources.hinchada)}
            delta={delta('hinchada')}
            alerta={resources.hinchada < 25}
          />
          <Cifra label="Socios" valor={socios(resources.socios)} delta={delta('socios')} />
          <Cifra label="Plantel" valor={entero(resources.plantel)} delta={delta('plantel')} />
          <Cifra
            label="Influencia"
            valor={entero(resources.influencia)}
            delta={delta('influencia')}
          />
        </div>
      </div>
    </header>
  );
}
