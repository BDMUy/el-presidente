import 'server-only';

/**
 * Acceso a la base, solo desde el servidor.
 *
 * Usa la clave de servicio, así que este módulo nunca puede llegar al
 * navegador: `server-only` lo hace fallar en tiempo de compilación si alguien
 * lo importa desde un componente de cliente.
 *
 * Si las variables de entorno no están configuradas, `getDb()` devuelve null y
 * las rutas responden que el ranking no está disponible. El juego entero
 * funciona sin base: los rankings son un agregado, no un requisito.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cliente: SupabaseClient | null | undefined;

export function getDb(): SupabaseClient | null {
  if (cliente !== undefined) return cliente;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    cliente = null;
    return null;
  }

  cliente = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}

/** Para que las rutas puedan responder distinto sin intentar la consulta. */
export function rankingConfigurado(): boolean {
  return getDb() !== null;
}
