import { describe, expect, it } from 'vitest';

import { ALL_EVENTS } from '@/content/events';
import { impactoDeOpcion } from './impacto';

const RECURSOS = ['caja', 'hinchada', 'socios', 'plantel', 'influencia'] as const;

describe('impactoDeOpcion', () => {
  it('las opciones al azar no llevan indicador', () => {
    for (const event of ALL_EVENTS) {
      for (const option of event.options) {
        if (option.random && option.random.length > 0) {
          expect(impactoDeOpcion(option), `${event.id}: ${option.label}`).toBeNull();
        }
      }
    }
  });

  it('toda opción determinista con algún efecto devuelve al menos un token', () => {
    for (const event of ALL_EVENTS) {
      for (const option of event.options) {
        if (option.random && option.random.length > 0) continue;
        const impacto = impactoDeOpcion(option);
        expect(impacto, `${event.id}: ${option.label}`).not.toBeNull();
        expect(impacto!.length, `${event.id}: ${option.label}`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('el grado siempre cae en 1, 2 o 3', () => {
    for (const event of ALL_EVENTS) {
      for (const option of event.options) {
        for (const token of impactoDeOpcion(option) ?? []) {
          expect([1, 2, 3], `${event.id}: ${token.id}`).toContain(token.grado);
        }
      }
    }
  });

  it('el signo del token coincide con el signo del efecto que representa', () => {
    for (const event of ALL_EVENTS) {
      for (const option of event.options) {
        if (option.random && option.random.length > 0) continue;
        const effects = option.effects ?? {};
        const impacto = impactoDeOpcion(option) ?? [];
        for (const recurso of RECURSOS) {
          const valor = effects[recurso];
          const token = impacto.find((t) => t.id === recurso);
          if (!valor) {
            expect(token, `${event.id}: ${option.label} (${recurso})`).toBeUndefined();
            continue;
          }
          expect(token, `${event.id}: ${option.label} (${recurso})`).toBeDefined();
          expect(token!.signo).toBe(valor > 0 ? '+' : '−');
        }
      }
    }
  });

  it('marca PRONTUARIO cuando la opción suma prontuario', () => {
    const conProntuario = { label: 'x', hint: 'y', effects: { flagsSuma: { prontuario: 1 } } };
    const impacto = impactoDeOpcion(conProntuario)!;
    expect(impacto.some((t) => t.id === 'prontuario' && t.signo === '−')).toBe(true);
  });

  it('marca DESPUÉS sin magnitud cuando hay un efecto diferido', () => {
    const conDiferido = {
      label: 'x',
      hint: 'y',
      effects: { hinchada: 3, deferred: [{ inSeasons: 2, text: 'z', effects: { hinchada: -5 } }] },
    };
    const impacto = impactoDeOpcion(conDiferido)!;
    const despues = impacto.find((t) => t.id === 'despues');
    expect(despues).toBeDefined();
    expect(despues!.signo).toBe('neutro');
  });

  it('una opción sin ningún efecto medible devuelve una lista vacía, no null', () => {
    const sinEfectos = { label: 'x', hint: 'y', effects: {} };
    expect(impactoDeOpcion(sinEfectos)).toEqual([]);
  });
});
