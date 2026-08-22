import { RIVALES } from '@/content/rivales';
import { Rand } from './rng';
import type {
  BigMatch,
  Club,
  GameState,
  LeagueId,
  Resources,
  SeasonResult,
  TitleId,
} from './types';
import { countryOf, DOMESTIC_CUPS, LEAGUES, TITLES } from './types';

const LEAGUE_AVERAGE: Record<LeagueId, number> = {
  'ar-primera': 58, 'ar-nacional': 42, 'ar-b': 30,
  'uy-primera': 50, 'uy-segunda': 28,
};

const LEAGUE_SPREAD = 7;

const SEASON_NOISE = 11;

const TV_MONEY: Record<LeagueId, number> = {
  'ar-primera': 3.5, 'ar-nacional': 1, 'ar-b': 0.35,
  'uy-primera': 2.9, 'uy-segunda': 0.4,
};

const WAGE_FACTOR: Record<LeagueId, number> = {
  'ar-primera': 0.13, 'ar-nacional': 0.06, 'ar-b': 0.03,
  'uy-primera': 0.08, 'uy-segunda': 0.04,
};

const PRIZE_MAX: Record<LeagueId, number> = {
  'ar-primera': 3.5, 'ar-nacional': 0.9, 'ar-b': 0.3,
  'uy-primera': 2.4, 'uy-segunda': 0.4,
};

const SOCIO_INCOME = 0.045;

const TITLE_INCOME: Partial<Record<TitleId, number>> = {
  'ar-liga-primera': 6,
  'ar-liga-nacional': 2,
  'ar-liga-b': 1,
  'uy-liga': 6,
  'uy-segunda-liga': 1,
  'ar-copa': 3,
  'ar-supercopa': 1.5,
  'uy-copa': 3,
  'uy-supercopa': 1.5,
  libertadores: 18,
  sudamericana: 6,
  ascenso: 4,
};

const DOMESTIC_CUP_TITLES = new Set(Object.values(DOMESTIC_CUPS).map((c) => c.title));

const SIZE_RANGE: Record<LeagueId, [number, number]> = {
  'ar-primera': [3, 10], 'ar-nacional': [2, 6], 'ar-b': [1, 3],
  'uy-primera': [2, 8], 'uy-segunda': [1, 3],
};

export function expectedPosition(club: Club, league: LeagueId): number {
  const { teams } = LEAGUES[league];
  const [min, max] = SIZE_RANGE[league];
  const norm = Math.min(1, Math.max(0, (club.size - min) / (max - min)));
  return Math.max(1, Math.round(teams * 0.85 - norm * teams * 0.75));
}

export function plantelForPosition(position: number, league: LeagueId): number {
  const { teams } = LEAGUES[league];
  const p = 1 - (position - 1) / (teams - 1);
  const clamped = Math.min(0.985, Math.max(0.015, p));
  return LEAGUE_AVERAGE[league] + LEAGUE_SPREAD * Math.log(clamped / (1 - clamped));
}

export function resolvePosition(
  resources: Resources,
  league: LeagueId,
  rand: Rand,
): number {
  const { teams } = LEAGUES[league];
  const perf =
    resources.plantel +
    rand.normal() * SEASON_NOISE +
    (resources.hinchada - 50) * 0.06;

  const p = 1 / (1 + Math.exp(-(perf - LEAGUE_AVERAGE[league]) / LEAGUE_SPREAD));
  return Math.min(teams, Math.max(1, 1 + Math.round((1 - p) * (teams - 1))));
}

export function rollBigMatch(
  state: GameState,
  club: Club,
  position: number,
  rand: Rand,
): BigMatch | null {
  const { league, resources, flags } = state;
  const rules = LEAGUES[league];
  const country = countryOf(league);
  const rival = rand.pick(RIVALES[country].filter((r) => r !== club.short));

  if (rules.promotesTo && position > rules.promote && position <= rules.promote + 4) {
    return {
      competition: 'playoff',
      label: `Final del Reducido por el ascenso`,
      rival,
      baseWin: 0.42 + (resources.plantel - LEAGUE_AVERAGE[league]) * 0.008,
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

  const copaChance = 0.13 + Math.max(0, (resources.plantel - LEAGUE_AVERAGE[league])) * 0.006;
  if (rand.chance(copaChance)) {
    const cup = DOMESTIC_CUPS[country];
    return {
      competition: 'copa',
      label: `Final de la ${cup.label}`,
      rival,
      baseWin: 0.5 + (resources.plantel - LEAGUE_AVERAGE[league]) * 0.006,
      title: cup.title,
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
  const { league } = state;
  const rules = LEAGUES[league];
  const titles: TitleId[] = [];

  const champion = position === 1;
  if (champion) titles.push(rules.championTitle);
  if (bigMatchTitle) titles.push(bigMatchTitle);

  const promotedDirect = rules.promotesTo !== null && position <= rules.promote;
  const promotedPlayoff = bigMatchTitle === 'ascenso';
  const promoted = promotedDirect || promotedPlayoff;
  const relegated = position > rules.teams - rules.relegate;

  const qualifiedContinental =
    (rules.continental && position <= 6) ||
    titles.some((t) => DOMESTIC_CUP_TITLES.has(t)) ||
    titles.includes('libertadores') ||
    titles.includes('sudamericana');

  return {
    position,
    teams: rules.teams,
    league,
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
  league: LeagueId,
  result: SeasonResult,
): Economy {
  const rules = LEAGUES[league];
  const detalle: { label: string; amount: number }[] = [];

  const socios = resources.socios * SOCIO_INCOME;
  detalle.push({ label: 'Cuotas de socios', amount: socios });

  const tv = TV_MONEY[league];
  detalle.push({ label: 'Derechos de TV', amount: tv });

  const premio = ((rules.teams - result.position) / rules.teams) * PRIZE_MAX[league];
  detalle.push({ label: 'Premios por tabla', amount: premio });

  const porTitulos = result.titles.reduce((sum, id) => sum + (TITLE_INCOME[id] ?? 0), 0);
  if (porTitulos > 0) detalle.push({ label: 'Premios por títulos', amount: porTitulos });

  const sueldos = -(resources.plantel * WAGE_FACTOR[league]);
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
  const expected = expectedPosition(club, result.league);
  const diff = expected - result.position;

  let hinchada = diff * (LEAGUES[result.league].tier === 1 ? 0.7 : 0.9);
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
    else if (DOMESTIC_CUP_TITLES.has(id)) hinchada += 12;
  }

  return { hinchada: round1(hinchada), socios: round1(socios) };
}

export function plantelDecay(league: LeagueId): number {
  return LEAGUES[league].tier === 1 ? -2.5 : -2;
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
