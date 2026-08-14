/**
 * Envío de un puntaje al ranking.
 *
 * Acá está la razón de ser del motor determinista: el cliente manda
 * `{seed, clubId, decisiones}` y el servidor reproduce la partida entera para
 * calcular el puntaje. **El puntaje que manda el cliente no se usa nunca.**
 * Sin esto el ranking sería una lista de números inventados.
 *
 * Para la Presidencia del Día se verifica además que la semilla y el club sean
 * exactamente los que corresponden a hoy, derivados de la fecha: no alcanza
 * con jugar bien, hay que haber jugado la partida del día.
 */

import { NextResponse } from 'next/server';

import { getClub } from '@/content/clubs';
import { fechaDelDia, presidenciaDelDia } from '@/lib/daily';
import { getDb } from '@/lib/db';
import { computeScore } from '@/lib/engine/election';
import { replayRun } from '@/lib/engine/engine';

/** Tope de decisiones: una presidencia larga ronda las 150. */
const MAX_DECISIONES = 400;
const MAX_NOMBRE = 24;

interface Envio {
  dispositivo?: unknown;
  nombre?: unknown;
  seed?: unknown;
  clubId?: unknown;
  choices?: unknown;
  diaria?: unknown;
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

  let cuerpo: Envio;
  try {
    cuerpo = (await request.json()) as Envio;
  } catch {
    return malaPeticion('Cuerpo ilegible.');
  }

  // ── Forma ────────────────────────────────────────────────
  const { dispositivo, nombre, seed, clubId, choices, diaria } = cuerpo;

  if (typeof dispositivo !== 'string' || !UUID.test(dispositivo)) {
    return malaPeticion('Dispositivo inválido.');
  }
  if (typeof nombre !== 'string' || nombre.trim().length === 0) {
    return malaPeticion('Falta el nombre.');
  }
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

  // ── La verificación ──────────────────────────────────────
  // Se reproduce la partida con el mismo motor que corrió en el navegador.
  // Si no termina, o si alguna decisión no era válida en su momento, el
  // replay falla y el envío se rechaza.
  let estado;
  try {
    estado = replayRun(seed, clubId, choices as number[]);
  } catch {
    return malaPeticion('La partida no se puede reproducir.');
  }

  if (estado.status !== 'terminado' || !estado.ending) {
    return malaPeticion('La presidencia no terminó.');
  }

  const puntaje = computeScore(estado);

  // ── ¿Es la del día? ──────────────────────────────────────
  let fechaDiaria: string | null = null;
  if (diaria === true) {
    const hoy = presidenciaDelDia(fechaDelDia());
    if (seed !== hoy.seed || clubId !== hoy.clubId) {
      return malaPeticion('Esa no es la Presidencia del Día.');
    }
    fechaDiaria = hoy.fecha;
  }

  try {
    await db`
      insert into presidencias
        (dispositivo, nombre, seed, club_id, decisiones, puntaje, temporadas, titulos, final, fecha_diaria)
      values (
        ${dispositivo}::uuid,
        ${nombre.trim().slice(0, MAX_NOMBRE)},
        ${seed},
        ${clubId},
        ${db.array(choices as number[])}::smallint[],
        ${puntaje},
        ${estado.season},
        ${estado.titles.length},
        ${estado.ending.id},
        ${fechaDiaria}::date
      )
    `;
  } catch (e) {
    // El índice único es el que impone "una por día". Que choque no es un
    // fallo: es la regla funcionando.
    if ((e as { code?: string }).code === '23505') {
      return NextResponse.json(
        { ok: false, error: 'Ya enviaste tu Presidencia del Día.', puntaje },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: false, error: 'No se pudo guardar.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, puntaje });
}
