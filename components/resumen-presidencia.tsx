/**
 * El resumen de una presidencia terminada.
 *
 * Sin `use client` a propósito: lo renderiza el epílogo del juego y también la
 * página pública de un link compartido, que es un componente de servidor. Es
 * puramente presentacional, así que sirve para las dos sin duplicar nada.
 */

import { computeScore } from '@/lib/engine/election';
import { TITLES, type Club, type Ending, type GameState, type TitleId } from '@/lib/engine/types';
import { plataCorta, plural } from '@/lib/format';
import { Membrete, Sello } from './ui';

export function ResumenPresidencia({
  state,
  club,
  ending,
}: {
  state: GameState;
  club: Club;
  ending: Ending;
}) {
  const score = computeScore(state);
  const porTitulo = new Map<TitleId, number>();
  for (const title of state.titles) {
    porTitulo.set(title.id, (porTitulo.get(title.id) ?? 0) + 1);
  }

  return (
    <>
      <div className="-mx-5 -mt-5 mb-5 flex h-1.5 sm:-mx-7 sm:-mt-7" aria-hidden>
        <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
        <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
      </div>

      <Membrete>
        {club.name} · {state.history[0]?.year ?? state.year}–{state.year}
      </Membrete>

      <h1 className="mt-3 font-display text-[clamp(1.8rem,8vw,2.6rem)] leading-[0.95] font-black tracking-tight text-tinta uppercase">
        {ending.title}
      </h1>

      <p className="mt-4 font-body text-[16px] leading-relaxed text-tinta">{ending.text}</p>

      <dl className="mt-7 grid grid-cols-3 gap-3 border-y border-hoja-linea py-4">
        <Dato label="Temporadas" valor={String(state.season)} />
        <Dato label="Títulos" valor={String(state.titles.length)} />
        <Dato label="Hinchada" valor={String(Math.round(state.resources.hinchada))} />
        <Dato label="Socios" valor={`${Math.round(state.resources.socios)}k`} />
        {/* Formato corto: en tres columnas, "−US$ 2,9M" parte en dos líneas y
            rompe la alineación de toda la fila. */}
        <Dato label="Caja US$" valor={plataCorta(state.resources.caja)} />
        <Dato label="Asc./Desc." valor={`${state.ascensos}/${state.descensos}`} />
      </dl>

      {porTitulo.size > 0 ? (
        <div className="mt-5">
          <Membrete>Vitrina de esta presidencia</Membrete>
          <ul className="mt-2 flex flex-wrap gap-2">
            {[...porTitulo].map(([id, veces]) => (
              <li key={id}>
                <Sello tono="bronce">
                  {TITLES[id].label}
                  {veces > 1 && ` ×${veces}`}
                </Sello>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-5 font-acta text-[12px] tracking-[0.08em] text-tinta-2 uppercase">
          Vitrina vacía. No todas las presidencias dejan una copa.
        </p>
      )}

      {state.rare && (
        <p className="mt-5 border-l-2 border-sello pl-3 font-acta text-[12px] leading-relaxed tracking-wide text-sello uppercase">
          Club en llamas · una de cada quinientas presidencias arranca así
        </p>
      )}

      <div className="mt-7 border-t-2 border-tinta pt-4 text-center">
        <p className="font-acta text-[11px] tracking-[0.16em] text-tinta-2 uppercase">
          Puntaje de la presidencia
        </p>
        <p className="font-display text-5xl leading-none font-black tabular-nums text-tinta">
          {score.toLocaleString('es-AR')}
        </p>
        <p className="mt-2 font-body text-[14px] text-tinta-2">
          {plural(state.season, 'temporada', 'temporadas')} al frente de {club.name}
        </p>
      </div>
    </>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <dt className="font-acta text-[11px] tracking-[0.08em] text-tinta-2 uppercase">{label}</dt>
      <dd className="mt-0.5 font-display text-lg leading-none font-black tabular-nums text-tinta">
        {valor}
      </dd>
    </div>
  );
}
