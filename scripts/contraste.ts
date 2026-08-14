/**
 * Auditoría y solucionador de contraste WCAG.
 *
 * Dos modos:
 *   npx tsx scripts/contraste.ts          audita los pares que usa la interfaz
 *   npx tsx scripts/contraste.ts resolver calcula los tokens que hacen falta
 *
 * Existe porque la jerarquía por opacidad sobre fondo oscuro colapsa el
 * contraste sin avisar: `text-papel/40` parece un gris suave y en realidad es
 * un 2,97:1 ilegible. Los tonos se derivan acá y se congelan como hex.
 */

type RGB = [number, number, number];

function hex(color: string): RGB {
  const h = color.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function aHex([r, g, b]: RGB): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
}

function mezclar(frente: RGB, fondo: RGB, alfa: number): RGB {
  return frente.map((c, i) => c * alfa + fondo[i] * (1 - alfa)) as RGB;
}

function luminancia([r, g, b]: RGB): number {
  const canal = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function ratio(a: RGB, b: RGB): number {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Busca la mezcla mínima entre `desde` y `hacia` que alcanza el contraste
 * objetivo contra `fondo`. Búsqueda binaria sobre la proporción de mezcla.
 */
function resolver(desde: RGB, hacia: RGB, fondo: RGB, objetivo: number): { color: RGB; r: number } {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const candidato = mezclar(hacia, desde, mid);
    if (ratio(candidato, fondo) >= objetivo) hi = mid;
    else lo = mid;
  }
  const color = mezclar(hacia, desde, hi);
  return { color, r: ratio(color, fondo) };
}

/** Debe reflejar el bloque @theme de app/globals.css. */
const T = {
  pano: '#14342a',
  panoAlto: '#1c463a',
  linea: '#465d52',
  papel: '#e8e2d4',
  papel2: '#a8b2a5',
  hoja: '#e8e2d4',
  hojaLinea: '#a29982',
  tinta: '#1a1815',
  tinta2: '#4e483e',
  sello: '#b3261e',
  selloClaro: '#e89f98',
  bronce: '#7a5f24',
  bronceClaro: '#c1a66e',
  // Verde de Tailwind usado para los deltas positivos sobre papel.
  verde800: '#065f46',
  blanco: '#ffffff',
};

if (process.argv[2] === 'resolver') {
  console.log('\nTOKENS DERIVADOS PARA FONDO OSCURO\n');
  console.log('  Objetivo 4.5:1 para texto chico, 3:1 para texto grande y bordes.\n');

  const pano = hex(T.pano);
  const panoAlto = hex(T.panoAlto);

  const pedidos: { nombre: string; desde: string; hacia: string; fondo: RGB; objetivo: number }[] = [
    { nombre: 'papel-2 (secundario sobre paño)', desde: T.pano, hacia: T.papel, fondo: pano, objetivo: 4.5 },
    { nombre: 'papel-2 (secundario sobre paño alto)', desde: T.panoAlto, hacia: T.papel, fondo: panoAlto, objetivo: 4.5 },
    { nombre: 'papel-3 (terciario, texto grande)', desde: T.pano, hacia: T.papel, fondo: pano, objetivo: 3 },
    { nombre: 'bronce claro sobre paño', desde: T.bronce, hacia: T.blanco, fondo: pano, objetivo: 4.5 },
    { nombre: 'bronce claro sobre paño alto', desde: T.bronce, hacia: T.blanco, fondo: panoAlto, objetivo: 4.5 },
    { nombre: 'sello claro sobre paño', desde: T.sello, hacia: T.blanco, fondo: pano, objetivo: 4.5 },
    { nombre: 'sello claro sobre paño alto', desde: T.sello, hacia: T.blanco, fondo: panoAlto, objetivo: 4.5 },
    { nombre: 'borde visible sobre paño', desde: T.pano, hacia: T.papel, fondo: pano, objetivo: 1.9 },
  ];

  for (const p of pedidos) {
    const { color, r } = resolver(hex(p.desde), hex(p.hacia), p.fondo, p.objetivo);
    console.log(`  ${aHex(color)}  ${r.toFixed(2).padStart(5)}:1   ${p.nombre}`);
  }

  console.log('\nTOKENS DERIVADOS PARA EL PAPEL\n');
  const papel = hex(T.papel);
  for (const p of [
    { nombre: 'tinta-2 (secundario)', desde: T.hoja, hacia: T.tinta, objetivo: 7 },
    { nombre: 'renglón punteado visible', desde: T.hoja, hacia: T.tinta, objetivo: 2.2 },
  ]) {
    const { color, r } = resolver(hex(p.desde), hex(p.hacia), papel, p.objetivo);
    console.log(`  ${aHex(color)}  ${r.toFixed(2).padStart(5)}:1   ${p.nombre}`);
  }
  console.log('');
  process.exit(0);
}

interface Caso {
  donde: string;
  frente: string;
  fondo: string;
  alfa?: number;
  /** Texto grande (>=18.66px bold o >=24px): umbral 3:1 en vez de 4.5:1. */
  grande?: boolean;
  /** Umbral propio, para bordes y elementos no textuales. */
  minimo?: number;
}

const CASOS: Caso[] = [
  // ── Sobre el papel ──
  { donde: 'Prosa del acta', frente: T.tinta, fondo: T.hoja },
  { donde: 'Título del acta', frente: T.tinta, fondo: T.hoja, grande: true },
  { donde: 'Membrete, hint y balance', frente: T.tinta2, fondo: T.hoja },
  { donde: 'Sello rojo sobre papel', frente: T.sello, fondo: T.hoja },
  { donde: 'Sello bronce sobre papel', frente: T.bronce, fondo: T.hoja },
  { donde: 'Delta positivo sobre papel', frente: T.verde800, fondo: T.hoja },
  { donde: 'Renglón punteado (decorativo)', frente: T.hojaLinea, fondo: T.hoja, minimo: 2 },
  { donde: 'Botón Continuar (hoja sobre tinta)', frente: T.hoja, fondo: T.tinta },

  // ── Sobre el paño ──
  { donde: 'Texto primario sobre paño', frente: T.papel, fondo: T.pano },
  { donde: 'Secundario sobre paño', frente: T.papel2, fondo: T.pano },
  { donde: 'Secundario sobre paño alto (carnet)', frente: T.papel2, fondo: T.panoAlto },
  { donde: 'Bronce claro sobre paño alto', frente: T.bronceClaro, fondo: T.panoAlto },
  { donde: 'Sello claro sobre paño alto', frente: T.selloClaro, fondo: T.panoAlto },
  { donde: 'Sello claro sobre paño', frente: T.selloClaro, fondo: T.pano },
  { donde: 'Borde sobre paño', frente: T.linea, fondo: T.pano, grande: true, minimo: 1.5 },
  { donde: 'Botón Asumir (tinta sobre papel)', frente: T.tinta, fondo: T.papel },
];

console.log('\nAUDITORÍA DE CONTRASTE (WCAG 2.1)\n');
let fallas = 0;
for (const caso of CASOS) {
  const fondo = hex(caso.fondo);
  const frente = caso.alfa ? mezclar(hex(caso.frente), fondo, caso.alfa) : hex(caso.frente);
  const r = ratio(frente, fondo);
  const minimo = caso.minimo ?? (caso.grande ? 3 : 4.5);
  const pasa = r >= minimo;
  if (!pasa) fallas++;
  console.log(
    `  ${pasa ? (r >= 7 ? 'AAA ' : 'AA  ') : 'FALLA'} ${r.toFixed(2).padStart(6)}:1  (mín ${minimo})  ${caso.donde}`,
  );
}
console.log(`\n${fallas === 0 ? 'Todo pasa.' : `${fallas} de ${CASOS.length} pares fallan.`}\n`);
