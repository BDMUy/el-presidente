import { CLUBS } from '../content/clubs';
import { CRACKS } from '../content/parodias';
import { applyChoice, optionCount, startRun } from '../lib/engine/engine';
import { Rand } from '../lib/engine/rng';
import type { GameState } from '../lib/engine/types';

const CORRIDAS = Number(process.argv[2] ?? 400);
const CATALOGO = new Set(CRACKS);

let ventanas = 0;
let conCrack = 0;
let dosEnLaMisma = 0;
let partidasConRepetido = 0;
const frecuencia = new Map<string, number>();

for (let s = 0; s < CORRIDAS; s++) {
  const dado = new Rand(s ^ 0x51ed2701);
  const club = dado.pick(CLUBS);
  let estado: GameState = startRun({ seed: s * 7919, clubId: club.id });
  const vistos: string[] = [];

  let guarda = 0;
  while (estado.status === 'jugando' && guarda++ < 5000) {
    if (estado.phase.kind === 'mercado') {
      ventanas++;
      const enLaVentana = estado.phase.offers.map((o) => o.name).filter((n) => CATALOGO.has(n));
      if (enLaVentana.length > 0) conCrack++;
      if (enLaVentana.length > 1) dosEnLaMisma++;
      for (const n of enLaVentana) {
        vistos.push(n);
        frecuencia.set(n, (frecuencia.get(n) ?? 0) + 1);
      }
    }

    const opciones = optionCount(estado);
    if (opciones === 0) break;
    estado = applyChoice(estado, dado.chance(0.6) ? 0 : dado.int(0, opciones - 1));
  }

  if (new Set(vistos).size !== vistos.length) partidasConRepetido++;
}

const pct = (n: number, de: number) => `${((n / de) * 100).toFixed(1)}%`;

console.log(`\n${CORRIDAS} presidencias · ${ventanas} ventanas de mercado\n`);
console.log(`  ventanas con un crack     ${conCrack} (${pct(conCrack, ventanas)})`);
console.log(`  dos en la misma ventana   ${dosEnLaMisma}`);
console.log(`  presidencias con repetido ${partidasConRepetido}`);
console.log(`  del catálogo se vieron    ${frecuencia.size} de ${CRACKS.length}\n`);

const orden = [...frecuencia.entries()].sort((a, b) => b[1] - a[1]);
const sinVer = CRACKS.filter((c) => !frecuencia.has(c));
if (orden.length > 0) {
  console.log(`  más visto  ${orden[0][0]} (${orden[0][1]})`);
  console.log(`  menos      ${orden[orden.length - 1][0]} (${orden[orden.length - 1][1]})`);
}
if (sinVer.length > 0) console.log(`\n  nunca apareció: ${sinVer.join(', ')}`);

if (partidasConRepetido > 0 || dosEnLaMisma > 0) {
  console.error('\n  ✗ Hay repeticiones: el índice por temporada no está haciendo su trabajo.\n');
  process.exitCode = 1;
} else {
  console.log('\n  ✓ Ningún crack se repite dentro de una misma presidencia.\n');
}
