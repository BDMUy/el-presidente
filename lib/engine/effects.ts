import type {
  Condition,
  Effects,
  GameState,
  PendingEffect,
  Resources,
} from './types';
import { countryOf, DEUDA_INHIBICION, RESOURCE_BOUNDS } from './types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function applyResources(resources: Resources, effects: Effects): Resources {
  const next: Resources = { ...resources };

  if (effects.caja) next.caja = round1(next.caja + effects.caja);
  if (effects.hinchada) {
    next.hinchada = clamp(next.hinchada + effects.hinchada, ...RESOURCE_BOUNDS.hinchada);
  }
  if (effects.socios) {
    next.socios = round1(clamp(next.socios + effects.socios, ...RESOURCE_BOUNDS.socios));
  }
  if (effects.plantel) {
    next.plantel = clamp(next.plantel + effects.plantel, ...RESOURCE_BOUNDS.plantel);
  }
  if (effects.influencia) {
    next.influencia = clamp(next.influencia + effects.influencia, ...RESOURCE_BOUNDS.influencia);
  }

  return next;
}

export function applyEffects(state: GameState, effects: Effects): GameState {
  const pending: PendingEffect[] = effects.deferred
    ? [
        ...state.pending,
        ...effects.deferred.map((d) => ({ ...d, dueSeason: state.season + d.inSeasons })),
      ]
    : state.pending;

  return {
    ...state,
    resources: applyResources(state.resources, effects),
    flags: aplicarFlags(state.flags, effects),
    pending,
  };
}

function aplicarFlags(
  actuales: GameState['flags'],
  effects: Effects,
): GameState['flags'] {
  if (!effects.flags && !effects.flagsSuma) return actuales;

  const next = { ...actuales, ...effects.flags };
  for (const [nombre, delta] of Object.entries(effects.flagsSuma ?? {})) {
    const previo = next[nombre];
    next[nombre] = (typeof previo === 'number' ? previo : 0) + delta;
  }
  return next;
}

export function maturePending(state: GameState): GameState {
  const due = state.pending.filter((p) => p.dueSeason <= state.season);
  if (due.length === 0) return state;

  let next: GameState = { ...state, pending: state.pending.filter((p) => p.dueSeason > state.season) };
  for (const effect of due) {
    next = applyEffects(next, effect.effects);
  }

  return next;
}

export function estaInhibido(resources: Resources): boolean {
  return resources.caja <= DEUDA_INHIBICION;
}

export function meetsCondition(
  condition: Condition | undefined,
  state: GameState,
  clubSize: number,
): boolean {
  if (!condition) return true;
  const { resources, season, league, flags } = state;

  if (condition.minSeason !== undefined && season < condition.minSeason) return false;
  if (condition.maxSeason !== undefined && season > condition.maxSeason) return false;

  if (condition.league && !condition.league.includes(league)) return false;
  if (condition.country && !condition.country.includes(countryOf(league))) return false;

  if (condition.minHinchada !== undefined && resources.hinchada < condition.minHinchada) return false;
  if (condition.maxHinchada !== undefined && resources.hinchada > condition.maxHinchada) return false;
  if (condition.minCaja !== undefined && resources.caja < condition.minCaja) return false;
  if (condition.maxCaja !== undefined && resources.caja > condition.maxCaja) return false;
  if (condition.minInfluencia !== undefined && resources.influencia < condition.minInfluencia) return false;
  if (condition.maxInfluencia !== undefined && resources.influencia > condition.maxInfluencia) return false;
  if (condition.minPlantel !== undefined && resources.plantel < condition.minPlantel) return false;
  if (condition.maxPlantel !== undefined && resources.plantel > condition.maxPlantel) return false;

  if (condition.minSize !== undefined && clubSize < condition.minSize) return false;
  if (condition.maxSize !== undefined && clubSize > condition.maxSize) return false;

  if (condition.flag && !flags[condition.flag]) return false;
  if (condition.notFlag && flags[condition.notFlag]) return false;

  for (const [nombre, minimo] of Object.entries(condition.minFlag ?? {})) {
    const valor = flags[nombre];
    if (typeof valor !== 'number' || valor < minimo) return false;
  }

  return true;
}
