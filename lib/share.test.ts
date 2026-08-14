import { describe, expect, it } from 'vitest';

import { CLUBS } from '@/content/clubs';
import { logrosDeLaPartida, LOGROS } from '@/content/logros';
import { applyChoice, optionCount, replayRun, startRun } from '@/lib/engine/engine';
import { Rand } from '@/lib/engine/rng';
import type { GameState } from '@/lib/engine/types';
import { decodeRun, encodeRun, shareUrl } from './share';

/** Juega una partida entera con decisiones al azar y devuelve el estado final. */
function partidaCompleta(seed: number, clubId: string): GameState {
  const chooser = new Rand(seed ^ 0x1234567);
  let state = startRun({ seed, clubId });
  let guard = 0;
  while (state.status === 'jugando' && guard++ < 2000) {
    const opciones = optionCount(state);
    if (opciones === 0) break;
    state = applyChoice(state, chooser.int(0, opciones - 1));
  }
  return state;
}

describe('codificación de partidas', () => {
  it('ida y vuelta exacta', () => {
    const original = { seed: 3141592653, clubId: 'boca', choices: [0, 3, 55, 1, 0, 12] };
    expect(decodeRun(encodeRun(original))).toEqual(original);
  });

  it('sirve para cualquier club del catálogo', () => {
    for (const club of CLUBS) {
      const run = { seed: 12345, clubId: club.id, choices: [1, 2, 3] };
      expect(decodeRun(encodeRun(run)), club.id).toEqual(run);
    }
  });

  it('soporta semillas en todo el rango de 32 bits', () => {
    for (const seed of [0, 1, 65535, 2 ** 31, 0xffffffff]) {
      const run = { seed, clubId: 'river', choices: [0] };
      expect(decodeRun(encodeRun(run))?.seed, String(seed)).toBe(seed);
    }
  });

  it('el código es seguro para pegar en cualquier lado', () => {
    const code = encodeRun({ seed: 0xffffffff, clubId: 'boca', choices: [55, 0, 12] });
    // Sin caracteres que rompan una URL ni que un chat convierta en otra cosa.
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(encodeURIComponent(code)).toBe(code);
  });

  it('una presidencia completa entra en un link corto', () => {
    const state = partidaCompleta(777, 'racing');
    const code = encodeRun({ seed: state.seed, clubId: state.clubId, choices: state.choices });
    expect(code.length).toBeLessThan(140);
  });

  it('reconstruye la partida exacta desde el link', () => {
    // Es la garantía del link: quien lo abre tiene que ver la misma partida
    // que jugó quien lo mandó, sin base de datos en el medio.
    for (const seed of [11, 222, 3333, 44444]) {
      const original = partidaCompleta(seed, 'lanus');
      const code = encodeRun({
        seed: original.seed,
        clubId: original.clubId,
        choices: original.choices,
      });
      const datos = decodeRun(code)!;
      const reconstruida = replayRun(datos.seed, datos.clubId, datos.choices);
      expect(reconstruida).toEqual(original);
    }
  });

  it('rechaza basura sin lanzar excepciones', () => {
    for (const basura of ['', 'x', '!!!!!!!!', 'AAAA', '../../etc/passwd', 'A'.repeat(3)]) {
      expect(() => decodeRun(basura)).not.toThrow();
    }
    expect(decodeRun('')).toBeNull();
    expect(decodeRun('AAA')).toBeNull();
    expect(decodeRun('AAAAAA++')).toBeNull();
  });

  it('rechaza un índice de club que no existe', () => {
    // Seis caracteres de semilla y un índice altísimo de club.
    expect(decodeRun('AAAAAA__')).toBeNull();
  });

  it('falla fuerte si algo no entra, en vez de truncar', () => {
    // Un link truncado en silencio reconstruye otra partida, que es peor que
    // no poder compartir.
    expect(() => encodeRun({ seed: 1, clubId: 'no-existe', choices: [] })).toThrow(/Club/);
    expect(() => encodeRun({ seed: 1, clubId: 'boca', choices: [64] })).toThrow(/Decisión/);
    expect(() => encodeRun({ seed: 1, clubId: 'boca', choices: [-1] })).toThrow(/Decisión/);
  });

  it('arma la URL sin barras duplicadas', () => {
    expect(shareUrl('ABC', 'https://x.com')).toBe('https://x.com/p/ABC');
    expect(shareUrl('ABC', 'https://x.com/')).toBe('https://x.com/p/ABC');
  });
});

describe('logros', () => {
  it('los IDs son únicos', () => {
    const ids = LOGROS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todo logro tiene etiqueta y pista', () => {
    for (const logro of LOGROS) {
      expect(logro.label.length, logro.id).toBeGreaterThan(3);
      expect(logro.pista.length, logro.id).toBeGreaterThan(15);
    }
  });

  it('una partida terminada evalúa sin romperse', () => {
    for (let seed = 0; seed < 40; seed++) {
      const state = partidaCompleta(seed * 7919, CLUBS[seed % CLUBS.length].id);
      expect(() => logrosDeLaPartida(state)).not.toThrow();
    }
  });

  it('los logros son alcanzables en partidas reales', () => {
    // Un logro que nadie puede conseguir es contenido muerto, igual que una
    // carta con condiciones imposibles.
    const conseguidos = new Set<string>();
    for (let seed = 0; seed < 600; seed++) {
      const state = partidaCompleta(seed * 2654435761, CLUBS[seed % CLUBS.length].id);
      for (const id of logrosDeLaPartida(state)) conseguidos.add(id);
    }
    // Con decisiones al azar no se consiguen todos; los básicos sí.
    expect(conseguidos.has('primera-vuelta')).toBe(true);
    expect(conseguidos.size).toBeGreaterThanOrEqual(4);
  });
});
