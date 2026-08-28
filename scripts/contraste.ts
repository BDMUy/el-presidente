import { CLUBS } from '../content/clubs';
import { aHex, FONDO_CLARO, FONDO_OSCURO, hex, mezclar, ratio, resolver, tintaDeClub, type RGB } from '../lib/color';

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
  verde800: '#065f46',
  blanco: '#ffffff',
};

const TEMAS = {
  oscuro: {
    nombre: 'oscuro',
    fondo: FONDO_OSCURO,
    bloque: '#2B2C33',
    tinta: '#E6E3DB',
    tinta2: '#A3A09A',
    tinta3: '#85827C',
    alerta: '#F07A6B',
    favorable: '#8FBF8A',
  },
  claro: {
    nombre: 'claro',
    fondo: FONDO_CLARO,
    bloque: '#E4E1D8',
    tinta: '#1C1B20',
    tinta2: '#57545C',
    tinta3: '#7C7982',
    alerta: '#B3261E',
    favorable: '#2C6A4C',
  },
} as const;

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

if (process.argv[2] === 'clubes') {
  console.log('\nTINTA DE CLUB — AUDITORÍA DE CONTRASTE\n');
  console.log(`  ${CLUBS.length} clubes, objetivo 4.5:1, contra los dos temas.\n`);

  let fallas = 0;
  for (const tema of Object.values(TEMAS)) {
    console.log(`--- tema ${tema.nombre} (fondo ${tema.fondo}) ---\n`);
    for (const club of CLUBS) {
      const original = club.colors[0];
      const ajustado = tintaDeClub(original, tema.fondo, 4.5);
      const r = ratio(hex(ajustado), hex(tema.fondo));
      const pasa = r >= 4.5;
      if (!pasa) fallas++;
      const movido = ajustado.toLowerCase() !== original.toLowerCase();
      console.log(
        `  ${pasa ? 'OK   ' : 'FALLA'} ${r.toFixed(2).padStart(6)}:1  ${original} -> ${ajustado}${movido ? '' : '  (sin cambios)'}  ${club.name}`,
      );
    }
    console.log('');
  }

  console.log(fallas === 0 ? 'Todo pasa.\n' : `${fallas} pares club/tema fallan.\n`);
  process.exit(fallas === 0 ? 0 : 1);
}

interface Caso {
  donde: string;
  frente: string;
  fondo: string;
  alfa?: number;
  grande?: boolean;
  minimo?: number;
}

const CASOS: Caso[] = [
  { donde: 'Prosa del acta', frente: T.tinta, fondo: T.hoja },
  { donde: 'Título del acta', frente: T.tinta, fondo: T.hoja, grande: true },
  { donde: 'Membrete, hint y balance', frente: T.tinta2, fondo: T.hoja },
  { donde: 'Sello rojo sobre papel', frente: T.sello, fondo: T.hoja },
  { donde: 'Sello bronce sobre papel', frente: T.bronce, fondo: T.hoja },
  { donde: 'Delta positivo sobre papel', frente: T.verde800, fondo: T.hoja },
  { donde: 'Renglón punteado (decorativo)', frente: T.hojaLinea, fondo: T.hoja, minimo: 2 },
  { donde: 'Botón Continuar (hoja sobre tinta)', frente: T.hoja, fondo: T.tinta },

  { donde: 'Texto primario sobre paño', frente: T.papel, fondo: T.pano },
  { donde: 'Secundario sobre paño', frente: T.papel2, fondo: T.pano },
  { donde: 'Secundario sobre paño alto (carnet)', frente: T.papel2, fondo: T.panoAlto },
  { donde: 'Bronce claro sobre paño alto', frente: T.bronceClaro, fondo: T.panoAlto },
  { donde: 'Sello claro sobre paño alto', frente: T.selloClaro, fondo: T.panoAlto },
  { donde: 'Sello claro sobre paño', frente: T.selloClaro, fondo: T.pano },
  { donde: 'Borde sobre paño', frente: T.linea, fondo: T.pano, grande: true, minimo: 1.5 },
  { donde: 'Botón Asumir (tinta sobre papel)', frente: T.tinta, fondo: T.papel },
];

console.log('\nAUDITORÍA DE CONTRASTE (WCAG 2.1) — TOKENS ACTUALES\n');
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

console.log('\nAUDITORÍA DE CONTRASTE (WCAG 2.1) — TEMAS NUEVOS\n');
for (const tema of Object.values(TEMAS)) {
  const filas: Caso[] = [
    { donde: `[${tema.nombre}] tinta sobre fondo`, frente: tema.tinta, fondo: tema.fondo },
    { donde: `[${tema.nombre}] tinta-2 sobre fondo`, frente: tema.tinta2, fondo: tema.fondo },
    { donde: `[${tema.nombre}] tinta-3 sobre fondo (grande)`, frente: tema.tinta3, fondo: tema.fondo, grande: true },
    { donde: `[${tema.nombre}] tinta sobre bloque`, frente: tema.tinta, fondo: tema.bloque },
    { donde: `[${tema.nombre}] tinta-2 sobre bloque`, frente: tema.tinta2, fondo: tema.bloque },
    { donde: `[${tema.nombre}] alerta sobre fondo`, frente: tema.alerta, fondo: tema.fondo },
    { donde: `[${tema.nombre}] favorable sobre fondo`, frente: tema.favorable, fondo: tema.fondo },
    { donde: `[${tema.nombre}] separación fondo/bloque`, frente: tema.bloque, fondo: tema.fondo, minimo: 1 },
  ];
  for (const caso of filas) {
    const f = hex(caso.frente);
    const b = hex(caso.fondo);
    const r = ratio(f, b);
    const minimo = caso.minimo ?? (caso.grande ? 3 : 4.5);
    const pasa = r >= minimo;
    if (!pasa) fallas++;
    console.log(
      `  ${pasa ? (r >= 7 ? 'AAA ' : 'AA  ') : 'FALLA'} ${r.toFixed(2).padStart(6)}:1  (mín ${minimo})  ${caso.donde}`,
    );
  }
}

console.log(`\n${fallas === 0 ? 'Todo pasa.' : `${fallas} pares fallan.`}\n`);
process.exit(fallas === 0 ? 0 : 1);
