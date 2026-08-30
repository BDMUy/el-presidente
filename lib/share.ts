import { CLUBS } from '@/content/clubs';
import { replayRun, terminarRun } from '@/lib/engine/engine';
import type { GameState, Modo } from '@/lib/engine/types';

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const BASE = ALFABETO.length;

const LARGO_SEED = 6;
const LARGO_CLUB = 2;

const BLOQUE_MODO = 1024;

const MODOS_EN_LINK: readonly Modo[] = ['normal', 'corta', 'larga', 'llamas'];

export interface RunCodificada {
  seed: number;
  clubId: string;
  modo: Modo;
  choices: number[];
}

export type RunParaCodificar = Omit<RunCodificada, 'modo'> & { modo?: Modo };

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

export function encodeRun({ seed, clubId, modo = 'normal', choices }: RunParaCodificar): string {
  const clubIndex = CLUBS.findIndex((c) => c.id === clubId);
  if (clubIndex < 0) throw new Error(`Club desconocido: ${clubId}`);
  if (clubIndex >= BLOQUE_MODO) throw new Error('Demasiados clubes para el formato del link');

  const modoIndex = MODOS_EN_LINK.indexOf(modo);
  if (modoIndex < 0) throw new Error(`Modo desconocido: ${modo}`);

  const empaquetado = modoIndex * BLOQUE_MODO + clubIndex;
  if (empaquetado >= BASE ** LARGO_CLUB) throw new Error('Club y modo no entran en el link');

  const semilla = seed >>> 0;
  if (semilla >= BASE ** LARGO_SEED) throw new Error('Semilla fuera de rango');

  let out = aBase(semilla, LARGO_SEED) + aBase(empaquetado, LARGO_CLUB);
  for (const choice of choices) {
    if (!Number.isInteger(choice) || choice < 0 || choice >= BASE) {
      throw new Error(`Decisión fuera de rango para el link: ${choice}`);
    }
    out += ALFABETO[choice];
  }
  return out;
}

const MAX_DECISIONES = 400;

const MAX_SEED = 0xffffffff;

export function decodeRun(code: string): RunCodificada | null {
  if (typeof code !== 'string') return null;
  const limpio = code.trim();
  if (limpio.length < LARGO_SEED + LARGO_CLUB) return null;
  if (limpio.length > LARGO_SEED + LARGO_CLUB + MAX_DECISIONES) return null;

  const seed = deBase(limpio.slice(0, LARGO_SEED));
  const empaquetado = deBase(limpio.slice(LARGO_SEED, LARGO_SEED + LARGO_CLUB));
  if (seed === null || empaquetado === null) return null;

  if (seed > MAX_SEED) return null;

  const modo = MODOS_EN_LINK[Math.floor(empaquetado / BLOQUE_MODO)];
  const club = CLUBS[empaquetado % BLOQUE_MODO];
  if (!modo || !club) return null;

  const choices: number[] = [];
  for (const ch of limpio.slice(LARGO_SEED + LARGO_CLUB)) {
    const d = ALFABETO.indexOf(ch);
    if (d < 0) return null;
    choices.push(d);
  }

  return { seed, clubId: club.id, modo, choices };
}

export function shareUrl(code: string, origin: string): string {
  return `${origin.replace(/\/$/, '')}/p/${code}`;
}

export function reconstruirPresidencia(code: string): GameState | null {
  try {
    const datos = decodeRun(decodeURIComponent(code));
    if (!datos) return null;
    const state = terminarRun(replayRun(datos.seed, datos.clubId, datos.choices, datos.modo));
    return state.status === 'terminado' && state.ending ? state : null;
  } catch {
    return null;
  }
}
