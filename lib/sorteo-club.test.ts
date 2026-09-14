import { describe, expect, it } from 'vitest';
import { CLUBS } from '@/content/clubs';
import { countryOf } from '@/lib/engine/types';
import { sortearClubPorDestino } from './sorteo-club';

describe('Sorteo de país, liga y club', () => {
  it('consume una elección por nivel, en orden, sin ponderar por cantidad de clubes', () => {
    const paises = [...new Set(CLUBS.map((club) => countryOf(club.league)))];
    for (const [p, pais] of paises.entries()) {
      const ligas = [...new Set(CLUBS.filter((club) => countryOf(club.league) === pais).map((club) => club.league))];
      for (const [l, liga] of ligas.entries()) {
        const clubes = CLUBS.filter((club) => club.league === liga);
        for (const [c, club] of clubes.entries()) {
          const valores = [(p + 0.5) / paises.length, (l + 0.5) / ligas.length, (c + 0.5) / clubes.length];
          let llamadas = 0;
          expect(sortearClubPorDestino(() => valores[llamadas++])).toEqual({ pais, liga, club });
          expect(llamadas).toBe(3);
        }
      }
    }
  });

  it('admite los extremos del generador y siempre devuelve una combinación válida', () => {
    for (const valor of [0, 1 - Number.EPSILON]) {
      const resultado = sortearClubPorDestino(() => valor);
      expect(countryOf(resultado.liga)).toBe(resultado.pais);
      expect(resultado.club.league).toBe(resultado.liga);
    }
  });
});
