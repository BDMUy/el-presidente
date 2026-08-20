/**
 * El motor. Dos funciones públicas: `startRun` y `applyChoice`.
 *
 * Todo el juego es una máquina de fases donde cada fase expone una lista de
 * opciones y el jugador elige un índice. Por eso una partida entera se
 * describe con `{ seed, clubId, choices: number[] }`, y por eso el servidor
 * puede reproducirla exactamente para verificar el puntaje.
 *
 * Invariante: `applyChoice` es pura. No lee reloj, no lee Math.random, no
 * toca nada fuera del estado que recibe.
 */

import { getClub } from '@/content/clubs';
import { ALL_EVENTS } from '@/content/events';
import { applyEffects, estaInhibido, maturePending, meetsCondition } from './effects';
import {
  buildEnding,
  checkEarlyExit,
  finalEnding,
  isElectionSeason,
  resolveElection,
} from './election';
import { assignmentCost, enumerateAssignments, resolveMesaChica } from './mesa-chica';
import { generateOffers } from './mercado';
import { Rand } from './rng';
import {
  buildSeasonResult,
  expectedPosition,
  plantelDecay,
  plantelForPosition,
  desgasteDelCargo,
  resolveEconomy,
  resolveMood,
  resolvePosition,
  rollBigMatch,
} from './season';
import type {
  Club,
  Effects,
  GameEvent,
  GameState,
  Modo,
  PlayerOffer,
  Resources,
} from './types';
import {
  EVENTS_PER_SEASON,
  START_YEAR,
  TEMPORADAS_POR_MODO,
} from './types';


// ─────────────────────────────────────────────────────────────
// Arranque
// ─────────────────────────────────────────────────────────────

/**
 * Recursos iniciales derivados del peso institucional del club.
 *
 * El plantel no se estima: se deriva de la posición que se espera del club,
 * así que cada presidencia arranca exactamente en la expectativa de su gente.
 * Todo lo que pase después es mérito o culpa tuya.
 */
export function initialResources(club: Club): Resources {
  const s = club.size;
  const esperada = expectedPosition(club, club.category);
  return {
    caja: Math.round((s * 0.9 - 2) * 10) / 10,
    hinchada: 55,
    socios: Math.round(s * s * 1.35 * 10) / 10,
    plantel: Math.round(plantelForPosition(esperada, club.category) * 10) / 10,
    influencia: 30,
  };
}

/**
 * La deuda con la que arranca una partida en llamas, para todos los clubes.
 *
 * Es **el** número que fija la dificultad del modo, y eso se midió en vez de
 * suponerlo. Barriendo el valor con la política `greedy` de `simulate`:
 *
 * | deuda | completan | quiebran | estatua |
 * |-------|-----------|----------|---------|
 * | −18   | 21,4%     |  7,2%    | 4,3%    |
 * | −22   | 16,0%     | 17,6%    | 3,8%    |
 * | −26   | 11,6%     | 33,6%    | 3,2%    |
 * | −30   |  7,7%     | 52,6%    | 2,6%    |
 *
 * A −30 la quiebra se lleva más de la mitad de las partidas y el modo pasa a
 * ser un solo problema —administrar deuda— con el resto del juego de adorno.
 * A −22 la forma de irte más común sigue siendo perder la elección (41%) y la
 * quiebra es una de varias (18%), que es lo que se quería: difícil por muchos
 * lados y no por uno.
 *
 * La contracara de la misma medición: **la hinchada inicial casi no mueve la
 * aguja**. Con 40, 44 o 48 el porcentaje que completa da 16,0%, 16,0% y 17,3%,
 * porque un jugador que lee recupera hinchada rápido. Los cuarenta quedaron
 * igual, pero por lo que cuentan y no por lo que pesan: arrancar cinco puntos
 * abajo de los cuarenta y cinco que pide la elección es la premisa del modo.
 */
const DEUDA_EN_LLAMAS = -22;

/**
 * El club en llamas: cómo arranca la partida ultra difícil.
 *
 * Tres cosas al mismo tiempo, y las tres importan:
 *
 * - **Veintidós millones de deuda.** El club queda inhibido desde el primer
 *   día —la inhibición es a los dieciocho— así que la ventana de pases arranca
 *   cerrada para comprar y abierta solo para vender.
 * - **Un plantel doce puntos mejor del que le corresponde al club.** No es un
 *   regalo: es la trampa. Es lo único que tenés para vender, y venderlo es lo
 *   único que apaga el incendio. Los mismos jugadores que te pueden salvar la
 *   campaña son la plata que te salva del concurso.
 * - **La hinchada en cuarenta.** Cinco puntos por debajo de los cuarenta y
 *   cinco que se necesitan para ganar la elección. O sea: empezás perdiendo,
 *   y tenés cuatro temporadas hasta la primera votación para dar vuelta algo
 *   que todavía no hiciste.
 *
 * La deuda **se fija, no se resta**, y esa es la corrección de cómo lo hacía
 * la rareza que esto reemplaza. Restando veintidós a la caja de cada club, los
 * diez más grandes quedaban entre −15 y −18: por encima de la línea de
 * inhibición, o sea con el mercado abierto. Los otros cincuenta y cuatro
 * quedaban debajo. El mismo modo significaba dos cosas distintas según el club
 * que eligieras, y justo los clubes grandes —los que más se eligen— eran los
 * que lo jugaban en fácil. Un número fijo hace que "en llamas" quiera decir lo
 * mismo con River que con Acassuso.
 *
 * El plantel sí sigue siendo relativo, y ahí está bien: "mejor del que
 * merecés" solo se puede medir contra lo que le corresponde a cada club.
 */
function recibirElClubEnLlamas(club: Club): Resources {
  const base = initialResources(club);
  return { ...base, caja: DEUDA_EN_LLAMAS, plantel: base.plantel + 12, hinchada: 40 };
}

export interface StartOptions {
  seed: number;
  clubId: string;
  /** Cómo es la partida. Por defecto la normal, que es la de siempre. */
  modo?: Modo;
}

export function startRun({ seed, clubId, modo = 'normal' }: StartOptions): GameState {
  const club = getClub(clubId);
  const rand = new Rand(seed);

  const resources = modo === 'llamas' ? recibirElClubEnLlamas(club) : initialResources(club);

  const base: GameState = {
    seed,
    rng: rand.s,
    clubId,
    category: club.category,
    modo,
    season: 1,
    year: START_YEAR,
    mandate: 1,
    resources,
    titles: [],
    history: [],
    flags: {},
    pending: [],
    usedEvents: [],
    eventsThisSeason: 0,
    bigMatch: null,
    pendingPosition: null,
    pendingTitle: null,
    phase: { kind: 'mercado', offers: [], inhibido: false },
    status: 'jugando',
    ending: null,
    log: [],
    choices: [],
    descensos: 0,
    ascensos: 0,
  };

  return openMercado(base);
}

// ─────────────────────────────────────────────────────────────
// Transición principal
// ─────────────────────────────────────────────────────────────

/**
 * Avanza el juego aplicando la opción `choice` de la fase actual.
 * `choice` es el índice dentro de la lista que la fase mostró al jugador.
 */
export function applyChoice(state: GameState, choice: number): GameState {
  if (state.status === 'terminado') return state;

  const withChoice: GameState = { ...state, choices: [...state.choices, choice] };

  switch (state.phase.kind) {
    case 'mercado':
      return resolveMercado(withChoice, state.phase.offers, choice);
    case 'evento':
      return resolveEvento(withChoice, state.phase.event, state.phase.available, choice);
    case 'resultado-evento':
      return afterEvento(withChoice);
    case 'mesa-chica':
      return resolveMesa(withChoice, choice);
    case 'resultado-final':
      return openTemporada(withChoice);
    case 'temporada':
      return closeSeason(withChoice, state.phase.result);
    case 'eleccion':
      return afterElection(withChoice, state.phase.result.won);
    case 'fin':
      return state;
  }
}

/**
 * Reproduce una partida entera desde la semilla y el log de decisiones.
 *
 * Es la pieza que hace verificable el ranking: el cliente manda decisiones, no
 * puntajes, y el servidor corre exactamente esta función para saber si el
 * puntaje declarado es real.
 */
export function replayRun(
  seed: number,
  clubId: string,
  choices: number[],
  modo: Modo = 'normal',
): GameState {
  let state = startRun({ seed, clubId, modo });
  for (const choice of choices) {
    if (state.status === 'terminado') break;
    const max = optionCount(state);
    if (max === 0) break;
    if (choice < 0 || choice >= max) {
      throw new Error(`Decisión inválida ${choice} en la fase ${state.phase.kind}`);
    }
    state = applyChoice(state, choice);
  }
  return state;
}

/** Cuántas opciones ofrece la fase actual. Sirve para validar y para simular. */
export function optionCount(state: GameState): number {
  switch (state.phase.kind) {
    case 'mercado':
      return state.phase.offers.length + 1;
    case 'evento':
      return state.phase.available.length;
    case 'mesa-chica':
      return enumerateAssignments().length;
    case 'fin':
      return 0;
    default:
      return 1;
  }
}

// ─────────────────────────────────────────────────────────────
// Mercado de pases
// ─────────────────────────────────────────────────────────────

function openMercado(state: GameState): GameState {
  const rand = new Rand(state.rng);
  const inhibido = estaInhibido(state.resources);

  const all = generateOffers(
    state.category,
    state.resources.plantel,
    rand,
    state.season,
    state.seed,
  );
  // Inhibido por deuda: solo podés vender. Es el castigo real de endeudarse.
  const offers = inhibido ? all.filter((o) => o.kind === 'venta') : all;

  const { state: matured, texts } = maturePending({ ...state, rng: rand.s });
  const log = texts.map((text) => ({ season: state.season, text }));

  return {
    ...matured,
    log: [...matured.log, ...log],
    eventsThisSeason: 0,
    bigMatch: null,
    pendingPosition: null,
    pendingTitle: null,
    phase: { kind: 'mercado', offers, inhibido },
  };
}

function resolveMercado(state: GameState, offers: PlayerOffer[], choice: number): GameState {
  // La última opción siempre es aguantar el plantel como está.
  if (choice >= offers.length) {
    return openEvento(state);
  }

  const offer = offers[choice];
  const rand = new Rand(state.rng);

  let plantelDelta = offer.plantelDelta;
  let text = '';

  if (offer.kind !== 'venta' && rand.chance(offer.risk)) {
    plantelDelta = Math.round(plantelDelta * 0.35);
    text = `${offer.name} llegó y no funcionó: se lesionó en la pretemporada.`;
  } else if (offer.kind === 'venta') {
    text = `Se vendió a ${offer.name}. La tribuna se enteró por Twitter.`;
  } else {
    text = `Llegó ${offer.name}, ${offer.archetype}.`;
  }

  const effects: Effects = {
    caja: -offer.cost,
    plantel: plantelDelta,
    hinchada: offer.hinchadaDelta,
  };

  const next = applyEffects({ ...state, rng: rand.s }, effects);
  return openEvento({ ...next, log: [...next.log, { season: state.season, text }] });
}

// ─────────────────────────────────────────────────────────────
// Eventos
// ─────────────────────────────────────────────────────────────

/** Eventos que pueden salir ahora mismo, según condiciones y repeticiones. */
export function eligibleEvents(state: GameState, club: Club): GameEvent[] {
  return ALL_EVENTS.filter((event) => {
    if (event.once && state.usedEvents.includes(event.id)) return false;
    if (state.usedEvents.includes(event.id)) return false;
    return meetsCondition(event.requires, state, club.size);
  });
}

function openEvento(state: GameState): GameState {
  const club = getClub(state.clubId);
  const rand = new Rand(state.rng);

  let pool = eligibleEvents(state, club);
  // Si se agotó el catálogo, se permite repetir para no trabar la partida.
  if (pool.length === 0) {
    pool = ALL_EVENTS.filter((e) => meetsCondition(e.requires, state, club.size));
  }
  if (pool.length === 0) {
    return openMesaChicaOrTemporada({ ...state, rng: rand.s });
  }

  const event = rand.weighted(pool, (e) => e.weight ?? 1);
  const available = event.options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => meetsCondition(option.requires, state, club.size))
    .map(({ index }) => index);

  return {
    ...state,
    rng: rand.s,
    usedEvents: [...state.usedEvents, event.id],
    eventsThisSeason: state.eventsThisSeason + 1,
    phase: { kind: 'evento', event, available },
  };
}

function resolveEvento(
  state: GameState,
  event: GameEvent,
  available: number[],
  choice: number,
): GameState {
  const optionIndex = available[Math.min(choice, available.length - 1)];
  const option = event.options[optionIndex];
  const rand = new Rand(state.rng);

  let effects: Effects;
  let text: string;

  if (option.random && option.random.length > 0) {
    const outcome = rand.weighted(option.random, (o) => o.weight);
    effects = outcome.effects;
    text = outcome.text;
  } else {
    effects = option.effects ?? {};
    text = option.hint;
  }

  const next = applyEffects({ ...state, rng: rand.s }, effects);

  return {
    ...next,
    log: [...next.log, { season: state.season, text }],
    phase: { kind: 'resultado-evento', text, effects },
  };
}

function afterEvento(state: GameState): GameState {
  if (state.eventsThisSeason < EVENTS_PER_SEASON) {
    return openEvento(state);
  }
  return openMesaChicaOrTemporada(state);
}

// ─────────────────────────────────────────────────────────────
// La Mesa Chica y el cierre de temporada
// ─────────────────────────────────────────────────────────────

/**
 * Se resuelve la tabla en silencio y recién ahí se decide si hay partido
 * grande. Así el playoff de ascenso puede depender de la posición, y la Mesa
 * Chica queda donde tiene que estar: justo antes del resumen del año.
 */
function openMesaChicaOrTemporada(state: GameState): GameState {
  const rand = new Rand(state.rng);
  const club = getClub(state.clubId);

  const position = resolvePosition(state.resources, state.category, rand);
  const bigMatch = rollBigMatch(state, club, position, rand);

  const staged: GameState = { ...state, rng: rand.s, pendingPosition: position, bigMatch };

  if (!bigMatch) return openTemporada(staged);
  return { ...staged, phase: { kind: 'mesa-chica', match: bigMatch } };
}

function resolveMesa(state: GameState, choice: number): GameState {
  const match = state.bigMatch;
  if (!match) return openTemporada(state);

  const assignments = enumerateAssignments();
  const assignment = assignments[Math.min(choice, assignments.length - 1)];

  // Un solo Rand para toda la transición: se le pasa a resolveMesaChica, que
  // lo consume, y al final se guarda el cursor de vuelta en el estado.
  const rand = new Rand(state.rng);
  const withCost = applyEffects(state, assignmentCost(assignment));
  const outcome = resolveMesaChica(match, assignment, rand);
  const next = applyEffects({ ...withCost, rng: rand.s }, outcome.effects);

  return {
    ...next,
    pendingTitle: outcome.won ? match.title : null,
    log: [...next.log, { season: state.season, text: outcome.text }],
    phase: { kind: 'resultado-final', won: outcome.won, text: outcome.text, match },
  };
}

function openTemporada(state: GameState): GameState {
  const club = getClub(state.clubId);
  const position = state.pendingPosition ?? 1;
  const result = buildSeasonResult(state, club, position, state.pendingTitle);

  return { ...state, phase: { kind: 'temporada', result } };
}

function closeSeason(state: GameState, result: import('./types').SeasonResult): GameState {
  const club = getClub(state.clubId);
  const rand = new Rand(state.rng);

  const economy = resolveEconomy(state.resources, state.category, result);
  const mood = resolveMood(club, result);

  let next = applyEffects({ ...state, rng: rand.s }, {
    caja: economy.neto,
    // Al humor de la temporada se le suma el desgaste de seguir en el cargo.
    hinchada: mood.hinchada + desgasteDelCargo(state.mandate),
    socios: mood.socios,
    plantel: plantelDecay(state.category),
  });

  const titles = result.titles.map((id) => ({ id, season: state.season, year: state.year }));

  const category = result.promoted
    ? promote(state.category)
    : result.relegated
      ? relegate(state.category)
      : state.category;

  next = {
    ...next,
    titles: [...next.titles, ...titles],
    category,
    descensos: next.descensos + (result.relegated ? 1 : 0),
    ascensos: next.ascensos + (result.promoted ? 1 : 0),
    history: [
      ...next.history,
      {
        season: state.season,
        year: state.year,
        clubId: state.clubId,
        category: state.category,
        position: result.position,
        titles: result.titles,
        hinchada: Math.round(next.resources.hinchada),
        caja: next.resources.caja,
      },
    ],
    flags: {
      ...next.flags,
      continental: result.qualifiedContinental,
      libertadores: result.champion || result.position <= 2,
    },
    log: [...next.log, { season: state.season, text: result.summary }],
  };

  // ¿Se cae la presidencia antes de tiempo?
  const early = checkEarlyExit(next);
  if (early) return finish(next, early, club);

  // ¿Se cumplió el mandato completo del modo elegido?
  if (next.season >= TEMPORADAS_POR_MODO[next.modo]) {
    return finish(next, finalEnding(next), club);
  }

  // ¿Toca votar?
  if (isElectionSeason(next.season, next.modo)) {
    const election = resolveElection(next, rand);
    return {
      ...next,
      rng: rand.s,
      log: [...next.log, { season: next.season, text: election.summary }],
      phase: { kind: 'eleccion', result: election },
    };
  }

  return openMercado(advanceSeason(next));
}

function afterElection(state: GameState, won: boolean): GameState {
  const club = getClub(state.clubId);
  if (!won) return finish(state, 'derrota-electoral', club);

  // Ganar la elección renueva el capital político.
  const renewed = applyEffects(state, { influencia: 12, hinchada: 3 });
  return openMercado(advanceSeason({ ...renewed, mandate: renewed.mandate + 1 }));
}

function advanceSeason(state: GameState): GameState {
  return { ...state, season: state.season + 1, year: state.year + 1 };
}

function finish(state: GameState, endingId: import('./types').EndingId, club: Club): GameState {
  const ending = buildEnding(endingId, state, club);
  return {
    ...state,
    status: 'terminado',
    ending,
    phase: { kind: 'fin', ending },
  };
}

function promote(category: GameState['category']): GameState['category'] {
  return category === 'b' ? 'nacional' : 'primera';
}

function relegate(category: GameState['category']): GameState['category'] {
  return category === 'primera' ? 'nacional' : 'b';
}
