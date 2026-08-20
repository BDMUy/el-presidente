/**
 * ¿Cuánto más difícil es el club en llamas, y dónde se muere?
 *
 * Se juegan los mismos pares semilla/club dos veces, una en normal y otra en
 * llamas, con la misma política. Las dos duran dieciséis temporadas, así que
 * lo único que cambia entre las dos corridas es el arranque: veintidós
 * millones de deuda, el plantel doce puntos por encima de lo que el club puede
 * pagar, y la hinchada en cuarenta.
 *
 * Antes esto medía otra cosa: el club en llamas era una rareza que el motor
 * sorteaba 1 en 500 y que competía en la tabla normal contra partidas que
 * arrancaban enteras. La medición decía −24,5% de puntaje, o sea un castigo
 * secreto que además ensuciaba el ranking. Por eso pasó a ser un modo que se
 * elige y tiene su propia tabla.
 *
 * Lo que hay que mirar acá no es solo cuántas terminan, sino **dónde se
 * mueren**: si casi todas caen en la primera elección, la dificultad está
 * puesta en la hinchada y el resto del modo no se llega a jugar nunca.
 *
 *   npx tsx scripts/llamas.ts 3000
 */

import { CLUBS } from '../content/clubs';
import { computeScore } from '../lib/engine/election';
import { applyChoice, optionCount, startRun } from '../lib/engine/engine';
import { Rand } from '../lib/engine/rng';
import type { EndingId, GameState, Modo } from '../lib/engine/types';
import { TEMPORADAS_POR_MODO } from '../lib/engine/types';

const CORRIDAS = Number(process.argv[2] ?? 3000);

interface Salida {
  puntaje: number;
  temporadas: number;
  titulos: number;
  final: EndingId;
  completa: boolean;
}

function jugar(seed: number, clubId: string, modo: Modo): Salida {
  const dado = new Rand(seed ^ 0x2545f491);
  let st: GameState = startRun({ seed, clubId, modo });
  let g = 0;
  while (st.status === 'jugando' && g++ < 5000) {
    const n = optionCount(st);
    if (n === 0) break;
    // Misma política en las dos corridas: sesgada a la primera opción, que es
    // un jugador que lee y elige razonable sin ser óptimo. Para el número
    // calibrado de "jugador que optimiza" está `simulate --modo=llamas`.
    st = applyChoice(st, dado.chance(0.6) ? 0 : dado.int(0, n - 1));
  }
  return {
    puntaje: computeScore(st),
    temporadas: st.season,
    titulos: st.titles.length,
    final: st.ending?.id ?? 'reelecto-gris',
    completa: st.season >= TEMPORADAS_POR_MODO[modo],
  };
}

const normales: Salida[] = [];
const llamas: Salida[] = [];

for (let i = 0; i < CORRIDAS; i++) {
  const dado = new Rand(i ^ 0x9e3779b9);
  const club = dado.pick(CLUBS);
  const seed = i * 7919 + 13;
  normales.push(jugar(seed, club.id, 'normal'));
  llamas.push(jugar(seed, club.id, 'llamas'));
}

const med = (xs: number[]) => {
  const o = [...xs].sort((a, b) => a - b);
  return o[Math.floor(o.length / 2)];
};
const prom = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const pct = (xs: Salida[], f: (s: Salida) => boolean) =>
  ((xs.filter(f).length / xs.length) * 100).toFixed(1) + '%';

function fila(etiqueta: string, a: Salida[], b: Salida[], f: (s: Salida) => number) {
  console.log(
    `  ${etiqueta.padEnd(12)} med ${med(a.map(f)).toFixed(1).padStart(7)} → ${med(b.map(f)).toFixed(1).padStart(7)}` +
      `    prom ${prom(a.map(f)).toFixed(1).padStart(7)} → ${prom(b.map(f)).toFixed(1).padStart(7)}`,
  );
}

console.log(`\n${CORRIDAS} pares · normal → en llamas\n`);
fila('puntaje', normales, llamas, (s) => s.puntaje);
fila('temporadas', normales, llamas, (s) => s.temporadas);
fila('títulos', normales, llamas, (s) => s.titulos);

console.log('');
console.log(`  completan 16   ${pct(normales, (s) => s.completa)} → ${pct(llamas, (s) => s.completa)}`);

// Dónde se mueren. Si una sola causa se lleva casi todo, la dificultad está
// concentrada en un solo lugar y el resto del modo es decorado.
console.log('\n  CÓMO TERMINAN (en llamas)');
const finales = new Map<EndingId, number>();
for (const s of llamas) finales.set(s.final, (finales.get(s.final) ?? 0) + 1);
for (const [final, n] of [...finales].sort((a, b) => b[1] - a[1])) {
  const p = (n / llamas.length) * 100;
  console.log(`  ${final.padEnd(20)} ${p.toFixed(1).padStart(5)}%  ${'█'.repeat(Math.round(p / 2.5))}`);
}

// En qué temporada caen. La primera elección es la 4.
console.log('\n  EN QUÉ TEMPORADA SE CAEN (en llamas, las que no terminan)');
const cortes = new Map<number, number>();
for (const s of llamas.filter((x) => !x.completa)) {
  cortes.set(s.temporadas, (cortes.get(s.temporadas) ?? 0) + 1);
}
for (const t of [...cortes.keys()].sort((a, b) => a - b)) {
  const n = cortes.get(t)!;
  const p = (n / llamas.length) * 100;
  console.log(`  T${String(t).padEnd(19)} ${p.toFixed(1).padStart(5)}%  ${'█'.repeat(Math.round(p / 2.5))}`);
}

const delta = ((prom(llamas.map((s) => s.puntaje)) - prom(normales.map((s) => s.puntaje))) /
  prom(normales.map((s) => s.puntaje))) * 100;
console.log(`\n  diferencia de puntaje promedio: ${delta > 0 ? '+' : ''}${delta.toFixed(1)}%\n`);
