/**
 * Aplica las migraciones de db/migrations en orden.
 *
 * Deliberadamente mínimo: son unos pocos archivos y todos son idempotentes
 * (`create table if not exists`, `create index if not exists`), así que correr
 * esto dos veces no rompe nada y no hace falta una tabla de control.
 *
 *   DATABASE_URL="postgres://..." npx tsx scripts/migrar.ts
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import postgres from 'postgres';

/**
 * Lee .env.local igual que lo hace Next.
 *
 * Este script corre bajo tsx, que —a diferencia del servidor de Next— no carga
 * los archivos de entorno. Sin esto habría que pasar la cadena de conexión por
 * línea de comandos, y una credencial escrita en la terminal queda guardada en
 * el historial del shell.
 */
function cargarEntornoLocal(): void {
  if (process.env.DATABASE_URL) return;
  const archivo = join(process.cwd(), '.env.local');
  if (!existsSync(archivo)) return;
  try {
    process.loadEnvFile(archivo);
  } catch {
    // Node viejo: se parsea a mano lo mínimo indispensable.
    for (const linea of readFileSync(archivo, 'utf8').split('\n')) {
      const m = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i.exec(linea);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

cargarEntornoLocal();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('\nFalta DATABASE_URL.\n');
  console.error('  Poné la cadena de conexión en .env.local y volvé a correr:\n');
  console.error('    DATABASE_URL=postgresql://usuario:clave@host/base?sslmode=require\n');
  console.error('  O pasala directo:\n');
  console.error('    DATABASE_URL="postgresql://..." npm run migrar\n');
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

// Envuelto en una función y no con `await` de nivel superior: tsx carga estos
// scripts como CommonJS, y el await suelto los rompe con ERR_REQUIRE_ASYNC_MODULE.
async function migrar(): Promise<void> {
  const sql = postgres(url!, { max: 1, connect_timeout: 20 });

  try {
    console.log(
      `\nAplicando ${archivos.length} ${archivos.length === 1 ? 'migración' : 'migraciones'}…\n`,
    );
    for (const archivo of archivos) {
      await sql.unsafe(readFileSync(join(carpeta, archivo), 'utf8'));
      console.log(`  ✓ ${archivo}`);
    }

    const [{ count }] = await sql<{ count: string }[]>`select count(*) from presidencias`;
    console.log(
      `\nListo. La tabla presidencias tiene ${count} ${count === '1' ? 'fila' : 'filas'}.\n`,
    );
  } catch (error) {
    // Los errores de conexión de postgres.js llegan con `message` vacío y toda
    // la información en `code`, así que reportar solo el message deja al que
    // corre esto sin ninguna pista de qué pasó.
    const e = error as { message?: string; code?: string };
    const detalle = [e.message, e.code].filter(Boolean).join(' · ') || String(error);
    console.error(`\nFalló la migración: ${detalle}\n`);
    if (e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND' || e.code === 'CONNECT_TIMEOUT') {
      console.error('  Revisá que la cadena de conexión sea la correcta y termine en');
      console.error('  ?sslmode=require, que es lo que pide Neon.\n');
    }
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

void migrar();
