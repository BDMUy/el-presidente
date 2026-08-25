import { describe, expect, it } from 'vitest';

import { CORRUPCION } from './events/corrupcion';
import { ALL_EVENTS } from './events';
import { applyEffects, meetsCondition } from '@/lib/engine/effects';
import { finalEnding } from '@/lib/engine/election';
import { startRun } from '@/lib/engine/engine';
import type { Country, GameEvent, GameState } from '@/lib/engine/types';

const tentaciones = CORRUPCION.filter((e) => !e.requires?.minFlag);
const escalada = CORRUPCION.filter((e) => e.requires?.minFlag);

function estado(prontuario: number, season = 8, clubId = 'boca'): GameState {
  const base = startRun({ seed: 1, clubId, modo: 'larga' });
  return {
    ...base,
    season,
    flags: prontuario > 0 ? { prontuario } : {},
    resources: { caja: 50, hinchada: 80, socios: 100, plantel: 70, influencia: 80 },
  };
}

const escaladaDe = (country: Country) =>
  escalada.filter((e) => !e.requires?.country || e.requires.country.includes(country));

const escaladaDeArgentina = escaladaDe('argentina');
const escaladaDeUruguay = escaladaDe('uruguay');
const escaladaDePeru = escaladaDe('peru');
const escaladaDeColombia = escaladaDe('colombia');
const escaladaDeChile = escaladaDe('chile');
const escaladaDeParaguay = escaladaDe('paraguay');
const escaladaDeBolivia = escaladaDe('bolivia');
const escaladaDeEcuador = escaladaDe('ecuador');
const escaladaDeVenezuela = escaladaDe('venezuela');

const visible = (e: GameEvent, s: GameState) => meetsCondition(e.requires, s, 9);

describe('el hilo de corrupción', () => {
  it('tiene tentaciones que aparecen siempre y escalada que no', () => {
    expect(tentaciones.length).toBeGreaterThanOrEqual(7);
    expect(escalada.length).toBeGreaterThanOrEqual(8);
  });

  it('una presidencia limpia no ve NUNCA una carta de escalada', () => {
    const limpio = estado(0, 16);
    for (const e of escalada) {
      expect(visible(e, limpio), e.id).toBe(false);
    }
  });

  it('la escalada se abre de a poco, no toda junta', () => {
    const abiertasEn = (p: number) => escaladaDeArgentina.filter((e) => visible(e, estado(p, 16))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(2)).toBeGreaterThan(0);
    expect(abiertasEn(2)).toBeLessThan(escaladaDeArgentina.length);
    expect(abiertasEn(9)).toBe(escaladaDeArgentina.length);
  });

  it('lo mismo pasa con un club uruguayo, con la versión AUF de la carta', () => {
    const abiertasEn = (p: number) =>
      escaladaDeUruguay.filter((e) => visible(e, estado(p, 16, 'penarol'))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(9)).toBe(escaladaDeUruguay.length);
  });

  it('lo mismo pasa con un club peruano, con la versión FPF de la carta', () => {
    const abiertasEn = (p: number) =>
      escaladaDePeru.filter((e) => visible(e, estado(p, 16, 'alianzalima'))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(9)).toBe(escaladaDePeru.length);
  });

  it('lo mismo pasa con un club colombiano, con la versión Dimayor de la carta', () => {
    const abiertasEn = (p: number) =>
      escaladaDeColombia.filter((e) => visible(e, estado(p, 16, 'millonarios'))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(9)).toBe(escaladaDeColombia.length);
  });

  it('lo mismo pasa con un club chileno, con la versión ANFP de la carta', () => {
    const abiertasEn = (p: number) =>
      escaladaDeChile.filter((e) => visible(e, estado(p, 16, 'colocolo'))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(9)).toBe(escaladaDeChile.length);
  });

  it('lo mismo pasa con un club paraguayo, con la versión APF de la carta', () => {
    const abiertasEn = (p: number) =>
      escaladaDeParaguay.filter((e) => visible(e, estado(p, 16, 'olimpia'))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(9)).toBe(escaladaDeParaguay.length);
  });

  it('lo mismo pasa con un club boliviano, con la versión FBF de la carta', () => {
    const abiertasEn = (p: number) =>
      escaladaDeBolivia.filter((e) => visible(e, estado(p, 16, 'bolivar'))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(9)).toBe(escaladaDeBolivia.length);
  });

  it('lo mismo pasa con un club ecuatoriano, con la versión LigaPro de la carta', () => {
    const abiertasEn = (p: number) =>
      escaladaDeEcuador.filter((e) => visible(e, estado(p, 16, 'barcelonasc'))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(9)).toBe(escaladaDeEcuador.length);
  });

  it('lo mismo pasa con un club venezolano, con la versión FVF de la carta', () => {
    const abiertasEn = (p: number) =>
      escaladaDeVenezuela.filter((e) => visible(e, estado(p, 16, 'tachira'))).length;
    expect(abiertasEn(1)).toBe(0);
    expect(abiertasEn(9)).toBe(escaladaDeVenezuela.length);
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
    const impecable = {
      ...estado(0, 16),
      resources: { caja: 40, hinchada: 90, socios: 120, plantel: 85, influencia: 60 },
      titles: Array.from({ length: 6 }, (_, i) => ({ id: 'ar-liga-primera' as const, season: i + 2, year: 2027 + i })),
      descensos: 0,
    };

    expect(finalEnding(impecable)).toBe('estatua');
    expect(finalEnding({ ...impecable, flags: { prontuario: 9 } })).toBe('reelecto-gris');
  });

  it('el prontuario tolerado escala con la duración', () => {
    const base = {
      resources: { caja: 40, hinchada: 90, socios: 120, plantel: 85, influencia: 60 },
      titles: Array.from({ length: 8 }, (_, i) => ({ id: 'ar-liga-primera' as const, season: i + 2, year: 2027 + i })),
      descensos: 0,
      flags: { prontuario: 3 },
    };

    expect(finalEnding({ ...estado(0, 8), ...base, modo: 'corta' })).toBe('reelecto-gris');
    expect(finalEnding({ ...estado(0, 32), ...base, modo: 'larga' })).toBe('estatua');
  });
});
