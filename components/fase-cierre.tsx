'use client';

import { LEAGUES, TITLES, type ElectionResult, type GameState, type SeasonResult } from '@/lib/engine/types';
import { resolveEconomy } from '@/lib/engine/season';
import { ordinal, plataConSigno } from '@/lib/format';
import { Continuar, Membrete, Papel, Puntos, Sello, Titulo } from './ui';

export function FaseTemporada({
  state,
  result,
  onContinuar,
}: {
  state: GameState;
  result: SeasonResult;
  onContinuar: () => void;
}) {
  const economia = resolveEconomy(state.resources, state.league, result);

  const sello = result.champion
    ? { texto: 'Campeón', tono: 'verde' as const }
    : result.promoted
      ? { texto: 'Ascenso', tono: 'verde' as const }
      : result.relegated
        ? { texto: 'Descenso', tono: 'rojo' as const }
        : null;

  return (
    <Papel torcido={1}>
      <div className="flex items-start justify-between gap-4">
        <Membrete>
          Memoria y balance · {state.year}
        </Membrete>
        {sello && (
          <Sello tono={sello.tono} animado className="shrink-0">
            {sello.texto}
          </Sello>
        )}
      </div>

      <div className="mt-4">
        <Titulo>Temporada {state.season}</Titulo>
        <p className="mt-3 font-body text-[16px] leading-relaxed text-tinta">{result.summary}</p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-hoja-linea pt-4">
        <div>
          <dt className="font-acta text-[11px] tracking-[0.14em] text-tinta-2 uppercase">
            Posición
          </dt>
          <dd className="font-display text-2xl font-black tabular-nums text-tinta">
            {ordinal(result.position)}
            <span className="ml-1 font-acta text-xs font-normal text-tinta-2">
              de {result.teams}
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-acta text-[11px] tracking-[0.14em] text-tinta-2 uppercase">
            Categoría
          </dt>
          <dd className="font-display text-[15px] font-bold text-tinta uppercase">
            {LEAGUES[result.league].label}
          </dd>
        </div>
      </dl>

      {result.titles.length > 0 && (
        <div className="mt-5">
          <Membrete>Se ganó</Membrete>
          <ul className="mt-2 flex flex-wrap gap-2">
            {result.titles.map((id) => (
              <li key={id}>
                <Sello tono="bronce">{TITLES[id].label}</Sello>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <Membrete>Ejercicio económico</Membrete>
        <ul className="mt-2">
          {economia.detalle.map((linea) => (
            <li
              key={linea.label}
              className="flex items-baseline border-t border-hoja-linea py-1.5 font-acta text-[13px]"
            >
              <span className="text-tinta-2">{linea.label}</span>
              <Puntos />
              <span className={linea.amount < 0 ? 'text-sello' : 'text-tinta'}>
                {plataConSigno(linea.amount)}
              </span>
            </li>
          ))}
          <li className="flex items-baseline border-t-2 border-tinta py-2.5 font-acta text-[13px] font-bold uppercase">
            <span className="text-tinta">Resultado</span>
            <Puntos />
            <span className={economia.neto < 0 ? 'text-sello' : 'text-tinta'}>
              {plataConSigno(economia.neto)}
            </span>
          </li>
        </ul>
      </div>

      <Continuar onClick={onContinuar}>Elevar a la asamblea</Continuar>
    </Papel>
  );
}

export function FaseEleccion({
  result,
  season,
  onContinuar,
}: {
  result: ElectionResult;
  season: number;
  onContinuar: () => void;
}) {
  return (
    <Papel torcido={2}>
      <div className="flex items-start justify-between gap-4">
        <Membrete>Acta de escrutinio · Temporada {season}</Membrete>
        <Sello tono={result.won ? 'verde' : 'rojo'} animado className="shrink-0">
          {result.won ? 'Reelecto' : 'Derrotado'}
        </Sello>
      </div>

      <div className="mt-5 text-center">
        <p className="font-display text-[4rem] leading-none font-black tabular-nums text-tinta">
          {result.votes}
          <span className="text-2xl">%</span>
        </p>
        <p className="mt-1 font-acta text-[11px] tracking-[0.16em] text-tinta-2 uppercase">
          de los votos de socios
        </p>
      </div>

      <p className="mt-6 border-t border-hoja-linea pt-4 font-body text-[16px] leading-relaxed text-tinta">
        {result.summary}
      </p>

      <Continuar onClick={onContinuar}>
        {result.won ? 'Asumir el nuevo mandato' : 'Entregar el cargo'}
      </Continuar>
    </Papel>
  );
}
