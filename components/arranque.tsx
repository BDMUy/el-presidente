'use client';

/**
 * Pantalla de arranque: la asamblea que te elige presidente.
 *
 * El héroe no es un número grande ni una foto de cancha: es la boleta. Elegís
 * el club cuya presidencia vas a tomar, y la lista se lee como un padrón, con
 * la expectativa de cada club escrita al lado. Eso último importa: define
 * contra qué te van a medir durante dieciséis temporadas.
 */

import { useMemo, useState } from 'react';

import { CLUBS } from '@/content/clubs';
import { expectedPosition } from '@/lib/engine/season';
import { CATEGORY_RULES, type Category, type Club } from '@/lib/engine/types';
import { Membrete, Sello } from './ui';

const ORDEN: Category[] = ['primera', 'nacional', 'b'];

export function Arranque({ onEmpezar }: { onEmpezar: (clubId: string) => void }) {
  const [elegido, setElegido] = useState<string | null>(null);

  const porCategoria = useMemo(() => {
    return ORDEN.map((category) => ({
      category,
      clubes: CLUBS.filter((c) => c.category === category).sort((a, b) => b.size - a.size),
    }));
  }, []);

  const club = elegido ? CLUBS.find((c) => c.id === elegido)! : null;

  const sortear = () => {
    setElegido(CLUBS[Math.floor(Math.random() * CLUBS.length)].id);
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 pt-10 pb-32">
      <Membrete>Asamblea ordinaria · elección de autoridades</Membrete>

      <h1 className="mt-3 font-display text-[clamp(2.75rem,14vw,4.5rem)] leading-[0.85] font-black tracking-[-0.03em] text-papel uppercase">
        El
        <br />
        Presidente
      </h1>

      <p className="mt-5 max-w-md font-body text-[15px] leading-relaxed text-papel/70">
        Ganás la elección y tenés cuatro mandatos para que no te echen. Manejás la caja, la
        hinchada y la rosca. <span className="text-papel">Vos armás el plantel; el plantel juega.</span>
      </p>

      <div className="mt-8 flex items-center justify-between border-t border-papel/15 pt-4">
        <Membrete>Elegí el club</Membrete>
        <button
          type="button"
          onClick={sortear}
          className="font-acta text-[11px] tracking-[0.1em] text-bronce uppercase underline underline-offset-4 hover:text-papel"
        >
          Que decida el sorteo
        </button>
      </div>

      <div className="mt-4 space-y-6">
        {porCategoria.map(({ category, clubes }) => (
          <section key={category}>
            <h2 className="font-acta text-[10px] tracking-[0.18em] text-papel/40 uppercase">
              {CATEGORY_RULES[category].label}
            </h2>
            <ul className="mt-2">
              {clubes.map((c) => (
                <FilaClub
                  key={c.id}
                  club={c}
                  elegido={c.id === elegido}
                  onElegir={() => setElegido(c.id)}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      {club && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-pano-borde bg-pano-alto/95 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-black text-papel uppercase">
                {club.name}
              </p>
              <p className="font-acta text-[10px] tracking-[0.1em] text-papel/50 uppercase">
                Te esperan {expectedPosition(club, club.category)}° de{' '}
                {CATEGORY_RULES[club.category].teams}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEmpezar(club.id)}
              className="shrink-0 bg-papel px-6 py-3 font-display text-sm font-black tracking-[0.12em] text-tinta uppercase transition-transform active:scale-[0.98]"
            >
              Asumir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilaClub({
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
        className={`flex w-full items-center gap-3 border-b border-papel/10 py-2.5 text-left transition-colors ${
          elegido ? 'bg-papel/10' : 'hover:bg-papel/5'
        }`}
      >
        <span className="flex h-7 w-1.5 shrink-0 flex-col overflow-hidden rounded-full" aria-hidden>
          <span className="flex-1" style={{ backgroundColor: club.colors[0] }} />
          <span className="flex-1" style={{ backgroundColor: club.colors[1] }} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[15px] font-bold tracking-tight text-papel">
            {club.name}
          </span>
          {club.nickname && (
            <span className="block truncate font-body text-[12px] text-papel/45">
              {club.nickname}
            </span>
          )}
        </span>

        {elegido ? (
          <Sello tono="bronce" className="shrink-0">
            Elegido
          </Sello>
        ) : (
          <span className="shrink-0 font-acta text-[10px] tracking-[0.08em] text-papel/35 tabular-nums">
            {esperada}°/{teams}
          </span>
        )}
      </button>
    </li>
  );
}
