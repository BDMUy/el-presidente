'use client';

import Image from 'next/image';

import { LEAGUES, TITLES, type ElectionResult, type GameState, type SeasonResult } from '@/lib/engine/types';
import { resolveEconomy } from '@/lib/engine/season';
import { ordinal, plata, plataConSigno } from '@/lib/format';
import { Continuar, Ladillo, Puntos, Recuadro, Titular, Volanta } from './ui';
import { Festejo } from './festejo';

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

  const ladillo = result.champion
    ? { texto: 'Campeón', tono: 'favorable' as const }
    : result.promoted
      ? { texto: 'Ascenso', tono: 'favorable' as const }
      : result.relegated
        ? { texto: 'Descenso', tono: 'alerta' as const }
        : null;

  return (
    <Recuadro>
      <div className="flex items-start justify-between gap-4">
        <Volanta>
          Memoria y balance · {state.year}
        </Volanta>
        <span className="flex shrink-0 flex-wrap justify-end gap-1.5">
          {ladillo && (
            <Ladillo tono={ladillo.tono} animado>
              {ladillo.texto}
            </Ladillo>
          )}
          {result.qualifiedContinental && (
            <Ladillo tono="favorable" animado>
              A la continental
            </Ladillo>
          )}
        </span>
      </div>

      {(result.champion || result.promoted) && (
        <Festejo
          titulo={result.champion ? '¡Campeones!' : '¡Ascendimos!'}
          detalle={result.champion ? TITLES[LEAGUES[result.league].championTitle].label : 'Nos espera otra categoría.'}
        />
      )}

      {result.champion && <Image src="/ilustraciones/copa.png" alt="" width={1024} height={1024} sizes="64px" className="float-right ml-3 h-16 w-16 object-contain" />}

      <div className="mt-4">
        <Titular>Temporada {state.season}</Titular>
        <p className="mt-3 font-cuerpo text-[1rem] leading-relaxed text-tinta">{result.summary}</p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-corondel pt-4">
        <div>
          <dt className="font-tabla text-[0.75rem] tracking-[0.14em] text-tinta-2 uppercase">
            Posición
          </dt>
          <dd className="font-titular text-2xl font-black tabular-nums text-tinta">
            {ordinal(result.position)}
            <span className="ml-1 font-tabla text-xs font-normal text-tinta-2">
              de {result.teams}
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-tabla text-[0.75rem] tracking-[0.14em] text-tinta-2 uppercase">
            Categoría
          </dt>
          <dd className="font-titular text-[0.9375rem] font-bold text-tinta uppercase">
            {LEAGUES[result.league].label}
          </dd>
        </div>
      </dl>

      {result.titles.length > 0 && (
        <div className="mt-5">
          <Volanta>Se ganó</Volanta>
          <ul className="mt-2 flex flex-wrap gap-2">
            {result.titles.map((id) => (
              <li key={id}>
                <Ladillo tono="acento">{TITLES[id].label}</Ladillo>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 border-t border-corondel pt-4">
        <BarraBalance
          etiqueta="Ingresos"
          monto={economia.ingresos}
          maximo={Math.max(economia.ingresos, Math.abs(economia.egresos))}
          tono="favorable"
        />
        <BarraBalance
          etiqueta="Egresos"
          monto={Math.abs(economia.egresos)}
          maximo={Math.max(economia.ingresos, Math.abs(economia.egresos))}
          tono="alerta"
        />
      </div>

      <details className="mt-4 border-t border-corondel">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 py-2 font-tabla text-[0.8125rem]">
          <span className="text-tinta-2">Balance de caja <span className="indicador-mas" aria-hidden>+</span></span>
          <span className={economia.neto < 0 ? 'text-alerta' : 'text-favorable'}>{plataConSigno(economia.neto)}</span>
        </summary>
        <ul className="mt-2">
          {economia.detalle.map((linea) => (
            <li
              key={linea.label}
              className="flex items-baseline border-t border-corondel py-1.5 font-tabla text-[0.8125rem]"
            >
              <span className="text-tinta-2">{linea.label}</span>
              <Puntos />
              <span className={linea.amount < 0 ? 'text-alerta' : 'text-tinta'}>
                {plataConSigno(linea.amount)}
              </span>
            </li>
          ))}
          <li className="flex items-baseline border-t-2 border-tinta py-2.5 font-tabla text-[0.8125rem] font-bold uppercase">
            <span className="text-tinta">Resultado</span>
            <Puntos />
            <span className={economia.neto < 0 ? 'text-alerta' : 'text-tinta'}>
              {plataConSigno(economia.neto)}
            </span>
          </li>
        </ul>
      </details>

      <Continuar onClick={onContinuar}>Elevar a la asamblea</Continuar>
    </Recuadro>
  );
}

function BarraBalance({
  etiqueta,
  monto,
  maximo,
  tono,
}: {
  etiqueta: string;
  monto: number;
  maximo: number;
  tono: 'favorable' | 'alerta';
}) {
  const proporcion = maximo > 0 ? monto / maximo : 0;

  return (
    <div className="mt-2 first:mt-0">
      <p className="flex items-baseline justify-between gap-2 font-tabla text-[0.8125rem]">
        <span className="text-tinta-2 uppercase">{etiqueta}</span>
        <span className={tono === 'alerta' ? 'text-alerta' : 'text-favorable'}>
          {plata(monto)}
        </span>
      </p>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-fondo-3" aria-hidden>
        <div
          className={`h-full origin-left rounded-full ${tono === 'alerta' ? 'bg-alerta' : 'bg-favorable'}`}
          style={{ transform: `scaleX(${proporcion})` }}
        />
      </div>
    </div>
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
    <Recuadro>
      <div className="flex items-start justify-between gap-4">
        <Volanta>Acta de escrutinio · Temporada {season}</Volanta>
        <Ladillo tono={result.won ? 'favorable' : 'alerta'} animado className="shrink-0">
          {result.won ? 'Reelecto' : 'Derrotado'}
        </Ladillo>
      </div>

      {result.won && <Festejo titulo="¡Reelecto!" detalle="La gente te dio otro mandato." />}

      <div className="mt-5 text-center">
        <Image src="/ilustraciones/urna-elecciones.png" alt="" width={1024} height={1024} sizes="80px" className="mx-auto mb-3 h-20 w-20 object-contain" />
        <p className="font-titular text-[4rem] leading-none font-black tabular-nums text-tinta">
          {result.votes}
          <span className="text-2xl">%</span>
        </p>
        <p className="mt-1 font-tabla text-[0.75rem] tracking-[0.16em] text-tinta-2 uppercase">
          de los votos de socios
        </p>
        <p className="mt-2 font-cuerpo text-[0.9375rem] text-tinta-2">
          {result.won ? 'Le ganaste a' : 'Te ganó'} {result.rival}, que se quedó con el{' '}
          {100 - result.votes}%.
        </p>
      </div>

      <p className="mt-6 border-t border-corondel pt-4 font-cuerpo text-[1rem] leading-relaxed text-tinta">
        {result.summary}
      </p>

      <Continuar onClick={onContinuar}>
        {result.won ? 'Asumir el nuevo mandato' : 'Entregar el cargo'}
      </Continuar>
    </Recuadro>
  );
}
