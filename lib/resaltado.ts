const TOPE = 3;

// Lo que ya está escrito en el relato y conviene que salte: plata, porcentajes,
// cantidades con unidad y lo que alguien dijo entre comillas.
const TERMINOS =
  /«[^»]{1,60}»|"[^"]{1,60}"|\d+(?:[.,]\d+)?\s*(?:%|millones|mil(?:lones)?|M\b)|\d{2,}(?:[.,]\d+)?\s*(?:socios|entradas|hinchas|personas|fechas|puntos)/gi;

export interface Tramo {
  texto: string;
  clave: boolean;
}

export function marcarTerminos(texto: string): Tramo[] {
  const tramos: Tramo[] = [];
  let desde = 0;
  let marcados = 0;

  for (const encontrado of texto.matchAll(TERMINOS)) {
    if (marcados >= TOPE) break;
    const inicio = encontrado.index ?? 0;
    if (inicio > desde) tramos.push({ texto: texto.slice(desde, inicio), clave: false });
    tramos.push({ texto: encontrado[0], clave: true });
    desde = inicio + encontrado[0].length;
    marcados++;
  }

  if (desde < texto.length) tramos.push({ texto: texto.slice(desde), clave: false });
  return tramos;
}
