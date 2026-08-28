import { describe, expect, it } from 'vitest';

import { hex, ratio, tintaDeClub } from './color';

const OSCURO = '#23242A';
const CLARO = '#F1EFE9';

const CASOS = ['#FFD700', '#E4002B', '#FFFFFF', '#0A2A5E', '#7FBFEA', '#111111', '#1A6B3C'];

describe('tintaDeClub', () => {
  it('alcanza el objetivo de contraste sobre fondo oscuro', () => {
    for (const color of CASOS) {
      const ajustado = tintaDeClub(color, OSCURO, 4.5);
      expect(ratio(hex(ajustado), hex(OSCURO))).toBeGreaterThanOrEqual(4.49);
    }
  });

  it('alcanza el objetivo de contraste sobre fondo claro', () => {
    for (const color of CASOS) {
      const ajustado = tintaDeClub(color, CLARO, 4.5);
      expect(ratio(hex(ajustado), hex(CLARO))).toBeGreaterThanOrEqual(4.49);
    }
  });

  it('no toca un color que ya cumple', () => {
    expect(tintaDeClub('#FFFFFF', OSCURO, 4.5)).toBe('#ffffff');
    expect(tintaDeClub('#111111', CLARO, 4.5)).toBe('#111111');
  });
});
