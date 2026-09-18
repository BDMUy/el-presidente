import { describe, expect, it } from 'vitest';

import { ALL_EVENTS } from '@/content/events';
import { marcarTerminos } from '@/lib/resaltado';

const claves = (texto: string) =>
  marcarTerminos(texto)
    .filter((t) => t.clave)
    .map((t) => t.texto);

describe('marcarTerminos', () => {
  it('marca plata, porcentajes y cantidades con unidad', () => {
    expect(claves('Pide 3 millones y el 40% de la próxima venta.')).toEqual([
      '3 millones',
      '40%',
    ]);
    expect(claves('Dice que hay 14.500 socios al día.')).toEqual(['14.500 socios']);
  });

  it('marca lo que alguien dijo entre comillas', () => {
    expect(claves('Avisa: «esto se arregla o no se juega».')).toEqual([
      '«esto se arregla o no se juega»',
    ]);
  });

  it('no marca edades ni años, que no son una cifra en juego', () => {
    const texto = 'El capitán tiene 34 años y pide renovar.';
    expect(marcarTerminos(texto)).toEqual([{ texto, clave: false }]);
  });

  it('deja intacto el texto sin cifras ni comillas', () => {
    const texto = 'El utilero se va del club después de treinta años.';
    expect(marcarTerminos(texto)).toEqual([{ texto, clave: false }]);
  });

  it('reconstruye siempre el texto original', () => {
    for (const evento of ALL_EVENTS) {
      expect(marcarTerminos(evento.text).map((t) => t.texto).join('')).toBe(evento.text);
    }
  });

  it('nunca marca más de tres términos por relato', () => {
    for (const evento of ALL_EVENTS) {
      expect(claves(evento.text).length).toBeLessThanOrEqual(3);
    }
  });
});
