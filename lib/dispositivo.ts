import { DIRIGENTES, TODOS_LOS_DIRIGENTES } from '@/content/parodias';
import type { Country } from '@/lib/engine/types';

const KEY_ID = 'el-presidente:dispositivo';
const KEY_NOMBRE = 'el-presidente:nombre';
const KEY_ASIGNADO = 'el-presidente:nombre-asignado';
const EVENTO_REASIGNADO = 'el-presidente:nombre-asignado-cambio';
export const RETRATOS = [
  'pomposo',
  'tecnocrata',
  'populista',
  'viejo-guardia',
  'socia',
  'exjugador',
  'barra',
  'heredero',
] as const;
export type Retrato = (typeof RETRATOS)[number];

export function idDispositivo(): string {
  if (typeof window === 'undefined') return '';
  try {
    const guardado = window.localStorage.getItem(KEY_ID);
    if (guardado) return guardado;
    const nuevo = crypto.randomUUID();
    window.localStorage.setItem(KEY_ID, nuevo);
    return nuevo;
  } catch {
    return crypto.randomUUID();
  }
}

export function leerNombre(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(KEY_NOMBRE) ?? '';
  } catch {
    return '';
  }
}

export function guardarNombre(nombre: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY_NOMBRE, nombre.trim().slice(0, 24));
  } catch {
  }
}

export function nombreAsignado(): string {
  if (typeof window === 'undefined') return TODOS_LOS_DIRIGENTES[0];
  try {
    const guardado = window.localStorage.getItem(KEY_ASIGNADO);
    if (guardado) return guardado;
    return reasignarNombre();
  } catch {
    return TODOS_LOS_DIRIGENTES[0];
  }
}

export function reasignarNombre(pais?: Country): string {
  if (typeof window === 'undefined') return TODOS_LOS_DIRIGENTES[0];
  const bolsa = pais ? DIRIGENTES[pais] : TODOS_LOS_DIRIGENTES;
  const sorteado = bolsa[Math.floor(Math.random() * bolsa.length)];
  try {
    window.localStorage.setItem(KEY_ASIGNADO, sorteado);
  } catch {
  }
  window.dispatchEvent(new Event(EVENTO_REASIGNADO));
  return sorteado;
}

export function alReasignarNombre(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENTO_REASIGNADO, callback);
  return () => window.removeEventListener(EVENTO_REASIGNADO, callback);
}

export function nombreDelPresidente(): string {
  return leerNombre().trim() || nombreAsignado();
}

export function retratoDeSemilla(seed: number): Retrato {
  return RETRATOS[Math.abs(seed) % RETRATOS.length];
}
