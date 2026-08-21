import { CLUBS } from '../content/clubs';
import { computeScore } from '../lib/engine/election';
import { applyChoice, optionCount, startRun } from '../lib/engine/engine';
import { enumerateAssignments, winProbability } from '../lib/engine/mesa-chica';
import { Rand } from '../lib/engine/rng';
import type { Effects, EndingId, GameState, Modo } from '../lib/engine/types';
import { MODOS, TEMPORADAS_POR_MODO } from '../lib/engine/types';

const posicionales = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const runs = Number(posicionales[0] ?? 2000);
const clubFilter = posicionales[1];

const argModo = process.argv.find((a) => a.startsWith('--modo='))?.slice(7) ?? 'normal';
const modos: Modo[] = argModo === 'todos' ? [...MODOS] : [argModo as Modo];
for (const m of modos) {
  if (!MODOS.includes(m)) {
    console.error(`Modo desconocido: "${m}". Son ${MODOS.join(', ')} o "todos".`);
    process.exit(1);
  }
}

type Policy = 'random' | 'greedy';

interface Outcome {
  ending: EndingId;
  score: number;
  seasons: number;
  titles: number;
  hinchada: number;
  caja: number;
  descensos: number;
  ascensos: number;
}

function valueOf(effects: Effects | undefined, cajaActual: number): number {
  if (!effects) return 0;
  const pesoCaja = cajaActual < 5 ? 3 : 1.5;
  let value =
    (effects.hinchada ?? 0) * 1 +
    (effects.plantel ?? 0) * 1.2 +
    (effects.caja ?? 0) * pesoCaja +
    (effects.influencia ?? 0) * 0.4 +
    (effects.socios ?? 0) * 0.8;

  for (const d of effects.deferred ?? []) {
    value += valueOf(d.effects, cajaActual) * 0.5;
  }

  value -= (effects.flagsSuma?.prontuario ?? 0) * 4;

  return value;
}

function greedyChoice(state: GameState): number {
  const { phase, resources } = state;

  switch (phase.kind) {
    case 'mercado': {
      const scored = phase.offers.map((offer, index) => {
        const affordable = offer.cost <= resources.caja + 5;
        const value =
          offer.plantelDelta * 1.2 +
          offer.hinchadaDelta * 1 -
          offer.cost * (resources.caja < 5 ? 3 : 1.5);
        return { index, value: affordable ? value : -Infinity };
      });
      const best = scored.reduce((a, b) => (b.value > a.value ? b : a), {
        index: phase.offers.length,
        value: 0,
      });
      return best.index;
    }

    case 'evento': {
      const scored = phase.available.map((optionIndex, displayIndex) => {
        const option = phase.event.options[optionIndex];
        let value: number;
        if (option.random) {
          const total = option.random.reduce((s, o) => s + o.weight, 0);
          value = option.random.reduce(
            (s, o) => s + (o.weight / total) * valueOf(o.effects, resources.caja),
            0,
          );
        } else {
          value = valueOf(option.effects, resources.caja);
        }
        return { displayIndex, value };
      });
      return scored.reduce((a, b) => (b.value > a.value ? b : a)).displayIndex;
    }

    case 'mesa-chica': {
      const assignments = enumerateAssignments();
      const desesperado = phase.match.baseWin < 0.4;
      const scored = assignments.map((assignment, index) => {
        const prob = winProbability(phase.match, assignment);
        const costo =
          assignment.plantel * 0.8 + assignment.hinchada * 0.3 + assignment.prensa * 0.5;
        const riesgo = assignment.gestion * (desesperado ? 0.04 : 0.12);
        return { index, value: prob - costo * 0.02 - riesgo };
      });
      return scored.reduce((a, b) => (b.value > a.value ? b : a)).index;
    }

    default:
      return 0;
  }
}

function play(seed: number, clubId: string, policy: Policy, modo: Modo): Outcome {
  const chooser = new Rand(seed ^ 0x5f3759df);
  let state: GameState = startRun({ seed, clubId, modo });

  let guard = 0;
  while (state.status === 'jugando' && guard++ < 5000) {
    const options = optionCount(state);
    if (options === 0) break;
    const choice = policy === 'random' ? chooser.int(0, options - 1) : greedyChoice(state);
    state = applyChoice(state, Math.min(choice, options - 1));
  }

  return {
    ending: state.ending?.id ?? 'reelecto-gris',
    score: computeScore(state),
    seasons: state.season,
    titles: state.titles.length,
    hinchada: Math.round(state.resources.hinchada),
    caja: state.resources.caja,
    descensos: state.descensos,
    ascensos: state.ascensos,
  };
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

function summarize(label: string, values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  console.log(
    `  ${label.padEnd(12)} med ${percentile(sorted, 0.5).toFixed(1).padStart(7)}` +
      `   avg ${avg.toFixed(1).padStart(7)}` +
      `   p10 ${percentile(sorted, 0.1).toFixed(1).padStart(7)}` +
      `   p90 ${percentile(sorted, 0.9).toFixed(1).padStart(7)}`,
  );
}

function report(policy: Policy, outcomes: Outcome[], modo: Modo) {
  const total = TEMPORADAS_POR_MODO[modo];
  console.log(
    `\n${'═'.repeat(60)}\n${modo.toUpperCase()} (${total} temporadas) · POLÍTICA: ${policy.toUpperCase()}\n${'═'.repeat(60)}`,
  );

  const endings = new Map<EndingId, number>();
  for (const o of outcomes) endings.set(o.ending, (endings.get(o.ending) ?? 0) + 1);

  console.log('\nFINALES');
  for (const [ending, count] of [...endings].sort((a, b) => b[1] - a[1])) {
    const pct = ((count / outcomes.length) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round((count / outcomes.length) * 40));
    console.log(`  ${ending.padEnd(20)} ${pct.padStart(5)}%  ${bar}`);
  }

  console.log('\nDISTRIBUCIONES');
  summarize('puntaje', outcomes.map((o) => o.score));
  summarize('temporadas', outcomes.map((o) => o.seasons));
  summarize('títulos', outcomes.map((o) => o.titles));
  summarize('hinchada', outcomes.map((o) => o.hinchada));
  summarize('caja', outcomes.map((o) => o.caja));

  const n = outcomes.length;
  const completas = outcomes.filter((o) => o.seasons >= total).length;
  console.log('\nCHEQUEOS');
  console.log(`  con al menos un título     ${((outcomes.filter((o) => o.titles > 0).length / n) * 100).toFixed(1)}%`);
  console.log(`  completaron las ${String(total).padStart(2)}         ${((completas / n) * 100).toFixed(1)}%`);
  console.log(`  descensos por partida      ${(outcomes.reduce((s, o) => s + o.descensos, 0) / n).toFixed(2)}`);
  console.log(`  ascensos por partida       ${(outcomes.reduce((s, o) => s + o.ascensos, 0) / n).toFixed(2)}`);
}

const pool = clubFilter ? CLUBS.filter((c) => c.id === clubFilter) : CLUBS;
if (pool.length === 0) {
  console.error(`No existe el club "${clubFilter}"`);
  process.exit(1);
}

console.log(
  `\nSimulando ${runs} presidencias × 2 políticas × ${modos.length} ` +
    `${modos.length === 1 ? 'modo' : 'modos'} sobre ${pool.length} ${pool.length === 1 ? 'club' : 'clubes'}...`,
);

const started = Date.now();
for (const modo of modos) {
  for (const policy of ['random', 'greedy'] as Policy[]) {
    const outcomes: Outcome[] = [];
    for (let i = 0; i < runs; i++) {
      outcomes.push(play(i * 2654435761, pool[i % pool.length].id, policy, modo));
    }
    report(policy, outcomes, modo);
  }
}
const elapsed = Date.now() - started;
console.log(`\n${runs * 2 * modos.length} partidas en ${elapsed}ms\n`);
