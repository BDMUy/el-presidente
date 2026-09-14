import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CORONDEL_OSCURO, FONDO_CLARO, FONDO_OSCURO, SUPERFICIE_CLARA, SUPERFICIE_OSCURA, TINTA_2_OSCURA, TINTA_OSCURA, hex, mezclar, ratio } from './color';

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

describe('Paleta editorial', () => {
  for (const [selector, fondo, superficie] of [
    [':root', FONDO_OSCURO, SUPERFICIE_OSCURA],
    ["[data-tema='claro']", FONDO_CLARO, SUPERFICIE_CLARA],
  ]) {
    const bloque = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
    const token = (nombre: string) => {
      const valor = bloque.match(new RegExp(`--${nombre}: (#[0-9a-f]{6});`, 'i'))?.[1];
      if (!valor) throw new Error(`Falta ${nombre} en ${selector}`);
      return valor;
    };

    it(`${selector}: CSS y cálculo de colores usan las mismas superficies`, () => {
      expect(token('fondo')).toBe(fondo);
      expect(token('fondo-2')).toBe(superficie);
    });

    if (selector === ':root') {
      it('la tarjeta para compartir usa las mismas tintas que el tema oscuro', () => {
        expect(token('tinta')).toBe(TINTA_OSCURA);
        expect(token('tinta-2')).toBe(TINTA_2_OSCURA);
        expect(token('corondel')).toBe(CORONDEL_OSCURO);
      });
    }

    it(`${selector}: texto, acciones y bordes cumplen en ambas superficies`, () => {
      for (const base of [fondo, superficie]) {
        for (const nombre of ['tinta', 'tinta-2', 'tinta-3', 'acento', 'alerta', 'favorable']) {
          expect(ratio(hex(token(nombre)), hex(base)), `${nombre} sobre ${base}`).toBeGreaterThanOrEqual(4.5);
        }
        expect(ratio(hex(token('corondel')), hex(base))).toBeGreaterThanOrEqual(3);
      }
      expect(ratio(hex(token('sobre-acento')), hex(token('acento')))).toBeGreaterThanOrEqual(4.5);
    });

    it(`${selector}: la cabecera protege el texto aun sobre los extremos de la imagen`, () => {
      for (const extremo of ['#000000', '#ffffff']) {
        const protegido = mezclar(hex(fondo), hex(extremo), 0.82);
        for (const texto of ['tinta']) {
          expect(ratio(hex(token(texto)), protegido)).toBeGreaterThanOrEqual(4.5);
        }
      }
    });
  }
});
