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
import type { Modo } from '@/lib/engine/types';
import { MODOS } from '@/lib/engine/types';
import { limpiarNombre } from '@/lib/nombre';
import { hashDeOrigen } from '@/lib/origen';

/** Tope de decisiones: una presidencia larga ronda las 150. */
const MAX_DECISIONES = 400;

/**
 * Envíos por hora desde un mismo origen.
 *
 * Una presidencia lleva de seis a diez minutos, así que un jugador real no
 * llega ni a seis por hora. El número está alto a propósito porque detrás de
 * un mismo IP puede haber una casa entera, una escuela o un CGNAT de una
 * operadora: es un techo contra la inundación, no una cuota por persona.
 */
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

  // Sin esto, un `content-type: text/plain` convierte el POST en una petición
  // simple: sin preflight de CORS, cualquier página de internet puede hacer
  // que el navegador de un visitante mande envíos a este endpoint. Medido: con
  // text/plain el envío entraba con 200.
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

  // ── Forma ────────────────────────────────────────────────
  const { dispositivo, nombre, seed, clubId, choices, diaria } = cuerpo;

  // Sin modo se asume normal: es lo que eran todas las partidas antes de que
  // los modos existieran, igual que en los links compartidos.
  const modo: Modo = cuerpo.modo === undefined ? 'normal' : (cuerpo.modo as Modo);
  if (!esModo(modo)) return malaPeticion('Duración inválida.');

  if (typeof dispositivo !== 'string' || !UUID.test(dispositivo)) {
    return malaPeticion('Dispositivo inválido.');
  }

  // Se limpia antes de mirar si quedó algo: un nombre de tres caracteres de
  // ancho cero pasaba el `trim()` y entraba a la tabla como una fila en blanco.
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

  // ── La verificación ──────────────────────────────────────
  // Se reproduce la partida con el mismo motor que corrió en el navegador.
  // Si no termina, o si alguna decisión no era válida en su momento, el
  // replay falla y el envío se rechaza.
  let estado;
  try {
    estado = replayRun(seed, clubId, choices as number[], modo);
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
    // La del día es siempre normal, y hay que exigirlo acá. Sin esto, alguien
    // juega la semilla del día en modo corto y entra en la tabla diaria
    // —la única que no se separa por modo— con otra vara.
    if (modo !== 'normal') {
      return malaPeticion('La Presidencia del Día se juega en duración normal.');
    }
    fechaDiaria = hoy.fecha;
  }

  // ── La ventana ───────────────────────────────────────────
  // Se consulta después de verificar la partida y no antes: así el que intenta
  // inundar paga el replay de cada intento, y no le sale gratis tantear.
  //
  // El origen es lo único que sobrevive a que el atacante rote el uuid de
  // dispositivo. Cuando no hay origen —la aplicación no está detrás de un
  // proxy que informe el IP— se cae al dispositivo, que es débil pero no es
  // nada: sin este `else`, medido, pasaban doce de doce sin ningún tope.
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
    // Si la cuenta falla, se deja pasar: quedarse sin ranking por un problema
    // de lectura es peor que un envío de más.
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
    // Los índices únicos que chocan no son fallos: son las reglas funcionando.
    // Son dos, y dicen cosas distintas, así que el mensaje también.
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
