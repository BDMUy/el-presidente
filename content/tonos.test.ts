import { describe, expect, it } from 'vitest';

import { ALL_EVENTS } from '@/content/events';
import { TONO_LABEL } from '@/lib/engine/types';

const conAlgunTono = ALL_EVENTS.filter((evento) => evento.options.some((o) => o.tono));

describe('tonos de las opciones', () => {
  it('etiqueta la carta entera o ninguna opción', () => {
    const aMedias = conAlgunTono
      .filter((evento) => evento.options.some((o) => !o.tono))
      .map((evento) => evento.id);
    expect(aMedias).toEqual([]);
  });

  it('no repite el mismo tono en todas las opciones de una carta', () => {
    const sinContraste = conAlgunTono
      .filter((evento) => new Set(evento.options.map((o) => o.tono)).size === 1)
      .map((evento) => evento.id);
    expect(sinContraste).toEqual([]);
  });

  it('usa solo tonos del vocabulario cerrado', () => {
    const fuera = ALL_EVENTS.flatMap((evento) =>
      evento.options.filter((o) => o.tono && !(o.tono in TONO_LABEL)).map(() => evento.id),
    );
    expect(fuera).toEqual([]);
  });
});
