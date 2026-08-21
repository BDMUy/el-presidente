import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { randomUUID } from 'node:crypto';
import postgres from 'postgres';

import { CLUBS } from '../content/clubs';
import { applyChoice, optionCount, startRun } from '../lib/engine/engine';
import { Rand } from '../lib/engine/rng';
import type { GameState } from '../lib/engine/types';

const MARCA = '[prueba] ';

const RESTOS_DE_PRUEBAS = [
  'Prueba Final',
  'a',
  'A'.repeat(24),
  "'; drop table presidenci",
  '<img src=x onerror=alert',
  'admin0001',
  'jefe0001',
  'linea1 linea2 linea3',
  'abc',
];

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

function jugar(seed: number, clubId: string): number[] {
  const dado = new Rand(seed ^ 0x9e3779b9);
  let state: GameState = startRun({ seed, clubId });
  const choices: number[] = [];

  let guarda = 0;
  while (state.status === 'jugando' && guarda++ < 5000) {
    const opciones = optionCount(state);
    if (opciones === 0) break;
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
         or nombre in ${sql([...NOMBRES, ...RESTOS_DE_PRUEBAS])}
      order by puntaje desc
    `;

    if (condenadas.length === 0) {
      console.log('\nNo hay presidencias de prueba para borrar.\n');
      return;
    }

    console.log(`\nBorrando ${condenadas.length} presidencias de prueba:\n`);
    for (const f of condenadas) console.log(`  − ${f.nombre} · ${f.puntaje}`);

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
