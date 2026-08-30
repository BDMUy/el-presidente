import { CLUBS, getClub } from '../content/clubs';
import { applyChoice, optionCount, startRun } from '../lib/engine/engine';
import { enumerateAssignments, winProbability } from '../lib/engine/mesa-chica';
import { Rand } from '../lib/engine/rng';
import { expectedPosition } from '../lib/engine/season';
import type { Effects, GameState, Modo } from '../lib/engine/types';
import { MODOS } from '../lib/engine/types';

const posicionales = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const runs = Number(posicionales[0] ?? 3000);

const argModo = process.argv.find((a) => a.startsWith('--modo='))?.slice(7) ?? 'todos';
const modos: Modo[] = argModo === 'todos' ? [...MODOS] : [argModo as Modo];
for (const m of modos) {
  if (!MODOS.includes(m)) {
    console.error(`Modo desconocido: "${m}". Son ${MODOS.join(', ')} o "todos".`);
    process.exit(1);
  }
}

type Policy = 'random' | 'greedy';

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

function greedyChoice(state: GameState, chooser: Rand): number {
  const { phase, resources } = state;

  switch (phase.kind) {
    case 'mercado': {
      const scored = phase.offers.map((offer, index) => {
        const affordable = offer.cost <= resources.caja + 5;
        const value = offer.plantelDelta * 1.2 + offer.hinchadaDelta - offer.cost * (resources.caja < 5 ? 3 : 1.5);
        return { index, value: affordable ? value : -Infinity };
      });
      const best = scored.reduce((a, b) => (b.value > a.value ? b : a), { index: phase.offers.length, value: 0 });
      return best.index;
    }
    case 'evento': {
      const scored = phase.available.map((optionIndex, displayIndex) => {
        const option = phase.event.options[optionIndex];
        const value = option.random
          ? option.random.reduce(
              (s, o) => s + (o.weight / option.random!.reduce((t, x) => t + x.weight, 0)) * valueOf(o.effects, resources.caja),
              0,
            )
          : valueOf(option.effects, resources.caja);
        return { displayIndex, value };
      });
      return scored.reduce((a, b) => (b.value > a.value ? b : a)).displayIndex;
    }
    case 'mesa-chica': {
      const assignments = enumerateAssignments();
      const scored = assignments.map((assignment, index) => {
        const prob = winProbability(phase.match, assignment);
        const costo = assignment.plantel * 0.8 + assignment.hinchada * 0.3 + assignment.prensa * 0.5;
        return { index, value: prob - costo * 0.02 };
      });
      return scored.reduce((a, b) => (b.value > a.value ? b : a)).index;
    }
    default:
      return chooser.int(0, Math.max(0, optionCount(state) - 1));
  }
}

interface Muestra {
  fase: string;
  texto: string;
  state: GameState;
  votes?: number;
  posicion?: number;
}

interface Regla {
  id: string;
  patron: RegExp;
  prohibido: (m: Muestra) => boolean;
}

const REGLAS: Regla[] = [
  {
    id: 'renuncia-con-hinchada-alta',
    patron: /pid(e|ió).{0,20}renuncia|que se vaya|escrache/i,
    prohibido: (m) => m.fase === 'temporada' && m.state.resources.hinchada >= 60,
  },
  {
    id: 'cuentas-en-orden-con-deuda',
    patron: /cuentas.{0,15}en orden|balance impecable/i,
    prohibido: (m) => m.fase === 'fin' && m.state.resources.caja < 0,
  },
  {
    id: 'ni-fiesta-ni-tragedia-lejos-de-la-expectativa',
    patron: /Ni fiesta ni tragedia/,
    prohibido: (m) => {
      if (m.fase !== 'temporada' || m.posicion === undefined) return false;
      const club = getClub(m.state.clubId);
      const esperada = expectedPosition(club, m.state.league);
      return esperada - m.posicion <= -5;
    },
  },
  {
    id: 'sin-catastrofes-con-descenso',
    patron: /sin catástrofes/,
    prohibido: (m) => m.fase === 'fin' && m.state.descensos > 0,
  },
  {
    id: 'paliza-electoral-ganada-sin-margen',
    patron: /no dejó margen para el reclamo/,
    prohibido: (m) => (m.votes ?? 100) < 75,
  },
  {
    id: 'paliza-electoral-perdida-sin-margen',
    patron: /sin discusión posible/,
    prohibido: (m) => (m.votes ?? 0) > 25,
  },
];

function jugar(seed: number, clubId: string, policy: Policy, modo: Modo, muestras: Muestra[]): void {
  const chooser = new Rand(seed ^ 0x51759df);
  let state: GameState = startRun({ seed, clubId, modo });

  let guard = 0;
  while (state.status === 'jugando' && guard++ < 5000) {
    const options = optionCount(state);
    if (options === 0) break;
    const choice = policy === 'random' ? chooser.int(0, options - 1) : greedyChoice(state, chooser);
    state = applyChoice(state, Math.min(choice, options - 1));

    const { phase } = state;
    if (phase.kind === 'resultado-evento') {
      muestras.push({ fase: 'evento', texto: phase.text, state });
    } else if (phase.kind === 'resultado-final') {
      muestras.push({ fase: 'mesa-chica', texto: phase.text, state });
    } else if (phase.kind === 'temporada') {
      muestras.push({ fase: 'temporada', texto: phase.result.summary, state, posicion: phase.result.position });
    } else if (phase.kind === 'eleccion') {
      muestras.push({ fase: 'eleccion', texto: phase.result.summary, state, votes: phase.result.votes });
    } else if (phase.kind === 'fin') {
      muestras.push({ fase: 'fin', texto: phase.ending.text, state });
    }
  }
}

const muestras: Muestra[] = [];
for (const modo of modos) {
  for (const policy of ['random', 'greedy'] as Policy[]) {
    for (let i = 0; i < runs; i++) {
      const club = CLUBS[i % CLUBS.length];
      jugar(i * 2654435761 + policy.length, club.id, policy, modo, muestras);
    }
  }
}

console.log(`\nCOHERENCIA DE MENSAJES · ${runs} presidencias × 2 políticas × ${modos.length} modo(s)`);
console.log(`  textos revisados   ${muestras.length}\n`);

let violaciones = 0;
for (const regla of REGLAS) {
  const encontradas = muestras.filter((m) => regla.patron.test(m.texto) && regla.prohibido(m));
  if (encontradas.length === 0) continue;
  violaciones += encontradas.length;
  console.log(`  [FALLA] ${regla.id} — ${encontradas.length} caso(s)`);
  for (const caso of encontradas.slice(0, 3)) {
    console.log(
      `    fase=${caso.fase} hinchada=${Math.round(caso.state.resources.hinchada)} ` +
        `caja=${caso.state.resources.caja} descensos=${caso.state.descensos} → "${caso.texto}"`,
    );
  }
}

if (violaciones === 0) {
  console.log(`  Sin violaciones sobre ${REGLAS.length} reglas.\n`);
} else {
  console.log(`\n  Total: ${violaciones} violación(es).\n`);
  process.exit(1);
}
