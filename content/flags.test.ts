import { describe, expect, it } from 'vitest';

import { ALL_EVENTS } from './events';
import type { Condition, Effects } from '@/lib/engine/types';

const FLAGS_DEL_MOTOR = ['continental', 'libertadores', 'prontuario'];

const FLAGS_SIN_CONSUMIDOR = [
  'auditoria_trabada',
  'barra_adentro',
  'barra_arreglada',
  'comision_propia',
  'debe_favor',
  'gerenciado',
  'libertadores',
  'pibe_madurando',
  'prensa_comprada',
  'recompra',
];

function juntarProducidos(effects: Effects | undefined, acc: Set<string>): void {
  if (!effects) return;
  for (const nombre of Object.keys(effects.flags ?? {})) acc.add(nombre);
  for (const nombre of Object.keys(effects.flagsSuma ?? {})) acc.add(nombre);
  for (const diferido of effects.deferred ?? []) juntarProducidos(diferido.effects, acc);
}

function juntarConsumidos(cond: Condition | undefined, acc: Set<string>): void {
  if (!cond) return;
  if (cond.flag) acc.add(cond.flag);
  if (cond.notFlag) acc.add(cond.notFlag);
  for (const nombre of Object.keys(cond.minFlag ?? {})) acc.add(nombre);
}

const producidos = new Set<string>();
const consumidos = new Set<string>();

for (const evento of ALL_EVENTS) {
  juntarConsumidos(evento.requires, consumidos);
  for (const opcion of evento.options) {
    juntarConsumidos(opcion.requires, consumidos);
    juntarProducidos(opcion.effects, producidos);
    for (const rama of opcion.random ?? []) juntarProducidos(rama.effects, producidos);
  }
}

const disponibles = new Set([...producidos, ...FLAGS_DEL_MOTOR]);

describe('integridad de flags', () => {
  it('todo flag que un requires consume tiene quien lo produzca', () => {
    const huerfanos = [...consumidos].filter((f) => !disponibles.has(f)).sort();
    expect(
      huerfanos,
      `requires pide flags que nada setea (ni el contenido ni el motor): ${huerfanos.join(', ')}`,
    ).toEqual([]);
  });

  it('los flags que se producen y ningún requires consume son los ya conocidos', () => {
    const sinConsumidor = [...disponibles].filter((f) => !consumidos.has(f)).sort();
    expect(
      sinConsumidor,
      `flags nuevos sin consumidor: ${sinConsumidor.filter((f) => !FLAGS_SIN_CONSUMIDOR.includes(f)).join(', ')}`,
    ).toEqual([...FLAGS_SIN_CONSUMIDOR].sort());
  });
});
