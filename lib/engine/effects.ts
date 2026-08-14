/**
 * Aplicación de efectos y evaluación de condiciones.
 *
 * Es la capa que traduce el contenido (datos) a cambios de estado. Todo el
 * contenido del juego habla este lenguaje, así que sumar eventos nuevos nunca
 * requiere tocar el motor.
 */

import type {
  Category,
  Condition,
  Effects,
  GameState,
  PendingEffect,
  Resources,
} from './types';
import { DEUDA_INHIBICION, RESOURCE_BOUNDS } from './types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Redondea a un decimal, para que la caja no muestre basura de punto flotante. */
function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Aplica deltas a los recursos y los deja dentro de sus límites.
 * `caja` no se acota: la deuda es una mecánica, no un error.
 */
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

/**
 * Aplica un efecto completo al estado: recursos, flags y efectos diferidos.
 * Devuelve un estado nuevo; no muta el que recibe.
 */
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
    flags: effects.flags ? { ...state.flags, ...effects.flags } : state.flags,
    pending,
  };
}

/**
 * Madura los efectos diferidos que vencen en la temporada actual.
 * Devuelve el estado actualizado y los textos a mostrar.
 */
export function maturePending(state: GameState): { state: GameState; texts: string[] } {
  const due = state.pending.filter((p) => p.dueSeason <= state.season);
  if (due.length === 0) return { state, texts: [] };

  let next: GameState = { ...state, pending: state.pending.filter((p) => p.dueSeason > state.season) };
  for (const effect of due) {
    next = applyEffects(next, effect.effects);
  }

  return { state: next, texts: due.map((d) => d.text) };
}

/** ¿El club está inhibido por deuda y no puede fichar? */
export function estaInhibido(resources: Resources): boolean {
  return resources.caja <= DEUDA_INHIBICION;
}

/**
 * Evalúa si una condición se cumple contra el estado actual.
 * Los campos ausentes no restringen nada; los presentes se combinan con AND.
 */
export function meetsCondition(
  condition: Condition | undefined,
  state: GameState,
  clubSize: number,
): boolean {
  if (!condition) return true;
  const { resources, season, category, flags } = state;

  if (condition.minSeason !== undefined && season < condition.minSeason) return false;
  if (condition.maxSeason !== undefined && season > condition.maxSeason) return false;

  if (condition.category && !condition.category.includes(category)) return false;

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

  return true;
}

/** Etiqueta legible de una categoría, para los textos. */
export function categoryLabel(category: Category): string {
  return { primera: 'Primera', nacional: 'la Nacional', b: 'la B' }[category];
}
