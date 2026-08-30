import { CLUBS } from '../content/clubs';
import { ALL_EVENTS } from '../content/events';
import { applyChoice, optionCount, startRun } from '../lib/engine/engine';
import { Rand } from '../lib/engine/rng';
import type { Country, GameState, Modo } from '../lib/engine/types';
import { countryOf, MODOS, TEMPORADAS_POR_MODO } from '../lib/engine/types';

const posicionales = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const runs = Number(posicionales[0] ?? 3000);

const argModo = process.argv.find((a) => a.startsWith('--modo='))?.slice(7) ?? 'normal';
if (!(MODOS as readonly string[]).includes(argModo)) {
  console.error(`Modo desconocido: "${argModo}". Son ${MODOS.join(', ')}.`);
  process.exit(1);
}
const modo = argModo as Modo;
const TOPE = TEMPORADAS_POR_MODO[modo];

const argPais = process.argv.find((a) => a.startsWith('--pais='))?.slice(7) as Country | undefined;
const pool = argPais ? CLUBS.filter((c) => countryOf(c.league) === argPais) : CLUBS;
if (pool.length === 0) {
  console.error(`No hay clubes para pais="${argPais}"`);
  process.exit(1);
}

function elegir(state: GameState, chooser: Rand): number {
  if (state.phase.kind === 'mercado') {
    const { offers } = state.phase;
    const noMover = offers.length;
    let mejor = noMover;
    let mejorDelta = 0;
    offers.forEach((offer, i) => {
      if (offer.plantelDelta <= mejorDelta) return;
      if (offer.cost > state.resources.caja) return;
      mejor = i;
      mejorDelta = offer.plantelDelta;
    });
    return mejor;
  }

  if (state.phase.kind !== 'evento') return chooser.int(0, optionCount(state) - 1);

  const { event, available } = state.phase;
  const valores = available.map((optionIndex) => {
    const option = event.options[optionIndex];
    return option.random
      ? option.random.reduce(
          (s, o) => s + (o.weight / option.random!.reduce((t, x) => t + x.weight, 0)) * (o.effects.hinchada ?? 0),
          0,
        )
      : (option.effects?.hinchada ?? 0);
  });
  const mejorValor = Math.max(...valores);
  const empatados = valores
    .map((v, displayIndex) => ({ v, displayIndex }))
    .filter(({ v }) => v === mejorValor)
    .map(({ displayIndex }) => displayIndex);
  return chooser.pick(empatados);
}

function jugar(seed: number, clubId: string): GameState {
  const chooser = new Rand(seed ^ 0x9e3779b9);
  let state = startRun({ seed, clubId, modo });
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
let repetidasTotal = 0;
let partidasConRepetidas = 0;
let partidasLargas = 0;
let cartasEnLargas = 0;
const primeraRepeticion: number[] = [];
let sorteosEnLargas = 0;
let repetidasEnLargas = 0;

for (let i = 0; i < runs; i++) {
  const club = pool[i % pool.length];
  const state = jugar(i * 2654435761, club.id);
  cartasPorPartida += state.usedEvents.length;
  temporadas += state.season;

  const distintas = new Set(state.usedEvents);
  const repetidas = state.usedEvents.length - distintas.size;
  repetidasTotal += repetidas;
  if (repetidas > 0) partidasConRepetidas++;

  if (state.season >= TOPE) {
    partidasLargas++;
    cartasEnLargas += distintas.size;
    sorteosEnLargas += state.usedEvents.length;
    repetidasEnLargas += repetidas;
    const yaVistas = new Set<string>();
    for (let k = 0; k < state.usedEvents.length; k++) {
      if (yaVistas.has(state.usedEvents[k])) {
        primeraRepeticion.push(k);
        break;
      }
      yaVistas.add(state.usedEvents[k]);
    }
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

console.log(`\nCOBERTURA DE CONTENIDO · ${runs} presidencias · modo ${modo} (${TOPE} temporadas)\n`);
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

if (partidasLargas > 0) {
  const sorteos = sorteosEnLargas / partidasLargas;
  const repes = repetidasEnLargas / partidasLargas;
  console.log(`\n  EN LAS ${partidasLargas} PRESIDENCIAS COMPLETAS:`);
  console.log(`    cartas que salen         ${sorteos.toFixed(0)}`);
  console.log(
    `    de ellas, repetidas      ${repes.toFixed(0)} (${((repes / sorteos) * 100).toFixed(0)}%)`,
  );

  if (primeraRepeticion.length > 0) {
    const ordenadas = [...primeraRepeticion].sort((a, b) => a - b);
    const mediana = ordenadas[Math.floor(ordenadas.length / 2)];
    console.log(
      `    1ª repetición (mediana)  en la carta ${mediana} de ${sorteos.toFixed(0)} ` +
        `(al ${((mediana / sorteos) * 100).toFixed(0)}% de la partida)`,
    );
  } else {
    console.log('    1ª repetición            nunca: ninguna repitió una carta');
  }
}

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

const top = [...vistas].sort((a, b) => b[1] - a[1]).slice(0, 8);
console.log('\n  MÁS FRECUENTES:');
for (const [id, n] of top) {
  console.log(`    ${id.padEnd(26)} ${((n / runs) * 100).toFixed(1)}% de las partidas`);
}
console.log('');
