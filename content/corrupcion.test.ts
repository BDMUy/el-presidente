import { describe, expect, it } from 'vitest';

import { CORRUPCION } from './events/corrupcion';
import { ALL_EVENTS } from './events';
import { applyEffects, meetsCondition } from '@/lib/engine/effects';
import { finalEnding } from '@/lib/engine/election';
import { startRun } from '@/lib/engine/engine';
import type { GameEvent, GameState } from '@/lib/engine/types';

const tentaciones = CORRUPCION.filter((e) => !e.requires?.minFlag);
const escalada = CORRUPCION.filter((e) => e.requires?.minFlag);

/** El estado en el que una carta se evalúa: todo holgado menos el prontuario. */
function estado(prontuario: number, season = 8): GameState {
  const base = startRun({ seed: 1, clubId: 'boca', modo: 'larga' });
  return {
    ...base,
    season,
    flags: prontuario > 0 ? { prontuario } : {},
    resources: { caja: 50, hinchada: 80, socios: 100, plantel: 70, influencia: 80 },
  };
}

const visible = (e: GameEvent, s: GameState) => meetsCondition(e.requires, s, 9);

describe('el hilo de corrupción', () => {
  it('tiene tentaciones que aparecen siempre y escalada que no', () => {
    expect(tentaciones.length).toBeGreaterThanOrEqual(7);
    expect(escalada.length).toBeGreaterThanOrEqual(8);
  });

  it('una presidencia limpia no ve NUNCA una carta de escalada', () => {
    // Es la mitad del trato: si el hilo apareciera igual, dejaría de ser una
    // consecuencia y sería una desgracia que le pasa a cualquiera.
    const limpio = estado(0, 16);
    for (const e of escalada) {
      expect(visible(e, limpio), e.id).toBe(false);
    }
  });

  it('la escalada se abre de a poco, no toda junta', () => {
    const abiertasEn = (p: number) => escalada.filter((e) => visible(e, estado(p, 16))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(2)).toBeGreaterThan(0);
    expect(abiertasEn(2)).toBeLessThan(escalada.length);
    expect(abiertasEn(9)).toBe(escalada.length);
  });

  it('las tentaciones están disponibles sin haber hecho nada', () => {
    const limpio = estado(0, 8);
    expect(tentaciones.filter((e) => visible(e, limpio)).length).toBe(tentaciones.length);
  });

  it('cada tentación tiene una salida sucia que suma prontuario y una que no', () => {
    for (const e of tentaciones) {
      const suman = e.options.filter((o) => o.effects?.flagsSuma?.prontuario);
      expect(suman.length, `${e.id}: ninguna opción sucia`).toBeGreaterThanOrEqual(1);
      expect(suman.length, `${e.id}: todas las opciones son sucias`).toBeLessThan(e.options.length);
    }
  });

  it('elegir sucio acumula y va abriendo el hilo', () => {
    let s = estado(0, 8);
    for (const e of tentaciones) {
      const sucia = e.options.find((o) => o.effects?.flagsSuma?.prontuario);
      if (sucia?.effects) s = applyEffects(s, sucia.effects);
    }
    expect(s.flags.prontuario).toBeGreaterThanOrEqual(tentaciones.length);
    expect(escalada.filter((e) => visible(e, { ...s, season: 16 })).length).toBeGreaterThan(0);
  });

  it('el fondo del pozo no se toca solo con las tentaciones', () => {
    // Son siete y suman de a uno; los dos últimos peldaños piden ocho y nueve.
    // O sea que para llegar al final hay que haber usado además la ficha de
    // gestión de la Mesa Chica, o haber elegido sucio dentro de la propia
    // escalada. Que el fondo cueste más que juntar las cartas fáciles es el
    // punto: es un prontuario, no una colección.
    let s = estado(0, 16);
    for (const e of tentaciones) {
      const sucia = e.options.find((o) => o.effects?.flagsSuma?.prontuario);
      if (sucia?.effects) s = applyEffects(s, sucia.effects);
    }
    const abiertas = escalada.filter((e) => visible(e, s)).length;
    expect(abiertas).toBeGreaterThan(0);
    expect(abiertas).toBeLessThan(escalada.length);
  });

  it('las cartas sucias que ya existían también suman', () => {
    const sucias = ['afa-voto', 'barra-plata'];
    for (const id of sucias) {
      const e = ALL_EVENTS.find((x) => x.id === id)!;
      const suman = e.options.filter((o) => o.effects?.flagsSuma?.prontuario);
      expect(suman.length, id).toBeGreaterThanOrEqual(1);
    }
  });

  it('el sponsor de apuestas NO suma: impopular no es lo mismo que sucio', () => {
    const e = ALL_EVENTS.find((x) => x.id === 'sponsor-dudoso')!;
    expect(e.options.every((o) => !o.effects?.flagsSuma)).toBe(true);
  });

  it('no le ponen tu nombre a la tribuna si tenés prontuario', () => {
    // Una presidencia impecable en todo lo demás: campeona, querida y sin
    // descensos. Lo único que cambia entre las dos es cuánto se robó.
    const impecable = {
      ...estado(0, 16),
      resources: { caja: 40, hinchada: 90, socios: 120, plantel: 85, influencia: 60 },
      titles: Array.from({ length: 6 }, (_, i) => ({ id: 'liga-primera' as const, season: i + 2, year: 2027 + i })),
      descensos: 0,
    };

    expect(finalEnding(impecable)).toBe('estatua');
    expect(finalEnding({ ...impecable, flags: { prontuario: 9 } })).toBe('reelecto-gris');
  });

  it('el prontuario tolerado escala con la duración', () => {
    // Treinta y dos temporadas tienen el doble de oportunidades de cortar
    // esquinas que dieciséis: un número fijo mediría el tiempo y no la
    // conducta. Con el mismo prontuario, la larga todavía llega y la corta no.
    const base = {
      resources: { caja: 40, hinchada: 90, socios: 120, plantel: 85, influencia: 60 },
      titles: Array.from({ length: 8 }, (_, i) => ({ id: 'liga-primera' as const, season: i + 2, year: 2027 + i })),
      descensos: 0,
      flags: { prontuario: 3 },
    };

    expect(finalEnding({ ...estado(0, 8), ...base, modo: 'corta' })).toBe('reelecto-gris');
    expect(finalEnding({ ...estado(0, 32), ...base, modo: 'larga' })).toBe('estatua');
  });
});
