import { limpiarNombre } from '@/lib/nombre';

export const TIPOS_CONTACTO = ['acceso', 'borrado', 'otra'] as const;
export type TipoContacto = (typeof TIPOS_CONTACTO)[number];

export const LARGO_MAXIMO_MENSAJE = 2000;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactoLimpio {
  nombre: string | null;
  email: string;
  tipo: TipoContacto;
  mensaje: string;
}

function limpiarEmail(crudo: unknown): string | null {
  if (typeof crudo !== 'string') return null;
  const limpio = crudo.trim().slice(0, 254);
  return EMAIL.test(limpio) ? limpio : null;
}

function esTipoContacto(crudo: unknown): crudo is TipoContacto {
  return typeof crudo === 'string' && (TIPOS_CONTACTO as readonly string[]).includes(crudo);
}

function limpiarMensaje(crudo: unknown): string | null {
  if (typeof crudo !== 'string') return null;
  const limpio = crudo.trim().slice(0, LARGO_MAXIMO_MENSAJE);
  return limpio.length === 0 ? null : limpio;
}

export function limpiarContacto(crudo: {
  nombre?: unknown;
  email?: unknown;
  tipo?: unknown;
  mensaje?: unknown;
}): ContactoLimpio | null {
  const email = limpiarEmail(crudo.email);
  const mensaje = limpiarMensaje(crudo.mensaje);
  if (!email || !mensaje || !esTipoContacto(crudo.tipo)) return null;

  const nombre = crudo.nombre === undefined ? null : limpiarNombre(crudo.nombre);

  return { nombre, email, tipo: crudo.tipo, mensaje };
}
