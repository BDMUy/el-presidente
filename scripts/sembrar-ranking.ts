/**
 * Llena el ranking de desarrollo con presidencias jugadas de verdad.
 *
 * Existe por una razón concreta: la tabla de posiciones vacía y la tabla con
 * filas son dos diseños distintos, y el segundo no se puede mirar hasta que
 * haya datos. Antes de esto la tabla llena solo existía en la cabeza de quien
 * la escribió.
 *
 * No inserta en la base directamente: manda las partidas por el endpoint, así
 * que de paso ejercita la verificación server-side completa. Si el servidor
 * rechaza algo, se ve acá.
 *
 *   npx tsx scripts/sembrar-ranking.ts 12
 *   npx tsx scripts/sembrar-ranking.ts 12 http://localhost:3001
 *
 * Y la contracara, porque estas partidas se escriben en la misma base que va a
 * servir el ranking de verdad y no pueden quedar ahí:
 *
 *   npx tsx scripts/sembrar-ranking.ts --limpiar
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { randomUUID } from 'node:crypto';
import postgres from 'postgres';

import { CLUBS } from '../content/clubs';
import { applyChoice, optionCount, startRun } from '../lib/engine/engine';
import { Rand } from '../lib/engine/rng';
import type { GameState } from '../lib/engine/types';

/** Marca en el nombre para poder borrar solo lo sembrado y nada más. */
const MARCA = '[prueba] ';

const limpiar = process.argv.includes('--limpiar');
const cantidad = Number(process.argv[2] ?? 10);
const base = process.argv[3] ?? 'http://localhost:3000';

const NOMBRES = [
  'Tinelli',
  'Angelici',
  'D. Ameal',
  'Moretti',
  'Doña Rosa',
  'El Chino',
  'Verón',
  'Riquelme',
  'La Gaita',
  'Cascini',
  'Mostaza',
  'El Ruso',
  'Beto',
  'La Tota',
  'Pepe Sánchez',
  'Nacho',
];

/**
 * Juega una presidencia entera y devuelve el log.
 *
 * Elige al azar a propósito: la idea no es un ranking creíble sino un abanico
 * de puntajes, nombres largos y cortos, y clubes de las tres categorías, que
 * es lo que estresa el layout de la tabla.
 */
function jugar(seed: number, clubId: string): number[] {
  const dado = new Rand(seed ^ 0x9e3779b9);
  let state: GameState = startRun({ seed, clubId });
  const choices: number[] = [];

  let guarda = 0;
  while (state.status === 'jugando' && guarda++ < 5000) {
    const opciones = optionCount(state);
    if (opciones === 0) break;
    // Sesgo hacia las primeras opciones: el azar puro termina casi siempre en
    // asamblea y todos los puntajes salen iguales de bajos.
    const choice = dado.chance(0.55) ? 0 : dado.int(0, opciones - 1);
    choices.push(choice);
    state = applyChoice(state, choice);
  }

  if (state.status !== 'terminado') throw new Error('la partida no terminó');
  return choices;
}

function cargarEntorno(): void {
  for (const nombre of ['.env.local', '.env']) {
    if (process.env.DATABASE_URL) return;
    const archivo = join(process.cwd(), nombre);
    if (!existsSync(archivo)) continue;
    try {
      process.loadEnvFile(archivo);
    } catch {
      for (const linea of readFileSync(archivo, 'utf8').split('\n')) {
        const m = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i.exec(linea);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  }
}

/**
 * Borra lo sembrado y solo lo sembrado.
 *
 * Imprime cada fila antes de tocarla: un script que borra en silencio de una
 * base que también va a tener partidas de gente real no es un script, es una
 * trampa. El filtro es el prefijo de marca, más la lista de nombres con la que
 * se sembró antes de que la marca existiera.
 */
async function limpiarSembrado(): Promise<void> {
  cargarEntorno();
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('\nFalta DATABASE_URL.\n');
    process.exitCode = 1;
    return;
  }

  const sql = postgres(url, { max: 1, connect_timeout: 20, onnotice: () => {} });
  try {
    const condenadas = await sql<{ id: number; nombre: string; puntaje: number }[]>`
      select id, nombre, puntaje from presidencias
      where nombre like ${MARCA + '%'}
         or nombre in ${sql([...NOMBRES, 'Prueba Final'])}
      order by puntaje desc
    `;

    if (condenadas.length === 0) {
      console.log('\nNo hay presidencias de prueba para borrar.\n');
      return;
    }

    console.log(`\nBorrando ${condenadas.length} presidencias de prueba:\n`);
    for (const f of condenadas) console.log(`  − ${f.nombre} · ${f.puntaje}`);

    // `in ${sql(array)}` y no `any(sql.array(...))`: lo segundo serializa el
    // array a una sola cadena separada por comas y Postgres lo rechaza como
    // literal malformado. Este expande a `in ($1, $2, …)`, que es lo que hay
    // que mandar.
    await sql`delete from presidencias where id in ${sql(condenadas.map((f) => f.id))}`;
    const [{ count }] = await sql<{ count: string }[]>`select count(*) from presidencias`;
    console.log(`\nListo. Quedan ${count} presidencias.\n`);
  } catch (error) {
    const e = error as { message?: string; code?: string };
    console.error(`\nFalló la limpieza: ${[e.message, e.code].filter(Boolean).join(' · ')}\n`);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

async function sembrar(): Promise<void> {
  const dado = new Rand(20260816);
  let enviadas = 0;

  for (let i = 0; i < cantidad; i++) {
    const club = dado.pick(CLUBS);
    const seed = dado.int(0, 0xffffff);

    let choices: number[];
    try {
      choices = jugar(seed, club.id);
    } catch {
      continue;
    }

    const respuesta = await fetch(`${base}/api/puntaje`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        dispositivo: randomUUID(),
        nombre: MARCA + NOMBRES[i % NOMBRES.length],
        seed,
        clubId: club.id,
        choices,
        diaria: false,
      }),
    });

    const datos = (await respuesta.json()) as { ok?: boolean; puntaje?: number; error?: string };
    if (datos.ok) {
      enviadas++;
      console.log(`  ✓ ${NOMBRES[i % NOMBRES.length]} · ${club.short} · ${datos.puntaje}`);
    } else {
      console.log(`  ✗ ${club.short}: ${datos.error ?? respuesta.status}`);
    }
  }

  console.log(`\n${enviadas} de ${cantidad} presidencias aceptadas por el servidor.\n`);
}

void (limpiar ? limpiarSembrado() : sembrar());
