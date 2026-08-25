import type { GameEvent } from '@/lib/engine/types';

export const LEGADO: GameEvent[] = [
  {
    id: 'leg-tu-nombre',
    kind: 'dilema',
    title: 'QUIEREN PONERTE TU NOMBRE',
    text: 'Un grupo de socios junta firmas para que la platea nueva lleve tu apellido. Todavía estás en el cargo.',
    requires: { minSeason: 10, minHinchada: 65 },
    options: [
      {
        label: 'Agradecer y frenarlo',
        hint: 'Los nombres se ponen cuando te fuiste. Suma más de lo que parece.',
        effects: { hinchada: 8, influencia: 6 },
      },
      {
        label: 'Dejar que avance',
        hint: 'Vanidad servida en bandeja. Alguno lo va a usar en tu contra.',
        effects: { hinchada: -5, influencia: -4 },
      },
      {
        label: 'Proponer el nombre de un ídolo muerto',
        hint: 'Le corrés el foco a alguien que se lo ganó hace treinta años.',
        effects: { hinchada: 12, influencia: 4 },
      },
    ],
  },
  {
    id: 'leg-el-pibe-volvio',
    kind: 'color',
    title: 'VOLVIÓ EL PIBE QUE VENDISTE',
    text: 'Aquel que salió de inferiores y se fue a Europa quiere volver a retirarse en el club. Cobra una fracción de lo que cobraba allá, pero sigue siendo mucho.',
    requires: { minSeason: 10 },
    weight: 2,
    options: [
      {
        label: 'Traerlo',
        hint: 'La gente se vuelve loca. Las piernas ya no son las mismas.',
        effects: { caja: -3, plantel: 2, hinchada: 16, socios: 4 },
      },
      {
        label: 'Traerlo como dirigente, no como jugador',
        hint: 'Honesto y menos romántico.',
        effects: { caja: -0.8, influencia: 8, hinchada: 4 },
      },
      {
        label: 'Decirle que no',
        hint: 'Frío, correcto y muy caro en imagen.',
        effects: { hinchada: -10, caja: 0.5 },
      },
    ],
  },
  {
    id: 'leg-sucesion',
    kind: 'dilema',
    title: 'LA SUCESIÓN',
    text: 'Te queda un mandato y todos preguntan quién sigue. Hay dos candidatos: el que te acompañó siempre y el que sabe de números.',
    requires: { minSeason: 12 },
    options: [
      {
        label: 'Ungir al leal',
        hint: 'La interna queda tranquila. Las cuentas, no tanto.',
        effects: { influencia: 8, hinchada: 5, caja: -1 },
      },
      {
        label: 'Ungir al que sabe de números',
        hint: 'El club queda mejor parado. Tu gente se siente traicionada.',
        effects: { caja: 3, influencia: -8, hinchada: -3 },
      },
      {
        label: 'No ungir a nadie',
        hint: 'Que decidan los socios. Se abre una interna feroz.',
        effects: { influencia: -5, hinchada: 6 },
      },
    ],
  },
  {
    id: 'leg-biografia',
    kind: 'color',
    title: 'QUIEREN ESCRIBIR TU BIOGRAFÍA',
    text: 'Un periodista propone un libro sobre tu gestión. Pide acceso a las actas de comisión de todos estos años.',
    requires: { minSeason: 11 },
    options: [
      {
        label: 'Abrirle todo',
        hint: 'Si la gestión aguanta la lupa, sale un monumento.',
        random: [
          { weight: 55, text: 'El libro salió y quedó como el manual de cómo se maneja un club.', effects: { hinchada: 10, influencia: 10 } },
          { weight: 45, text: 'Encontró tres actas que no convenía leer. El libro se volvió otra cosa.', effects: { hinchada: -12, influencia: -10 } },
        ],
      },
      {
        label: 'Darle solo entrevistas',
        hint: 'Control del relato. Sale tibio.',
        effects: { influencia: 2 },
      },
      {
        label: 'No participar',
        hint: 'Lo va a escribir igual, y peor.',
        effects: { hinchada: -3 },
      },
    ],
  },
  {
    id: 'leg-inferiores-cosecha',
    kind: 'color',
    title: 'LA CAMADA',
    text: 'Seis pibes de la misma camada están en el plantel de primera. Es la cosecha de las inferiores que sostuviste diez años.',
    requires: { minSeason: 10, notFlag: 'fideicomiso' },
    options: [
      {
        label: 'Ponerlos a todos de titulares un partido',
        hint: 'Una postal para la historia del club. Riesgo deportivo real.',
        effects: { plantel: -3, hinchada: 14, socios: 3 },
      },
      {
        label: 'Integrarlos de a poco',
        hint: 'Lo sensato. Nadie escribe sobre lo sensato.',
        effects: { plantel: 4, hinchada: 3 },
      },
    ],
  },
  {
    id: 'leg-veterano-retiro',
    kind: 'dilema',
    title: 'EL CAPITÁN SE RETIRA',
    text: 'Jugó nueve temporadas con vos. Pide un partido despedida con la cancha llena y la recaudación para él.',
    requires: { minSeason: 11 },
    options: [
      {
        label: 'Dárselo entero',
        hint: 'Se lo ganó. La recaudación de una noche no vuelve.',
        effects: { caja: -2, hinchada: 12, influencia: 4 },
      },
      {
        label: 'Partir la recaudación',
        hint: 'Justo para los dos. Romántico para ninguno.',
        effects: { caja: -0.5, hinchada: 4 },
      },
      {
        label: 'Homenaje en el entretiempo',
        hint: 'Cinco minutos y una plaqueta.',
        effects: { hinchada: -6, caja: 0.2 },
      },
    ],
  },
  {
    id: 'leg-oferta-afa',
    kind: 'dilema',
    title: 'TE QUIEREN EN LA AFA',
    text: 'Te ofrecen un cargo en la dirigencia del fútbol argentino. Es más poder, y es dejar el club a mitad de mandato.',
    requires: { minSeason: 12, minInfluencia: 55, country: ['argentina'] },
    options: [
      {
        label: 'Aceptar el cargo y seguir en el club',
        hint: 'Los dos sombreros. Nadie va a creer que no hay conflicto.',
        effects: { influencia: 18, hinchada: -10, caja: 1.5 },
      },
      {
        label: 'Rechazarlo',
        hint: 'Te quedás donde estás. Y lo dicen todos los micrófonos.',
        effects: { hinchada: 12, influencia: -6 },
      },
    ],
  },
  {
    id: 'leg-oferta-auf',
    kind: 'dilema',
    title: 'TE QUIEREN EN LA AUF',
    text: 'Te ofrecen un cargo en la dirigencia del fútbol uruguayo. Es más poder, y es dejar el club a mitad de mandato.',
    requires: { minSeason: 12, minInfluencia: 55, country: ['uruguay'] },
    options: [
      {
        label: 'Aceptar el cargo y seguir en el club',
        hint: 'Los dos sombreros. Nadie va a creer que no hay conflicto.',
        effects: { influencia: 18, hinchada: -10, caja: 1.5 },
      },
      {
        label: 'Rechazarlo',
        hint: 'Te quedás donde estás. Y lo dicen todos los micrófonos.',
        effects: { hinchada: 12, influencia: -6 },
      },
    ],
  },
  {
    id: 'leg-oferta-fpf',
    kind: 'dilema',
    title: 'TE QUIEREN EN LA FPF',
    text: 'Te ofrecen un cargo en la dirigencia del fútbol peruano. Es más poder, y es dejar el club a mitad de mandato.',
    requires: { minSeason: 12, minInfluencia: 55, country: ['peru'] },
    options: [
      {
        label: 'Aceptar el cargo y seguir en el club',
        hint: 'Los dos sombreros. Nadie va a creer que no hay conflicto.',
        effects: { influencia: 18, hinchada: -10, caja: 1.5 },
      },
      {
        label: 'Rechazarlo',
        hint: 'Te quedás donde estás. Y lo dicen todos los micrófonos.',
        effects: { hinchada: 12, influencia: -6 },
      },
    ],
  },
  {
    id: 'leg-oferta-fcf',
    kind: 'dilema',
    title: 'TE QUIEREN EN LA FCF',
    text: 'Te ofrecen un cargo en la dirigencia del fútbol colombiano. Es más poder, y es dejar el club a mitad de mandato.',
    requires: { minSeason: 12, minInfluencia: 55, country: ['colombia'] },
    options: [
      {
        label: 'Aceptar el cargo y seguir en el club',
        hint: 'Los dos sombreros. Nadie va a creer que no hay conflicto.',
        effects: { influencia: 18, hinchada: -10, caja: 1.5 },
      },
      {
        label: 'Rechazarlo',
        hint: 'Te quedás donde estás. Y lo dicen todos los micrófonos.',
        effects: { hinchada: 12, influencia: -6 },
      },
    ],
  },
  {
    id: 'leg-oferta-ffch',
    kind: 'dilema',
    title: 'TE QUIEREN EN LA FFCH',
    text: 'Te ofrecen un cargo en la dirigencia del fútbol chileno. Es más poder, y es dejar el club a mitad de mandato.',
    requires: { minSeason: 12, minInfluencia: 55, country: ['chile'] },
    options: [
      {
        label: 'Aceptar el cargo y seguir en el club',
        hint: 'Los dos sombreros. Nadie va a creer que no hay conflicto.',
        effects: { influencia: 18, hinchada: -10, caja: 1.5 },
      },
      {
        label: 'Rechazarlo',
        hint: 'Te quedás donde estás. Y lo dicen todos los micrófonos.',
        effects: { hinchada: 12, influencia: -6 },
      },
    ],
  },
  {
    id: 'leg-oferta-apf',
    kind: 'dilema',
    title: 'TE QUIEREN EN LA APF',
    text: 'Te ofrecen un cargo en la dirigencia del fútbol paraguayo. Es más poder, y es dejar el club a mitad de mandato.',
    requires: { minSeason: 12, minInfluencia: 55, country: ['paraguay'] },
    options: [
      {
        label: 'Aceptar el cargo y seguir en el club',
        hint: 'Los dos sombreros. Nadie va a creer que no hay conflicto.',
        effects: { influencia: 18, hinchada: -10, caja: 1.5 },
      },
      {
        label: 'Rechazarlo',
        hint: 'Te quedás donde estás. Y lo dicen todos los micrófonos.',
        effects: { hinchada: 12, influencia: -6 },
      },
    ],
  },
  {
    id: 'leg-estatua-en-vida',
    kind: 'color',
    title: 'LA PEÑA DEL INTERIOR',
    text: 'Una peña de setecientos kilómetros de distancia cumple cincuenta años y te invita a la cena aniversario. Es un sábado y hay partido el domingo.',
    requires: { minSeason: 9 },
    options: [
      {
        label: 'Ir',
        hint: 'Doce horas de auto por una cena. Se cuenta durante décadas.',
        effects: { hinchada: 7, socios: 2, caja: -0.2 },
      },
      {
        label: 'Mandar una carta y una camiseta firmada',
        hint: 'Correcto. Y todos entienden que no fuiste.',
        effects: { hinchada: 1 },
      },
    ],
  },
];
