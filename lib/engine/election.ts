/**
 * Elecciones, finales de partida y puntaje.
 *
 * Acá no hay "muerte": hay elección. Cada cuatro temporadas la gente vota, y
 * si no te quieren, se termina. Eso reemplaza al game over del roguelike por
 * algo que pertenece al mundo del juego.
 */

import { Rand } from './rng';
import type { Club, ElectionResult, Ending, EndingId, GameState } from './types';
import { HINCHADA_ASAMBLEA, TITLES, TOTAL_SEASONS } from './types';

const OPOSITORES = [
  'la Lista Celeste',
  'la agrupación "Volver a las Fuentes"',
  'el bloque opositor del Salón Cultural',
  'la lista que arma el ex tesorero',
  'la agrupación de socios vitalicios',
];

/**
 * Deuda a partir de la cual el club entra en quiebra y te vas.
 *
 * Calibrado contra los ingresos de un club grande (~12M por temporada): es un
 * pozo del que no se sale, pero al que hay que meterse a propósito.
 */
export const DEUDA_QUIEBRA = -40;

/**
 * Resuelve una elección. El voto es sobre todo la hinchada, pero la rosca
 * permite sobrevivir un mandato mediocre: el capital político existe.
 */
export function resolveElection(state: GameState, rand: Rand): ElectionResult {
  const { resources, titles, season } = state;
  const mandateStart = season - 4;
  const titlesThisMandate = titles.filter((t) => t.season > mandateStart).length;

  let votes =
    resources.hinchada * 0.75 +
    resources.rosca * 0.25 +
    titlesThisMandate * 4 +
    rand.normal() * 5;

  if (resources.caja < 0) {
    votes -= Math.min(15, -resources.caja * 0.4);
  }

  votes = Math.min(95, Math.max(5, Math.round(votes)));
  const rival = rand.pick(OPOSITORES);
  const won = votes >= 50;

  return {
    won,
    votes,
    rival,
    summary: won
      ? `Ganaste con el ${votes}% de los votos. ${capitalize(rival)} pidió recuento y perdió también eso.`
      : `Perdiste. Sacaste el ${votes}% y ${rival} se queda con el club.`,
  };
}

/** ¿Corresponde votar al terminar esta temporada? */
export function isElectionSeason(season: number): boolean {
  return season % 4 === 0 && season < TOTAL_SEASONS;
}

/**
 * Chequea si la presidencia se cae antes de tiempo, sin esperar a la elección.
 * Devuelve el final correspondiente, o null si seguís en el cargo.
 */
export function checkEarlyExit(state: GameState): EndingId | null {
  if (state.resources.caja <= DEUDA_QUIEBRA) return 'quiebra';
  if (state.resources.hinchada <= HINCHADA_ASAMBLEA) return 'asamblea';
  // Tres, no dos: el descenso ya se paga carísimo en hinchada, y sumar un
  // corte a las dos caídas convertía media partida competente en game over.
  if (state.descensos >= 3) return 'descenso-fatal';
  return null;
}

/**
 * Final de una presidencia que llegó hasta el final de las 16 temporadas.
 * El corte entre estatua y presidencia gris es deliberadamente exigente:
 * la estatua tiene que costar.
 */
export function finalEnding(state: GameState): EndingId {
  const { resources, titles, descensos } = state;
  const puntosTitulos = titles.reduce((sum, t) => sum + TITLES[t.id].points, 0);

  if (resources.hinchada >= 75 && puntosTitulos >= 200 && descensos === 0) return 'estatua';
  return 'reelecto-gris';
}

export function buildEnding(id: EndingId, state: GameState, club: Club): Ending {
  const años = state.season;
  const titulos = state.titles.length;

  const endings: Record<EndingId, Ending> = {
    estatua: {
      id: 'estatua',
      title: 'TU NOMBRE EN LA TRIBUNA',
      text: `Dieciséis años, ${titulos} ${plural(titulos, 'título', 'títulos')} y un club que no se parece en nada al que recibiste. La asamblea votó por unanimidad ponerle tu nombre a la tribuna sur. Fuiste a la inauguración y no pudiste hablar.`,
    },
    'reelecto-gris': {
      id: 'reelecto-gris',
      title: 'CUMPLISTE',
      text: `Terminaste los cuatro mandatos. ${titulos > 0 ? `${titulos} ${plural(titulos, 'título', 'títulos')} en la vitrina` : 'Sin títulos, pero sin catástrofes'}, las cuentas más o menos en orden y ${club.name} de pie. No te van a hacer una estatua. Tampoco te van a putear en el barrio.`,
    },
    'derrota-electoral': {
      id: 'derrota-electoral',
      title: 'LA GENTE VOTÓ',
      text: `${años} ${plural(años, 'año', 'años')} en el sillón y la gente eligió otra cosa. Entregaste las llaves un martes a la mañana, sin cámaras. El nuevo presidente prometió "recuperar la identidad del club".`,
    },
    asamblea: {
      id: 'asamblea',
      title: 'TE VOLTEÓ LA ASAMBLEA',
      text: `No hizo falta esperar a las elecciones. La asamblea extraordinaria se llenó de socios que no aparecían hacía años y te sacaron a mano alzada. Saliste por la puerta de atrás con un bolso y dos carpetas.`,
    },
    quiebra: {
      id: 'quiebra',
      title: 'EL CLUB FUNDIDO',
      text: `La deuda se comió todo. Embargos, sueldos impagos, jugadores que se fueron libres y una causa penal con tu nombre en la carátula. ${club.name} va a tardar una década en recuperarse de tu gestión.`,
    },
    'descenso-fatal': {
      id: 'descenso-fatal',
      title: 'DOS DESCENSOS',
      text: `Dos descensos en una misma presidencia. No hay rosca que aguante eso. Te fuiste antes de que te echaran, y ni así te ahorraste el escrache en la puerta de tu casa.`,
    },
  };

  return endings[id];
}

/**
 * Puntaje único y comparable. Es la vara del ranking diario y del global,
 * así que tiene que castigar el descenso más fuerte de lo que premia
 * cualquier atajo económico.
 */
export function computeScore(state: GameState): number {
  const puntosTitulos = state.titles.reduce((sum, t) => sum + TITLES[t.id].points, 0);

  const score =
    puntosTitulos +
    state.season * 18 +
    state.resources.hinchada * 4 +
    Math.max(0, state.resources.caja) * 3 +
    state.resources.socios * 1.2 +
    state.ascensos * 60 -
    state.descensos * 140;

  return Math.max(0, Math.round(score));
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
