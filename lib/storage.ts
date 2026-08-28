import type { Modo } from '@/lib/engine/types';
import { MODOS } from '@/lib/engine/types';

export const CONTENT_VERSION = 5;

const KEY = 'el-presidente:partida';

export interface PartidaGuardada {
  version: number;
  seed: number;
  clubId: string;
  modo: Modo;
  choices: number[];
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
      modo: MODOS.includes(parsed.modo as Modo) ? (parsed.modo as Modo) : 'normal',
      diaria: parsed.diaria ?? null,
    };
  } catch {
    return null;
  }
}

export function borrar(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
  }
}
