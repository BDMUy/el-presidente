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

  avisarSiNoEsPooled(url);

  cliente = postgres(url, {
    // En serverless cada instancia abre su propio pool: mantenerlo chico evita
    // agotar las conexiones del plan gratuito.
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return cliente;
}

/**
 * Avisa si en producción se está usando la conexión directa de Neon.
 *
 * En serverless cada invocación levanta su propia instancia y abre sus propias
 * conexiones. La conexión directa tiene un tope atado al tamaño del compute y
 * se agota; la pooled pasa por un PgBouncer que las recicla y aguanta miles.
 * Las dos cadenas se distinguen en una sola cosa: la pooled lleva `-pooler`
 * pegado al id del endpoint.
 *
 * Es un aviso y no un error porque la directa funciona perfecto con poco
 * tráfico, y romper el arranque por una decisión de capacidad sería peor que
 * el problema. Pero es exactamente el fallo que aparece recién cuando el juego
 * empieza a andar bien, que es el peor momento para descubrirlo.
 */
function avisarSiNoEsPooled(url: string): void {
  if (process.env.NODE_ENV !== 'production') return;
  if (!url.includes('.neon.tech') || url.includes('-pooler.')) return;

  console.warn(
    '[db] La cadena de conexión de Neon es la directa, no la pooled. ' +
      'En serverless conviene la que lleva "-pooler" en el host: la directa ' +
      'se queda sin conexiones cuando sube el tráfico.',
  );
}
