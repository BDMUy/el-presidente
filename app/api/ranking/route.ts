/**
 * Lectura de los rankings.
 *
 * Dos consultas y nada más: el top del día y el histórico. Se sirve desde el
 * servidor y no por consulta directa del navegador, para no exponer la tabla
 * y para poder cachear: con miles de jugadores abriendo la misma tabla, un
 * segundo de caché es la diferencia entre un plan gratuito y una factura.
 *
 * El log de decisiones no se devuelve: publicarlo al lado del ranking invita
 * a copiar la partida del primero en vez de jugarla.
 */

import { NextResponse } from 'next/server';

import { fechaDelDia } from '@/lib/daily';
import { getDb } from '@/lib/db';

const LIMITE = 50;
const CACHE_SEGUNDOS = 30;

export async function GET(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: 'El ranking todavía no está disponible.', filas: [] },
      { status: 503 },
    );
  }

  const tipo = new URL(request.url).searchParams.get('tipo') === 'global' ? 'global' : 'diario';

  const consulta = db
    .from('presidencias')
    .select('nombre, club_id, puntaje, temporadas, titulos, final')
    .order('puntaje', { ascending: false })
    .limit(LIMITE);

  const { data, error } =
    tipo === 'global'
      ? await consulta.is('fecha_diaria', null)
      : await consulta.eq('fecha_diaria', fechaDelDia());

  if (error) {
    return NextResponse.json({ ok: false, error: 'No se pudo leer.', filas: [] }, { status: 500 });
  }

  return NextResponse.json(
    { ok: true, tipo, filas: data ?? [] },
    {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_SEGUNDOS}, stale-while-revalidate=120`,
      },
    },
  );
}
