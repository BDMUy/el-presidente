/**
 * Catálogo de eventos.
 *
 * Sumar contenido nuevo es agregar un archivo acá y listarlo abajo: el motor
 * no se toca. Esa es la razón de que los eventos sean datos y no código.
 *
 * Los archivos están agrupados por frente, no por dificultad. Varios son
 * condicionales —copas solo si clasificaste, ascenso solo en la B o la
 * Nacional, crisis solo con algún recurso en el piso, legado a partir de la
 * temporada nueve, la escalada de corrupción según el prontuario— para que la
 * partida suene distinta según dónde estés parado, en vez de tirar cartas al
 * azar sobre cualquier situación.
 *
 * Esa división importa al sumar contenido. Solo las cartas SIN condición de
 * contexto entran en el mazo de una presidencia sana, que es donde una partida
 * exitosa pasa casi todo el tiempo; las condicionales le dan textura a la B, a
 * la crisis o a la copa, pero no alcanzan para que una larga no se repita.
 * Cuando el modo largo repetía el 41% de sus cartas, lo que faltaba eran
 * generales y no condicionales.
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
