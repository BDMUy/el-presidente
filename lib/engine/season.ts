import { RIVALES, RIVALES_CONTINENTALES } from '@/content/rivales';
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
  'pe-primera': 50, 'pe-segunda': 28,
  'co-primera': 54, 'co-segunda': 28,
  'cl-primera': 52, 'cl-segunda': 28,
  'py-primera': 50, 'py-segunda': 28,
  'bo-primera': 50, 'bo-segunda': 28,
  'ec-primera': 52, 'ec-segunda': 28,
  've-primera': 50, 've-segunda': 28,
  'br-primera': 55, 'br-segunda': 30,
};

const LEAGUE_SPREAD = 7;

const SEASON_NOISE = 11;

const TV_MONEY: Record<LeagueId, number> = {
  'ar-primera': 3.5, 'ar-nacional': 1, 'ar-b': 0.35,
  'uy-primera': 3.0, 'uy-segunda': 0.4,
  'pe-primera': 2.2, 'pe-segunda': 0.4,
  'co-primera': 3, 'co-segunda': 0.4,
  'cl-primera': 2.5, 'cl-segunda': 0.4,
  'py-primera': 2.4, 'py-segunda': 0.4,
  'bo-primera': 1.98, 'bo-segunda': 0.4,
  'ec-primera': 2.35, 'ec-segunda': 0.4,
  've-primera': 1.95, 've-segunda': 0.4,
  'br-primera': 4.85, 'br-segunda': 0.6,
};

const WAGE_FACTOR: Record<LeagueId, number> = {
  'ar-primera': 0.13, 'ar-nacional': 0.06, 'ar-b': 0.03,
  'uy-primera': 0.097, 'uy-segunda': 0.04,
  'pe-primera': 0.095, 'pe-segunda': 0.04,
  'co-primera': 0.1, 'co-segunda': 0.04,
  'cl-primera': 0.094, 'cl-segunda': 0.04,
  'py-primera': 0.075, 'py-segunda': 0.04,
  'bo-primera': 0.087, 'bo-segunda': 0.04,
  'ec-primera': 0.086, 'ec-segunda': 0.04,
  've-primera': 0.076, 've-segunda': 0.04,
  'br-primera': 0.096, 'br-segunda': 0.05,
};

const PRIZE_MAX: Record<LeagueId, number> = {
  'ar-primera': 3.5, 'ar-nacional': 0.9, 'ar-b': 0.3,
  'uy-primera': 2.3, 'uy-segunda': 0.4,
  'pe-primera': 1.8, 'pe-segunda': 0.4,
  'co-primera': 2.5, 'co-segunda': 0.4,
  'cl-primera': 2.1, 'cl-segunda': 0.4,
  'py-primera': 2.2, 'py-segunda': 0.4,
  'bo-primera': 1.78, 'bo-segunda': 0.4,
  'ec-primera': 2.15, 'ec-segunda': 0.4,
  've-primera': 1.73, 've-segunda': 0.4,
  'br-primera': 4.4, 'br-segunda': 0.6,
};

const SOCIO_INCOME = 0.045;

const TITLE_INCOME: Partial<Record<TitleId, number>> = {
  'ar-liga-primera': 6,
  'ar-liga-nacional': 2,
  'ar-liga-b': 1,
  'uy-liga': 2.3,
  'uy-segunda-liga': 0.5,
  'pe-liga': 1.5,
  'pe-segunda-liga': 0.3,
  'ar-copa': 3,
  'ar-supercopa': 1.5,
  'uy-copa': 1.15,
  'uy-supercopa': 0.58,
  'pe-copa': 0.8,
  'co-liga': 4,
  'co-segunda-liga': 0.7,
  'co-copa': 2,
  'cl-liga': 3.2,
  'cl-segunda-liga': 0.55,
  'cl-copa': 1.6,
  'py-liga': 1.8,
  'py-segunda-liga': 0.3,
  'py-copa': 0.8,
  'bo-liga': 2.2,
  'bo-segunda-liga': 0.35,
  'bo-copa': 1,
  'ec-liga': 2.8,
  'ec-segunda-liga': 0.45,
  'ec-copa': 1.3,
  've-liga': 1.45,
  've-segunda-liga': 0.22,
  've-copa': 0.6,
  'br-liga': 4,
  'br-segunda-liga': 0.65,
  'br-copa': 2,
  libertadores: 18,
  sudamericana: 6,
  ascenso: 4,
};

const DOMESTIC_CUP_TITLES = new Set(Object.values(DOMESTIC_CUPS).map((c) => c.title));

const CONTINENTAL_RATIO = 6 / 30;

const SIZE_RANGE: Record<LeagueId, [number, number]> = {
  'ar-primera': [3, 10], 'ar-nacional': [2, 6], 'ar-b': [1, 3],
  'uy-primera': [3, 8], 'uy-segunda': [1, 3],
  'pe-primera': [2, 9], 'pe-segunda': [1, 3],
  'co-primera': [2, 9], 'co-segunda': [1, 3],
  'cl-primera': [2, 9], 'cl-segunda': [1, 3],
  'py-primera': [2, 9], 'py-segunda': [1, 3],
  'bo-primera': [2, 9], 'bo-segunda': [1, 3],
  'ec-primera': [2, 9], 'ec-segunda': [1, 3],
  've-primera': [2, 9], 've-segunda': [1, 3],
  'br-primera': [2, 9], 'br-segunda': [1, 3],
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
        rival: rand.pick(RIVALES_CONTINENTALES),
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

  const continentalSlots = Math.round(rules.teams * CONTINENTAL_RATIO);
  const qualifiedContinental =
    (rules.continental && position <= continentalSlots) ||
    titles.some((t) => DOMESTIC_CUP_TITLES.has(t)) ||
    titles.includes('libertadores') ||
    titles.includes('sudamericana');

  const esperada = expectedPosition(club, league);

  return {
    position,
    teams: rules.teams,
    league,
    champion,
    promoted,
    relegated,
    qualifiedContinental,
    titles,
    summary: buildSummary(
      club,
      position,
      rules.teams,
      champion,
      promoted,
      relegated,
      esperada,
      state.resources.hinchada,
    ),
  };
}

function buildSummary(
  club: Club,
  position: number,
  teams: number,
  champion: boolean,
  promoted: boolean,
  relegated: boolean,
  esperada: number,
  hinchada: number,
): string {
  if (champion) return `${club.name} dio la vuelta. La ciudad es una fiesta.`;
  if (promoted) return `${club.name} asciende. Once años de espera se terminaron en una tarde.`;
  if (relegated) return `${club.name} se fue al descenso. El silencio en el estadio fue peor que los insultos.`;

  const diff = esperada - position;

  if (diff >= 5) return `${club.name} terminó ${position}° y superó lo que se esperaba de este plantel. La gente se ilusiona.`;
  if (diff >= 1) return `Temporada correcta: ${position}° de ${teams}. Cumplió con lo que se esperaba, ni más ni menos.`;
  if (diff >= -4) return `${position}° de ${teams}. Ni fiesta ni tragedia.`;
  if (hinchada >= 60) return `${position}° de ${teams}, bastante por debajo de lo que se esperaba. La hinchada no festeja, pero tampoco te suelta la mano.`;
  if (hinchada >= 40) return `${position}° de ${teams}. La gente no putea todavía, pero la paciencia se está por terminar.`;
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
  return LEAGUES[league].tier === 1 ? -9 : -7.25;
}

export function desgasteDelCargo(mandate: number): number {
  return -(mandate * 0.8);
}

export function titlePoints(id: TitleId): number {
  return TITLES[id].points;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
