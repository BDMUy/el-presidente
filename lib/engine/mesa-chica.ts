/**
 * La Mesa Chica: el clímax de la temporada.
 *
 * No jugás el partido — repartís tres fichas de influencia entre cinco frentes
 * y mirás. Es una decisión de asignación con costos asimétricos, no una prueba
 * de reflejos: el análogo dirigencial del penal.
 *
 * El reparto se guarda en el log como un único índice, porque las 35
 * distribuciones posibles se enumeran siempre en el mismo orden.
 */

import { Rand } from './rng';
import type { BigMatch, Effects, Frente, MesaChicaAssignment } from './types';
import { FICHAS_MESA_CHICA, FRENTES } from './types';

const EMPTY: MesaChicaAssignment = { plantel: 0, dt: 0, hinchada: 0, prensa: 0, gestion: 0 };

/**
 * Todas las formas de repartir las fichas, en orden canónico y estable.
 * El índice dentro de este array es lo que viaja en el log de la partida.
 *
 * Incluye los repartos de menos de tres fichas, y también el de cero: como
 * cada ficha se paga en plata o en influencia, guardárselas es una decisión
 * legítima y tiene que ser representable.
 */
export function enumerateAssignments(): MesaChicaAssignment[] {
  const ids = FRENTES.map((f) => f.id);
  const out: MesaChicaAssignment[] = [];

  const walk = (index: number, left: number, acc: MesaChicaAssignment) => {
    if (index === ids.length - 1) {
      out.push({ ...acc, [ids[index]]: left });
      return;
    }
    for (let n = 0; n <= left; n++) {
      walk(index + 1, left - n, { ...acc, [ids[index]]: n });
    }
  };

  for (let total = 0; total <= FICHAS_MESA_CHICA; total++) {
    walk(0, total, { ...EMPTY });
  }
  return out;
}

/** Índice canónico de un reparto. Lo usa la UI para registrar la elección. */
export function assignmentIndex(assignment: MesaChicaAssignment): number {
  const index = enumerateAssignments().findIndex((a) =>
    FRENTES.every((f) => a[f.id] === assignment[f.id]),
  );
  if (index < 0) {
    throw new Error(`Reparto imposible: ${JSON.stringify(assignment)}`);
  }
  return index;
}

/** Etiqueta corta de un reparto, para mostrarlo en el resumen. */
export function describeAssignment(assignment: MesaChicaAssignment): string {
  const parts = FRENTES.filter((f) => assignment[f.id] > 0).map(
    (f) => `${f.label}${assignment[f.id] > 1 ? ` ×${assignment[f.id]}` : ''}`,
  );
  return parts.length > 0 ? parts.join(' · ') : 'No moviste un dedo';
}

/** Probabilidad final de ganar el partido con este reparto. */
export function winProbability(match: BigMatch, assignment: MesaChicaAssignment): number {
  const bonus = FRENTES.reduce((sum, f) => sum + assignment[f.id] * f.winPerFicha, 0);
  return Math.min(0.92, Math.max(0.05, match.baseWin + bonus));
}

/** Costo inmediato de un reparto, antes de saber el resultado. */
export function assignmentCost(assignment: MesaChicaAssignment): Effects {
  return {
    caja: -(assignment.plantel * 0.8 + assignment.hinchada * 0.3 + assignment.prensa * 0.5),
    influencia: -(assignment.gestion * 12),
    hinchada: assignment.hinchada * 2,
  };
}

/**
 * Lo que cuesta una sola ficha en un frente.
 *
 * Se deriva de `assignmentCost` en vez de escribirse a mano en cada frente:
 * una etiqueta hardcodeada que dice "US$ 0,8M" se vuelve mentira en cuanto
 * alguien cambia el precio, y nadie se entera hasta que un jugador se queja.
 */
export function costoPorFicha(frente: Frente): Effects {
  return assignmentCost({ ...EMPTY, [frente]: 1 });
}

export interface MesaChicaOutcome {
  won: boolean;
  text: string;
  effects: Effects;
}

/**
 * Resuelve el partido y devuelve las consecuencias.
 *
 * La gestión política es la palanca más fuerte y por eso arrastra la factura
 * más cara: quema influencia ya, y puede estallar como escándalo dos temporadas
 * más tarde, cuando ya te olvidaste de que la usaste.
 */
export function resolveMesaChica(
  match: BigMatch,
  assignment: MesaChicaAssignment,
  rand: Rand,
): MesaChicaOutcome {
  const won = rand.chance(winProbability(match, assignment));
  const effects: Effects = {};

  if (won) {
    effects.hinchada = 14;
    effects.influencia = 6;
  } else {
    // El blindaje de prensa recién se paga acá: amortigua la derrota.
    const amortiguado = assignment.prensa * 3;
    effects.hinchada = Math.min(0, -16 + amortiguado);
    effects.influencia = -4;
  }

  const deferred: NonNullable<Effects['deferred']> = [];
  for (let i = 0; i < assignment.gestion; i++) {
    if (rand.chance(0.22)) {
      deferred.push({
        inSeasons: rand.int(1, 2),
        text: 'Salieron a la luz los audios de aquella final. La gente ata cabos.',
        effects: { hinchada: -12, influencia: -10, caja: -2 },
      });
    }
  }
  if (deferred.length > 0) effects.deferred = deferred;

  return {
    won,
    text: won ? victoryText(match, assignment, rand) : defeatText(match, assignment, rand),
    effects,
  };
}

function victoryText(match: BigMatch, assignment: MesaChicaAssignment, rand: Rand): string {
  const base = rand.pick([
    `Se ganó. El estadio no se vació hasta las tres de la mañana.`,
    `Campeón. Te abrazaste con gente que dos meses atrás pedía tu renuncia.`,
    `Se dio. Contra ${match.rival}, que es como tenía que ser.`,
  ]);
  if (assignment.gestion >= 2) {
    return `${base} Nadie preguntó demasiado por el arbitraje, y mejor así.`;
  }
  if (assignment.plantel >= 2) {
    return `${base} La prima salió cara, pero salió.`;
  }
  return base;
}

function defeatText(match: BigMatch, assignment: MesaChicaAssignment, rand: Rand): string {
  const base = rand.pick([
    `Se perdió. ${match.rival} dio la vuelta en tu cara.`,
    `Otra final perdida. El micro volvió en silencio.`,
    `No se pudo. Faltó todo lo que sobró en la previa.`,
  ]);
  if (assignment.prensa >= 2) {
    return `${base} Al menos los diarios del lunes te pegaron flojo.`;
  }
  if (assignment.gestion >= 1) {
    return `${base} Gastaste influencia en una final que perdiste igual: lo peor de los dos mundos.`;
  }
  return base;
}

/** Frentes con su definición, para que la UI no importe tipos sueltos. */
export { FRENTES };
export type { Frente };
