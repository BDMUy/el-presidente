import { describe, expect, it } from 'vitest';

import {
  CLIMA_PRENSA,
  CLIMA_TRIBUNA,
  climaDeHinchada,
  vozDeSemilla,
} from '@/content/clima';
import { HINCHADA_ELECCION } from '@/lib/engine/types';

describe('clima', () => {
  it('parte la hinchada en tres climas, con el corte de la elección', () => {
    expect(climaDeHinchada(80)).toBe('bien');
    expect(climaDeHinchada(HINCHADA_ELECCION)).toBe('tibio');
    expect(climaDeHinchada(HINCHADA_ELECCION - 1)).toBe('mal');
  });

  it('da la misma voz para la misma semilla y temporada', () => {
    expect(vozDeSemilla(CLIMA_TRIBUNA, 'mal', 41, 3)).toBe(
      vozDeSemilla(CLIMA_TRIBUNA, 'mal', 41, 3),
    );
  });

  it('cambia de voz al cambiar de temporada', () => {
    const t1 = vozDeSemilla(CLIMA_PRENSA, 'tibio', 9, 1);
    const t2 = vozDeSemilla(CLIMA_PRENSA, 'tibio', 9, 2);
    expect(t1).not.toBe(t2);
  });

  it('siempre devuelve una frase de la bolsa del clima', () => {
    expect(CLIMA_TRIBUNA.bien).toContain(vozDeSemilla(CLIMA_TRIBUNA, 'bien', 5, 4));
    expect(CLIMA_PRENSA.mal).toContain(vozDeSemilla(CLIMA_PRENSA, 'mal', 5, 4));
  });
});
