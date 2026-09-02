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
import { Rand, seedFromString } from './rng';
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
  LeagueId,
  Modo,
  PlayerOffer,
  Resources,
} from './types';
import {
  EVENTS_PER_SEASON,
  LEAGUES,
  MOVIMIENTOS_POR_VENTANA,
  START_YEAR,
  TEMPORADAS_POR_MODO,
} from './types';

export function initialResources(club: Club): Resources {
  const s = club.size;
  const esperada = expectedPosition(club, club.league);
  return {
    caja: Math.round((s * 0.9 - 2) * 10) / 10,
    hinchada: 55,
    socios: Math.round(s * s * 1.35 * 10) / 10,
    plantel: Math.round(plantelForPosition(esperada, club.league) * 10) / 10,
    influencia: 30,
  };
}

const DEUDA_EN_LLAMAS = -22;

const BONUS_PLANTEL_LLAMAS: Record<LeagueId, number> = {
  'ar-primera': 19, 'ar-nacional': 19, 'ar-b': 19,
  'uy-primera': 14, 'uy-segunda': 19,
  'pe-primera': 17, 'pe-segunda': 19,
  'co-primera': 13, 'co-segunda': 19,
  'cl-primera': 14, 'cl-segunda': 19,
  'py-primera': 13, 'py-segunda': 19,
  'bo-primera': 14, 'bo-segunda': 19,
  'ec-primera': 13, 'ec-segunda': 19,
  've-primera': 13, 've-segunda': 19,
  'br-primera': 3, 'br-segunda': 19,
};

function recibirElClubEnLlamas(club: Club): Resources {
  const base = initialResources(club);
  return {
    ...base,
    caja: DEUDA_EN_LLAMAS,
    plantel: base.plantel + BONUS_PLANTEL_LLAMAS[club.league],
    hinchada: 40,
  };
}

export interface StartOptions {
  seed: number;
  clubId: string;
  modo?: Modo;
}

export function startRun({ seed, clubId, modo = 'normal' }: StartOptions): GameState {
  const club = getClub(clubId);

  const resources = modo === 'llamas' ? recibirElClubEnLlamas(club) : initialResources(club);

  const base: GameState = {
    seed,
    rng: seed,
    clubId,
    league: club.league,
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
    phase: { kind: 'mercado', offers: [], inhibido: false, restantes: 0 },
    status: 'jugando',
    ending: null,
    log: [],
    choices: [],
    descensos: 0,
    ascensos: 0,
  };

  return openMercado(base);
}

export function applyChoice(state: GameState, choice: number): GameState {
  if (state.status === 'terminado') return state;

  const esDecisionReal = optionCount(state) > 1;
  const conElegida: GameState = esDecisionReal
    ? { ...state, choices: [...state.choices, choice] }
    : state;

  switch (conElegida.phase.kind) {
    case 'mercado':
      return resolveMercado(
        conElegida,
        conElegida.phase.offers,
        conElegida.phase.restantes,
        conElegida.phase.inhibido,
        choice,
      );
    case 'evento':
      return resolveEvento(conElegida, conElegida.phase.event, conElegida.phase.available, choice);
    case 'resultado-evento':
      return afterEvento(conElegida);
    case 'mesa-chica':
      return resolveMesa(conElegida, choice);
    case 'resultado-final':
      return openTemporada(conElegida);
    case 'temporada':
      return closeSeason(conElegida, conElegida.phase.result);
    case 'eleccion':
      return afterElection(conElegida, conElegida.phase.result.won);
    case 'fin':
      return conElegida;
  }
}

export function replayRun(
  seed: number,
  clubId: string,
  choices: number[],
  modo: Modo = 'normal',
): GameState {
  let state = startRun({ seed, clubId, modo });
  let indice = 0;

  while (indice < choices.length) {
    if (state.status === 'terminado') break;

    if (optionCount(state) <= 1) {
      state = applyChoice(state, 0);
      continue;
    }

    const choice = choices[indice];
    const max = optionCount(state);
    if (choice < 0 || choice >= max) {
      throw new Error(`Decisión inválida ${choice} en la fase ${state.phase.kind}`);
    }
    state = applyChoice(state, choice);
    indice++;
  }

  return state;
}

export function terminarRun(state: GameState): GameState {
  let actual = state;
  while (actual.status === 'jugando' && optionCount(actual) === 1) {
    actual = applyChoice(actual, 0);
  }
  return actual;
}

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

function conAzar(state: GameState, fn: (rand: Rand) => GameState): GameState {
  const rand = new Rand(state.rng);
  const next = fn(rand);
  return next.rng === rand.s ? next : { ...next, rng: rand.s };
}

function openMercado(state: GameState): GameState {
  return conAzar(state, (rand) => {
    const inhibido = estaInhibido(state.resources);

    const all = generateOffers(
      state.league,
      state.resources.plantel,
      rand,
      state.season,
      state.seed,
    );
    const offers = inhibido ? all.filter((o) => o.kind === 'venta' || o.kind === 'cesion') : all;

    const { state: matured, texts } = maturePending(state);
    const log = texts.map((text) => ({ season: state.season, text }));

    return {
      ...matured,
      log: [...matured.log, ...log],
      eventsThisSeason: 0,
      bigMatch: null,
      pendingPosition: null,
      pendingTitle: null,
      phase: { kind: 'mercado', offers, inhibido, restantes: MOVIMIENTOS_POR_VENTANA },
    };
  });
}

function resolveMercado(
  state: GameState,
  offers: PlayerOffer[],
  restantes: number,
  inhibido: boolean,
  choice: number,
): GameState {
  if (choice >= offers.length) {
    return openEvento(state);
  }

  const offer = offers[choice];

  const conLog = conAzar(state, (rand) => {
    let plantelDelta = offer.plantelDelta;
    let text = '';
    let deferred: Effects['deferred'];

    const sePresta = offer.kind === 'prestamo';
    const seCede = offer.kind === 'cesion';
    const puedeLesionarse = offer.kind === 'compra' || offer.kind === 'libre' || sePresta;

    if (puedeLesionarse && rand.chance(offer.risk)) {
      plantelDelta = Math.round(plantelDelta * 0.35);
      text =
        offer.kind === 'compra'
          ? `${offer.name} llegó y no funcionó: se lesionó en la pretemporada.`
          : sePresta
            ? `${offer.name} llegó a préstamo y no funcionó: se lesionó en la pretemporada.`
            : `${offer.name} llegó gratis y se fue lesionado antes de debutar.`;
    } else if (offer.kind === 'venta') {
      text =
        state.resources.hinchada < 40
          ? `Se vendió a ${offer.name}. La gente, que ya venía caliente, no lo perdonó.`
          : `Se vendió a ${offer.name}. La tribuna se enteró por Twitter.`;
    } else if (seCede) {
      text = `${offer.name} se va a préstamo. Vuelve en un par de temporadas.`;
      deferred = [
        {
          inSeasons: rand.int(1, 2),
          text: `Volvió del préstamo: ${offer.name} está de nuevo a disposición.`,
          effects: { plantel: -offer.plantelDelta },
        },
      ];
    } else if (sePresta) {
      text = `Llegó ${offer.name} a préstamo: ${offer.archetype}.`;
      deferred = [
        {
          inSeasons: rand.int(1, 2),
          text: `Terminó el préstamo de ${offer.name} y volvió a su club.`,
          effects: { plantel: -plantelDelta },
        },
      ];
    } else {
      text =
        offer.kind === 'compra'
          ? `Llegó ${offer.name}, ${offer.archetype}.`
          : `Firmó ${offer.name} a costo cero: ${offer.archetype}.`;
    }

    const effects: Effects = {
      caja: -offer.cost,
      plantel: plantelDelta,
      hinchada: offer.hinchadaDelta,
      ...(deferred ? { deferred } : {}),
    };

    const next = applyEffects(state, effects);
    return { ...next, log: [...next.log, { season: state.season, text }] };
  });

  const ofertasRestantes = offers.filter((_, i) => i !== choice);
  const movimientosRestantes = restantes - 1;

  if (movimientosRestantes <= 0 || ofertasRestantes.length === 0) {
    return openEvento(conLog);
  }

  return {
    ...conLog,
    phase: { kind: 'mercado', offers: ofertasRestantes, inhibido, restantes: movimientosRestantes },
  };
}

export function eligibleEvents(state: GameState, club: Club): GameEvent[] {
  return ALL_EVENTS.filter((event) => {
    if (state.usedEvents.includes(event.id)) return false;
    return meetsCondition(event.requires, state, club.size);
  });
}

function rotacionPorSemilla(seed: number, id: string): number {
  return 0.25 + ((seedFromString(`${seed}:${id}`) % 1000) / 1000) * 1.75;
}

function openEvento(state: GameState): GameState {
  const club = getClub(state.clubId);

  let pool = eligibleEvents(state, club);
  if (pool.length === 0) {
    pool = ALL_EVENTS.filter((e) => meetsCondition(e.requires, state, club.size));
  }
  if (pool.length === 0) {
    return openMesaChicaOrTemporada(state);
  }

  return conAzar(state, (rand) => {
    const event = rand.weighted(pool, (e) => (e.weight ?? 1) * rotacionPorSemilla(state.seed, e.id));
    const available = event.options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => meetsCondition(option.requires, state, club.size))
      .map(({ index }) => index);

    return {
      ...state,
      usedEvents: [...state.usedEvents, event.id],
      eventsThisSeason: state.eventsThisSeason + 1,
      phase: { kind: 'evento', event, available },
    };
  });
}

function resolveEvento(
  state: GameState,
  event: GameEvent,
  available: number[],
  choice: number,
): GameState {
  const optionIndex = available[Math.min(choice, available.length - 1)];
  const option = event.options[optionIndex];

  return conAzar(state, (rand) => {
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

    const next = applyEffects(state, effects);

    return {
      ...next,
      log: [...next.log, { season: state.season, text }],
      phase: { kind: 'resultado-evento', text, effects },
    };
  });
}

function afterEvento(state: GameState): GameState {
  if (state.eventsThisSeason < EVENTS_PER_SEASON) {
    return openEvento(state);
  }
  return openMesaChicaOrTemporada(state);
}

function openMesaChicaOrTemporada(state: GameState): GameState {
  return conAzar(state, (rand) => {
    const club = getClub(state.clubId);

    const position = resolvePosition(state.resources, state.league, rand);
    const bigMatch = rollBigMatch(state, club, position, rand);

    const staged: GameState = { ...state, pendingPosition: position, bigMatch };

    if (!bigMatch) return openTemporada(staged);
    return { ...staged, phase: { kind: 'mesa-chica', match: bigMatch } };
  });
}

function resolveMesa(state: GameState, choice: number): GameState {
  const match = state.bigMatch;
  if (!match) return openTemporada(state);

  const assignments = enumerateAssignments();
  const assignment = assignments[Math.min(choice, assignments.length - 1)];

  return conAzar(state, (rand) => {
    const withCost = applyEffects(state, assignmentCost(assignment));
    const outcome = resolveMesaChica(match, assignment, rand, state.resources.hinchada);
    const next = applyEffects(withCost, outcome.effects);

    return {
      ...next,
      pendingTitle: outcome.won ? match.title : null,
      log: [...next.log, { season: state.season, text: outcome.text }],
      phase: { kind: 'resultado-final', won: outcome.won, text: outcome.text, match },
    };
  });
}

function openTemporada(state: GameState): GameState {
  const club = getClub(state.clubId);
  const position = state.pendingPosition ?? 1;
  const result = buildSeasonResult(state, club, position, state.pendingTitle);

  return { ...state, phase: { kind: 'temporada', result } };
}

function closeSeason(state: GameState, result: import('./types').SeasonResult): GameState {
  const club = getClub(state.clubId);

  const economy = resolveEconomy(state.resources, state.league, result);
  const mood = resolveMood(club, result);

  let next = applyEffects(state, {
    caja: economy.neto,
    hinchada: mood.hinchada + desgasteDelCargo(state.mandate),
    socios: mood.socios,
    plantel: plantelDecay(state.league),
  });

  const titles = result.titles.map((id) => ({ id, season: state.season, year: state.year }));

  const league = result.promoted
    ? promote(state.league)
    : result.relegated
      ? relegate(state.league)
      : state.league;

  next = {
    ...next,
    titles: [...next.titles, ...titles],
    league,
    descensos: next.descensos + (result.relegated ? 1 : 0),
    ascensos: next.ascensos + (result.promoted ? 1 : 0),
    history: [
      ...next.history,
      {
        season: state.season,
        year: state.year,
        clubId: state.clubId,
        league: state.league,
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

  const early = checkEarlyExit(next);
  if (early) return finish(next, early, club);

  if (next.season >= TEMPORADAS_POR_MODO[next.modo]) {
    return finish(next, finalEnding(next), club);
  }

  if (isElectionSeason(next.season, next.modo)) {
    return conAzar(next, (rand) => {
      const election = resolveElection(next, rand);
      return {
        ...next,
        log: [...next.log, { season: next.season, text: election.summary }],
        phase: { kind: 'eleccion', result: election },
      };
    });
  }

  return openMercado(advanceSeason(next));
}

function afterElection(state: GameState, won: boolean): GameState {
  const club = getClub(state.clubId);
  if (!won) return finish(state, 'derrota-electoral', club);

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

function promote(league: GameState['league']): GameState['league'] {
  return LEAGUES[league].promotesTo ?? league;
}

function relegate(league: GameState['league']): GameState['league'] {
  return LEAGUES[league].relegatesTo ?? league;
}
