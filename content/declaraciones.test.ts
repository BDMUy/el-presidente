import { describe, expect, it } from 'vitest';

import {
  DECLARACIONES,
  DECLARACIONES_EN_LLAMAS,
  declaracionDeSemilla,
} from '@/content/declaraciones';

describe('declaraciones', () => {
  it('devuelve siempre la misma declaración para la misma semilla', () => {
    expect(declaracionDeSemilla(4471, 'normal')).toBe(declaracionDeSemilla(4471, 'normal'));
  });

  it('usa la bolsa de llamas solo en ese modo', () => {
    expect(DECLARACIONES).toContain(declaracionDeSemilla(7, 'corta'));
    expect(DECLARACIONES_EN_LLAMAS).toContain(declaracionDeSemilla(7, 'llamas'));
  });

  it('cubre toda la bolsa y nunca queda vacía', () => {
    const salidas = new Set(
      Array.from({ length: DECLARACIONES.length }, (_, i) => declaracionDeSemilla(i, 'normal')),
    );
    expect(salidas.size).toBe(DECLARACIONES.length);
    expect(declaracionDeSemilla(-1, 'larga')).not.toBe('');
  });
});
