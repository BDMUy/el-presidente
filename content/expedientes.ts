import { TEMA_POR_EVENTO } from '@/content/events';
import { seedFromString } from '@/lib/engine/rng';
import type { EventKind } from '@/lib/engine/types';

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

export interface Ilustracion {
  src: string;
  ancho: number;
  alto: number;
  rotulo: string;
}

const PERSONAJES: Record<string, Ilustracion> = {
  hinchada: {
    src: '/ilustraciones/personaje-barra.webp',
    ancho: 1024,
    alto: 683,
    rotulo: 'El jefe de la barra',
  },
  dirigencia: {
    src: '/ilustraciones/personaje-dirigente.webp',
    ancho: 1024,
    alto: 683,
    rotulo: 'El dirigente de la vieja guardia',
  },
  corrupcion: {
    src: '/ilustraciones/personaje-arbitro.webp',
    ancho: 1024,
    alto: 683,
    rotulo: 'Vestuario de árbitros',
  },
  crisis: {
    src: '/ilustraciones/personaje-prensa.webp',
    ancho: 1024,
    alto: 683,
    rotulo: 'Sala de prensa',
  },
};

const ESCENAS: Record<EventKind, Ilustracion> = {
  golpe: {
    src: '/ilustraciones/escena-golpe.webp',
    ancho: 1024,
    alto: 683,
    rotulo: 'El teléfono a esa hora',
  },
  dilema: {
    src: '/ilustraciones/escena-golpe.webp',
    ancho: 1024,
    alto: 683,
    rotulo: 'El escritorio, esa semana',
  },
  color: {
    src: '/ilustraciones/personaje-hincha.webp',
    ancho: 1024,
    alto: 683,
    rotulo: 'La gente del club',
  },
};

export function ilustracionDeEvento(eventId: string, kind: EventKind): Ilustracion {
  return PERSONAJES[TEMA_POR_EVENTO[eventId] ?? ''] ?? ESCENAS[kind];
}
