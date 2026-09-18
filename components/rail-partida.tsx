import {
  EVENTS_PER_SEASON,
  SEASONS_PER_MANDATE,
  TEMPORADAS_POR_MODO,
  type GameState,
} from '@/lib/engine/types';
import { ordinal } from '@/lib/format';

export function RailPartida({ state }: { state: GameState }) {
  const temporadas = TEMPORADAS_POR_MODO[state.modo];
  const mandatos = temporadas / SEASONS_PER_MANDATE;
  const enLaTemporada = Math.min(state.eventsThisSeason, EVENTS_PER_SEASON);
  const historia = state.history.slice(-6);

  return (
    <aside className="palco-secundario hidden lg:block" aria-label="Estado del mandato">
      <section>
        <h2 className="border-b border-corondel pb-1 font-titular text-[0.75rem] tracking-[0.14em] text-tinta-2 uppercase">
          Cronología del mandato
        </h2>

        <p className="mt-3 font-titular text-[1.375rem] leading-tight text-tinta">
          Temporada {state.season}
          <span className="text-tinta-2"> de {temporadas}</span>
        </p>
        <p className="mt-1 font-tabla text-[0.75rem] tracking-[0.06em] text-tinta-2 uppercase tabular-nums">
          {state.year} · Mandato {state.mandate} de {mandatos}
        </p>

        <p className="mt-3 flex items-center gap-2">
          <span className="flex items-center gap-1" aria-hidden>
            {Array.from({ length: EVENTS_PER_SEASON }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full ${i < enLaTemporada ? 'bg-acento' : 'bg-corondel'}`}
              />
            ))}
          </span>
          <span className="font-tabla text-[0.75rem] tracking-[0.06em] text-tinta-2 uppercase">
            {enLaTemporada} de {EVENTS_PER_SEASON} cartas
          </span>
        </p>
      </section>

      {historia.length > 0 && (
        <section className="mt-6">
          <h2 className="border-b border-corondel pb-1 font-titular text-[0.75rem] tracking-[0.14em] text-tinta-2 uppercase">
            Cómo veníamos
          </h2>
          <ul className="mt-2">
            {historia.map((registro) => (
              <li
                key={registro.season}
                className="flex items-baseline justify-between gap-2 border-b border-corondel py-1.5 font-tabla text-[0.8125rem] text-tinta tabular-nums last:border-b-0"
              >
                <span className="text-tinta-2">T{registro.season}</span>
                <span>{ordinal(registro.position)}</span>
                <span className="text-tinta-2">
                  {registro.titles.length > 0
                    ? `${registro.titles.length} ${registro.titles.length === 1 ? 'copa' : 'copas'}`
                    : '—'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
