import 'server-only';

import postgres, { type Sql } from 'postgres';

let cliente: Sql | null | undefined;

export function getDb(): Sql | null {
  if (cliente !== undefined) return cliente;

  const url = process.env.DATABASE_URL;
  if (!url) {
    cliente = null;
    return null;
  }

  avisarSiNoEsPooled(url);

  cliente = postgres(url, {
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return cliente;
}

function avisarSiNoEsPooled(url: string): void {
  if (process.env.NODE_ENV !== 'production') return;
  if (!url.includes('.neon.tech') || url.includes('-pooler.')) return;

  console.warn(
    '[db] La cadena de conexión de Neon es la directa, no la pooled. ' +
      'En serverless conviene la que lleva "-pooler" en el host: la directa ' +
      'se queda sin conexiones cuando sube el tráfico.',
  );
}
