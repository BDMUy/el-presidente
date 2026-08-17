import { describe, expect, it } from 'vitest';

import { LARGO_MAXIMO_NOMBRE, limpiarNombre } from './nombre';

/**
 * Cada caso de "lo que entraba antes" salió de atacar el endpoint de verdad,
 * no de imaginar qué podría mandar alguien.
 */
describe('limpiarNombre', () => {
  it('deja pasar un nombre normal', () => {
    expect(limpiarNombre('Riquelme')).toBe('Riquelme');
    expect(limpiarNombre('  Doña Rosa  ')).toBe('Doña Rosa');
  });

  it('rechaza lo que no es texto', () => {
    expect(limpiarNombre(null)).toBeNull();
    expect(limpiarNombre(42)).toBeNull();
    expect(limpiarNombre({ toString: () => 'x' })).toBeNull();
  });

  it('rechaza un nombre hecho solo de caracteres invisibles', () => {
    // Tres anchos cero: pasaban el trim() y entraban como fila en blanco.
    expect(limpiarNombre('​​​')).toBeNull();
    expect(limpiarNombre('﻿')).toBeNull();
    expect(limpiarNombre('   ')).toBeNull();
    expect(limpiarNombre('')).toBeNull();
  });

  it('saca los overrides de dirección', () => {
    // U+202E da vuelta el sentido de lectura del resto del renglón.
    expect(limpiarNombre('admin‮0001')).toBe('admin0001');
    expect(limpiarNombre('⁦hola⁩')).toBe('hola');
  });

  it('aplasta los saltos de línea, que rompen el renglón de la tabla', () => {
    expect(limpiarNombre('linea1\nlinea2\nlinea3')).toBe('linea1 linea2 linea3');
    expect(limpiarNombre('a\tb')).toBe('a b');
    expect(limpiarNombre('a  b')).toBe('a b');
  });

  it('corta al largo máximo sin dejar espacios colgando', () => {
    const largo = limpiarNombre('A'.repeat(5000));
    expect(largo).toHaveLength(LARGO_MAXIMO_NOMBRE);

    // El corte cae justo sobre un espacio: no puede quedar al final.
    const conEspacio = limpiarNombre('aaaaaaaaaaaaaaaaaaaaaaa bbb');
    expect(conEspacio).toBe('aaaaaaaaaaaaaaaaaaaaaaa');
  });

  it('no parte un emoji al medio', () => {
    // Cortando por unidades de UTF-16, el carácter 24 caería en la mitad del
    // último emoji y dejaría un sustituto suelto.
    const limpio = limpiarNombre('a'.repeat(23) + '\u{1f9c9}\u{1f9c9}');
    expect(limpio).toBe('a'.repeat(23) + '\u{1f9c9}');
    expect([...limpio!].length).toBe(24);
  });

  it('deja el HTML como texto: escaparlo es tarea de quien lo muestra', () => {
    expect(limpiarNombre('<b>hola</b>')).toBe('<b>hola</b>');
  });
});
