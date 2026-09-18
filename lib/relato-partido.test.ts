import { describe, expect, it } from 'vitest';

import { relatoDePartido } from '@/lib/relato-partido';

const claves = Array.from({ length: 200 }, (_, i) => `semilla-${i}`);

describe('relatoDePartido', () => {
  it('da siempre el mismo relato para la misma clave', () => {
    expect(relatoDePartido({ won: true, clave: 'boca:5:final' })).toEqual(
      relatoDePartido({ won: true, clave: 'boca:5:final' }),
    );
  });

  it('el marcador nunca contradice el resultado', () => {
    for (const clave of claves) {
      const ganado = relatoDePartido({ won: true, clave });
      expect(ganado.propios).toBeGreaterThan(ganado.rival);

      const perdido = relatoDePartido({ won: false, clave });
      expect(perdido.rival).toBeGreaterThan(perdido.propios);
    }
  });

  it('los hitos coinciden con el marcador y van en orden de minuto', () => {
    for (const clave of claves) {
      for (const won of [true, false]) {
        const relato = relatoDePartido({ won, clave });
        const propios = relato.hitos.filter((h) => h.tipo === 'gol-propio').length;
        const rival = relato.hitos.filter((h) => h.tipo === 'gol-rival').length;
        expect([propios, rival]).toEqual([relato.propios, relato.rival]);

        const minutos = relato.hitos.map((h) => h.minuto);
        expect([...minutos].sort((a, b) => a - b)).toEqual(minutos);
        expect(Math.max(0, ...minutos)).toBeLessThanOrEqual(95);
      }
    }
  });

  it('marca como decisivo el último gol del que definió el partido', () => {
    for (const clave of claves) {
      for (const won of [true, false]) {
        const relato = relatoDePartido({ won, clave });
        const decisivos = relato.hitos.filter((h) => h.decisivo);
        if (relato.propios + relato.rival === 0) continue;
        expect(decisivos).toHaveLength(1);
        expect(decisivos[0].tipo).toBe(won ? 'gol-propio' : 'gol-rival');
      }
    }
  });
});
