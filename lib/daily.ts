import { CLUBS } from '@/content/clubs';
import { Rand, seedFromString } from '@/lib/engine/rng';

const UTC_OFFSET_AR = -3;

export function fechaDelDia(ahora: Date = new Date()): string {
  const ar = new Date(ahora.getTime() + UTC_OFFSET_AR * 3600_000);
  return ar.toISOString().slice(0, 10);
}

export interface PresidenciaDelDia {
  fecha: string;
  seed: number;
  clubId: string;
}

export function presidenciaDelDia(fecha: string = fechaDelDia()): PresidenciaDelDia {
  const seed = seedFromString(`el-presidente:${fecha}`);
  const rand = new Rand(seed);
  return { fecha, seed, clubId: rand.pick(CLUBS).id };
}

export function faltaParaLaProxima(ahora: Date = new Date()): number {
  const ar = new Date(ahora.getTime() + UTC_OFFSET_AR * 3600_000);
  const finDelDia = Date.UTC(
    ar.getUTCFullYear(),
    ar.getUTCMonth(),
    ar.getUTCDate() + 1,
    0,
    0,
    0,
    0,
  );
  return finDelDia - ar.getTime();
}

export function formatearEspera(ms: number): string {
  const totalMin = Math.max(0, Math.floor(ms / 60_000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return [h, m].map((n) => String(n).padStart(2, '0')).join(':');
}
