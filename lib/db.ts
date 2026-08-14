import 'server-only';

/**
 * Acceso a la base, solo desde el servidor.
 *
 * Se conecta con un `DATABASE_URL` de Postgres común, sin SDK de ningún
 * proveedor. Es deliberado: el proyecto ya cambió de proveedor una vez, y con
 * una cadena de conexión estándar cambiar de Neon a Supabase, a Railway o a un
 * VPS es cambiar una variable de entorno, no reescribir las consultas.
 *
 * `server-only` hace fallar la compilación si alguien importa esto desde un
 * componente de cliente: la credencial nunca puede llegar al navegador.
 *
 * Si la variable no está configurada, `getDb()` devuelve null y las rutas
 * responden que el ranking no está disponible. El juego entero funciona sin
 * base: los rankings son un agregado, no un requisito.
 */

import postgres, { type Sql } from 'postgres';

let cliente: Sql | null | undefined;

export function getDb(): Sql | null {
  if (cliente !== undefined) return cliente;

  const url = process.env.DATABASE_URL;
  if (!url) {
    cliente = null;
    return null;
  }

  cliente = postgres(url, {
    // En serverless cada instancia abre su propio pool: mantenerlo chico evita
    // agotar las conexiones del plan gratuito.
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return cliente;
}
