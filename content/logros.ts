/**
 * Logros: lo que se acumula entre presidencias.
 *
 * Cada uno es una condición pura sobre una partida terminada, así que se
 * evalúan igual en el cliente y en el servidor y no hace falta rastrear nada
 * mientras jugás.
 *
 * Regla de escritura: un logro tiene que nombrar algo que hiciste, no un
 * número que alcanzaste. "Cien mil socios" es un número; "La casa llena" es
 * una escena. La segunda se cuenta; la primera se olvida.
 */

import type { GameState } from '@/lib/engine/types';
import { TITLES } from '@/lib/engine/types';

export interface LogroDef {
  id: string;
  label: string;
  /** Qué hay que hacer. Se muestra siempre, esté conseguido o no. */
  pista: string;
  /** Si es true, no se revela hasta conseguirlo. */
  oculto?: boolean;
  cumple: (state: GameState) => boolean;
}

const puntosDeTitulos = (state: GameState) =>
  state.titles.reduce((sum, t) => sum + TITLES[t.id].points, 0);

export const LOGROS: readonly LogroDef[] = [
  {
    id: 'primera-vuelta',
    label: 'La primera vuelta',
    pista: 'Ganá tu primer título con cualquier club.',
    cumple: (s) => s.titles.length > 0,
  },
  {
    id: 'cuatro-mandatos',
    label: 'Cuatro mandatos',
    pista: 'Completá las dieciséis temporadas sin que te echen.',
    cumple: (s) => s.season >= 16 && s.ending?.id !== 'derrota-electoral',
  },
  {
    id: 'la-estatua',
    label: 'La estatua',
    pista: 'Terminá una presidencia con tu nombre en la tribuna.',
    cumple: (s) => s.ending?.id === 'estatua',
  },
  {
    id: 'de-la-b-a-primera',
    label: 'De la B a Primera',
    pista: 'Agarrá un club en la B y dejalo en Primera.',
    cumple: (s) => s.history[0]?.category === 'b' && s.category === 'primera',
  },
  {
    id: 'noche-continental',
    label: 'Noche continental',
    pista: 'Ganá la Libertadores o la Sudamericana.',
    cumple: (s) => s.titles.some((t) => t.id === 'libertadores' || t.id === 'sudamericana'),
  },
  {
    id: 'casa-llena',
    label: 'La casa llena',
    pista: 'Llegá a cien mil socios.',
    cumple: (s) => s.resources.socios >= 100,
  },
  {
    id: 'canción-de-tribuna',
    label: 'Canción de tribuna',
    pista: 'Terminá con la hinchada al máximo.',
    cumple: (s) => s.resources.hinchada >= 100,
  },
  {
    id: 'el-telefono',
    label: 'El teléfono que atienden',
    pista: 'Terminá con la influencia al máximo.',
    cumple: (s) => s.resources.influencia >= 100,
  },
  {
    id: 'las-cuentas-claras',
    label: 'Las cuentas claras',
    pista: 'Completá cuatro mandatos sin deber un peso.',
    cumple: (s) => s.season >= 16 && s.resources.caja >= 0,
  },
  {
    id: 'coleccionista',
    label: 'Coleccionista',
    pista: 'Ganá cinco títulos en una misma presidencia.',
    cumple: (s) => s.titles.length >= 5,
  },
  {
    id: 'nunca-bajamos',
    label: 'Nunca bajamos',
    pista: 'Completá cuatro mandatos sin un solo descenso.',
    cumple: (s) => s.season >= 16 && s.descensos === 0,
  },
  {
    id: 'epoca-dorada',
    label: 'Una época',
    pista: 'Juntá doscientos puntos de títulos en una presidencia.',
    cumple: (s) => puntosDeTitulos(s) >= 200,
  },
  {
    id: 'club-en-llamas',
    label: 'Club en llamas',
    pista: 'Terminá una presidencia de las que arrancan al borde del abismo.',
    oculto: true,
    cumple: (s) => s.rare,
  },
  {
    id: 'el-fundido',
    label: 'El fundido',
    pista: 'Llevá un club a la quiebra. No es un logro que se cuente en voz alta.',
    oculto: true,
    cumple: (s) => s.ending?.id === 'quiebra',
  },
];

export const LOGROS_POR_ID: Record<string, LogroDef> = Object.fromEntries(
  LOGROS.map((l) => [l.id, l]),
);

/** Qué logros desbloquea esta partida terminada. */
export function logrosDeLaPartida(state: GameState): string[] {
  return LOGROS.filter((l) => l.cumple(state)).map((l) => l.id);
}
