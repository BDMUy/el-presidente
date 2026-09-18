import {
  ASCENSO,
  COLOR,
  COPAS,
  CORRUPCION,
  CRISIS,
  DIRIGENCIA,
  ECONOMIA,
  FEMENINO,
  HINCHADA,
  INFERIORES,
  LEGADO,
  VESTUARIO,
} from '../content/events';
import type { EventOption, GameEvent, TonoOpcion } from '../lib/engine/types';

const ARCHIVOS: Record<string, GameEvent[]> = {
  corrupcion: CORRUPCION,
  dirigencia: DIRIGENCIA,
  vestuario: VESTUARIO,
  hinchada: HINCHADA,
  economia: ECONOMIA,
  legado: LEGADO,
  inferiores: INFERIORES,
  crisis: CRISIS,
  femenino: FEMENINO,
  ascenso: ASCENSO,
  copas: COPAS,
  color: COLOR,
};

const LEXICO: [TonoOpcion, RegExp][] = [
  ['mano-dura', /\b(apret|echar|echá|cortar|cortá|negar|negá|plantar|rajar|expuls|sancion|denunci|multa|prohib)/i],
  ['pacto', /\b(negoci|acord|arregl|mitad|repart|favor|canje|pacta|acuerdo|compens)/i],
  ['via-pacifica', /\b(ced|dar|dales|darles|acept|calm|banc|conten|escuch|invit|regal)/i],
  ['patear-para-adelante', /\b(esper|posterg|silencio|dejar que|ganar tiempo|patear|no decir|más adelante|postergá)/i],
  ['a-libro-abierto', /\b(conferencia|dar la cara|transparen|asamblea|abrir los libros|explicar|informar|publicar|auditor)/i],
];

function tonoPropuesto(option: EventOption): { tono: TonoOpcion; senal: string } | null {
  if (option.effects?.flagsSuma?.prontuario) {
    return { tono: 'via-turbia', senal: 'prontuario' };
  }
  const texto = `${option.label} ${option.hint}`;
  for (const [tono, patron] of LEXICO) {
    const coincidencia = texto.match(patron);
    if (coincidencia) return { tono, senal: `léxico «${coincidencia[0]}»` };
  }
  return null;
}

const soloArchivo = process.argv.slice(2).find((a) => !a.startsWith('--'));
const entradas = soloArchivo
  ? Object.entries(ARCHIVOS).filter(([nombre]) => nombre === soloArchivo)
  : Object.entries(ARCHIVOS);

if (entradas.length === 0) {
  console.error(`Archivo desconocido: "${soloArchivo}". Son ${Object.keys(ARCHIVOS).join(', ')}.`);
  process.exit(1);
}

let total = 0;
let propuestas = 0;

for (const [nombre, eventos] of entradas) {
  console.log(`\n### ${nombre} (${eventos.length} cartas)\n`);
  for (const evento of eventos) {
    const yaTiene = evento.options.some((o) => o.tono);
    console.log(`${evento.id}${yaTiene ? '  [ya curado]' : ''}`);
    for (const option of evento.options) {
      total++;
      const propuesta = tonoPropuesto(option);
      if (propuesta) propuestas++;
      const marca = option.tono ? `= ${option.tono}` : propuesta ? `? ${propuesta.tono}` : '? —';
      const motivo = option.tono ? 'ya escrito' : (propuesta?.senal ?? 'sin señal');
      console.log(`  ${marca.padEnd(26)} ${motivo.padEnd(24)} ${option.label}`);
    }
  }
}

console.log(
  `\n${propuestas} de ${total} opciones tienen propuesta. El resto va a mano.` +
    '\nEste borrador no escribe nada: se cura archivo por archivo.',
);
