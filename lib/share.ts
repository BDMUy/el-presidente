/**
 * Codificación de una partida en la URL.
 *
 * Una presidencia ya está descrita por `{seed, clubId, choices}`, así que el
 * link no necesita servidor: lleva la partida entera y el destinatario la
 * reconstruye con `replayRun`. Una partida completa entra en unos setenta
 * caracteres.
 *
 * El alfabeto es base64url para que sobreviva a cualquier lugar donde se
 * pegue un link: sin `+`, sin `/`, sin `=`.
 *
 * Formato: [seed × 6][índice de club × 2][una decisión por carácter]
 */

import { CLUBS } from '@/content/clubs';

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const BASE = ALFABETO.length; // 64

const LARGO_SEED = 6; // 6 × 6 bits = 36, alcanza para 32 bits
const LARGO_CLUB = 2; // hasta 4096 clubes, para que crecer el catálogo no rompa links viejos

export interface RunCodificada {
  seed: number;
  clubId: string;
  choices: number[];
}

function aBase(valor: number, largo: number): string {
  let out = '';
  let n = valor;
  for (let i = 0; i < largo; i++) {
    out = ALFABETO[n % BASE] + out;
    n = Math.floor(n / BASE);
  }
  return out;
}

function deBase(texto: string): number | null {
  let n = 0;
  for (const ch of texto) {
    const d = ALFABETO.indexOf(ch);
    if (d < 0) return null;
    n = n * BASE + d;
  }
  return n;
}

/**
 * Codifica una partida. Falla fuerte si algo no entra: un link silenciosamente
 * truncado reconstruye otra partida, que es peor que no poder compartir.
 */
export function encodeRun({ seed, clubId, choices }: RunCodificada): string {
  const clubIndex = CLUBS.findIndex((c) => c.id === clubId);
  if (clubIndex < 0) throw new Error(`Club desconocido: ${clubId}`);
  if (clubIndex >= BASE ** LARGO_CLUB) throw new Error('Demasiados clubes para el formato del link');

  const semilla = seed >>> 0;
  if (semilla >= BASE ** LARGO_SEED) throw new Error('Semilla fuera de rango');

  let out = aBase(semilla, LARGO_SEED) + aBase(clubIndex, LARGO_CLUB);
  for (const choice of choices) {
    if (!Number.isInteger(choice) || choice < 0 || choice >= BASE) {
      throw new Error(`Decisión fuera de rango para el link: ${choice}`);
    }
    out += ALFABETO[choice];
  }
  return out;
}

/** Decodifica un link. Devuelve null ante cualquier basura, sin excepciones. */
export function decodeRun(code: string): RunCodificada | null {
  if (typeof code !== 'string') return null;
  const limpio = code.trim();
  if (limpio.length < LARGO_SEED + LARGO_CLUB) return null;

  const seed = deBase(limpio.slice(0, LARGO_SEED));
  const clubIndex = deBase(limpio.slice(LARGO_SEED, LARGO_SEED + LARGO_CLUB));
  if (seed === null || clubIndex === null) return null;

  const club = CLUBS[clubIndex];
  if (!club) return null;

  const choices: number[] = [];
  for (const ch of limpio.slice(LARGO_SEED + LARGO_CLUB)) {
    const d = ALFABETO.indexOf(ch);
    if (d < 0) return null;
    choices.push(d);
  }

  return { seed, clubId: club.id, choices };
}

/** La URL completa para compartir. */
export function shareUrl(code: string, origin: string): string {
  return `${origin.replace(/\/$/, '')}/p/${code}`;
}
