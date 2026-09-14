import { describe, expect, it } from 'vitest';
import { DEUDA_INHIBICION, type PlayerOffer } from './engine/types';
import { cajaTras, motivoBloqueo } from './mercado-seleccion';

function oferta(nombre: string, cost: number): PlayerOffer {
  return {
    name: nombre,
    kind: cost >= 0 ? 'compra' : 'venta',
    archetype: 'arquetipo',
    age: 25,
    note: 'nota',
    cost,
    plantelDelta: cost >= 0 ? 5 : -5,
    hinchadaDelta: 0,
    risk: 0,
  };
}

const compraCara = oferta('Caro', 12);
const compraBarata = oferta('Barato', 1);
const venta = oferta('Vendido', -20);

describe('selección del mercado', () => {
  it('deja endeudarse mientras no llegue a la inhibición', () => {
    expect(cajaTras(5, [compraCara])).toBe(-7);
    expect(motivoBloqueo(compraCara, [], 5, 3)).toBeNull();
  });

  it('bloquea la operación que deja la caja en el umbral de inhibición o peor', () => {
    expect(cajaTras(-6, [compraCara])).toBe(DEUDA_INHIBICION);
    expect(motivoBloqueo(compraCara, [], -6, 3)).toBe('Te inhibe el club');
    expect(motivoBloqueo(compraCara, [], -7, 3)).toBe('Te inhibe el club');
  });

  it('una venta en el mismo combo habilita la compra que sola no entraba', () => {
    expect(motivoBloqueo(compraCara, [], -6, 3)).toBe('Te inhibe el club');
    expect(motivoBloqueo(compraCara, [venta], -6, 3)).toBeNull();
    expect(cajaTras(-6, [venta, compraCara])).toBe(2);
  });

  it('no bloquea lo que ya está marcado, para poder desmarcarlo', () => {
    expect(motivoBloqueo(compraCara, [compraCara], -50, 1)).toBeNull();
  });

  it('corta al llegar al tope de firmas de la ventana', () => {
    expect(motivoBloqueo(compraBarata, [venta, compraCara], 100, 2)).toBe('Ya elegiste 2');
    expect(motivoBloqueo(compraBarata, [venta], 100, 2)).toBeNull();
  });
});
