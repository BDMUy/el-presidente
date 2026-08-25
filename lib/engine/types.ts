export type Country = 'argentina' | 'uruguay' | 'peru' | 'colombia' | 'chile' | 'paraguay' | 'bolivia' | 'ecuador' | 'venezuela';

export type LeagueId =
  | 'ar-primera' | 'ar-nacional' | 'ar-b'
  | 'uy-primera' | 'uy-segunda'
  | 'pe-primera' | 'pe-segunda'
  | 'co-primera' | 'co-segunda'
  | 'cl-primera' | 'cl-segunda'
  | 'py-primera' | 'py-segunda'
  | 'bo-primera' | 'bo-segunda'
  | 'ec-primera' | 'ec-segunda'
  | 've-primera' | 've-segunda';

export interface Club {
  id: string;
  name: string;
  short: string;
  colors: [string, string];
  league: LeagueId;
  size: number;
  nickname?: string;
}

export interface LeagueDef {
  id: LeagueId;
  country: Country;
  tier: number;
  teams: number;
  promote: number;
  relegate: number;
  continental: boolean;
  label: string;
  championTitle: TitleId;
  promotesTo: LeagueId | null;
  relegatesTo: LeagueId | null;
}

export const LEAGUES: Record<LeagueId, LeagueDef> = {
  'ar-primera': {
    id: 'ar-primera', country: 'argentina', tier: 1, teams: 30, promote: 0, relegate: 2,
    continental: true, label: 'Liga Profesional', championTitle: 'ar-liga-primera',
    promotesTo: null, relegatesTo: 'ar-nacional',
  },
  'ar-nacional': {
    id: 'ar-nacional', country: 'argentina', tier: 2, teams: 38, promote: 1, relegate: 2,
    continental: false, label: 'Primera Nacional', championTitle: 'ar-liga-nacional',
    promotesTo: 'ar-primera', relegatesTo: 'ar-b',
  },
  'ar-b': {
    id: 'ar-b', country: 'argentina', tier: 3, teams: 20, promote: 1, relegate: 2,
    continental: false, label: 'Primera B', championTitle: 'ar-liga-b',
    promotesTo: 'ar-nacional', relegatesTo: null,
  },
  'uy-primera': {
    id: 'uy-primera', country: 'uruguay', tier: 1, teams: 16, promote: 0, relegate: 1,
    continental: true, label: 'Liga AUF Uruguaya', championTitle: 'uy-liga',
    promotesTo: null, relegatesTo: 'uy-segunda',
  },
  'uy-segunda': {
    id: 'uy-segunda', country: 'uruguay', tier: 2, teams: 13, promote: 3, relegate: 2,
    continental: false, label: 'Segunda División', championTitle: 'uy-segunda-liga',
    promotesTo: 'uy-primera', relegatesTo: null,
  },
  'pe-primera': {
    id: 'pe-primera', country: 'peru', tier: 1, teams: 18, promote: 0, relegate: 1,
    continental: true, label: 'Liga 1', championTitle: 'pe-liga',
    promotesTo: null, relegatesTo: 'pe-segunda',
  },
  'pe-segunda': {
    id: 'pe-segunda', country: 'peru', tier: 2, teams: 16, promote: 2, relegate: 2,
    continental: false, label: 'Liga 2', championTitle: 'pe-segunda-liga',
    promotesTo: 'pe-primera', relegatesTo: null,
  },
  'co-primera': {
    id: 'co-primera', country: 'colombia', tier: 1, teams: 20, promote: 0, relegate: 1,
    continental: true, label: 'Categoría Primera A', championTitle: 'co-liga',
    promotesTo: null, relegatesTo: 'co-segunda',
  },
  'co-segunda': {
    id: 'co-segunda', country: 'colombia', tier: 2, teams: 16, promote: 2, relegate: 2,
    continental: false, label: 'Categoría Primera B', championTitle: 'co-segunda-liga',
    promotesTo: 'co-primera', relegatesTo: null,
  },
  'cl-primera': {
    id: 'cl-primera', country: 'chile', tier: 1, teams: 16, promote: 0, relegate: 1,
    continental: true, label: 'Liga de Primera', championTitle: 'cl-liga',
    promotesTo: null, relegatesTo: 'cl-segunda',
  },
  'cl-segunda': {
    id: 'cl-segunda', country: 'chile', tier: 2, teams: 16, promote: 1, relegate: 1,
    continental: false, label: 'Primera B', championTitle: 'cl-segunda-liga',
    promotesTo: 'cl-primera', relegatesTo: null,
  },
  'py-primera': {
    id: 'py-primera', country: 'paraguay', tier: 1, teams: 12, promote: 0, relegate: 1,
    continental: true, label: 'Copa de Primera', championTitle: 'py-liga',
    promotesTo: null, relegatesTo: 'py-segunda',
  },
  'py-segunda': {
    id: 'py-segunda', country: 'paraguay', tier: 2, teams: 16, promote: 2, relegate: 2,
    continental: false, label: 'División Intermedia', championTitle: 'py-segunda-liga',
    promotesTo: 'py-primera', relegatesTo: null,
  },
  'bo-primera': {
    id: 'bo-primera', country: 'bolivia', tier: 1, teams: 16, promote: 0, relegate: 1,
    continental: true, label: 'División Profesional', championTitle: 'bo-liga',
    promotesTo: null, relegatesTo: 'bo-segunda',
  },
  'bo-segunda': {
    id: 'bo-segunda', country: 'bolivia', tier: 2, teams: 9, promote: 1, relegate: 1,
    continental: false, label: 'Copa Simón Bolívar', championTitle: 'bo-segunda-liga',
    promotesTo: 'bo-primera', relegatesTo: null,
  },
  'ec-primera': {
    id: 'ec-primera', country: 'ecuador', tier: 1, teams: 16, promote: 0, relegate: 1,
    continental: true, label: 'LigaPro Serie A', championTitle: 'ec-liga',
    promotesTo: null, relegatesTo: 'ec-segunda',
  },
  'ec-segunda': {
    id: 'ec-segunda', country: 'ecuador', tier: 2, teams: 12, promote: 2, relegate: 1,
    continental: false, label: 'Serie B', championTitle: 'ec-segunda-liga',
    promotesTo: 'ec-primera', relegatesTo: null,
  },
  've-primera': {
    id: 've-primera', country: 'venezuela', tier: 1, teams: 14, promote: 0, relegate: 1,
    continental: true, label: 'Liga FUTVE', championTitle: 've-liga',
    promotesTo: null, relegatesTo: 've-segunda',
  },
  've-segunda': {
    id: 've-segunda', country: 'venezuela', tier: 2, teams: 12, promote: 1, relegate: 1,
    continental: false, label: 'Liga FUTVE 2', championTitle: 've-segunda-liga',
    promotesTo: 've-primera', relegatesTo: null,
  },
};

export function countryOf(league: LeagueId): Country {
  return LEAGUES[league].country;
}

export const DOMESTIC_CUPS: Record<Country, { title: TitleId; label: string }> = {
  argentina: { title: 'ar-copa', label: 'Copa Argentina' },
  uruguay: { title: 'uy-copa', label: 'Copa AUF Uruguay' },
  peru: { title: 'pe-copa', label: 'Copa de la Liga' },
  colombia: { title: 'co-copa', label: 'Copa BetPlay' },
  chile: { title: 'cl-copa', label: 'Copa Chile' },
  paraguay: { title: 'py-copa', label: 'Copa Paraguay' },
  bolivia: { title: 'bo-copa', label: 'Copa Bolivia' },
  ecuador: { title: 'ec-copa', label: 'Copa Ecuador' },
  venezuela: { title: 've-copa', label: 'Copa Venezuela' },
};

export interface Resources {
  caja: number;
  hinchada: number;
  socios: number;
  plantel: number;
  influencia: number;
}

export const RESOURCE_BOUNDS = {
  hinchada: [0, 100],
  plantel: [0, 100],
  influencia: [0, 100],
  socios: [0, 200],
} as const;

export const DEUDA_INHIBICION = -18;

export const HINCHADA_ASAMBLEA = 8;

export const HINCHADA_ELECCION = 45;

export interface Effects {
  caja?: number;
  hinchada?: number;
  socios?: number;
  plantel?: number;
  influencia?: number;
  flags?: Record<string, number | boolean>;
  flagsSuma?: Record<string, number>;
  deferred?: DeferredEffect[];
}

export interface DeferredEffect {
  inSeasons: number;
  text: string;
  effects: Effects;
}

export interface PendingEffect extends DeferredEffect {
  dueSeason: number;
}

export type EventKind = 'golpe' | 'dilema' | 'color';

export const EVENT_KIND_LABEL: Record<EventKind, string> = {
  golpe: 'GOLPE DURO',
  dilema: 'DECISIÓN DIFÍCIL',
  color: 'PASAN COSAS',
};

export interface Condition {
  minSeason?: number;
  maxSeason?: number;
  league?: LeagueId[];
  country?: Country[];
  minHinchada?: number;
  maxHinchada?: number;
  minCaja?: number;
  maxCaja?: number;
  minInfluencia?: number;
  maxInfluencia?: number;
  minPlantel?: number;
  maxPlantel?: number;
  minSize?: number;
  maxSize?: number;
  flag?: string;
  notFlag?: string;
  minFlag?: Record<string, number>;
}

export interface RandomOutcome {
  weight: number;
  text: string;
  effects: Effects;
}

export interface EventOption {
  label: string;
  hint: string;
  effects?: Effects;
  random?: RandomOutcome[];
  requires?: Condition;
}

export interface GameEvent {
  id: string;
  kind: EventKind;
  title: string;
  text: string;
  options: EventOption[];
  weight?: number;
  requires?: Condition;
  once?: boolean;
}

export type OfferKind = 'compra' | 'venta' | 'libre';

export interface PlayerOffer {
  kind: OfferKind;
  name: string;
  archetype: string;
  age: number;
  plantelDelta: number;
  cost: number;
  hinchadaDelta: number;
  note: string;
  risk: number;
}

export type Frente = 'plantel' | 'dt' | 'hinchada' | 'prensa' | 'gestion';

export interface FrenteDef {
  id: Frente;
  label: string;
  desc: string;
  winPerFicha: number;
  riesgo?: string;
}

export const FRENTES: readonly FrenteDef[] = [
  { id: 'plantel', label: 'Prima al plantel', desc: 'Plata sobre la mesa. Motiva, y se sabe.', winPerFicha: 0.08 },
  { id: 'dt', label: 'Respaldo al DT', desc: 'Salís a bancarlo en público.', winPerFicha: 0.06 },
  { id: 'hinchada', label: 'Operativo tribuna', desc: 'Que la cancha sea un infierno.', winPerFicha: 0.05 },
  { id: 'prensa', label: 'Blindaje de prensa', desc: 'Si se pierde, que no te maten.', winPerFicha: 0.03 },
  {
    id: 'gestion',
    label: 'Gestión política',
    desc: 'Llamadas que no conviene detallar.',
    winPerFicha: 0.12,
    riesgo: 'Puede salir a la luz más adelante',
  },
];

export const FICHAS_MESA_CHICA = 3;

export type Competition = 'liga' | 'copa' | 'continental' | 'playoff';

export interface BigMatch {
  competition: Competition;
  label: string;
  rival: string;
  baseWin: number;
  title: TitleId;
}

export type MesaChicaAssignment = Record<Frente, number>;

export type TitleId =
  | 'ar-liga-primera'
  | 'ar-liga-nacional'
  | 'ar-liga-b'
  | 'uy-liga'
  | 'uy-segunda-liga'
  | 'pe-liga'
  | 'pe-segunda-liga'
  | 'co-liga'
  | 'co-segunda-liga'
  | 'cl-liga'
  | 'cl-segunda-liga'
  | 'py-liga'
  | 'py-segunda-liga'
  | 'bo-liga'
  | 'bo-segunda-liga'
  | 'ec-liga'
  | 'ec-segunda-liga'
  | 've-liga'
  | 've-segunda-liga'
  | 'ar-copa'
  | 'ar-supercopa'
  | 'uy-copa'
  | 'uy-supercopa'
  | 'pe-copa'
  | 'co-copa'
  | 'cl-copa'
  | 'py-copa'
  | 'bo-copa'
  | 'ec-copa'
  | 've-copa'
  | 'libertadores'
  | 'sudamericana'
  | 'ascenso';

export interface TitleDef {
  id: TitleId;
  label: string;
  points: number;
}

export const TITLES: Record<TitleId, TitleDef> = {
  'ar-liga-primera': { id: 'ar-liga-primera', label: 'Liga Profesional', points: 100 },
  'ar-liga-nacional': { id: 'ar-liga-nacional', label: 'Primera Nacional', points: 45 },
  'ar-liga-b': { id: 'ar-liga-b', label: 'Primera B', points: 30 },
  'uy-liga': { id: 'uy-liga', label: 'Liga AUF Uruguaya', points: 100 },
  'uy-segunda-liga': { id: 'uy-segunda-liga', label: 'Segunda División', points: 30 },
  'ar-copa': { id: 'ar-copa', label: 'Copa Argentina', points: 70 },
  'ar-supercopa': { id: 'ar-supercopa', label: 'Supercopa Argentina', points: 40 },
  'uy-copa': { id: 'uy-copa', label: 'Copa AUF Uruguay', points: 70 },
  'uy-supercopa': { id: 'uy-supercopa', label: 'Supercopa Uruguaya', points: 40 },
  'pe-liga': { id: 'pe-liga', label: 'Liga 1', points: 100 },
  'pe-segunda-liga': { id: 'pe-segunda-liga', label: 'Liga 2', points: 30 },
  'pe-copa': { id: 'pe-copa', label: 'Copa de la Liga', points: 70 },
  'co-liga': { id: 'co-liga', label: 'Categoría Primera A', points: 100 },
  'co-segunda-liga': { id: 'co-segunda-liga', label: 'Categoría Primera B', points: 30 },
  'co-copa': { id: 'co-copa', label: 'Copa BetPlay', points: 70 },
  'cl-liga': { id: 'cl-liga', label: 'Liga de Primera', points: 100 },
  'cl-segunda-liga': { id: 'cl-segunda-liga', label: 'Primera B', points: 30 },
  'cl-copa': { id: 'cl-copa', label: 'Copa Chile', points: 70 },
  'py-liga': { id: 'py-liga', label: 'Copa de Primera', points: 100 },
  'py-segunda-liga': { id: 'py-segunda-liga', label: 'División Intermedia', points: 30 },
  'py-copa': { id: 'py-copa', label: 'Copa Paraguay', points: 70 },
  'bo-liga': { id: 'bo-liga', label: 'División Profesional', points: 100 },
  'bo-segunda-liga': { id: 'bo-segunda-liga', label: 'Copa Simón Bolívar', points: 30 },
  'bo-copa': { id: 'bo-copa', label: 'Copa Bolivia', points: 70 },
  'ec-liga': { id: 'ec-liga', label: 'LigaPro Serie A', points: 100 },
  'ec-segunda-liga': { id: 'ec-segunda-liga', label: 'Serie B', points: 30 },
  'ec-copa': { id: 'ec-copa', label: 'Copa Ecuador', points: 70 },
  've-liga': { id: 've-liga', label: 'Liga FUTVE', points: 100 },
  've-segunda-liga': { id: 've-segunda-liga', label: 'Liga FUTVE 2', points: 30 },
  've-copa': { id: 've-copa', label: 'Copa Venezuela', points: 70 },
  libertadores: { id: 'libertadores', label: 'Copa Libertadores', points: 250 },
  sudamericana: { id: 'sudamericana', label: 'Copa Sudamericana', points: 140 },
  ascenso: { id: 'ascenso', label: 'Ascenso', points: 80 },
};

export interface WonTitle {
  id: TitleId;
  season: number;
  year: number;
}

export interface SeasonResult {
  position: number;
  teams: number;
  league: LeagueId;
  champion: boolean;
  promoted: boolean;
  relegated: boolean;
  qualifiedContinental: boolean;
  titles: TitleId[];
  summary: string;
}

export interface SeasonRecord {
  season: number;
  year: number;
  clubId: string;
  league: LeagueId;
  position: number;
  titles: TitleId[];
  hinchada: number;
  caja: number;
}

export interface ElectionResult {
  won: boolean;
  votes: number;
  rival: string;
  summary: string;
}

export type EndingId =
  | 'estatua'
  | 'reelecto-gris'
  | 'derrota-electoral'
  | 'asamblea'
  | 'quiebra'
  | 'descenso-fatal';

export interface Ending {
  id: EndingId;
  title: string;
  text: string;
}

export type Phase =
  | { kind: 'mercado'; offers: PlayerOffer[]; inhibido: boolean }
  | { kind: 'evento'; event: GameEvent; available: number[] }
  | { kind: 'resultado-evento'; text: string; effects: Effects }
  | { kind: 'mesa-chica'; match: BigMatch }
  | { kind: 'resultado-final'; won: boolean; text: string; match: BigMatch }
  | { kind: 'temporada'; result: SeasonResult }
  | { kind: 'eleccion'; result: ElectionResult }
  | { kind: 'fin'; ending: Ending };

export type RunStatus = 'jugando' | 'terminado';

export interface LogEntry {
  season: number;
  text: string;
}

export interface GameState {
  seed: number;
  rng: number;
  clubId: string;
  league: LeagueId;
  modo: Modo;
  season: number;
  year: number;
  mandate: number;
  resources: Resources;
  titles: WonTitle[];
  history: SeasonRecord[];
  flags: Record<string, number | boolean>;
  pending: PendingEffect[];
  usedEvents: string[];
  eventsThisSeason: number;
  bigMatch: BigMatch | null;
  pendingPosition: number | null;
  pendingTitle: TitleId | null;
  phase: Phase;
  status: RunStatus;
  ending: Ending | null;
  log: LogEntry[];
  choices: number[];
  descensos: number;
  ascensos: number;
}

export type Modo = 'corta' | 'normal' | 'larga' | 'llamas';

export const TEMPORADAS_POR_MODO: Record<Modo, number> = {
  corta: 8,
  normal: 16,
  larga: 32,
  llamas: 16,
};

export const MODOS: readonly Modo[] = ['corta', 'normal', 'larga', 'llamas'];

export const SEASONS_PER_MANDATE = 4;
export const EVENTS_PER_SEASON = 3;
export const START_YEAR = 2026;
