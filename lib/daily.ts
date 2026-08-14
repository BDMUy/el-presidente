/**
 * La Presidencia del Día.
 *
 * Todos los jugadores reciben exactamente la misma partida: mismo club, misma
 * semilla, mismos eventos, misma suerte. El desafío es idéntico para todos y
 * gana el que mejor lo juega.
 *
 * La fecha se calcula en hora argentina y no en UTC: el día del juego tiene
 * que cambiar a la medianoche del jugador, no a las nueve de la noche.
 *
 * Es un módulo puro. El servidor deriva la misma partida que el cliente sin
 * consultarse nada, así que no hace falta guardar la semilla del día en
 * ningún lado.
 */

import { CLUBS } from '@/content/clubs';
import { Rand, seedFromString } from '@/lib/engine/rng';

/** Horas de diferencia de Argentina con UTC. */
const UTC_OFFSET_AR = -3;

/** Fecha del juego en formato AAAA-MM-DD, según el reloj argentino. */
export function fechaDelDia(ahora: Date = new Date()): string {
  const ar = new Date(ahora.getTime() + UTC_OFFSET_AR * 3600_000);
  return ar.toISOString().slice(0, 10);
}

export interface PresidenciaDelDia {
  fecha: string;
  seed: number;
  clubId: string;
}

/**
 * Deriva la partida del día a partir de la fecha.
 *
 * El club sale del mismo sorteo que la semilla, así que no hay nada que
 * coordinar: dos dispositivos con la misma fecha llegan al mismo resultado.
 */
export function presidenciaDelDia(fecha: string = fechaDelDia()): PresidenciaDelDia {
  const seed = seedFromString(`el-presidente:${fecha}`);
  const rand = new Rand(seed);
  return { fecha, seed, clubId: rand.pick(CLUBS).id };
}

/** Cuánto falta para la próxima, en milisegundos. */
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

/** "10:17:56", para el contador de la pantalla. */
export function formatearEspera(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}
