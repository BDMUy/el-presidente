import { describe, expect, it } from 'vitest';

import { CLUBS } from '@/content/clubs';
import { computeScore } from '@/lib/engine/election';
import { applyChoice, optionCount, replayRun, startRun } from '@/lib/engine/engine';
import { Rand } from '@/lib/engine/rng';
import { LEAGUES } from '@/lib/engine/types';
import { fechaDelDia, faltaParaLaProxima, formatearEspera, presidenciaDelDia } from './daily';

describe('Presidencia del Día', () => {
  it('la misma fecha da siempre la misma partida', () => {
    const a = presidenciaDelDia('2026-08-14');
    const b = presidenciaDelDia('2026-08-14');
    expect(a).toEqual(b);
  });

  it('fechas distintas dan partidas distintas', () => {
    const dias = ['2026-08-14', '2026-08-15', '2026-08-16', '2026-08-17'];
    const semillas = dias.map((d) => presidenciaDelDia(d).seed);
    expect(new Set(semillas).size).toBe(dias.length);
  });

  it('el club del día siempre existe', () => {
    for (let i = 0; i < 400; i++) {
      const fecha = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
      const { clubId } = presidenciaDelDia(fecha);
      expect(CLUBS.some((c) => c.id === clubId), fecha).toBe(true);
    }
  });

  it('reparte clubes de todas las ligas a lo largo del año', () => {
    const ligas = new Set<string>();
    for (let i = 0; i < 365; i++) {
      const fecha = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
      const club = CLUBS.find((c) => c.id === presidenciaDelDia(fecha).clubId)!;
      ligas.add(club.league);
    }
    expect(ligas.size).toBe(Object.keys(LEAGUES).length);
  });

  it('la fecha se calcula con el reloj argentino, no con UTC', () => {
    expect(fechaDelDia(new Date('2026-08-15T02:00:00Z'))).toBe('2026-08-14');
    expect(fechaDelDia(new Date('2026-08-15T03:30:00Z'))).toBe('2026-08-15');
  });

  it('la cuenta regresiva llega a cero justo al cambiar el día', () => {
    const falta = faltaParaLaProxima(new Date('2026-08-15T02:59:00Z'));
    expect(falta).toBeGreaterThan(0);
    expect(falta).toBeLessThanOrEqual(60_000);
  });

  it('el contador se muestra siempre con dos dígitos', () => {
    expect(formatearEspera(0)).toBe('00:00:00');
    expect(formatearEspera(3661_000)).toBe('01:01:01');
    expect(formatearEspera(-5)).toBe('00:00:00');
  });

  it('la partida del día es jugable de punta a punta', () => {
    const { seed, clubId } = presidenciaDelDia('2026-08-14');
    const chooser = new Rand(42);
    let state = startRun({ seed, clubId });
    let guard = 0;
    while (state.status === 'jugando' && guard++ < 2000) {
      const n = optionCount(state);
      if (n === 0) break;
      state = applyChoice(state, chooser.int(0, n - 1));
    }
    expect(state.status).toBe('terminado');
    expect(state.ending).not.toBeNull();
  });
});

describe('verificación de puntajes', () => {
  it('el puntaje reproducido coincide con el original', () => {
    for (const seed of [1, 5000, 987654]) {
      const chooser = new Rand(seed ^ 0xabcdef);
      let original = startRun({ seed, clubId: 'huracan' });
      let guard = 0;
      while (original.status === 'jugando' && guard++ < 2000) {
        const n = optionCount(original);
        if (n === 0) break;
        original = applyChoice(original, chooser.int(0, n - 1));
      }
      const verificado = replayRun(seed, 'huracan', original.choices);
      expect(computeScore(verificado)).toBe(computeScore(original));
    }
  });

  it('una decisión inventada hace fallar la reproducción', () => {
    expect(() => replayRun(123, 'boca', [0, 0, 63])).toThrow(/Decisión inválida/);
  });

  it('un log incompleto no llega a una partida terminada', () => {
    const parcial = replayRun(123, 'boca', [0, 0, 0]);
    expect(parcial.status).toBe('jugando');
  });
});
