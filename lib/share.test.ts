import { describe, expect, it } from 'vitest';

import { CLUBS } from '@/content/clubs';
import { logrosDeLaPartida, LOGROS } from '@/content/logros';
import { applyChoice, optionCount, replayRun, startRun } from '@/lib/engine/engine';
import { Rand } from '@/lib/engine/rng';
import type { GameState, Modo } from '@/lib/engine/types';
import { MODOS } from '@/lib/engine/types';
import { decodeRun, encodeRun, reconstruirPresidencia, shareUrl } from './share';

describe('decodeRun no acepta más de lo que encodeRun produce', () => {
  it('rechaza una semilla de más de 32 bits', () => {
    expect(decodeRun('______AA')).toBeNull();
    expect(decodeRun(encodeRun({ seed: 0xffffffff, clubId: 'boca', choices: [0] }))?.seed).toBe(
      0xffffffff,
    );
  });

  it('rechaza un log más largo que el que acepta el ranking', () => {
    const base = 'AABnkyAA';
    expect(decodeRun(base + 'A'.repeat(400))).not.toBeNull();
    expect(decodeRun(base + 'A'.repeat(401))).toBeNull();
    expect(decodeRun(base + 'A'.repeat(30000))).toBeNull();
  });
});

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
    const original = {
      seed: 3141592653,
      clubId: 'boca',
      modo: 'normal' as const,
      choices: [0, 3, 55, 1, 0, 12],
    };
    expect(decodeRun(encodeRun(original))).toEqual(original);
  });

  it('sirve para cualquier club del catálogo', () => {
    for (const club of CLUBS) {
      const run = { seed: 12345, clubId: club.id, modo: 'normal' as const, choices: [1, 2, 3] };
      expect(decodeRun(encodeRun(run)), club.id).toEqual(run);
    }
  });

  it('el modo va y vuelve, en cualquier club', () => {
    const bordes = [CLUBS[0], CLUBS[Math.floor(CLUBS.length / 2)], CLUBS[CLUBS.length - 1]];
    for (const modo of MODOS) {
      for (const club of bordes) {
        const run = { seed: 999, clubId: club.id, modo, choices: [1] };
        expect(decodeRun(encodeRun(run)), `${modo}/${club.id}`).toEqual(run);
      }
    }
  });

  it('un link escrito antes de que existieran los modos sigue siendo normal', () => {
    const viejo = 'AABnkyAABCACACAAAAAAABAAAAABAAAADAAAAAAA';
    const datos = decodeRun(viejo);

    expect(datos).not.toBeNull();
    expect(datos!.modo).toBe('normal');
    expect(datos!.seed).toBe(424242);
    expect(datos!.clubId).toBe('boca');
    expect(encodeRun({ ...datos!, modo: 'normal' })).toBe(viejo);
  });

  it('soporta semillas en todo el rango de 32 bits', () => {
    for (const seed of [0, 1, 65535, 2 ** 31, 0xffffffff]) {
      const run = { seed, clubId: 'river', choices: [0] };
      expect(decodeRun(encodeRun(run))?.seed, String(seed)).toBe(seed);
    }
  });

  it('el código es seguro para pegar en cualquier lado', () => {
    const code = encodeRun({ seed: 0xffffffff, clubId: 'boca', choices: [55, 0, 12] });
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(encodeURIComponent(code)).toBe(code);
  });

  it('una presidencia completa entra en un link corto', () => {
    const state = partidaCompleta(777, 'racing');
    const code = encodeRun({ seed: state.seed, clubId: state.clubId, choices: state.choices });
    expect(code.length).toBeLessThan(140);
  });

  it('reconstruye la partida exacta desde el link', () => {
    for (const seed of [11, 222, 3333, 44444]) {
      const original = partidaCompleta(seed, 'lanus');
      const code = encodeRun({
        seed: original.seed,
        clubId: original.clubId,
        choices: original.choices,
      });
      const datos = decodeRun(code)!;
      const reconstruida = replayRun(datos.seed, datos.clubId, datos.choices, datos.modo);
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
    expect(decodeRun('AAAAAA__')).toBeNull();
  });

  it('falla fuerte si algo no entra, en vez de truncar', () => {
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
    const conseguidos = new Set<string>();
    for (let seed = 0; seed < 600; seed++) {
      const state = partidaCompleta(seed * 2654435761, CLUBS[seed % CLUBS.length].id);
      for (const id of logrosDeLaPartida(state)) conseguidos.add(id);
    }
    expect(conseguidos.has('primera-vuelta')).toBe(true);
    expect(conseguidos.size).toBeGreaterThanOrEqual(4);
  });
});

describe('reconstruirPresidencia', () => {
  function jugarEnModo(seed: number, clubId: string, modo: Modo): GameState {
    const chooser = new Rand(seed ^ 0x1234567);
    let state = startRun({ seed, clubId, modo });
    let guard = 0;
    while (state.status === 'jugando' && guard++ < 4000) {
      const opciones = optionCount(state);
      if (opciones === 0) break;
      state = applyChoice(state, chooser.int(0, opciones - 1));
    }
    return state;
  }

  it('devuelve la partida exacta en los tres modos', () => {
    for (const modo of MODOS) {
      const original = jugarEnModo(987654321, 'talleres', modo);
      const code = encodeRun({
        seed: original.seed,
        clubId: original.clubId,
        modo: original.modo,
        choices: original.choices,
      });
      const reconstruida = reconstruirPresidencia(code);
      expect(reconstruida, `modo ${modo}`).toEqual(original);
      expect(reconstruida?.modo, `modo ${modo}`).toBe(modo);
    }
  });

  it('descarta lo que no es una presidencia terminada', () => {
    const aMedias = encodeRun({ seed: 4242, clubId: 'boca', choices: [0, 0, 0] });
    expect(reconstruirPresidencia(aMedias)).toBeNull();
  });

  it('no lanza con un link inventado', () => {
    for (const basura of ['', 'x', '../../etc/passwd', 'A'.repeat(500), '%%%%']) {
      expect(() => reconstruirPresidencia(basura)).not.toThrow();
      expect(reconstruirPresidencia(basura)).toBeNull();
    }
  });
});
