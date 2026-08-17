/**
 * Limpieza del nombre que se muestra en el ranking.
 *
 * El campo es la única entrada de texto libre del juego y termina en una lista
 * pública, así que se trata como hostil. Nada de esto es teórico: se probó
 * contra el endpoint y todo lo que se filtra acá abajo entraba tal cual.
 *
 * React escapa el HTML, así que el riesgo no es ejecución de código sino
 * tipográfico, que en una tabla de posiciones alcanza para arruinarla:
 *
 *   - U+202E y compañía invierten el sentido del texto y pueden hacer que una
 *     fila se lea al revés y arrastre visualmente a las de al lado.
 *   - Los caracteres de ancho cero pasan el `trim()` sin ser nada, así que
 *     tres de ellos entraban como un nombre válido e invisible.
 *   - Un salto de línea rompe el renglón de la tabla y el de la imagen OG.
 *
 * Va por rangos de código y no por una clase de regex: un carácter de control
 * escrito literalmente adentro de un regex es, por definición, invisible en el
 * fuente, y el primer intento de este archivo terminó con un NUL de verdad en
 * el medio de una línea.
 */

/** Rangos que nunca pueden aparecer en un nombre, con el nombre de cada uno. */
const INVISIBLES: ReadonlyArray<readonly [number, number, string]> = [
  [0x0000, 0x001f, 'controles C0'],
  [0x007f, 0x009f, 'DEL y controles C1'],
  [0x200b, 0x200f, 'anchos cero y marcas de dirección'],
  [0x202a, 0x202e, 'incrustaciones y overrides de dirección'],
  [0x2060, 0x2064, 'juntadores invisibles'],
  [0x2066, 0x2069, 'aislamientos de dirección'],
  [0xfeff, 0xfeff, 'BOM usado como ancho cero'],
];

function esInvisible(punto: number): boolean {
  return INVISIBLES.some(([desde, hasta]) => punto >= desde && punto <= hasta);
}

/**
 * Tabulación, salto de línea, retorno, tabulación vertical y avance de página.
 *
 * Son controles, pero separan palabras, así que se convierten en espacio en
 * vez de borrarse: borrándolos, "linea1\nlinea2" quedaba "linea1linea2" y
 * pegaba dos palabras que no iban juntas.
 */
function esEspacioDeControl(punto: number): boolean {
  return punto >= 0x09 && punto <= 0x0d;
}

export const LARGO_MAXIMO_NOMBRE = 24;

/**
 * Devuelve el nombre listo para guardar, o null si no queda nada que mostrar.
 *
 * Null y no cadena vacía a propósito: quien llama tiene que decidir qué hacer,
 * y una cadena vacía se cuela sola hasta la base.
 */
export function limpiarNombre(crudo: unknown): string | null {
  if (typeof crudo !== 'string') return null;

  const visible = [...crudo.normalize('NFC')]
    .map((ch) => {
      const punto = ch.codePointAt(0) ?? 0;
      if (esEspacioDeControl(punto)) return ' ';
      return esInvisible(punto) ? '' : ch;
    })
    .join('');

  // `\s` de JS ya cubre el espacio duro, el ideográfico y los de imprenta, así
  // que no hace falta enumerarlos.
  const normalizado = visible.replace(/\s+/g, ' ').trim();

  // El corte va por puntos de código y no con slice(): slice() cuenta unidades
  // de UTF-16, así que partía el emoji que caía justo en el límite y dejaba un
  // sustituto suelto —el rombo con el signo de pregunta— guardado en la tabla.
  const limpio = [...normalizado].slice(0, LARGO_MAXIMO_NOMBRE).join('').trim();

  return limpio.length === 0 ? null : limpio;
}
