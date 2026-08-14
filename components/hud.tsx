/**
 * El carnet: la barra fija de arriba.
 *
 * Está armada como un carnet de socio —banda con los colores del club, número
 * de temporada, y las cinco cifras como renglones de balance— en vez de como
 * un marcador deportivo. El jugador es dirigente, no futbolista, y lo primero
 * que ve tiene que decirlo.
 */

import { CATEGORY_RULES, type Club, type Resources } from '@/lib/engine/types';
import { entero, plata, socios } from '@/lib/format';
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
    <header className="sticky top-0 z-20 border-b border-pano-borde bg-pano-alto/95 backdrop-blur">
      <div className="mx-auto max-w-xl">
        {/* Banda de color del club: lo único del club que no es su nombre. */}
        <div className="flex h-1.5" aria-hidden>
          <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
          <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
        </div>

        <div className="flex items-baseline justify-between gap-3 px-4 pt-2.5">
          <h2 className="truncate font-display text-sm font-black tracking-tight text-papel uppercase">
            {club.name}
          </h2>
          <p className="shrink-0 font-acta text-[10px] tracking-[0.1em] text-papel/50 uppercase">
            T{season} · {year} · M{mandate}
          </p>
        </div>

        <p className="px-4 font-acta text-[10px] tracking-[0.1em] text-bronce uppercase">
          {CATEGORY_RULES[category].label}
          {inhibido && <span className="ml-2 text-sello">· club inhibido</span>}
        </p>

        <div className="grid grid-cols-5 gap-2 px-4 py-2.5">
          <Cifra label="Caja" valor={plata(resources.caja)} delta={delta('caja')} destacado={resources.caja < 0} />
          <Cifra label="Hinchada" valor={entero(resources.hinchada)} delta={delta('hinchada')} destacado={resources.hinchada < 25} />
          <Cifra label="Socios" valor={socios(resources.socios)} delta={delta('socios')} />
          <Cifra label="Plantel" valor={entero(resources.plantel)} delta={delta('plantel')} />
          <Cifra label="Rosca" valor={entero(resources.rosca)} delta={delta('rosca')} />
        </div>
      </div>
    </header>
  );
}
