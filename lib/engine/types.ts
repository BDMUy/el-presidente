export type Category = 'primera' | 'nacional' | 'b';

export interface Club {
  id: string;
  name: string;
  short: string;
  colors: [string, string];
  category: Category;
  size: number;
  nickname?: string;
}

export interface CategoryRules {
  teams: number;
  promote: number;
  relegate: number;
  continental: boolean;
  label: string;
}

export const CATEGORY_RULES: Record<Category, CategoryRules> = {
  primera: { teams: 30, promote: 0, relegate: 2, continental: true, label: 'Liga Profesional' },
  nacional: { teams: 38, promote: 1, relegate: 2, continental: false, label: 'Primera Nacional' },
  b: { teams: 20, promote: 1, relegate: 2, continental: false, label: 'Primera B' },
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
  category?: Category[];
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
  | 'liga-primera'
  | 'liga-nacional'
  | 'liga-b'
  | 'copa-argentina'
  | 'supercopa'
  | 'libertadores'
  | 'sudamericana'
  | 'ascenso';

export interface TitleDef {
  id: TitleId;
  label: string;
  points: number;
}

export const TITLES: Record<TitleId, TitleDef> = {
  'liga-primera': { id: 'liga-primera', label: 'Liga Profesional', points: 100 },
  'liga-nacional': { id: 'liga-nacional', label: 'Primera Nacional', points: 45 },
  'liga-b': { id: 'liga-b', label: 'Primera B', points: 30 },
  'copa-argentina': { id: 'copa-argentina', label: 'Copa Argentina', points: 70 },
  supercopa: { id: 'supercopa', label: 'Supercopa Argentina', points: 40 },
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
  category: Category;
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
  category: Category;
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
  category: Category;
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
