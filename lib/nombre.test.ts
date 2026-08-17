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

  it('no parte por la mitad una letra de fuera del plano básico', () => {
    // U+1D400 es una letra y ocupa dos unidades de UTF-16. Cortando por
    // unidades, el carácter 24 caería en la mitad de la última y dejaría un
    // sustituto suelto guardado en la tabla.
    const limpio = limpiarNombre('a'.repeat(23) + '\u{1d400}\u{1d400}');
    expect(limpio).toBe('a'.repeat(23) + '\u{1d400}');
    expect([...limpio!].length).toBe(24);
  });

  it('trata cualquier espacio como espacio, no como basura', () => {
    // El espacio duro y el ideográfico no son letras ni signos permitidos:
    // borrarlos en vez de convertirlos pegaba dos palabras que iban separadas.
    expect(limpiarNombre('a b')).toBe('a b');
    expect(limpiarNombre('a　b')).toBe('a b');
    expect(limpiarNombre('a b')).toBe('a b');
  });

  it('conserva las tildes y la eñe, vengan compuestas o descompuestas', () => {
    expect(limpiarNombre('Doña Rosa')).toBe('Doña Rosa');
    expect(limpiarNombre('José Sanfilippo')).toBe('José Sanfilippo');
    // La misma "é" tecleada en forma descompuesta: e + acento combinante.
    expect(limpiarNombre('José')).toBe('José');
    expect(limpiarNombre('Ñuñez')).toBe('Ñuñez');
  });

  it('deja los signos que aparecen en nombres de verdad', () => {
    expect(limpiarNombre('D. Ameal')).toBe('D. Ameal');
    expect(limpiarNombre("O'Higgins")).toBe("O'Higgins");
    expect(limpiarNombre('Jean-Pierre')).toBe('Jean-Pierre');
  });

  it('saca lo que convertiría la tabla en otra cosa', () => {
    // El HTML ya no se guarda como texto: se cae por la regla de caracteres,
    // que es más estricta que la de seguridad.
    expect(limpiarNombre('<b>hola</b>')).toBe('bholab');
    expect(limpiarNombre('Riquelme 🏆🏆')).toBe('Riquelme');
    expect(limpiarNombre('@@@')).toBeNull();
    expect(limpiarNombre('¯\\_(ツ)_/¯')).toBe('ツ');
  });
});
