/**
 * Identidad anónima para el ranking.
 *
 * No hay cuentas. Un uuid que el navegador genera una vez sirve para dos
 * cosas: imponer "una Presidencia del Día por persona" y que alguien pueda
 * reconocerse en la tabla. No identifica a nadie ni viaja a ningún lado que
 * no sea el ranking.
 *
 * El nombre lo elige el jugador y también vive acá: pedirlo cada vez que
 * termina una partida sería una fricción absurda.
 */

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
    // Sin almacenamiento se genera uno por sesión: se puede jugar y enviar,
    // pero el tope de una por día no se sostiene. Es el mal menor.
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
    // Se vuelve a pedir la próxima vez.
  }
}

/**
 * El nombre de dirigente que le toca a quien no puso el suyo.
 *
 * Se sortea una sola vez y queda guardado. Que quede guardado es el punto: el
 * acta de asunción, el epílogo y la fila de la tabla tienen que decir lo
 * mismo, y un nombre que se sortea en cada render los haría discrepar entre
 * dos pantallas de la misma partida.
 *
 * No usa el azar sembrado del motor a propósito. Esto no es parte de la
 * partida —no la cambia, no viaja en el log, no lo verifica el servidor— así
 * que atarlo a la semilla haría que todos los que juegan la Presidencia del
 * Día se llamaran igual.
 */
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

/** El nombre que firma: el que puso el jugador, o el que le tocó. */
export function nombreDelPresidente(): string {
  return leerNombre().trim() || nombreAsignado();
}
