import { describe, expect, it } from 'vitest';

import { CLUBS } from '@/content/clubs';
import {
  FONDO_CLARO,
  FONDO_OSCURO,
  hex,
  ratio,
  SUPERFICIE_CLARA,
  SUPERFICIE_OSCURA,
  tintaDeClub,
} from './color';

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

  it('resuelto contra la superficie, cumple 4.5:1 sobre el fondo y sobre el bloque', () => {
    for (const [fondo, superficie] of [
      [FONDO_OSCURO, SUPERFICIE_OSCURA],
      [FONDO_CLARO, SUPERFICIE_CLARA],
    ]) {
      for (const club of CLUBS) {
        const acento = tintaDeClub(club.colors[0], superficie, 4.5);
        expect(ratio(hex(acento), hex(superficie))).toBeGreaterThanOrEqual(4.49);
        expect(ratio(hex(acento), hex(fondo))).toBeGreaterThanOrEqual(4.49);
      }
    }
  });
});
