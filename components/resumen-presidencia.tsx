'use client';

import type { CSSProperties } from 'react';

import { computeScore, puntajePorTemporadas } from '@/lib/engine/election';
import { TITLES, type Club, type Ending, type GameState, type TitleId } from '@/lib/engine/types';
import { plataCorta } from '@/lib/format';
import { useTintaClub } from '@/lib/tema';
import { Ladillo, Volanta } from './ui';

export function ResumenPresidencia({
  state,
  club,
  ending,
}: {
  state: GameState;
  club: Club;
  ending: Ending;
}) {
  const tintaClub = useTintaClub(club);
  const score = computeScore(state);
  const piso = puntajePorTemporadas(state);
  const porTitulo = new Map<TitleId, number>();
  for (const title of state.titles) {
    porTitulo.set(title.id, (porTitulo.get(title.id) ?? 0) + 1);
  }

  return (
    <div style={{ '--club': tintaClub } as CSSProperties}>
      <Volanta>
        {club.name} · {state.history[0]?.year ?? state.year}–{state.year}
      </Volanta>

      <h1
        className="revelar-titular mt-3 font-titular text-[clamp(2.25rem,10vw,4rem)] leading-[0.9] font-black tracking-[-0.02em] text-tinta uppercase"
        style={{ fontStretch: '75%' }}
      >
        {ending.title}
      </h1>

      <p className="mt-4 font-cuerpo text-[16px] leading-relaxed text-tinta">{ending.text}</p>

      <div className="mt-7 border-y border-corondel py-4">
        <dl className="grid grid-cols-3 divide-x divide-corondel">
          <Dato label="Temporadas" valor={String(state.season)} />
          <Dato label="Títulos" valor={String(state.titles.length)} />
          <Dato label="Hinchada" valor={String(Math.round(state.resources.hinchada))} />
        </dl>
        <dl className="mt-4 grid grid-cols-3 divide-x divide-corondel">
          <Dato label="Socios" valor={`${Math.round(state.resources.socios)}k`} />
          <Dato label="Caja US$" valor={plataCorta(state.resources.caja)} />
          <Dato label="Asc./Desc." valor={`${state.ascensos}/${state.descensos}`} />
        </dl>
      </div>

      {porTitulo.size > 0 ? (
        <div className="mt-5">
          <Volanta>Vitrina de esta presidencia</Volanta>
          <ul className="mt-2 flex flex-wrap gap-2">
            {[...porTitulo].map(([id, veces]) => (
              <li key={id}>
                <Ladillo tono="club">
                  {TITLES[id].label}
                  {veces > 1 && ` ×${veces}`}
                </Ladillo>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-5 font-tabla text-[12px] tracking-[0.08em] text-tinta-2 uppercase">
          Vitrina vacía. No todas las presidencias dejan una copa.
        </p>
      )}

      {state.modo === 'llamas' && (
        <p className="mt-5 border-l-2 border-alerta pl-3 font-tabla text-[12px] leading-relaxed tracking-wide text-alerta uppercase">
          Club en llamas · veintidós millones de deuda y la gente en contra
        </p>
      )}

      <div
        className="entrar-nota mt-7 border-t-2 border-[var(--club)] pt-4 text-center"
        style={{ animationDelay: '420ms' }}
      >
        <p className="font-tabla text-[11px] tracking-[0.16em] text-tinta-2 uppercase">
          Puntaje de la presidencia
        </p>
        <p className="font-titular text-5xl leading-none font-black tabular-nums text-tinta">
          {score.toLocaleString('es-AR')}
        </p>
        {score === 0 ? (
          <p className="mt-2 font-cuerpo text-[14px] leading-snug text-tinta-2">
            Entre los descensos y la deuda no quedó puntaje para anotar.
          </p>
        ) : (
          <p className="mt-2 font-cuerpo text-[14px] leading-snug text-tinta-2">
            Del tiempo en el cargo salen {piso.toLocaleString('es-AR')} puntos.{' '}
            {state.descensos > 0
              ? 'El resto lo movieron los títulos, la hinchada, la caja y los descensos.'
              : 'El resto sale de los títulos, la hinchada y la caja.'}
          </p>
        )}
      </div>
    </div>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="pl-3 first:pl-0">
      <dt className="font-tabla text-[11px] tracking-[0.08em] text-tinta-2 uppercase">{label}</dt>
      <dd className="mt-0.5 font-titular text-lg leading-none font-black tabular-nums text-tinta">
        {valor}
      </dd>
    </div>
  );
}
