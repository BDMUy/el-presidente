import { readFileSync } from 'node:fs';
import { CLUBS } from '../content/clubs';
import { aHex, hex, ratio, resolver, tintaDeClub } from '../lib/color';

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

function tema(nombre: string, selector: RegExp) {
  const bloque = css.match(selector)?.[1];
  if (!bloque) throw new Error(`No se encontró el tema ${nombre}`);
  const tokens = Object.fromEntries(
    Array.from(bloque.matchAll(/--([a-z0-9-]+):\s*(#[a-f0-9]{6});/gi), ([, token, color]) => [token, color]),
  );
  return { nombre, tokens };
}

const TEMAS = [
  tema('oscuro', /:root\s*{([^}]+)}/),
  tema('claro', /\[data-tema='claro'\]\s*{([^}]+)}/),
];

let fallas = 0;

function verificar(frente: string, fondo: string, minimo: number, donde: string) {
  const contraste = ratio(hex(frente), hex(fondo));
  const pasa = contraste >= minimo;
  if (!pasa) fallas++;
  console.log(`  ${pasa ? 'OK   ' : 'FALLA'} ${contraste.toFixed(2).padStart(6)}:1 (mín ${minimo}) ${donde}`);
}

if (process.argv[2] === 'resolver') {
  for (const { nombre, tokens } of TEMAS) {
    for (const superficie of ['fondo', 'fondo-2']) {
      for (const [token, objetivo] of [['tinta-2', 4.5], ['corondel', 3]] as const) {
        const { color, r } = resolver(hex(tokens[superficie]), hex(tokens.tinta), hex(tokens[superficie]), objetivo);
        console.log(`  ${aHex(color)} ${r.toFixed(2)}:1 [${nombre}] ${token} sobre ${superficie}`);
      }
    }
  }
  process.exit(0);
}

console.log('\nAUDITORÍA DE CONTRASTE — PALETA DEL PALCO\n');

for (const { nombre, tokens } of TEMAS) {
  for (const superficie of ['fondo', 'fondo-2']) {
    for (const token of ['tinta', 'tinta-2', 'tinta-3', 'alerta', 'favorable', 'acento']) {
      verificar(tokens[token], tokens[superficie], 4.5, `[${nombre}] ${token} sobre ${superficie}`);
    }
    verificar(tokens.corondel, tokens[superficie], 3, `[${nombre}] borde funcional sobre ${superficie}`);
    verificar(tokens.tinta, tokens[superficie], 3, `[${nombre}] foco sobre ${superficie}`);
  }
  verificar(tokens['sobre-acento'], tokens.acento, 4.5, `[${nombre}] texto de acción principal`);
}

console.log(`\nACENTOS DE ${CLUBS.length} CLUBES — DOS TEMAS, DOS SUPERFICIES\n`);

for (const { nombre, tokens } of TEMAS) {
  for (const superficie of ['fondo', 'fondo-2']) {
    let peor = { contraste: Infinity, club: '', color: '' };
    for (const club of CLUBS) {
      const color = tintaDeClub(club.colors[0], tokens['fondo-2'], 4.5);
      const contraste = ratio(hex(color), hex(tokens[superficie]));
      if (contraste < peor.contraste) peor = { contraste, club: club.name, color };
      if (process.argv[2] === 'clubes') {
        verificar(color, tokens[superficie], 4.5, `[${nombre}] ${club.name} sobre ${superficie}`);
      }
    }
    verificar(peor.color, tokens[superficie], 4.5, `[${nombre}] peor acento sobre ${superficie}: ${peor.club}`);
  }
}

console.log(`\n${fallas === 0 ? 'Todo pasa.' : `${fallas} pares fallan.`}\n`);
process.exit(fallas === 0 ? 0 : 1);
