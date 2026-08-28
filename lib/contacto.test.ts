import { describe, expect, it } from 'vitest';

import { LARGO_MAXIMO_MENSAJE, limpiarContacto } from './contacto';

describe('limpiarContacto', () => {
  it('acepta un pedido normal', () => {
    const resultado = limpiarContacto({
      nombre: 'Doña Rosa',
      email: 'rosa@example.com',
      tipo: 'borrado',
      mensaje: 'Quiero que borren mis datos del ranking.',
    });
    expect(resultado).toEqual({
      nombre: 'Doña Rosa',
      email: 'rosa@example.com',
      tipo: 'borrado',
      mensaje: 'Quiero que borren mis datos del ranking.',
    });
  });

  it('el nombre es opcional', () => {
    const resultado = limpiarContacto({
      email: 'rosa@example.com',
      tipo: 'otra',
      mensaje: 'Una consulta cualquiera.',
    });
    expect(resultado?.nombre).toBeNull();
  });

  it('rechaza un email con formato inválido', () => {
    expect(
      limpiarContacto({ email: 'no-es-un-email', tipo: 'acceso', mensaje: 'hola' }),
    ).toBeNull();
    expect(limpiarContacto({ email: '', tipo: 'acceso', mensaje: 'hola' })).toBeNull();
    expect(limpiarContacto({ tipo: 'acceso', mensaje: 'hola' })).toBeNull();
  });

  it('rechaza un tipo que no está en la lista', () => {
    expect(
      limpiarContacto({ email: 'a@b.com', tipo: 'spam', mensaje: 'hola' }),
    ).toBeNull();
    expect(limpiarContacto({ email: 'a@b.com', mensaje: 'hola' })).toBeNull();
  });

  it('rechaza un mensaje vacío', () => {
    expect(limpiarContacto({ email: 'a@b.com', tipo: 'acceso', mensaje: '' })).toBeNull();
    expect(limpiarContacto({ email: 'a@b.com', tipo: 'acceso', mensaje: '   ' })).toBeNull();
    expect(limpiarContacto({ email: 'a@b.com', tipo: 'acceso' })).toBeNull();
  });

  it('corta el mensaje al largo máximo', () => {
    const resultado = limpiarContacto({
      email: 'a@b.com',
      tipo: 'acceso',
      mensaje: 'a'.repeat(5000),
    });
    expect(resultado?.mensaje).toHaveLength(LARGO_MAXIMO_MENSAJE);
  });

  it('rechaza lo que no es texto', () => {
    expect(limpiarContacto({ email: 42, tipo: 'acceso', mensaje: 'hola' })).toBeNull();
    expect(limpiarContacto({ email: 'a@b.com', tipo: 'acceso', mensaje: 42 })).toBeNull();
  });
});
