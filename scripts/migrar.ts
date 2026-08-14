/**
 * Aplica las migraciones de db/migrations en orden.
 *
 * Deliberadamente mínimo: son unos pocos archivos y todos son idempotentes
 * (`create table if not exists`, `create index if not exists`), así que correr
 * esto dos veces no rompe nada y no hace falta una tabla de control.
 *
 *   DATABASE_URL="postgres://..." npx tsx scripts/migrar.ts
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('\nFalta DATABASE_URL.\n');
  console.error('  DATABASE_URL="postgres://usuario:clave@host/base" npx tsx scripts/migrar.ts\n');
  process.exit(1);
}

const carpeta = join(process.cwd(), 'db', 'migrations');
const archivos = readdirSync(carpeta)
  .filter((f) => f.endsWith('.sql'))
  .sort();

if (archivos.length === 0) {
  console.error(`No hay migraciones en ${carpeta}`);
  process.exit(1);
}

const sql = postgres(url, { max: 1, connect_timeout: 20 });

try {
  console.log(`\nAplicando ${archivos.length} ${archivos.length === 1 ? 'migración' : 'migraciones'}…\n`);
  for (const archivo of archivos) {
    const contenido = readFileSync(join(carpeta, archivo), 'utf8');
    await sql.unsafe(contenido);
    console.log(`  ✓ ${archivo}`);
  }

  const [{ count }] = await sql<{ count: string }[]>`select count(*) from presidencias`;
  console.log(`\nListo. La tabla presidencias tiene ${count} ${count === '1' ? 'fila' : 'filas'}.\n`);
} catch (error) {
  console.error('\nFalló la migración:', error instanceof Error ? error.message : error, '\n');
  process.exitCode = 1;
} finally {
  await sql.end();
}
