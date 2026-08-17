/**
 * ¿El "club en llamas" merece un ranking aparte?
 *
 * Se juegan los mismos pares semilla/club dos veces, una normal y otra con la
 * rareza forzada, con la misma política de decisión. Si el puntaje sale
 * parecido, comparten tabla sin problema; si sale sistemáticamente más alto o
 * más bajo, la tabla mezcla dos juegos distintos.
 *
 * La primera medición dio −33% de puntaje promedio para la rareza, y eso
 * destapó que estaba a medio hacer: el plan decía "deuda catastrófica y una
 * final regalada", y el código tiene la deuda pero nunca tuvo la final. O sea
 * el castigo sin la compensación.
 *
 * Ojo con la política: acá se juega sesgado a la primera opción, que es un
 * jugador que lee pero no optimiza. El plantel extra de la rareza probablemente
 * rinda más en manos de alguien bueno, así que la brecha real es seguramente
 * menor que la medida. Lo que no cambia es el signo: quiebran más y llegan
 * menos lejos.
 *
 *   npx tsx scripts/llamas.ts 3000
 */

import { CLUBS } from '../content/clubs';
import { computeScore } from '../lib/engine/election';
import { applyChoice, optionCount, startRun } from '../lib/engine/engine';
import { Rand } from '../lib/engine/rng';
import type { GameState } from '../lib/engine/types';

const CORRIDAS = Number(process.argv[2] ?? 3000);

interface Salida {
  puntaje: number;
  temporadas: number;
  titulos: number;
  quiebra: boolean;
  completa: boolean;
}

function jugar(seed: number, clubId: string, forceRare: boolean): Salida {
  const dado = new Rand(seed ^ 0x2545f491);
  let st: GameState = startRun({ seed, clubId, forceRare });
  let g = 0;
  while (st.status === 'jugando' && g++ < 5000) {
    const n = optionCount(st);
    if (n === 0) break;
    // Misma política en las dos corridas: sesgada a la primera opción, que es
    // un jugador que lee y elige razonable sin ser óptimo.
    st = applyChoice(st, dado.chance(0.6) ? 0 : dado.int(0, n - 1));
  }
  return {
    puntaje: computeScore(st),
    temporadas: st.season,
    titulos: st.titles.length,
    quiebra: st.ending?.id === 'quiebra',
    completa: st.season >= 16,
  };
}

const normales: Salida[] = [];
const llamas: Salida[] = [];

for (let i = 0; i < CORRIDAS; i++) {
  const dado = new Rand(i ^ 0x9e3779b9);
  const club = dado.pick(CLUBS);
  const seed = i * 7919 + 13;
  normales.push(jugar(seed, club.id, false));
  llamas.push(jugar(seed, club.id, true));
}

const med = (xs: number[]) => {
  const o = [...xs].sort((a, b) => a - b);
  return o[Math.floor(o.length / 2)];
};
const prom = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const pct = (xs: Salida[], f: (s: Salida) => boolean) =>
  ((xs.filter(f).length / xs.length) * 100).toFixed(1) + '%';

function fila(etiqueta: string, a: Salida[], b: Salida[], f: (s: Salida) => number) {
  const va = med(a.map(f));
  const vb = med(b.map(f));
  const pa = prom(a.map(f));
  const pb = prom(b.map(f));
  console.log(
    `  ${etiqueta.padEnd(12)} med ${va.toFixed(1).padStart(7)} → ${vb.toFixed(1).padStart(7)}` +
      `    prom ${pa.toFixed(1).padStart(7)} → ${pb.toFixed(1).padStart(7)}`,
  );
}

console.log(`\n${CORRIDAS} pares · normal → en llamas\n`);
fila('puntaje', normales, llamas, (s) => s.puntaje);
fila('temporadas', normales, llamas, (s) => s.temporadas);
fila('títulos', normales, llamas, (s) => s.titulos);

console.log('');
console.log(`  completan 16   ${pct(normales, (s) => s.completa)} → ${pct(llamas, (s) => s.completa)}`);
console.log(`  quiebran       ${pct(normales, (s) => s.quiebra)} → ${pct(llamas, (s) => s.quiebra)}`);

const pn = prom(normales.map((s) => s.puntaje));
const pl = prom(llamas.map((s) => s.puntaje));
const delta = ((pl - pn) / pn) * 100;
console.log(`\n  diferencia de puntaje promedio: ${delta > 0 ? '+' : ''}${delta.toFixed(1)}%\n`);
