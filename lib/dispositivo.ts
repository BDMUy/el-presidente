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

const KEY_ID = 'el-presidente:dispositivo';
const KEY_NOMBRE = 'el-presidente:nombre';

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
