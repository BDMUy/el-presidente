/**
 * Persistencia local de la partida.
 *
 * No se guarda el estado: se guarda `{seed, clubId, choices}` y se reconstruye
 * con `replayRun`. Son doscientos bytes en vez de varios kilobytes, sobrevive
 * a cualquier cambio interno del estado, y de paso ejercita el determinismo
 * del motor en cada carga: si el replay dejara de funcionar, se notaría acá
 * antes que en el ranking.
 *
 * El precio es que un cambio de contenido invalida las partidas guardadas
 * —los mismos índices eligen otras cosas—, y por eso existe CONTENT_VERSION.
 */

/**
 * Subir esto cada vez que cambie el contenido, el balance o el significado de
 * los índices de decisión. Una partida vieja replayeada contra contenido nuevo
 * no falla: da otro juego, que es peor que fallar.
 */
import type { Modo } from '@/lib/engine/types';
import { MODOS } from '@/lib/engine/types';

export const CONTENT_VERSION = 5;

const KEY = 'el-presidente:partida';

export interface PartidaGuardada {
  version: number;
  seed: number;
  clubId: string;
  /** Duración elegida. Sin esto, una corta guardada se retomaba como normal. */
  modo: Modo;
  choices: number[];
  /** Fecha de la Presidencia del Día si esta partida es la del día. */
  diaria?: string | null;
}

export function guardar(partida: Omit<PartidaGuardada, 'version'>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ ...partida, version: CONTENT_VERSION } satisfies PartidaGuardada),
    );
  } catch {
    // Modo incógnito o almacenamiento lleno: la partida sigue en memoria.
  }
}

export function leer(): PartidaGuardada | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PartidaGuardada>;
    if (
      parsed.version !== CONTENT_VERSION ||
      typeof parsed.seed !== 'number' ||
      typeof parsed.clubId !== 'string' ||
      !Array.isArray(parsed.choices)
    ) {
      return null;
    }

    return {
      ...(parsed as PartidaGuardada),
      // Una duración que no reconocemos se lee como normal en vez de tirar la
      // partida: peor sería perderla por un valor raro en el almacenamiento.
      modo: MODOS.includes(parsed.modo as Modo) ? (parsed.modo as Modo) : 'normal',
      diaria: parsed.diaria ?? null,
    };
  } catch {
    return null;
  }
}

const KEY_ACTA = 'el-presidente:vio-acta';

/**
 * Si el jugador ya vio el acta de asunción.
 *
 * Va en su propia clave y sin versión: es una marca sobre la persona, no sobre
 * la partida. Empezar una presidencia nueva no debería volver a explicarte qué
 * es la caja.
 */
export function vioActa(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(KEY_ACTA) === '1';
  } catch {
    // Sin almacenamiento, mejor no bloquear el arranque con el acta.
    return true;
  }
}

export function marcarActaVista(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY_ACTA, '1');
  } catch {
    // Se va a volver a mostrar la próxima vez. Es molesto, no roto.
  }
}

export function borrar(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nada que hacer: la próxima carga simplemente arranca de cero.
  }
}
