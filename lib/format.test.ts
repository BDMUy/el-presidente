import { describe, expect, it } from 'vitest';

import { plataCorta } from './format';

describe('plataCorta', () => {
  it('usa un decimal con coma abajo de 100 millones', () => {
    expect(plataCorta(5.2)).toBe('5,2M');
    expect(plataCorta(45)).toBe('45,0M');
    expect(plataCorta(99.9)).toBe('99,9M');
  });

  it('marca la deuda con el signo menos y mantiene el decimal', () => {
    expect(plataCorta(-1.1)).toBe('−1,1M');
    expect(plataCorta(-22)).toBe('−22,0M');
    expect(plataCorta(-40)).toBe('−40,0M');
  });

  it('redondea sin decimal de 100 millones para arriba, que en el HUD no entra', () => {
    expect(plataCorta(100)).toBe('100M');
    expect(plataCorta(106.4)).toBe('106M');
    expect(plataCorta(106.6)).toBe('107M');
    expect(plataCorta(999.4)).toBe('999M');
    expect(plataCorta(-140.6)).toBe('−141M');
  });
});
