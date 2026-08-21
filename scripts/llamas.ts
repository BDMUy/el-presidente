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

console.log('\n  CÓMO TERMINAN (en llamas)');
const finales = new Map<EndingId, number>();
for (const s of llamas) finales.set(s.final, (finales.get(s.final) ?? 0) + 1);
for (const [final, n] of [...finales].sort((a, b) => b[1] - a[1])) {
  const p = (n / llamas.length) * 100;
  console.log(`  ${final.padEnd(20)} ${p.toFixed(1).padStart(5)}%  ${'█'.repeat(Math.round(p / 2.5))}`);
}

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
