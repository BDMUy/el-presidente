import { describe, expect, it } from 'vitest';

import { CLUBS, getClub } from '@/content/clubs';
import { ALL_EVENTS, findDuplicateIds } from '@/content/events';
import { APELLIDOS } from '@/content/nombres';
import { applyEffects, applyResources, estaInhibido, meetsCondition } from './effects';
import { checkEarlyExit, computeScore, DEUDA_QUIEBRA, resolveElection } from './election';
import { applyChoice, initialResources, optionCount, replayRun, startRun } from './engine';
import { assignmentIndex, enumerateAssignments, winProbability } from './mesa-chica';
import { generateOffers } from './mercado';
import { Rand, seedFromString } from './rng';
import { expectedPosition, plantelForPosition, resolvePosition } from './season';
import { RECURSOS_POR_ID } from '@/lib/recursos';
import type { GameState } from './types';
import { FICHAS_MESA_CHICA, HINCHADA_ASAMBLEA, TEMPORADAS_POR_MODO } from './types';

function playThrough(seed: number, clubId: string, pick: (state: GameState) => number): GameState {
  let state = startRun({ seed, clubId });
  let guard = 0;
  while (state.status === 'jugando' && guard++ < 2000) {
    const options = optionCount(state);
    if (options === 0) break;
    state = applyChoice(state, Math.min(pick(state), options - 1));
  }
  return state;
}

const alwaysFirst = () => 0;

describe('Rand', () => {
  it('produce la misma secuencia con la misma semilla', () => {
    const a = new Rand(12345);
    const b = new Rand(12345);
    const seqA = Array.from({ length: 50 }, () => a.next());
    const seqB = Array.from({ length: 50 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it('produce secuencias distintas con semillas distintas', () => {
    const a = new Rand(1).next();
    const b = new Rand(2).next();
    expect(a).not.toBe(b);
  });

  it('mantiene los valores dentro de rango', () => {
    const rand = new Rand(99);
    for (let i = 0; i < 500; i++) {
      const value = rand.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
      expect(rand.int(3, 7)).toBeGreaterThanOrEqual(3);
      expect(rand.int(3, 7)).toBeLessThanOrEqual(7);
    }
  });

  it('seedFromString es estable', () => {
    expect(seedFromString('2026-08-13')).toBe(seedFromString('2026-08-13'));
    expect(seedFromString('2026-08-13')).not.toBe(seedFromString('2026-08-14'));
  });
});

describe('efectos', () => {
  it('acota los recursos a sus límites', () => {
    const base = { caja: 0, hinchada: 95, socios: 10, plantel: 98, influencia: 5 };
    const next = applyResources(base, { hinchada: 20, plantel: 20, influencia: -20 });
    expect(next.hinchada).toBe(100);
    expect(next.plantel).toBe(100);
    expect(next.influencia).toBe(0);
  });

  it('deja que la caja vaya a negativo: la deuda es una mecánica', () => {
    const base = { caja: 2, hinchada: 50, socios: 10, plantel: 50, influencia: 50 };
    expect(applyResources(base, { caja: -20 }).caja).toBe(-18);
  });

  it('agenda los efectos diferidos en la temporada correcta', () => {
    const state = startRun({ seed: 1, clubId: 'boca' });
    const next = applyEffects(state, {
      deferred: [{ inSeasons: 3, text: 'x', effects: { hinchada: -10 } }],
    });
    expect(next.pending).toHaveLength(1);
    expect(next.pending[0].dueSeason).toBe(state.season + 3);
  });
});

describe('condiciones', () => {
  const state = startRun({ seed: 7, clubId: 'temperley' });

  it('sin condición, siempre pasa', () => {
    expect(meetsCondition(undefined, state, 5)).toBe(true);
  });

  it('filtra por categoría', () => {
    expect(meetsCondition({ category: ['nacional'] }, state, 5)).toBe(true);
    expect(meetsCondition({ category: ['primera'] }, state, 5)).toBe(false);
  });

  it('filtra por temporada', () => {
    expect(meetsCondition({ minSeason: 5 }, state, 5)).toBe(false);
    expect(meetsCondition({ maxSeason: 1 }, state, 5)).toBe(true);
  });

  it('filtra por flags', () => {
    const conFlag = { ...state, flags: { barra_arreglada: true } };
    expect(meetsCondition({ flag: 'barra_arreglada' }, conFlag, 5)).toBe(true);
    expect(meetsCondition({ notFlag: 'barra_arreglada' }, conFlag, 5)).toBe(false);
  });
});

describe('resolución deportiva', () => {
  it('un plantel mejor termina más arriba, en promedio', () => {
    const rand = new Rand(4242);
    const flojo: number[] = [];
    const fuerte: number[] = [];
    for (let i = 0; i < 400; i++) {
      flojo.push(resolvePosition({ caja: 0, hinchada: 50, socios: 0, plantel: 45, influencia: 0 }, 'primera', rand));
      fuerte.push(resolvePosition({ caja: 0, hinchada: 50, socios: 0, plantel: 75, influencia: 0 }, 'primera', rand));
    }
    const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
    expect(avg(fuerte)).toBeLessThan(avg(flojo));
  });

  it('nunca devuelve una posición fuera de la tabla', () => {
    const rand = new Rand(11);
    for (let i = 0; i < 500; i++) {
      const pos = resolvePosition(
        { caja: 0, hinchada: 50, socios: 0, plantel: rand.int(0, 100), influencia: 0 },
        'primera',
        rand,
      );
      expect(pos).toBeGreaterThanOrEqual(1);
      expect(pos).toBeLessThanOrEqual(30);
    }
  });

  it('plantelForPosition es la inversa de resolvePosition sin ruido', () => {
    const plantel = plantelForPosition(10, 'primera');
    const rand = new Rand(555);
    const results: number[] = [];
    for (let i = 0; i < 800; i++) {
      results.push(resolvePosition({ caja: 0, hinchada: 50, socios: 0, plantel, influencia: 0 }, 'primera', rand));
    }
    results.sort((a, b) => a - b);
    expect(results[400]).toBeGreaterThan(6);
    expect(results[400]).toBeLessThan(15);
  });

  it('la expectativa respeta el tamaño dentro de cada categoría', () => {
    const boca = getClub('boca');
    const riestra = getClub('riestra');
    expect(expectedPosition(boca, 'primera')).toBeLessThan(expectedPosition(riestra, 'primera'));
  });
});

describe('Mesa Chica', () => {
  it('enumera los repartos de hasta 3 fichas en 5 frentes', () => {
    const all = enumerateAssignments();
    expect(all).toHaveLength(56);
    for (const assignment of all) {
      const total = Object.values(assignment).reduce((s, n) => s + n, 0);
      expect(total).toBeLessThanOrEqual(FICHAS_MESA_CHICA);
      expect(total).toBeGreaterThanOrEqual(0);
    }
  });

  it('incluye el reparto vacío: guardarse las fichas es una decisión', () => {
    const vacio = { plantel: 0, dt: 0, hinchada: 0, prensa: 0, gestion: 0 };
    expect(() => assignmentIndex(vacio)).not.toThrow();
  });

  it('todo reparto que la UI puede armar tiene índice', () => {
    const ids = ['plantel', 'dt', 'hinchada', 'prensa', 'gestion'] as const;
    for (let total = 0; total <= FICHAS_MESA_CHICA; total++) {
      for (const a of ids) {
        for (const b of ids) {
          const reparto = { plantel: 0, dt: 0, hinchada: 0, prensa: 0, gestion: 0 };
          for (let i = 0; i < total; i++) reparto[i % 2 === 0 ? a : b] += 1;
          expect(() => assignmentIndex(reparto)).not.toThrow();
        }
      }
    }
  });

  it('el orden es estable, así el log del jugador se puede reproducir', () => {
    expect(enumerateAssignments()).toEqual(enumerateAssignments());
  });

  it('assignmentIndex encuentra todos los repartos', () => {
    enumerateAssignments().forEach((assignment, index) => {
      expect(assignmentIndex(assignment)).toBe(index);
    });
  });

  it('más fichas nunca bajan la probabilidad de ganar', () => {
    const match = { competition: 'copa' as const, label: 'x', rival: 'y', baseWin: 0.4, title: 'copa-argentina' as const };
    const nada = { plantel: 0, dt: 0, hinchada: 0, prensa: 0, gestion: 0 };
    const todo = { plantel: 3, dt: 0, hinchada: 0, prensa: 0, gestion: 0 };
    expect(winProbability(match, todo)).toBeGreaterThan(winProbability(match, nada));
  });

  it('la probabilidad queda siempre acotada', () => {
    const imposible = { competition: 'copa' as const, label: 'x', rival: 'y', baseWin: -5, title: 'copa-argentina' as const };
    const seguro = { competition: 'copa' as const, label: 'x', rival: 'y', baseWin: 5, title: 'copa-argentina' as const };
    const todo = { plantel: 0, dt: 0, hinchada: 0, prensa: 0, gestion: 3 };
    expect(winProbability(imposible, todo)).toBeGreaterThanOrEqual(0.05);
    expect(winProbability(seguro, todo)).toBeLessThanOrEqual(0.92);
  });
});

describe('arranque', () => {
  it('cada club arranca en su expectativa', () => {
    for (const club of CLUBS) {
      const resources = initialResources(club);
      const esperado = plantelForPosition(expectedPosition(club, club.category), club.category);
      expect(Math.abs(resources.plantel - esperado)).toBeLessThan(0.2);
    }
  });

  it('todos los clubes arrancan una partida sin romperse', () => {
    for (const club of CLUBS) {
      const state = startRun({ seed: 1234, clubId: club.id });
      expect(state.status).toBe('jugando');
      expect(state.phase.kind).toBe('mercado');
      expect(optionCount(state)).toBeGreaterThan(0);
    }
  });

  it('el club en llamas arranca fundido, inhibido y perdiendo la elección', () => {
    const normal = startRun({ seed: 5, clubId: 'boca' });
    const llamas = startRun({ seed: 5, clubId: 'boca', modo: 'llamas' });

    expect(llamas.resources.caja).toBe(-22);
    expect(estaInhibido(llamas.resources)).toBe(true);
    expect(llamas.resources.plantel).toBe(normal.resources.plantel + 12);
    expect(llamas.resources.hinchada).toBe(40);
    expect(llamas.resources.hinchada).toBeLessThan(45);

    for (const modo of ['corta', 'normal', 'larga'] as const) {
      expect(startRun({ seed: 5, clubId: 'boca', modo }).resources.hinchada).toBe(55);
    }
  });

  it('en llamas quiere decir lo mismo con cualquier club', () => {
    for (const clubId of ['river', 'boca', 'lanus', 'acassuso']) {
      const st = startRun({ seed: 7, clubId, modo: 'llamas' });
      expect(st.resources.caja, clubId).toBe(-22);
      expect(estaInhibido(st.resources), clubId).toBe(true);
    }
  });

  it('un club desconocido falla fuerte y claro', () => {
    expect(() => startRun({ seed: 1, clubId: 'no-existe' })).toThrow(/Club desconocido/);
  });
});

describe('determinismo', () => {
  it('la misma semilla y las mismas decisiones dan el mismo estado final', () => {
    const a = playThrough(777, 'lanus', alwaysFirst);
    const b = playThrough(777, 'lanus', alwaysFirst);
    expect(b).toEqual(a);
  });

  it('replayRun reconstruye exactamente una partida a partir del log', () => {
    const chooser = new Rand(31337);
    let original = startRun({ seed: 9001, clubId: 'racing' });
    let guard = 0;
    while (original.status === 'jugando' && guard++ < 2000) {
      const options = optionCount(original);
      if (options === 0) break;
      original = applyChoice(original, chooser.int(0, options - 1));
    }

    const replayed = replayRun(9001, 'racing', original.choices);
    expect(replayed.choices).toEqual(original.choices);
    expect(computeScore(replayed)).toBe(computeScore(original));
    expect(replayed).toEqual(original);
  });

  it('semillas distintas divergen', () => {
    const a = playThrough(1, 'boca', alwaysFirst);
    const b = playThrough(2, 'boca', alwaysFirst);
    expect(computeScore(a)).not.toBe(computeScore(b));
  });

  it('replayRun rechaza una decisión fuera de rango', () => {
    expect(() => replayRun(1, 'boca', [999])).toThrow(/Decisión inválida/);
  });
});

describe('recorrido completo', () => {
  it('toda partida termina y deja un final escrito', () => {
    for (let seed = 0; seed < 60; seed++) {
      const club = CLUBS[seed % CLUBS.length];
      const state = playThrough(seed * 7919, club.id, alwaysFirst);
      expect(state.status).toBe('terminado');
      expect(state.ending).not.toBeNull();
      expect(state.ending!.text.length).toBeGreaterThan(20);
      expect(state.season).toBeLessThanOrEqual(TEMPORADAS_POR_MODO[state.modo]);
    }
  });

  it('nunca se ofrece una fase sin opciones mientras la partida sigue', () => {
    const chooser = new Rand(4);
    let state = startRun({ seed: 42, clubId: 'quilmes' });
    let guard = 0;
    while (state.status === 'jugando' && guard++ < 2000) {
      expect(optionCount(state)).toBeGreaterThan(0);
      state = applyChoice(state, chooser.int(0, optionCount(state) - 1));
    }
    expect(state.status).toBe('terminado');
  });

  it('el historial tiene una entrada por temporada jugada', () => {
    const state = playThrough(123, 'ferro', alwaysFirst);
    expect(state.history.length).toBe(state.season);
    expect(new Set(state.history.map((h) => h.season)).size).toBe(state.history.length);
  });
});

describe('finales', () => {
  it('la asamblea te voltea con la hinchada en el piso', () => {
    const state = startRun({ seed: 1, clubId: 'boca' });
    const hundido = { ...state, resources: { ...state.resources, hinchada: HINCHADA_ASAMBLEA } };
    expect(checkEarlyExit(hundido)).toBe('asamblea');
  });

  it('la quiebra se dispara con la deuda descontrolada', () => {
    const state = startRun({ seed: 1, clubId: 'boca' });
    const fundido = { ...state, resources: { ...state.resources, caja: DEUDA_QUIEBRA - 1 } };
    expect(checkEarlyExit(fundido)).toBe('quiebra');
  });

  it('una gestión sana no dispara ningún final anticipado', () => {
    const state = startRun({ seed: 1, clubId: 'boca' });
    expect(checkEarlyExit(state)).toBeNull();
  });
});

describe('elecciones', () => {
  it('la influencia permite sobrevivir un mandato mediocre', () => {
    const base = startRun({ seed: 3, clubId: 'huracan' });
    const sinInfluencia = { ...base, season: 4, resources: { ...base.resources, hinchada: 48, influencia: 0 } };
    const conInfluencia = { ...base, season: 4, resources: { ...base.resources, hinchada: 48, influencia: 100 } };
    const a = resolveElection(sinInfluencia, new Rand(1));
    const b = resolveElection(conInfluencia, new Rand(1));
    expect(b.votes).toBeGreaterThan(a.votes);
  });

  it('con la hinchada por el piso se pierde la elección', () => {
    const base = startRun({ seed: 3, clubId: 'huracan' });
    const malo = { ...base, season: 4, resources: { ...base.resources, hinchada: 10, influencia: 0 } };
    expect(resolveElection(malo, new Rand(2)).won).toBe(false);
  });
});

describe('puntaje', () => {
  it('nunca es negativo', () => {
    const base = startRun({ seed: 1, clubId: 'acassuso' });
    const desastre = { ...base, descensos: 10, resources: { ...base.resources, hinchada: 0, caja: -50, socios: 0 } };
    expect(computeScore(desastre)).toBe(0);
  });

  it('los títulos suman', () => {
    const base = startRun({ seed: 1, clubId: 'boca' });
    const conTitulo = {
      ...base,
      titles: [{ id: 'libertadores' as const, season: 3, year: 2028 }],
    };
    expect(computeScore(conTitulo)).toBeGreaterThan(computeScore(base));
  });

  it('el descenso pesa más que cualquier atajo económico', () => {
    const base = startRun({ seed: 1, clubId: 'boca' });
    const conPlata = { ...base, resources: { ...base.resources, caja: base.resources.caja + 30 } };
    const conDescenso = { ...conPlata, descensos: 1 };
    expect(computeScore(conDescenso)).toBeLessThan(computeScore(base));
  });
});

describe('mercado', () => {
  it('no repite apellidos dentro de la misma ventana', () => {
    const rand = new Rand(2024);
    for (let i = 0; i < 300; i++) {
      const offers = generateOffers('primera', 'argentina', 60, rand);
      const apellidos = offers.map((o) => o.name.split(' ')[1]);
      expect(new Set(apellidos).size).toBe(apellidos.length);
    }
  });

  it('siempre ofrece una venta, una compra y un libre', () => {
    const rand = new Rand(99);
    for (let i = 0; i < 100; i++) {
      const kinds = generateOffers('nacional', 'argentina', 45, rand).map((o) => o.kind).sort();
      expect(kinds).toEqual(['compra', 'libre', 'venta']);
    }
  });

  it('genera nombres uruguayos para un club uruguayo', () => {
    const rand = new Rand(2026);
    for (let i = 0; i < 50; i++) {
      const offers = generateOffers('primera', 'uruguay', 60, rand);
      expect(offers.every((o) => !APELLIDOS.argentina.includes(o.name.split(' ').pop() ?? ''))).toBe(true);
    }
  });
});

describe('recursos', () => {
  it('cada recurso tiene su explicación', () => {
    for (const campo of ['caja', 'hinchada', 'socios', 'plantel', 'influencia'] as const) {
      const def = RECURSOS_POR_ID[campo];
      expect(def, campo).toBeDefined();
      expect(def.label.length, campo).toBeGreaterThan(3);
      expect(def.texto.length, campo).toBeGreaterThan(60);
    }
  });
});

describe('contenido', () => {
  it('no hay IDs de evento duplicados', () => {
    expect(findDuplicateIds()).toEqual([]);
  });

  it('todo evento tiene al menos dos opciones y textos completos', () => {
    for (const event of ALL_EVENTS) {
      expect(event.options.length, event.id).toBeGreaterThanOrEqual(2);
      expect(event.title.length, event.id).toBeGreaterThan(3);
      expect(event.text.length, event.id).toBeGreaterThan(20);
      for (const option of event.options) {
        expect(option.label.length, event.id).toBeGreaterThanOrEqual(2);
        expect(option.hint.length, event.id).toBeGreaterThan(5);
        expect(Boolean(option.effects || option.random), `${event.id}: ${option.label}`).toBe(true);
      }
    }
  });

  it('las ramas azarosas tienen pesos positivos', () => {
    for (const event of ALL_EVENTS) {
      for (const option of event.options) {
        for (const outcome of option.random ?? []) {
          expect(outcome.weight, event.id).toBeGreaterThan(0);
          expect(outcome.text.length, event.id).toBeGreaterThan(10);
        }
      }
    }
  });

  it('ningún evento queda inalcanzable por pedir opciones imposibles', () => {
    for (const event of ALL_EVENTS) {
      const sinRequisitos = event.options.filter((o) => !o.requires);
      expect(sinRequisitos.length, event.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('los clubes tienen IDs únicos y colores válidos', () => {
    const ids = CLUBS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const club of CLUBS) {
      expect(club.colors[0], club.id).toMatch(/^#[0-9a-f]{6}$/i);
      expect(club.colors[1], club.id).toMatch(/^#[0-9a-f]{6}$/i);
      expect(club.size, club.id).toBeGreaterThanOrEqual(1);
      expect(club.size, club.id).toBeLessThanOrEqual(10);
    }
  });
});
