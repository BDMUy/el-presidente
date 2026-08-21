import { DIRIGENTES } from '@/content/parodias';

const KEY_ID = 'el-presidente:dispositivo';
const KEY_NOMBRE = 'el-presidente:nombre';
const KEY_ASIGNADO = 'el-presidente:nombre-asignado';

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
  if (typeof window === 'undefined') return DIRIGENTES[0];
  try {
    const guardado = window.localStorage.getItem(KEY_ASIGNADO);
    if (guardado) return guardado;

    const sorteado = DIRIGENTES[Math.floor(Math.random() * DIRIGENTES.length)];
    window.localStorage.setItem(KEY_ASIGNADO, sorteado);
    return sorteado;
  } catch {
    return DIRIGENTES[0];
  }
}

export function nombreDelPresidente(): string {
  return leerNombre().trim() || nombreAsignado();
}
