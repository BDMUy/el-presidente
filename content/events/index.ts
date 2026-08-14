/**
 * Catálogo de eventos.
 *
 * Sumar contenido nuevo es agregar un archivo acá y listarlo abajo: el motor
 * no se toca. Esa es la razón de que los eventos sean datos y no código.
 */

import type { GameEvent } from '@/lib/engine/types';
import { COLOR } from './color';
import { DIRIGENCIA } from './dirigencia';
import { HINCHADA } from './hinchada';
import { VESTUARIO } from './vestuario';

export const ALL_EVENTS: GameEvent[] = [
  ...VESTUARIO,
  ...HINCHADA,
  ...DIRIGENCIA,
  ...COLOR,
];

/** Chequeo de integridad: los IDs duplicados rompen el sistema de `once`. */
export function findDuplicateIds(): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const event of ALL_EVENTS) {
    if (seen.has(event.id)) dupes.push(event.id);
    seen.add(event.id);
  }
  return dupes;
}

export { COLOR, DIRIGENCIA, HINCHADA, VESTUARIO };
