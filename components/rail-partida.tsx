import {
  CLIMA_PRENSA,
  CLIMA_TRIBUNA,
  climaDeHinchada,
  vozDeSemilla,
} from '@/content/clima';
import {
  EVENTS_PER_SEASON,
  SEASONS_PER_MANDATE,
  TEMPORADAS_POR_MODO,
  TITLES,
  type GameState,
} from '@/lib/engine/types';
import { ordinal } from '@/lib/format';

export function RailPartida({ state }: { state: GameState }) {
  const temporadas = TEMPORADAS_POR_MODO[state.modo];
  const mandatos = temporadas / SEASONS_PER_MANDATE;
  const enLaTemporada = Math.min(state.eventsThisSeason, EVENTS_PER_SEASON);
  const historia = state.history.slice(-6);
  const clima = climaDeHinchada(state.resources.hinchada);
  const vitrina = state.titles.reduce((cuenta, titulo) => {
    cuenta.set(titulo.id, (cuenta.get(titulo.id) ?? 0) + 1);
    return cuenta;
  }, new Map<string, number>());

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

      <section className="mt-6">
        <h2 className="border-b border-corondel pb-1 font-titular text-[0.75rem] tracking-[0.14em] text-tinta-2 uppercase">
          Clima interno
        </h2>
        <figure className="tarjeta-plana mt-2 p-3">
          <blockquote className="font-cuerpo text-[0.9375rem] leading-snug text-tinta italic">
            «{vozDeSemilla(CLIMA_TRIBUNA, clima, state.seed, state.season)}»
          </blockquote>
          <figcaption className="mt-1.5 font-tabla text-[0.6875rem] tracking-[0.06em] text-tinta-2 uppercase">
            La popular
          </figcaption>
        </figure>
        <figure className="tarjeta-plana mt-2 p-3">
          <blockquote className="font-cuerpo text-[0.9375rem] leading-snug text-tinta italic">
            «{vozDeSemilla(CLIMA_PRENSA, clima, state.seed, state.season)}»
          </blockquote>
          <figcaption className="mt-1.5 font-tabla text-[0.6875rem] tracking-[0.06em] text-tinta-2 uppercase">
            Crónica deportiva
          </figcaption>
        </figure>
      </section>

      {vitrina.size > 0 && (
        <section className="mt-6">
          <h2 className="border-b border-corondel pb-1 font-titular text-[0.75rem] tracking-[0.14em] text-tinta-2 uppercase">
            Vitrina del mandato
          </h2>
          <ul className="mt-2">
            {[...vitrina].map(([id, veces]) => (
              <li
                key={id}
                className="flex items-baseline justify-between gap-2 border-b border-corondel py-1.5 font-tabla text-[0.8125rem] text-tinta last:border-b-0"
              >
                <span className="min-w-0">{TITLES[id as keyof typeof TITLES].label}</span>
                {veces > 1 && <span className="shrink-0 text-tinta-2 tabular-nums">×{veces}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

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
