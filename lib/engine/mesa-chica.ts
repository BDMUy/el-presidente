import { Rand } from './rng';
import type { BigMatch, Effects, Frente, MesaChicaAssignment } from './types';
import { FICHAS_MESA_CHICA, FRENTES } from './types';

const EMPTY: MesaChicaAssignment = { plantel: 0, dt: 0, hinchada: 0, prensa: 0, gestion: 0 };

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

export function assignmentIndex(assignment: MesaChicaAssignment): number {
  const index = enumerateAssignments().findIndex((a) =>
    FRENTES.every((f) => a[f.id] === assignment[f.id]),
  );
  if (index < 0) {
    throw new Error(`Reparto imposible: ${JSON.stringify(assignment)}`);
  }
  return index;
}

export function describeAssignment(assignment: MesaChicaAssignment): string {
  const parts = FRENTES.filter((f) => assignment[f.id] > 0).map(
    (f) => `${f.label}${assignment[f.id] > 1 ? ` ×${assignment[f.id]}` : ''}`,
  );
  return parts.length > 0 ? parts.join(' · ') : 'No moviste un dedo';
}

export function winProbability(match: BigMatch, assignment: MesaChicaAssignment): number {
  const bonus = FRENTES.reduce((sum, f) => sum + assignment[f.id] * f.winPerFicha, 0);
  return Math.min(0.92, Math.max(0.05, match.baseWin + bonus));
}

export function assignmentCost(assignment: MesaChicaAssignment): Effects {
  return {
    caja: -(assignment.plantel * 0.8 + assignment.hinchada * 0.3 + assignment.prensa * 0.5),
    influencia: -(assignment.gestion * 12),
    hinchada: assignment.hinchada * 2,
  };
}

export function costoPorFicha(frente: Frente): Effects {
  return assignmentCost({ ...EMPTY, [frente]: 1 });
}

export interface MesaChicaOutcome {
  won: boolean;
  text: string;
  effects: Effects;
}

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
    const amortiguado = assignment.prensa * 3;
    effects.hinchada = Math.min(0, -16 + amortiguado);
    effects.influencia = -4;
  }

  if (assignment.gestion > 0) {
    effects.flagsSuma = { prontuario: assignment.gestion };
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

export { FRENTES };
export type { Frente };
