import { describe, expect, it } from 'vitest';

import { LARGO_MAXIMO_NOMBRE, limpiarNombre } from './nombre';

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
    expect(limpiarNombre('​​​')).toBeNull();
    expect(limpiarNombre('﻿')).toBeNull();
    expect(limpiarNombre('   ')).toBeNull();
    expect(limpiarNombre('')).toBeNull();
  });

  it('saca los overrides de dirección', () => {
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

    const conEspacio = limpiarNombre('aaaaaaaaaaaaaaaaaaaaaaa bbb');
    expect(conEspacio).toBe('aaaaaaaaaaaaaaaaaaaaaaa');
  });

  it('no parte por la mitad una letra de fuera del plano básico', () => {
    const limpio = limpiarNombre('a'.repeat(23) + '\u{1d400}\u{1d400}');
    expect(limpio).toBe('a'.repeat(23) + '\u{1d400}');
    expect([...limpio!].length).toBe(24);
  });

  it('trata cualquier espacio como espacio, no como basura', () => {
    expect(limpiarNombre('a b')).toBe('a b');
    expect(limpiarNombre('a　b')).toBe('a b');
    expect(limpiarNombre('a b')).toBe('a b');
  });

  it('conserva las tildes y la eñe, vengan compuestas o descompuestas', () => {
    expect(limpiarNombre('Doña Rosa')).toBe('Doña Rosa');
    expect(limpiarNombre('José Sanfilippo')).toBe('José Sanfilippo');
    expect(limpiarNombre('José')).toBe('José');
    expect(limpiarNombre('Ñuñez')).toBe('Ñuñez');
  });

  it('deja los signos que aparecen en nombres de verdad', () => {
    expect(limpiarNombre('D. Ameal')).toBe('D. Ameal');
    expect(limpiarNombre("O'Higgins")).toBe("O'Higgins");
    expect(limpiarNombre('Jean-Pierre')).toBe('Jean-Pierre');
  });

  it('saca lo que convertiría la tabla en otra cosa', () => {
    expect(limpiarNombre('<b>hola</b>')).toBe('bholab');
    expect(limpiarNombre('Riquelme 🏆🏆')).toBe('Riquelme');
    expect(limpiarNombre('@@@')).toBeNull();
    expect(limpiarNombre('¯\\_(ツ)_/¯')).toBe('ツ');
  });
});
