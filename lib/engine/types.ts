/**
 * Tipos del motor. No importa nada de React ni del DOM: este archivo y sus
 * hermanos en lib/engine/ corren igual en el navegador, en Node y en el
 * servidor que verifica los puntajes.
 */

// ─────────────────────────────────────────────────────────────
// Clubes y categorías
// ─────────────────────────────────────────────────────────────

export type Category = 'primera' | 'nacional' | 'b';

export interface Club {
  id: string;
  /** Nombre real del club. Solo el nombre: sin escudo, sin fotos. */
  name: string;
  /** Versión corta para el HUD. */
  short: string;
  /** Dos colores para la identidad visual, en hex. */
  colors: [string, string];
  category: Category;
  /**
   * Peso institucional, 1 a 10. Un 10 es un grande histórico. Afecta
   * presupuesto, socios, presión de la hinchada y calidad del plantel inicial.
   */
  size: number;
  /** Apodo, para los textos narrativos. */
  nickname?: string;
}

export interface CategoryRules {
  teams: number;
  /** Cuántos ascienden directo. */
  promote: number;
  /** Cuántos descienden. */
  relegate: number;
  /** Si da acceso a copas continentales. */
  continental: boolean;
  label: string;
}

export const CATEGORY_RULES: Record<Category, CategoryRules> = {
  primera: { teams: 30, promote: 0, relegate: 2, continental: true, label: 'Liga Profesional' },
  nacional: { teams: 38, promote: 1, relegate: 2, continental: false, label: 'Primera Nacional' },
  b: { teams: 20, promote: 1, relegate: 2, continental: false, label: 'Primera B' },
};

// ─────────────────────────────────────────────────────────────
// Recursos
// ─────────────────────────────────────────────────────────────

/**
 * Los cinco recursos son todo el balance del juego. Caja puede ir a negativo
 * (eso es deuda); el resto está acotado.
 */
export interface Resources {
  /** Millones de dólares. Negativo = deuda. */
  caja: number;
  /** 0-100. Es tu vida: define si te reeligen. */
  hinchada: number;
  /** Miles de socios. Ingreso recurrente. */
  socios: number;
  /** 0-100. Define los resultados deportivos. */
  plantel: number;
  /** 0-100. Capital político: blindaje, asambleas, gestiones turbias. */
  influencia: number;
}

export const RESOURCE_BOUNDS = {
  hinchada: [0, 100],
  plantel: [0, 100],
  influencia: [0, 100],
  socios: [0, 200],
} as const;

/** Pasada esta deuda, el club queda inhibido y no puede fichar. */
export const DEUDA_INHIBICION = -18;

/** Con la hinchada en este piso, cae la asamblea y se termina la presidencia. */
export const HINCHADA_ASAMBLEA = 8;

/** Hinchada mínima para ganar una reelección. */
export const HINCHADA_ELECCION = 45;

// ─────────────────────────────────────────────────────────────
// Efectos (el lenguaje que habla el contenido)
// ─────────────────────────────────────────────────────────────

/** Cambios sobre los recursos. Todos los campos son deltas, no valores. */
export interface Effects {
  caja?: number;
  hinchada?: number;
  socios?: number;
  plantel?: number;
  influencia?: number;
  /** Marcas que otros eventos pueden consultar con `requires`. */
  flags?: Record<string, number | boolean>;
  /** Efectos que recién se aplican N temporadas después. */
  deferred?: DeferredEffect[];
}

export interface DeferredEffect {
  /** En cuántas temporadas madura. */
  inSeasons: number;
  /** Texto que se muestra cuando finalmente ocurre. */
  text: string;
  effects: Effects;
}

/** Efecto diferido ya agendado, con la temporada exacta en la que cae. */
export interface PendingEffect extends DeferredEffect {
  dueSeason: number;
}

// ─────────────────────────────────────────────────────────────
// Contenido: eventos
// ─────────────────────────────────────────────────────────────

export type EventKind = 'golpe' | 'dilema' | 'color';

export const EVENT_KIND_LABEL: Record<EventKind, string> = {
  golpe: 'GOLPE DURO',
  dilema: 'DECISIÓN DIFÍCIL',
  color: 'PASAN COSAS',
};

/** Condiciones de aparición. Todos los campos son opcionales y se suman con AND. */
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
  /** Requiere que esta flag esté seteada y sea verdadera. */
  flag?: string;
  /** Requiere que esta flag NO esté seteada. */
  notFlag?: string;
}

/** Una rama azarosa de una opción: el 🎲 de las cartas. */
export interface RandomOutcome {
  weight: number;
  text: string;
  effects: Effects;
}

export interface EventOption {
  label: string;
  /** La consecuencia que el jugador ve antes de elegir. */
  hint: string;
  effects?: Effects;
  /** Si está, la opción es un 🎲 y se resuelve por sorteo ponderado. */
  random?: RandomOutcome[];
  /** Si no se cumple, la opción no se ofrece. */
  requires?: Condition;
}

export interface GameEvent {
  id: string;
  kind: EventKind;
  title: string;
  text: string;
  options: EventOption[];
  /** Peso relativo en el sorteo. Por defecto 1. */
  weight?: number;
  requires?: Condition;
  /** Si es true, no puede repetirse en la misma partida. */
  once?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Mercado de pases
// ─────────────────────────────────────────────────────────────

export type OfferKind = 'compra' | 'venta' | 'libre';

export interface PlayerOffer {
  kind: OfferKind;
  name: string;
  /** Arquetipo narrativo: "9 de área", "pibe del club", "veterano de retorno". */
  archetype: string;
  age: number;
  /** Cuánto suma (compra) o resta (venta) al plantel. */
  plantelDelta: number;
  /** Costo en millones. Negativo en una venta (entra plata). */
  cost: number;
  /** Impacto en la hinchada. Vender un ídolo duele. */
  hinchadaDelta: number;
  /** Texto corto de sabor. */
  note: string;
  /** Riesgo de que salga mal (lesión, no adaptación). 0-1. */
  risk: number;
}

// ─────────────────────────────────────────────────────────────
// La Mesa Chica
// ─────────────────────────────────────────────────────────────

export type Frente = 'plantel' | 'dt' | 'hinchada' | 'prensa' | 'gestion';

export interface FrenteDef {
  id: Frente;
  label: string;
  desc: string;
  /** Cuánta probabilidad de ganar suma cada ficha. */
  winPerFicha: number;
  /**
   * Advertencia visible cuando el frente arrastra una consecuencia diferida.
   *
   * El riesgo se muestra a propósito: un dilema es más fuerte cuando sabés lo
   * que estás arriesgando y lo hacés igual. Escondido sería una trampa, y el
   * jugador se enteraría recién dos temporadas después, sin poder atarlo a
   * esta decisión.
   */
  riesgo?: string;
}

/**
 * Los cinco frentes donde podés repartir las tres fichas de influencia.
 *
 * `gestion` es deliberadamente el más eficaz: la opción más sucia tiene que
 * ser también la más tentadora, o el dilema no existe.
 *
 * ATENCIÓN: el orden de este array define los índices de reparto que viajan en
 * el log de la partida y en los links compartidos. Reordenarlo rompe todas las
 * partidas guardadas y todos los links que ya circulan. Para cambiar el orden
 * en pantalla existe un orden de presentación aparte en la UI.
 */
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
  /** Nombre completo del partido: "Final de la Copa Argentina". */
  label: string;
  rival: string;
  /** Probabilidad base de ganar, antes de las fichas. */
  baseWin: number;
  /** Qué título otorga si se gana. */
  title: TitleId;
}

/** Reparto de fichas elegido por el jugador. */
export type MesaChicaAssignment = Record<Frente, number>;

// ─────────────────────────────────────────────────────────────
// Títulos y resultados
// ─────────────────────────────────────────────────────────────

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
  /** Peso en el puntaje final. */
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
  /** Clasificó a copa continental para la temporada siguiente. */
  qualifiedContinental: boolean;
  titles: TitleId[];
  /** Resumen narrativo de la temporada. */
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

// ─────────────────────────────────────────────────────────────
// Elecciones y finales
// ─────────────────────────────────────────────────────────────

export interface ElectionResult {
  won: boolean;
  /** Porcentaje de votos obtenido. */
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

// ─────────────────────────────────────────────────────────────
// Fases y estado
// ─────────────────────────────────────────────────────────────

/**
 * Cada fase expone las opciones que el jugador puede elegir. El log de la
 * partida es simplemente la lista de índices elegidos, lo que hace que
 * reproducir una partida en el servidor sea trivial.
 */
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
  /** Semilla de la partida. Con esto y el log se reproduce todo. */
  seed: number;
  /** Cursor del PRNG. */
  rng: number;
  clubId: string;
  category: Category;
  /** 1 a TOTAL_SEASONS. */
  season: number;
  year: number;
  /** 1 a 4. */
  mandate: number;
  resources: Resources;
  titles: WonTitle[];
  history: SeasonRecord[];
  flags: Record<string, number | boolean>;
  pending: PendingEffect[];
  /** IDs de eventos `once` ya usados. */
  usedEvents: string[];
  /** Cuántos eventos van en la temporada actual. */
  eventsThisSeason: number;
  /** Partido grande pendiente de esta temporada, si lo hay. */
  bigMatch: BigMatch | null;
  /**
   * Posición en la tabla ya calculada pero todavía no revelada: se resuelve
   * antes de la Mesa Chica para saber si hay playoff, y se muestra después.
   */
  pendingPosition: number | null;
  /** Título ganado en el partido grande, pendiente de sumar al resultado. */
  pendingTitle: TitleId | null;
  phase: Phase;
  status: RunStatus;
  ending: Ending | null;
  log: LogEntry[];
  /** Decisiones tomadas, en orden. Es lo que se manda al servidor. */
  choices: number[];
  descensos: number;
  ascensos: number;
  /** Rareza 1/500. */
  rare: boolean;
}

export const TOTAL_SEASONS = 16;
export const SEASONS_PER_MANDATE = 4;
export const EVENTS_PER_SEASON = 3;
export const START_YEAR = 2026;
