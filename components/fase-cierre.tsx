'use client';

/**
 * Los cierres: balance anual, escrutinio y epílogo.
 *
 * El balance se muestra como el papel que le entregás a la asamblea, con las
 * columnas de ingresos y egresos abiertas. No se resume en un número porque
 * el jugador tiene que ver de dónde salió y adónde se fue la plata: es la
 * única forma de que la próxima decisión económica signifique algo.
 */

import { CATEGORY_RULES, TITLES, type Club, type ElectionResult, type Ending, type GameState, type SeasonResult } from '@/lib/engine/types';
import { computeScore } from '@/lib/engine/election';
import { resolveEconomy } from '@/lib/engine/season';
import { ordinal, plataConSigno, plataCorta, plural } from '@/lib/format';
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
  // Se recalcula con los recursos previos al cierre, así que muestra
  // exactamente lo que el motor está por aplicar.
  const economia = resolveEconomy(state.resources, state.category, result);

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
            {CATEGORY_RULES[result.category].label}
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

/** El escrutinio: el momento en que la gente decide si seguís. */
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

/**
 * El epílogo: la hoja que te llevás.
 *
 * Es el objeto que el jugador va a compartir, así que carga todo el palmarés
 * y termina con el puntaje. Los títulos van como sellos porque son las marcas
 * que dejó la presidencia.
 */
export function FaseFin({
  state,
  club,
  ending,
  onReiniciar,
}: {
  state: GameState;
  club: Club;
  ending: Ending;
  onReiniciar: () => void;
}) {
  const score = computeScore(state);
  const porTitulo = new Map<string, number>();
  for (const title of state.titles) {
    porTitulo.set(title.id, (porTitulo.get(title.id) ?? 0) + 1);
  }

  return (
    <Papel torcido={0}>
      <div className="flex h-1.5 -mx-5 -mt-5 mb-5 sm:-mx-7 sm:-mt-7" aria-hidden>
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
        {/* Formato corto: en una grilla de tres columnas, "−US$ 2,9M" parte en
            dos líneas y rompe la alineación de toda la fila. */}
        <Dato label="Caja US$" valor={plataCorta(state.resources.caja)} />
        <Dato label="Asc./Desc." valor={`${state.ascensos}/${state.descensos}`} />
      </dl>

      {porTitulo.size > 0 ? (
        <div className="mt-5">
          <Membrete>Vitrina</Membrete>
          <ul className="mt-2 flex flex-wrap gap-2">
            {[...porTitulo].map(([id, veces]) => (
              <li key={id}>
                <Sello tono="bronce">
                  {TITLES[id as keyof typeof TITLES].label}
                  {veces > 1 && ` ×${veces}`}
                </Sello>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-5 font-acta text-[11px] tracking-[0.1em] text-tinta-2 uppercase">
          Vitrina vacía. No todas las presidencias dejan una copa.
        </p>
      )}

      {state.rare && (
        <p className="mt-5 border-l-2 border-sello pl-3 font-acta text-[11px] leading-relaxed tracking-wide text-sello uppercase">
          Club en llamas · una de cada quinientas presidencias arranca así
        </p>
      )}

      <div className="mt-7 border-t-2 border-tinta pt-4 text-center">
        <p className="font-acta text-[11px] tracking-[0.2em] text-tinta-2 uppercase">
          Puntaje de la presidencia
        </p>
        <p className="font-display text-5xl leading-none font-black tabular-nums text-tinta">
          {score.toLocaleString('es-AR')}
        </p>
        <p className="mt-2 font-body text-[14px] text-tinta-2">
          {plural(state.season, 'temporada', 'temporadas')} al frente de {club.name}
        </p>
      </div>

      <Continuar onClick={onReiniciar}>Otra presidencia</Continuar>
    </Papel>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <dt className="font-acta text-[11px] tracking-[0.12em] text-tinta-2 uppercase">{label}</dt>
      <dd className="mt-0.5 font-display text-lg leading-none font-black tabular-nums text-tinta">
        {valor}
      </dd>
    </div>
  );
}
