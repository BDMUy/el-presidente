import { describe, expect, it } from 'vitest';

import { applyEffects, meetsCondition } from './effects';
import { startRun } from './engine';
import type { GameState } from './types';

const base = (): GameState => startRun({ seed: 1, clubId: 'boca' });

describe('flagsSuma: marcas que se acumulan', () => {
  it('suma sobre lo que había en vez de pisarlo', () => {
    let s = base();
    s = applyEffects(s, { flagsSuma: { prontuario: 1 } });
    s = applyEffects(s, { flagsSuma: { prontuario: 1 } });
    s = applyEffects(s, { flagsSuma: { prontuario: 2 } });
    expect(s.flags.prontuario).toBe(4);
  });

  it('sumar sobre una marca que no existe arranca de cero', () => {
    expect(applyEffects(base(), { flagsSuma: { nueva: 3 } }).flags.nueva).toBe(3);
  });

  it('sigue siendo posible pisar con flags, que es otro uso', () => {
    let s = applyEffects(base(), { flagsSuma: { prontuario: 5 } });
    s = applyEffects(s, { flags: { prontuario: 1 } });
    expect(s.flags.prontuario).toBe(1);
  });

  it('en la misma carta, primero pisa y después suma', () => {
    // Poner el piso y subirlo de una: si el orden fuera al revés, la suma se
    // perdería porque el pisado la sobreescribe.
    const s = applyEffects(base(), { flags: { prontuario: 10 }, flagsSuma: { prontuario: 1 } });
    expect(s.flags.prontuario).toBe(11);
  });

  it('sumar sobre una marca booleana la trata como cero, sin devolver NaN', () => {
    // Mezclar los dos usos en la misma marca es un error de contenido. Que dé
    // un número igual hace que se note en una condición en vez de esconderse.
    let s = applyEffects(base(), { flags: { mezcla: true } });
    s = applyEffects(s, { flagsSuma: { mezcla: 2 } });
    expect(s.flags.mezcla).toBe(2);
  });

  it('no toca las flags si el efecto no las menciona', () => {
    const s = applyEffects(base(), { flags: { a: 1 } });
    expect(applyEffects(s, { caja: 5 }).flags).toBe(s.flags);
  });
});

describe('minFlag: condiciones por umbral', () => {
  const con = (flags: GameState['flags']): GameState => ({ ...base(), flags });

  it('no se cumple hasta llegar al número', () => {
    const cond = { minFlag: { prontuario: 3 } };
    expect(meetsCondition(cond, con({ prontuario: 2 }), 8)).toBe(false);
    expect(meetsCondition(cond, con({ prontuario: 3 }), 8)).toBe(true);
    expect(meetsCondition(cond, con({ prontuario: 9 }), 8)).toBe(true);
  });

  it('una marca que no existe no cumple ningún umbral', () => {
    expect(meetsCondition({ minFlag: { prontuario: 1 } }, con({}), 8)).toBe(false);
  });

  it('una marca booleana no cuenta como número', () => {
    expect(meetsCondition({ minFlag: { x: 1 } }, con({ x: true }), 8)).toBe(false);
  });

  it('varios umbrales se combinan con AND', () => {
    const cond = { minFlag: { a: 2, b: 1 } };
    expect(meetsCondition(cond, con({ a: 2 }), 8)).toBe(false);
    expect(meetsCondition(cond, con({ a: 2, b: 1 }), 8)).toBe(true);
  });

  it('convive con el resto de las condiciones', () => {
    const estado = con({ prontuario: 5 });
    expect(meetsCondition({ minFlag: { prontuario: 3 }, minSeason: 99 }, estado, 8)).toBe(false);
    expect(meetsCondition({ minFlag: { prontuario: 3 }, minSeason: 1 }, estado, 8)).toBe(true);
  });
});
