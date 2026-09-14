import { describe, expect, it } from 'vitest';
import { applyChoice, optionCount, startRun } from './engine';

function novedadesDeMercado(seed: number): string[] {
  let state = startRun({ seed, clubId: 'boca', modo: 'corta' });
  const vistas: string[] = [];
  let guard = 0;
  while (state.status === 'jugando' && guard++ < 400) {
    const anterior = state.phase.kind;
    const n = optionCount(state);
    if (n === 0) break;
    state = applyChoice(state, 0);
    if (anterior === 'mercado') vistas.push(...state.novedades);
  }
  return vistas;
}

describe('novedades del mercado', () => {
  it('la lesión deja constancia con nombre y con las dos cifras', () => {
    const avisos = Array.from({ length: 60 }, (_, i) => novedadesDeMercado(i + 1))
      .flat()
      .filter((n) => n.includes('llegó tocado'));

    expect(avisos.length).toBeGreaterThan(0);

    for (const aviso of avisos) {
      const [, suma, prometido] = aviso.match(/suma (-?\d+) al plantel en vez de (-?\d+)\./)!;
      expect(Number(suma)).toBeLessThan(Number(prometido));
      expect(Number(suma)).toBe(Math.round(Number(prometido) * 0.35));
    }
  });

  it('la novedad dura una decisión y se limpia en la siguiente', () => {
    const conAviso = Array.from({ length: 60 }, (_, i) => i + 1).find((seed) => {
      let state = startRun({ seed, clubId: 'boca', modo: 'corta' });
      let guard = 0;
      while (state.status === 'jugando' && guard++ < 400) {
        if (optionCount(state) === 0) break;
        state = applyChoice(state, 0);
        if (state.novedades.length > 0) return true;
      }
      return false;
    });

    expect(conAviso).toBeDefined();

    let state = startRun({ seed: conAviso!, clubId: 'boca', modo: 'corta' });
    while (state.novedades.length === 0) state = applyChoice(state, 0);
    expect(applyChoice(state, 0).novedades).not.toEqual(state.novedades);
  });
});
