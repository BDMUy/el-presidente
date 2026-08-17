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
 * Lo que sí puede tener un nombre.
 *
 * Letras de cualquier alfabeto, las marcas que las acentúan, dígitos, y un
 * puñado de signos que aparecen en nombres reales: el punto de "D. Ameal", el
 * apóstrofo de "O'Higgins", el guion de los nombres compuestos.
 *
 * `\p{M}` es la clave del acento: en NFC "ñ" y "é" suelen venir como un solo
 * punto de código, pero no siempre, y un teclado de celular manda cualquiera
 * de las dos formas. Sin las marcas, "José" tecleado en la forma descompuesta
 * se convertía en "Jose".
 *
 * Todo lo demás se cae. No es por seguridad —de eso ya se ocupan los rangos de
 * arriba— sino porque una tabla de posiciones llena de emojis y signos deja de
 * parecer el libro de socios de un club.
 */
const PERMITIDO = /[\p{L}\p{M}\p{N} .'’-]/u;

function esPermitido(ch: string): boolean {
  return PERMITIDO.test(ch);
}

/**
 * Cualquier cosa que separe palabras: el salto de línea, la tabulación, el
 * espacio duro, el ideográfico, los de imprenta.
 *
 * Se pregunta **antes** que todo lo demás y se convierte en espacio en vez de
 * borrarse. Borrándolos se pegan dos palabras que no iban juntas, y ese error
 * ya apareció dos veces en este archivo: primero con el salto de línea, que
 * dejaba "linea1linea2", y después con el espacio duro, que la lista de
 * caracteres permitidos tiraba porque no es letra ni signo de los aceptados.
 */
function esEspacio(ch: string): boolean {
  return /\s/.test(ch);
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
      if (esEspacio(ch)) return ' ';
      if (esInvisible(ch.codePointAt(0) ?? 0)) return '';
      return esPermitido(ch) ? ch : '';
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
