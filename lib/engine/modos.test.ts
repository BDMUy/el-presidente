import { describe, expect, it } from 'vitest';

import { CLUBS } from '@/content/clubs';
import { LOGROS, logrosDeLaPartida } from '@/content/logros';
import { buildEnding, isElectionSeason, mandatosDe, puntosParaEstatua } from './election';
import { applyChoice, optionCount, startRun } from './engine';
import { Rand } from './rng';
import type { GameState, Modo } from './types';
import { MODOS, TEMPORADAS_POR_MODO } from './types';

function jugar(seed: number, clubId: string, modo: Modo): GameState {
  let state = startRun({ seed, clubId, modo });
  let guarda = 0;
  while (state.status === 'jugando' && guarda++ < 5000) {
    const n = optionCount(state);
    if (n === 0) break;
    state = applyChoice(state, 0);
  }
  return state;
}

describe('duración de cada modo', () => {
  it('ninguna partida pasa del calendario de su modo', () => {
    const dado = new Rand(0xc0ffee);
    for (const modo of MODOS) {
      for (let i = 0; i < 40; i++) {
        const club = dado.pick(CLUBS);
        const state = jugar(i * 7919 + 3, club.id, modo);
        expect(state.status).toBe('terminado');
        expect(state.season).toBeLessThanOrEqual(TEMPORADAS_POR_MODO[modo]);
      }
    }
  });

  it('el modo viaja en el estado y no se pierde a mitad de camino', () => {
    for (const modo of MODOS) {
      expect(jugar(12345, 'boca', modo).modo).toBe(modo);
    }
  });

  it('la normal sigue siendo la de siempre cuando no se pide modo', () => {
    expect(startRun({ seed: 1, clubId: 'boca' }).modo).toBe('normal');
  });

  it('reparte los mandatos que corresponden', () => {
    expect(mandatosDe('corta')).toBe(2);
    expect(mandatosDe('normal')).toBe(4);
    expect(mandatosDe('larga')).toBe(8);
  });
});

describe('isElectionSeason', () => {
  it('vota cada cuatro temporadas en los tres modos', () => {
    for (const modo of MODOS) {
      expect(isElectionSeason(4, modo)).toBe(true);
      expect(isElectionSeason(3, modo)).toBe(false);
      expect(isElectionSeason(5, modo)).toBe(false);
    }
  });

  it('no vota en la última: ahí la presidencia se termina igual', () => {
    expect(isElectionSeason(8, 'corta')).toBe(false);
    expect(isElectionSeason(16, 'normal')).toBe(false);
    expect(isElectionSeason(32, 'larga')).toBe(false);
  });

  it('sí vota en la temporada que para otro modo sería la última', () => {
    expect(isElectionSeason(8, 'normal')).toBe(true);
    expect(isElectionSeason(16, 'larga')).toBe(true);
  });
});

describe('umbral de la estatua', () => {
  it('la corta no lleva descuento aunque dure la mitad', () => {
    expect(puntosParaEstatua('corta')).toBe(puntosParaEstatua('normal'));
  });

  it('la larga sí pide más, porque el tiempo de más es tiempo de ganar', () => {
    expect(puntosParaEstatua('larga')).toBeGreaterThan(puntosParaEstatua('normal'));
  });
});

describe('la escalera de los eternos', () => {
  const ESCALERA = [
    ['el-mas-largo-del-barrio', 21],
    ['mas-que-los-de-alla', 23],
    ['dueno-del-continente', 27],
    ['una-era', 31],
  ] as const;

  it('ninguno se puede desbloquear en corta ni en normal', () => {
    for (const modo of ['corta', 'normal'] as Modo[]) {
      const tope = TEMPORADAS_POR_MODO[modo];
      for (const [, temporada] of ESCALERA) {
        expect(temporada).toBeGreaterThan(tope);
      }
    }
  });

  it('cada uno se desbloquea en su temporada exacta y no antes', () => {
    const base = startRun({ seed: 1, clubId: 'boca', modo: 'larga' });
    for (const [id, temporada] of ESCALERA) {
      const logro = LOGROS.find((l) => l.id === id);
      expect(logro, `falta el logro ${id}`).toBeDefined();
      expect(logro!.oculto).toBe(true);
      expect(logro!.cumple({ ...base, season: temporada - 1 })).toBe(false);
      expect(logro!.cumple({ ...base, season: temporada })).toBe(true);
    }
  });

  it('una corta completa no desbloquea el logro de los cuatro mandatos', () => {
    const corta = jugar(99, 'boca', 'corta');
    expect(logrosDeLaPartida(corta)).not.toContain('cuatro-mandatos');
  });
});

describe('los textos de los finales dicen la duración real', () => {
  const club = CLUBS[0];

  function estado(modo: Modo, extra: Partial<GameState> = {}): GameState {
    return { ...startRun({ seed: 7, clubId: club.id, modo }), ...extra };
  }

  it('la estatua nombra los años del modo, no siempre dieciséis', () => {
    expect(buildEnding('estatua', estado('corta'), club).text).toContain('Ocho años');
    expect(buildEnding('estatua', estado('normal'), club).text).toContain('Dieciséis años');
    expect(buildEnding('estatua', estado('larga'), club).text).toContain('Treinta y dos años');
  });

  it('el final gris nombra los mandatos del modo, no siempre cuatro', () => {
    expect(buildEnding('reelecto-gris', estado('corta'), club).text).toContain('los dos mandatos');
    expect(buildEnding('reelecto-gris', estado('normal'), club).text).toContain(
      'los cuatro mandatos',
    );
    expect(buildEnding('reelecto-gris', estado('larga'), club).text).toContain('los ocho mandatos');
  });

  it('el club en llamas solo cuenta si lo terminaste', () => {
    const completa = estado('llamas', { season: 16 });
    const aMedias = estado('llamas', { season: 9 });
    const normalCompleta = estado('normal', { season: 16 });

    expect(logrosDeLaPartida(completa)).toContain('club-en-llamas');
    expect(logrosDeLaPartida(aMedias)).not.toContain('club-en-llamas');
    expect(logrosDeLaPartida(normalCompleta)).not.toContain('club-en-llamas');
  });

  it('el epílogo en llamas solo aparece al llegar al final', () => {
    expect(buildEnding('reelecto-gris', estado('llamas', { season: 16 }), club).text).toContain(
      'veintidós millones de deuda',
    );
    expect(
      buildEnding('derrota-electoral', estado('llamas', { season: 12 }), club).text,
    ).not.toContain('veintidós millones de deuda');
  });

  it('completar la larga remata con los tres años que faltaron', () => {
    const completa = estado('larga', { season: 32 });
    expect(buildEnding('reelecto-gris', completa, club).text).toContain('te faltaron tres');

    const aMedias = estado('larga', { season: 28 });
    expect(buildEnding('derrota-electoral', aMedias, club).text).not.toContain('te faltaron tres');
  });

  it('el descenso fatal cuenta los descensos que hubo, no los que había antes', () => {
    const tres = buildEnding('descenso-fatal', estado('normal', { descensos: 3 }), club);
    expect(tres.title).toBe('TRES DESCENSOS');
    expect(tres.text).toContain('Tres descensos');

    const cuatro = buildEnding('descenso-fatal', estado('larga', { descensos: 4 }), club);
    expect(cuatro.title).toBe('CUATRO DESCENSOS');
  });
});
