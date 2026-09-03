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
  TitleId,
} from './types';
import {
  countryOf,
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
  'ar-primera': 20, 'ar-nacional': 20, 'ar-b': 20,
  'uy-primera': 15, 'uy-segunda': 20,
  'pe-primera': 18, 'pe-segunda': 20,
  'co-primera': 14, 'co-segunda': 20,
  'cl-primera': 15, 'cl-segunda': 20,
  'py-primera': 14, 'py-segunda': 20,
  'bo-primera': 15, 'bo-segunda': 20,
  'ec-primera': 14, 'ec-segunda': 20,
  've-primera': 14, 've-segunda': 20,
  'br-primera': 4, 'br-segunda': 20,
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
    bolsaEventos: [],
    phase: { kind: 'mercado', offers: [], inhibido: false, restantes: 0 },
    status: 'jugando',
    ending: null,
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
      return openTemporada(conElegida, conElegida.phase.position, conElegida.phase.title);
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

    return {
      ...maturePending(state),
      eventsThisSeason: 0,
      bolsaEventos: [],
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

  const conMovimiento = conAzar(state, (rand) => {
    let plantelDelta = offer.plantelDelta;
    let deferred: Effects['deferred'];

    const sePresta = offer.kind === 'prestamo';
    const seCede = offer.kind === 'cesion';
    const puedeLesionarse = offer.kind === 'compra' || offer.kind === 'libre' || sePresta;

    if (puedeLesionarse && rand.chance(offer.risk)) {
      plantelDelta = Math.round(plantelDelta * 0.35);
    } else if (seCede) {
      deferred = [
        {
          inSeasons: rand.int(1, 2),
          text: `Volvió del préstamo: ${offer.name} está de nuevo a disposición.`,
          effects: { plantel: -offer.plantelDelta },
        },
      ];
    } else if (sePresta) {
      deferred = [
        {
          inSeasons: rand.int(1, 2),
          text: `Terminó el préstamo de ${offer.name} y volvió a su club.`,
          effects: { plantel: -plantelDelta },
        },
      ];
    }

    const effects: Effects = {
      caja: -offer.cost,
      plantel: plantelDelta,
      hinchada: offer.hinchadaDelta,
      ...(deferred ? { deferred } : {}),
    };

    return applyEffects(state, effects);
  });

  const ofertasRestantes = offers.filter((_, i) => i !== choice);
  const movimientosRestantes = restantes - 1;

  if (movimientosRestantes <= 0 || ofertasRestantes.length === 0) {
    return openEvento(conMovimiento);
  }

  return {
    ...conMovimiento,
    phase: { kind: 'mercado', offers: ofertasRestantes, inhibido, restantes: movimientosRestantes },
  };
}

let eventosPorLigaCache: Map<LeagueId, GameEvent[]> | undefined;

function construirEventosPorLiga(): Map<LeagueId, GameEvent[]> {
  const index = new Map<LeagueId, GameEvent[]>();
  for (const league of Object.keys(LEAGUES) as LeagueId[]) {
    const country = countryOf(league);
    index.set(
      league,
      ALL_EVENTS.filter(({ requires }) => {
        if (!requires) return true;
        if (requires.league && !requires.league.includes(league)) return false;
        if (requires.country && !requires.country.includes(country)) return false;
        return true;
      }),
    );
  }
  return index;
}

function eventosPorLiga(league: LeagueId): GameEvent[] {
  eventosPorLigaCache ??= construirEventosPorLiga();
  return eventosPorLigaCache.get(league) ?? ALL_EVENTS;
}

export function eligibleEvents(state: GameState, club: Club): GameEvent[] {
  return eventosPorLiga(state.league).filter((event) => {
    if (state.usedEvents.includes(event.id)) return false;
    return meetsCondition(event.requires, state, club.size);
  });
}

function rotacionPorSemilla(seed: number, id: string): number {
  return 0.25 + ((seedFromString(`${seed}:${id}`) % 1000) / 1000) * 1.75;
}

function pesoDeEvento(seed: number, e: GameEvent): number {
  return (e.weight ?? 1) * rotacionPorSemilla(seed, e.id);
}

function muestrearBolsa(pool: GameEvent[], seed: number, rand: Rand): string[] {
  const restante = pool.slice();
  const salida: string[] = [];
  for (let i = 0; i < EVENTS_PER_SEASON && restante.length > 0; i++) {
    const elegido = rand.weighted(restante, (e) => pesoDeEvento(seed, e));
    salida.push(elegido.id);
    restante.splice(restante.indexOf(elegido), 1);
  }
  return salida;
}

function openEvento(state: GameState): GameState {
  const club = getClub(state.clubId);

  let pool = eligibleEvents(state, club);
  if (pool.length === 0) {
    pool = eventosPorLiga(state.league).filter((e) => meetsCondition(e.requires, state, club.size));
  }
  if (pool.length === 0) {
    return openMesaChicaOrTemporada(state);
  }

  return conAzar(state, (rand) => {
    const bolsa =
      state.eventsThisSeason === 0 ? muestrearBolsa(pool, state.seed, rand) : state.bolsaEventos;

    const idBolsa = bolsa[state.eventsThisSeason];
    const deLaBolsa =
      idBolsa && !state.usedEvents.includes(idBolsa)
        ? pool.find((e) => e.id === idBolsa)
        : undefined;
    const event = deLaBolsa ?? rand.weighted(pool, (e) => pesoDeEvento(state.seed, e));

    const available = event.options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => meetsCondition(option.requires, state, club.size))
      .map(({ index }) => index);

    return {
      ...state,
      bolsaEventos: bolsa,
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

    if (!bigMatch) return openTemporada(state, position, null);
    return { ...state, phase: { kind: 'mesa-chica', match: bigMatch, position } };
  });
}

function resolveMesa(state: GameState, choice: number): GameState {
  if (state.phase.kind !== 'mesa-chica') return state;
  const { match, position } = state.phase;

  const assignments = enumerateAssignments();
  const assignment = assignments[Math.min(choice, assignments.length - 1)];

  return conAzar(state, (rand) => {
    const withCost = applyEffects(state, assignmentCost(assignment));
    const outcome = resolveMesaChica(match, assignment, rand, state.resources.hinchada);
    const next = applyEffects(withCost, outcome.effects);

    return {
      ...next,
      phase: {
        kind: 'resultado-final',
        won: outcome.won,
        text: outcome.text,
        match,
        position,
        title: outcome.won ? match.title : null,
      },
    };
  });
}

function openTemporada(state: GameState, position: number, pendingTitle: TitleId | null): GameState {
  const club = getClub(state.clubId);
  const result = buildSeasonResult(state, club, position, pendingTitle);

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
