/**
 * Resolución deportiva y económica de una temporada.
 *
 * El jugador no juega los partidos: arma el plantel y el plantel responde.
 * Toda la aleatoriedad pasa por el Rand que se recibe, así que el resultado es
 * reproducible con la misma semilla.
 */

import { Rand } from './rng';
import type {
  BigMatch,
  Category,
  Club,
  GameState,
  Resources,
  SeasonResult,
  TitleId,
} from './types';
import { CATEGORY_RULES, TITLES } from './types';

/** Nivel medio del campeonato en cada categoría. */
const LEAGUE_AVERAGE: Record<Category, number> = { primera: 58, nacional: 42, b: 30 };

/** Cuánto pesa una diferencia de nivel. Más chico = la tabla ordena más fuerte. */
const LEAGUE_SPREAD = 7;

/** Desvío del ruido de la temporada: el fútbol tiene su cuota de azar. */
const SEASON_NOISE = 11;

/** Plata de TV por categoría, en millones por temporada. */
const TV_MONEY: Record<Category, number> = { primera: 3.5, nacional: 1, b: 0.35 };

/**
 * Multiplicador de la masa salarial: un plantel de Primera cuesta mucho más.
 *
 * Está calibrado para que sostener un plantel grande sea caro de verdad. Si
 * los sueldos son baratos, la deuda nunca es peligrosa y endeudarse para
 * reforzar deja de ser una decisión.
 */
const WAGE_FACTOR: Record<Category, number> = { primera: 0.13, nacional: 0.06, b: 0.03 };

/** Premio máximo por rendimiento en la tabla, en millones. */
const PRIZE_MAX: Record<Category, number> = { primera: 3.5, nacional: 0.9, b: 0.3 };

/** Ingreso por socio y por temporada, en millones cada mil socios. */
const SOCIO_INCOME = 0.045;

/** Plata que entra por ganar cada título, en millones. */
const TITLE_INCOME: Partial<Record<TitleId, number>> = {
  'liga-primera': 6,
  'liga-nacional': 2,
  'liga-b': 1,
  'copa-argentina': 3,
  supercopa: 1.5,
  libertadores: 18,
  sudamericana: 6,
  ascenso: 4,
};

const RIVALES = [
  'Boca', 'River', 'Racing', 'Independiente', 'San Lorenzo', 'Vélez',
  'Estudiantes', 'Lanús', 'Talleres', 'Newell\'s', 'Rosario Central', 'Huracán',
];

/**
 * Rango de peso institucional dentro de cada categoría. Un `size` 3 es el
 * club más chico de Primera y el más grande de la B, así que la expectativa
 * tiene que leerse relativa a la categoría, no en abstracto.
 */
const SIZE_RANGE: Record<Category, [number, number]> = {
  primera: [3, 10],
  nacional: [2, 6],
  b: [1, 3],
};

/**
 * Posición esperada según el peso institucional del club. Se usa para medir si
 * la temporada fue buena o mala *para este club*: salir sexto es una fiesta en
 * un club chico y un fracaso en un grande.
 */
export function expectedPosition(club: Club, category: Category): number {
  const { teams } = CATEGORY_RULES[category];
  const [min, max] = SIZE_RANGE[category];
  const norm = Math.min(1, Math.max(0, (club.size - min) / (max - min)));
  return Math.max(1, Math.round(teams * 0.85 - norm * teams * 0.75));
}

/**
 * Inversa de `resolvePosition`: qué nivel de plantel hace falta, en promedio,
 * para terminar en cierta posición.
 *
 * Se deriva en vez de estimarse a mano para que el plantel inicial de cada
 * club siga siendo coherente si mañana se retocan LEAGUE_AVERAGE o el spread.
 */
export function plantelForPosition(position: number, category: Category): number {
  const { teams } = CATEGORY_RULES[category];
  const p = 1 - (position - 1) / (teams - 1);
  const clamped = Math.min(0.985, Math.max(0.015, p));
  return LEAGUE_AVERAGE[category] + LEAGUE_SPREAD * Math.log(clamped / (1 - clamped));
}

/** Resuelve la posición final en la tabla. */
export function resolvePosition(
  resources: Resources,
  category: Category,
  rand: Rand,
): number {
  const { teams } = CATEGORY_RULES[category];
  const perf =
    resources.plantel +
    rand.normal() * SEASON_NOISE +
    (resources.hinchada - 50) * 0.06;

  const p = 1 / (1 + Math.exp(-(perf - LEAGUE_AVERAGE[category]) / LEAGUE_SPREAD));
  return Math.min(teams, Math.max(1, 1 + Math.round((1 - p) * (teams - 1))));
}

/**
 * Decide cuál es el partido grande de la temporada, si hay alguno.
 * Se llama después de conocer la posición, porque el playoff de ascenso
 * depende de dónde terminó el equipo.
 */
export function rollBigMatch(
  state: GameState,
  club: Club,
  position: number,
  rand: Rand,
): BigMatch | null {
  const { category, resources, flags } = state;
  const rules = CATEGORY_RULES[category];
  const rival = rand.pick(RIVALES.filter((r) => r !== club.short));

  // Playoff de ascenso: quedaste cerca pero no subiste directo.
  if (category !== 'primera' && position > rules.promote && position <= rules.promote + 4) {
    return {
      competition: 'playoff',
      label: `Final del Reducido por el ascenso`,
      rival,
      baseWin: 0.42 + (resources.plantel - LEAGUE_AVERAGE[category]) * 0.008,
      title: 'ascenso',
    };
  }

  // Copa continental: hay que haber clasificado la temporada anterior.
  if (flags.continental) {
    const strength = (resources.plantel - 55) / 40;
    if (rand.chance(0.16 + strength * 0.2)) {
      const esLibertadores = !!flags.libertadores;
      return {
        competition: 'continental',
        label: esLibertadores ? 'Final de la Copa Libertadores' : 'Final de la Copa Sudamericana',
        rival: rand.pick(['Flamengo', 'Palmeiras', 'Peñarol', 'Nacional', 'Colo-Colo', 'Atlético Mineiro']),
        baseWin: esLibertadores ? 0.34 + strength * 0.16 : 0.44 + strength * 0.16,
        title: esLibertadores ? 'libertadores' : 'sudamericana',
      };
    }
  }

  // Copa Argentina: la juegan todos, incluso los del ascenso.
  const copaChance = 0.13 + Math.max(0, (resources.plantel - LEAGUE_AVERAGE[category])) * 0.006;
  if (rand.chance(copaChance)) {
    return {
      competition: 'copa',
      label: 'Final de la Copa Argentina',
      rival,
      baseWin: 0.5 + (resources.plantel - LEAGUE_AVERAGE[category]) * 0.006,
      title: 'copa-argentina',
    };
  }

  return null;
}

/**
 * Arma el resultado completo de la temporada a partir de la posición y de lo
 * que haya pasado en el partido grande.
 */
export function buildSeasonResult(
  state: GameState,
  club: Club,
  position: number,
  bigMatchTitle: TitleId | null,
): SeasonResult {
  const { category } = state;
  const rules = CATEGORY_RULES[category];
  const titles: TitleId[] = [];

  const champion = position === 1;
  if (champion) {
    titles.push(
      category === 'primera' ? 'liga-primera' : category === 'nacional' ? 'liga-nacional' : 'liga-b',
    );
  }
  if (bigMatchTitle) titles.push(bigMatchTitle);

  const promotedDirect = category !== 'primera' && position <= rules.promote;
  const promotedPlayoff = bigMatchTitle === 'ascenso';
  const promoted = promotedDirect || promotedPlayoff;
  const relegated = position > rules.teams - rules.relegate;

  const qualifiedContinental =
    (category === 'primera' && position <= 6) ||
    titles.includes('copa-argentina') ||
    titles.includes('libertadores') ||
    titles.includes('sudamericana');

  return {
    position,
    teams: rules.teams,
    category,
    champion,
    promoted,
    relegated,
    qualifiedContinental,
    titles,
    summary: buildSummary(club, position, rules.teams, champion, promoted, relegated),
  };
}

function buildSummary(
  club: Club,
  position: number,
  teams: number,
  champion: boolean,
  promoted: boolean,
  relegated: boolean,
): string {
  if (champion) return `${club.name} dio la vuelta. La ciudad es una fiesta.`;
  if (promoted) return `${club.name} asciende. Once años de espera se terminaron en una tarde.`;
  if (relegated) return `${club.name} se fue al descenso. El silencio en el estadio fue peor que los insultos.`;
  if (position <= 4) return `${club.name} terminó ${position}° y se metió arriba. La gente se ilusiona.`;
  if (position <= teams / 2) return `Temporada correcta: ${position}° de ${teams}. Ni fiesta ni tragedia.`;
  return `${position}° de ${teams}. La platea empezó a pedir tu renuncia antes de la última fecha.`;
}

export interface Economy {
  ingresos: number;
  egresos: number;
  neto: number;
  detalle: { label: string; amount: number }[];
}

/** Calcula el balance económico de la temporada. */
export function resolveEconomy(
  resources: Resources,
  category: Category,
  result: SeasonResult,
): Economy {
  const rules = CATEGORY_RULES[category];
  const detalle: { label: string; amount: number }[] = [];

  const socios = resources.socios * SOCIO_INCOME;
  detalle.push({ label: 'Cuotas de socios', amount: socios });

  const tv = TV_MONEY[category];
  detalle.push({ label: 'Derechos de TV', amount: tv });

  const premio = ((rules.teams - result.position) / rules.teams) * PRIZE_MAX[category];
  detalle.push({ label: 'Premios por tabla', amount: premio });

  const porTitulos = result.titles.reduce((sum, id) => sum + (TITLE_INCOME[id] ?? 0), 0);
  if (porTitulos > 0) detalle.push({ label: 'Premios por títulos', amount: porTitulos });

  const sueldos = -(resources.plantel * WAGE_FACTOR[category]);
  detalle.push({ label: 'Masa salarial', amount: sueldos });

  // Los intereses de la deuda son la trampa silenciosa: endeudarse una vez es
  // manejable, quedarse endeudado te come la presidencia.
  const intereses = resources.caja < 0 ? resources.caja * 0.08 : 0;
  if (intereses !== 0) detalle.push({ label: 'Intereses de deuda', amount: intereses });

  const ingresos = socios + tv + premio + porTitulos;
  const egresos = sueldos + intereses;

  return {
    ingresos: round1(ingresos),
    egresos: round1(egresos),
    neto: round1(ingresos + egresos),
    detalle: detalle.map((d) => ({ ...d, amount: round1(d.amount) })),
  };
}

/**
 * Impacto de la temporada en la hinchada y en los socios.
 * Se mide contra la expectativa del club, no contra la tabla en abstracto.
 */
export function resolveMood(
  club: Club,
  result: SeasonResult,
): { hinchada: number; socios: number } {
  const expected = expectedPosition(club, result.category);
  const diff = expected - result.position;

  let hinchada = diff * (result.category === 'primera' ? 0.7 : 0.9);
  let socios = diff * 0.22;

  if (result.champion) {
    hinchada += 18;
    socios += 4;
  }
  if (result.promoted) {
    hinchada += 26;
    socios += 5;
  }
  if (result.relegated) {
    hinchada -= 34;
    socios -= 7;
  }
  for (const id of result.titles) {
    if (id === 'libertadores') hinchada += 30;
    else if (id === 'sudamericana') hinchada += 16;
    else if (id === 'copa-argentina') hinchada += 12;
  }

  return { hinchada: round1(hinchada), socios: round1(socios) };
}

/**
 * Cuánto se desgasta el plantel solo, si no lo tocás.
 *
 * Tiene que doler lo suficiente para que el mercado importe todas las
 * temporadas, sin condenar a muerte a quien pasa una ventana sin fichar.
 */
export function plantelDecay(category: Category): number {
  return category === 'primera' ? -2.5 : -2;
}

/** Puntos que otorga un título, para el puntaje final. */
export function titlePoints(id: TitleId): number {
  return TITLES[id].points;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
