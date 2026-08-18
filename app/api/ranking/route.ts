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
import type { Modo } from '@/lib/engine/types';
import { MODOS } from '@/lib/engine/types';

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

  const params = new URL(request.url).searchParams;
  const tipo = params.get('tipo') === 'global' ? 'global' : 'diario';

  // El global se lee por duración: el puntaje incluye las temporadas jugadas,
  // así que una larga siempre le gana a una corta y mezclarlas sería comparar
  // tres juegos distintos. El diario no lo necesita —la del día es siempre
  // normal— y por eso sigue siendo una sola tabla para todos.
  const pedido = params.get('modo');
  const modo: Modo = (MODOS as readonly string[]).includes(pedido ?? '')
    ? (pedido as Modo)
    : 'normal';

  let filas;
  try {
    filas =
      tipo === 'global'
        ? await db`
            select nombre, club_id, puntaje, temporadas, titulos, final
            from presidencias
            where fecha_diaria is null and modo = ${modo}
            order by puntaje desc
            limit ${LIMITE}
          `
        : await db`
            select nombre, club_id, puntaje, temporadas, titulos, final
            from presidencias
            where fecha_diaria = ${fechaDelDia()}::date
            order by puntaje desc
            limit ${LIMITE}
          `;
  } catch {
    return NextResponse.json({ ok: false, error: 'No se pudo leer.', filas: [] }, { status: 500 });
  }

  return NextResponse.json(
    { ok: true, tipo, modo: tipo === 'global' ? modo : null, filas },
    {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_SEGUNDOS}, stale-while-revalidate=120`,
      },
    },
  );
}
