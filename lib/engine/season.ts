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

const LEAGUE_AVERAGE: Record<Category, number> = { primera: 58, nacional: 42, b: 30 };

const LEAGUE_SPREAD = 7;

const SEASON_NOISE = 11;

const TV_MONEY: Record<Category, number> = { primera: 3.5, nacional: 1, b: 0.35 };

const WAGE_FACTOR: Record<Category, number> = { primera: 0.13, nacional: 0.06, b: 0.03 };

const PRIZE_MAX: Record<Category, number> = { primera: 3.5, nacional: 0.9, b: 0.3 };

const SOCIO_INCOME = 0.045;

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

const SIZE_RANGE: Record<Category, [number, number]> = {
  primera: [3, 10],
  nacional: [2, 6],
  b: [1, 3],
};

export function expectedPosition(club: Club, category: Category): number {
  const { teams } = CATEGORY_RULES[category];
  const [min, max] = SIZE_RANGE[category];
  const norm = Math.min(1, Math.max(0, (club.size - min) / (max - min)));
  return Math.max(1, Math.round(teams * 0.85 - norm * teams * 0.75));
}

export function plantelForPosition(position: number, category: Category): number {
  const { teams } = CATEGORY_RULES[category];
  const p = 1 - (position - 1) / (teams - 1);
  const clamped = Math.min(0.985, Math.max(0.015, p));
  return LEAGUE_AVERAGE[category] + LEAGUE_SPREAD * Math.log(clamped / (1 - clamped));
}

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

export function rollBigMatch(
  state: GameState,
  club: Club,
  position: number,
  rand: Rand,
): BigMatch | null {
  const { category, resources, flags } = state;
  const rules = CATEGORY_RULES[category];
  const rival = rand.pick(RIVALES.filter((r) => r !== club.short));

  if (category !== 'primera' && position > rules.promote && position <= rules.promote + 4) {
    return {
      competition: 'playoff',
      label: `Final del Reducido por el ascenso`,
      rival,
      baseWin: 0.42 + (resources.plantel - LEAGUE_AVERAGE[category]) * 0.008,
      title: 'ascenso',
    };
  }

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

export function plantelDecay(category: Category): number {
  return category === 'primera' ? -2.5 : -2;
}

export function desgasteDelCargo(mandate: number): number {
  return -(1 + mandate * 0.6);
}

export function titlePoints(id: TitleId): number {
  return TITLES[id].points;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
