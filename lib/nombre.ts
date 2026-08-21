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

const PERMITIDO = /[\p{L}\p{M}\p{N} .'’-]/u;

function esPermitido(ch: string): boolean {
  return PERMITIDO.test(ch);
}

function esEspacio(ch: string): boolean {
  return /\s/.test(ch);
}

export const LARGO_MAXIMO_NOMBRE = 24;

export function limpiarNombre(crudo: unknown): string | null {
  if (typeof crudo !== 'string') return null;

  const visible = [...crudo.normalize('NFC')]
    .map((ch) => {
      if (esEspacio(ch)) return ' ';
      if (esInvisible(ch.codePointAt(0) ?? 0)) return '';
      return esPermitido(ch) ? ch : '';
    })
    .join('');

  const normalizado = visible.replace(/\s+/g, ' ').trim();

  const limpio = [...normalizado].slice(0, LARGO_MAXIMO_NOMBRE).join('').trim();

  return limpio.length === 0 ? null : limpio;
}
