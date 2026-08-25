import { NextResponse } from 'next/server';

import { fechaDelDia } from '@/lib/daily';
import { getDb } from '@/lib/db';
import type { Modo } from '@/lib/engine/types';
import { MODOS } from '@/lib/engine/types';

const LIMITE = 50;

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

  return NextResponse.json({ ok: true, tipo, modo: tipo === 'global' ? modo : null, filas });
}
