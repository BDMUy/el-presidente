import { NextResponse } from 'next/server';

import { getClub } from '@/content/clubs';
import { fechaDelDia, presidenciaDelDia } from '@/lib/daily';
import { getDb } from '@/lib/db';
import { computeScore } from '@/lib/engine/election';
import { replayRun, terminarRun } from '@/lib/engine/engine';
import type { Modo } from '@/lib/engine/types';
import { MODOS } from '@/lib/engine/types';
import { limpiarNombre } from '@/lib/nombre';
import { hashDeOrigen } from '@/lib/origen';

const MAX_DECISIONES = 400;

const MAX_POR_HORA = 20;

interface Envio {
  dispositivo?: unknown;
  nombre?: unknown;
  seed?: unknown;
  clubId?: unknown;
  modo?: unknown;
  choices?: unknown;
  diaria?: unknown;
}

function esModo(valor: unknown): valor is Modo {
  return typeof valor === 'string' && (MODOS as readonly string[]).includes(valor);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function malaPeticion(motivo: string) {
  return NextResponse.json({ ok: false, error: motivo }, { status: 400 });
}

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: 'El ranking todavía no está disponible.' },
      { status: 503 },
    );
  }

  const tipo = request.headers.get('content-type') ?? '';
  if (!tipo.toLowerCase().includes('application/json')) {
    return malaPeticion('Se espera application/json.');
  }

  let cuerpo: Envio;
  try {
    cuerpo = (await request.json()) as Envio;
  } catch {
    return malaPeticion('Cuerpo ilegible.');
  }

  const { dispositivo, nombre, seed, clubId, choices, diaria } = cuerpo;

  const modo: Modo = cuerpo.modo === undefined ? 'normal' : (cuerpo.modo as Modo);
  if (!esModo(modo)) return malaPeticion('Duración inválida.');

  if (typeof dispositivo !== 'string' || !UUID.test(dispositivo)) {
    return malaPeticion('Dispositivo inválido.');
  }

  const nombreLimpio = limpiarNombre(nombre);
  if (nombreLimpio === null) return malaPeticion('Falta el nombre.');
  if (typeof seed !== 'number' || !Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) {
    return malaPeticion('Semilla inválida.');
  }
  if (typeof clubId !== 'string') return malaPeticion('Club inválido.');
  if (!Array.isArray(choices) || choices.length === 0 || choices.length > MAX_DECISIONES) {
    return malaPeticion('Decisiones inválidas.');
  }
  if (!choices.every((c) => Number.isInteger(c) && c >= 0 && c < 64)) {
    return malaPeticion('Decisiones fuera de rango.');
  }

  try {
    getClub(clubId);
  } catch {
    return malaPeticion('Club desconocido.');
  }

  let estado;
  try {
    estado = terminarRun(replayRun(seed, clubId, choices as number[], modo));
  } catch {
    return malaPeticion('La partida no se puede reproducir.');
  }

  if (estado.status !== 'terminado' || !estado.ending) {
    return malaPeticion('La presidencia no terminó.');
  }

  const puntaje = computeScore(estado);

  let fechaDiaria: string | null = null;
  if (diaria === true) {
    const hoy = presidenciaDelDia(fechaDelDia());
    if (seed !== hoy.seed || clubId !== hoy.clubId) {
      return malaPeticion('Esa no es la Presidencia del Día.');
    }
    if (modo !== 'normal') {
      return malaPeticion('La Presidencia del Día se juega en duración normal.');
    }
    fechaDiaria = hoy.fecha;
  }

  const origen = hashDeOrigen(request);
  try {
    const [{ recientes }] = origen
      ? await db<{ recientes: string }[]>`
          select count(*) as recientes from presidencias
          where origen_hash = ${origen} and creada_en > now() - interval '1 hour'
        `
      : await db<{ recientes: string }[]>`
          select count(*) as recientes from presidencias
          where dispositivo = ${dispositivo}::uuid and creada_en > now() - interval '1 hour'
        `;
    if (Number(recientes) >= MAX_POR_HORA) {
      return NextResponse.json(
        { ok: false, error: 'Demasiados envíos por ahora. Probá más tarde.', puntaje },
        { status: 429 },
      );
    }
  } catch {
  }

  try {
    await db`
      insert into presidencias
        (dispositivo, nombre, seed, club_id, modo, decisiones, puntaje, temporadas, titulos, final, fecha_diaria, origen_hash)
      values (
        ${dispositivo}::uuid,
        ${nombreLimpio},
        ${seed},
        ${clubId},
        ${modo},
        ${db.array(choices as number[])}::smallint[],
        ${puntaje},
        ${estado.season},
        ${estado.titles.length},
        ${estado.ending.id},
        ${fechaDiaria}::date,
        ${origen}
      )
    `;
  } catch (e) {
    const err = e as { code?: string; constraint_name?: string };
    if (err.code === '23505') {
      const yaEnviada = err.constraint_name === 'presidencias_una_por_partida';
      return NextResponse.json(
        {
          ok: false,
          error: yaEnviada
            ? 'Esta presidencia ya está en la tabla.'
            : 'Ya enviaste tu Presidencia del Día.',
          puntaje,
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: false, error: 'No se pudo guardar.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, puntaje });
}
