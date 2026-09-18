import { seedFromString } from '@/lib/engine/rng';

export const LUGARES: readonly string[] = [
  'Despacho presidencial',
  'Sede social',
  'Sala de prensa',
  'Palco de dirigentes',
  'Oficina de la tesorería',
  'Salón de la comisión directiva',
  'Pasillo del estadio',
  'Bar de la esquina de la sede',
];

export const HORAS: readonly string[] = [
  '8:15',
  '9:40',
  '11:05',
  '13:20',
  '16:45',
  '19:30',
  '21:40',
  '23:55',
];

export function expedienteDe(eventId: string): { lugar: string; hora: string } {
  const semilla = seedFromString(eventId);
  return {
    lugar: LUGARES[semilla % LUGARES.length],
    hora: HORAS[Math.floor(semilla / LUGARES.length) % HORAS.length],
  };
}
