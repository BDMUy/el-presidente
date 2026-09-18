import { existsSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { ALL_EVENTS } from '@/content/events';
import { HORAS, LUGARES, expedienteDe, ilustracionDeEvento } from '@/content/expedientes';

describe('expedientes', () => {
  it('da siempre el mismo lugar y hora para la misma carta', () => {
    expect(expedienteDe('cor-allanamiento')).toEqual(expedienteDe('cor-allanamiento'));
  });

  it('usa solo lugares y horas del pool', () => {
    for (const evento of ALL_EVENTS) {
      const { lugar, hora } = expedienteDe(evento.id);
      expect(LUGARES).toContain(lugar);
      expect(HORAS).toContain(hora);
    }
  });

  it('reparte las cartas entre todos los lugares', () => {
    const lugares = new Set(ALL_EVENTS.map((evento) => expedienteDe(evento.id).lugar));
    expect(lugares.size).toBe(LUGARES.length);
  });

  it('cada carta recibe una ilustración que existe en disco', () => {
    const faltantes = new Set<string>();
    for (const evento of ALL_EVENTS) {
      const { src } = ilustracionDeEvento(evento.id, evento.kind);
      if (!existsSync(`public${src}`)) faltantes.add(src);
    }
    expect([...faltantes]).toEqual([]);
  });
});
