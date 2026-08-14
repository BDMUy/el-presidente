/**
 * Cobertura de contenido.
 *
 * Simula miles de presidencias y reporta qué cartas aparecen y cuáles no. Es
 * la contracara del simulador de balance: ahí se mide si el juego es justo,
 * acá si el contenido existe de verdad.
 *
 * La métrica que importa es la lista de cartas nunca vistas. Una carta con
 * condiciones que no se cumplen nunca es trabajo de escritura tirado, y no hay
 * forma de darse cuenta jugando.
 *
 *   npx tsx scripts/cobertura.ts 3000
 */

import { CLUBS } from '../content/clubs';
import { ALL_EVENTS } from '../content/events';
import { applyChoice, optionCount, startRun } from '../lib/engine/engine';
import { Rand } from '../lib/engine/rng';
import type { GameState } from '../lib/engine/types';

const runs = Number(process.argv[2] ?? 3000);

/**
 * Política sesgada a sobrevivir: elige la opción que menos daña la hinchada.
 *
 * Con decisiones al azar la partida muere en la temporada cinco y solo ve un
 * quinto del catálogo, que no es la pregunta. La pregunta es qué ve alguien
 * que llega a las dieciséis.
 */
function elegir(state: GameState, chooser: Rand): number {
  if (state.phase.kind !== 'evento') return chooser.int(0, optionCount(state) - 1);

  const { event, available } = state.phase;
  let mejor = 0;
  let mejorValor = -Infinity;
  available.forEach((optionIndex, displayIndex) => {
    const option = event.options[optionIndex];
    const efectos = option.random
      ? option.random.reduce(
          (s, o) => s + (o.weight / option.random!.reduce((t, x) => t + x.weight, 0)) * (o.effects.hinchada ?? 0),
          0,
        )
      : (option.effects?.hinchada ?? 0);
    if (efectos > mejorValor) {
      mejorValor = efectos;
      mejor = displayIndex;
    }
  });
  return mejor;
}

function jugar(seed: number, clubId: string): GameState {
  const chooser = new Rand(seed ^ 0x9e3779b9);
  let state = startRun({ seed, clubId });
  let guard = 0;
  while (state.status === 'jugando' && guard++ < 5000) {
    const opciones = optionCount(state);
    if (opciones === 0) break;
    state = applyChoice(state, Math.min(elegir(state, chooser), opciones - 1));
  }
  return state;
}

const vistas = new Map<string, number>();
let cartasPorPartida = 0;
let temporadas = 0;
/** Cartas repetidas dentro de una misma partida: el mazo se agotó. */
let repetidasTotal = 0;
let partidasConRepetidas = 0;
let partidasLargas = 0;
let cartasEnLargas = 0;

for (let i = 0; i < runs; i++) {
  const club = CLUBS[i % CLUBS.length];
  const state = jugar(i * 2654435761, club.id);
  cartasPorPartida += state.usedEvents.length;
  temporadas += state.season;

  const distintas = new Set(state.usedEvents);
  const repetidas = state.usedEvents.length - distintas.size;
  repetidasTotal += repetidas;
  if (repetidas > 0) partidasConRepetidas++;

  if (state.season >= 14) {
    partidasLargas++;
    cartasEnLargas += distintas.size;
  }

  for (const id of distintas) {
    vistas.set(id, (vistas.get(id) ?? 0) + 1);
  }
}

const nunca = ALL_EVENTS.filter((e) => !vistas.has(e.id));
const raras = ALL_EVENTS.filter((e) => {
  const n = vistas.get(e.id) ?? 0;
  return n > 0 && n / runs < 0.01;
});

console.log(`\nCOBERTURA DE CONTENIDO · ${runs} presidencias\n`);
console.log(`  cartas en el catálogo      ${ALL_EVENTS.length}`);
console.log(`  cartas vistas alguna vez   ${vistas.size}`);
console.log(`  cartas por partida (prom)  ${(cartasPorPartida / runs).toFixed(1)}`);
console.log(`  temporadas por partida     ${(temporadas / runs).toFixed(1)}`);
console.log(
  `  presidencias completas     ${partidasLargas} (${((partidasLargas / runs) * 100).toFixed(1)}%), ` +
    `${partidasLargas > 0 ? (cartasEnLargas / partidasLargas).toFixed(1) : '0'} cartas distintas cada una`,
);
console.log(
  `  con cartas repetidas       ${((partidasConRepetidas / runs) * 100).toFixed(1)}% ` +
    `(${(repetidasTotal / runs).toFixed(2)} repeticiones por partida)`,
);

if (nunca.length > 0) {
  console.log(`\n  NUNCA APARECEN (${nunca.length}) — condiciones inalcanzables:`);
  for (const e of nunca) console.log(`    ${e.id.padEnd(26)} ${JSON.stringify(e.requires ?? {})}`);
} else {
  console.log('\n  Todas las cartas del catálogo son alcanzables.');
}

if (raras.length > 0) {
  console.log(`\n  MUY RARAS (menos del 1% de las partidas):`);
  for (const e of raras) {
    console.log(`    ${e.id.padEnd(26)} ${((vistas.get(e.id)! / runs) * 100).toFixed(2)}%`);
  }
}

// Las diez más frecuentes: si una carta domina, se repite demasiado.
const top = [...vistas].sort((a, b) => b[1] - a[1]).slice(0, 8);
console.log('\n  MÁS FRECUENTES:');
for (const [id, n] of top) {
  console.log(`    ${id.padEnd(26)} ${((n / runs) * 100).toFixed(1)}% de las partidas`);
}
console.log('');
