/**
 * Catálogo de eventos.
 *
 * Sumar contenido nuevo es agregar un archivo acá y listarlo abajo: el motor
 * no se toca. Esa es la razón de que los eventos sean datos y no código.
 *
 * Los archivos están agrupados por frente, no por dificultad. Varios son
 * condicionales —copas solo si clasificaste, ascenso solo en la B o la
 * Nacional, crisis solo con algún recurso en el piso, legado a partir de la
 * temporada nueve— para que la partida suene distinta según dónde estés
 * parado, en vez de tirar cartas al azar sobre cualquier situación.
 */

import type { GameEvent } from '@/lib/engine/types';
import { ASCENSO } from './ascenso';
import { COLOR } from './color';
import { COPAS } from './copas';
import { CORRUPCION } from './corrupcion';
import { CRISIS } from './crisis';
import { DIRIGENCIA } from './dirigencia';
import { ECONOMIA } from './economia';
import { FEMENINO } from './femenino';
import { HINCHADA } from './hinchada';
import { INFERIORES } from './inferiores';
import { LEGADO } from './legado';
import { VESTUARIO } from './vestuario';

export const ALL_EVENTS: GameEvent[] = [
  ...VESTUARIO,
  ...HINCHADA,
  ...DIRIGENCIA,
  ...COLOR,
  ...ECONOMIA,
  ...INFERIORES,
  ...FEMENINO,
  ...CORRUPCION,
  ...ASCENSO,
  ...COPAS,
  ...CRISIS,
  ...LEGADO,
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

export {
  ASCENSO,
  COLOR,
  COPAS,
  CORRUPCION,
  CRISIS,
  DIRIGENCIA,
  ECONOMIA,
  FEMENINO,
  HINCHADA,
  INFERIORES,
  LEGADO,
  VESTUARIO,
};
