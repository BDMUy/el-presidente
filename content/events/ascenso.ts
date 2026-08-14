/**
 * La vida en el ascenso: la B y la Nacional.
 *
 * Todo acá es más chico y más físico. No hay derechos de televisión que te
 * salven, la cancha es de tablones y el micro se rompe. La escala de los
 * efectos es deliberadamente menor: en la B, medio millón es una fortuna.
 */

import type { GameEvent } from '@/lib/engine/types';

const SOLO_ASCENSO = { category: ['nacional', 'b'] as const };

export const ASCENSO: GameEvent[] = [
  {
    id: 'asc-arbitro-de-la-b',
    kind: 'golpe',
    title: 'EL ARBITRAJE DEL ASCENSO',
    text: 'Tercer partido seguido con un penal en contra en el descuento. En el ascenso nadie mira, y eso lo saben todos.',
    weight: 2,
    requires: { category: [...SOLO_ASCENSO.category], minSeason: 2 },
    options: [
      {
        label: 'Denunciarlo en conferencia',
        hint: 'La gente te aplaude. Arriba te anotan en una lista.',
        effects: { hinchada: 8, influencia: -9 },
      },
      {
        label: 'Hacer la gestión en silencio',
        hint: 'Se acomoda para la próxima. Se paga con influencia.',
        effects: { influencia: -6, plantel: 2 },
      },
      {
        label: 'Aguantar sin decir nada',
        hint: 'No ganás nada. Tampoco perdés nada.',
        effects: { influencia: 2 },
      },
    ],
  },
  {
    id: 'asc-cancha-prestada',
    kind: 'golpe',
    title: 'CLAUSURARON LA CANCHA',
    text: 'La policía no da el operativo: hay que jugar de local a cien kilómetros y sin público durante dos meses.',
    requires: { category: [...SOLO_ASCENSO.category] },
    options: [
      {
        label: 'Poner los micros para que la gente viaje',
        hint: 'Sale plata que no tenés. La gente no se olvida.',
        effects: { caja: -1.2, hinchada: 10 },
      },
      {
        label: 'Jugar sin público y ahorrar',
        hint: 'El equipo pierde su cancha y su gente.',
        effects: { plantel: -3, hinchada: -6 },
      },
    ],
  },
  {
    id: 'asc-el-vecino',
    kind: 'color',
    title: 'EL VECINO DE ENFRENTE',
    text: 'Un vecino se queja de que los reflectores le dan en la ventana y amenaza con un amparo que suspendería los partidos nocturnos.',
    requires: { category: [...SOLO_ASCENSO.category] },
    options: [
      {
        label: 'Ponerle cortinas blackout en su casa',
        hint: 'Ridículo, barato y funciona.',
        effects: { caja: -0.2, hinchada: 3 },
      },
      {
        label: 'Mandarle una carta documento',
        hint: '🎲 Puede terminar rápido o en juzgado.',
        random: [
          { weight: 50, text: 'Se asustó y no volvió a llamar.', effects: { influencia: 2 } },
          { weight: 50, text: 'Consiguió el amparo. Dos meses sin nocturnos.', effects: { caja: -1.5, hinchada: -5 } },
        ],
      },
    ],
  },
  {
    id: 'asc-jugador-trabaja',
    kind: 'dilema',
    title: 'EL LATERAL TRABAJA DE ALBAÑIL',
    text: 'Tu mejor lateral entrena a la mañana y trabaja en una obra a la tarde. Llega fundido a los partidos.',
    requires: { category: ['b'] },
    options: [
      {
        label: 'Ponerle un contrato profesional',
        hint: 'Deja la obra y rinde. Es un sueldo más.',
        effects: { caja: -0.8, plantel: 5, hinchada: 4 },
      },
      {
        label: 'Conseguirle un trabajo liviano en el club',
        hint: 'Solución criolla. Funciona a medias.',
        effects: { caja: -0.3, plantel: 2 },
      },
      {
        label: 'Que se arregle',
        hint: 'Rinde la mitad y en algún momento se rompe.',
        effects: { plantel: -3 },
      },
    ],
  },
  {
    id: 'asc-promesa-ascenso',
    kind: 'golpe',
    title: 'TE RECUERDAN LA PROMESA',
    text: 'Colgaron un trapo con la fecha exacta en que prometiste el ascenso. Faltan seis fechas y están décimos.',
    requires: { flag: 'promesa_ascenso', minSeason: 2 },
    options: [
      {
        label: 'Ratificar la promesa',
        hint: 'Doble o nada. Si no subís, es peor.',
        effects: {
          hinchada: 6,
          deferred: [{ inSeasons: 1, text: 'La promesa que ratificaste no se cumplió. Te la cobraron con intereses.', effects: { hinchada: -14 } }],
        },
      },
      {
        label: 'Pedir disculpas y bajar el tono',
        hint: 'Honesto y poco épico.',
        effects: { hinchada: -3, influencia: 3 },
      },
    ],
  },
  {
    id: 'asc-refuerzo-de-primera',
    kind: 'dilema',
    title: 'BAJA UN NOMBRE DE PRIMERA',
    text: 'Un jugador que fue campeón en Primera acepta bajar a jugar con vos. Cobra tres veces lo que cobra el que más cobra.',
    requires: { category: [...SOLO_ASCENSO.category], minSeason: 2 },
    weight: 2,
    options: [
      {
        label: 'Traerlo',
        hint: 'Sube el equipo y llena la cancha. Rompe la escala salarial.',
        effects: { caja: -2.5, plantel: 8, hinchada: 12, socios: 3, deferred: [{ inSeasons: 2, text: 'El resto del plantel se enteró de lo que cobra el que vino de Primera. Reclamo general.', effects: { plantel: -5, caja: -1 } }] },
      },
      {
        label: 'Ofrecerle lo mismo que al resto',
        hint: '🎲 O acepta por amor, o se ríe y cuelga.',
        random: [
          { weight: 30, text: 'Aceptó igual. Dijo que quería volver a divertirse.', effects: { plantel: 7, hinchada: 10 } },
          { weight: 70, text: 'Se rió y firmó en otro lado.', effects: { hinchada: -3 } },
        ],
      },
      {
        label: 'No traerlo',
        hint: 'El plantel sigue siendo un plantel de la categoría.',
        effects: { influencia: 2 },
      },
    ],
  },
  {
    id: 'asc-reducido',
    kind: 'color',
    title: 'CUENTAS DEL REDUCIDO',
    text: 'Faltan dos fechas y todo el mundo hace cuentas. Un empate podría alcanzar, o no, según lo que pase en otras tres canchas.',
    requires: { category: [...SOLO_ASCENSO.category], minSeason: 2 },
    options: [
      {
        label: 'Prometer premio si entran',
        hint: 'Motiva de verdad. Sale plata que todavía no tenés.',
        effects: { caja: -1, plantel: 4 },
      },
      {
        label: 'No hablar de plata',
        hint: 'Que jueguen por la camiseta. A veces alcanza.',
        effects: { hinchada: 2 },
      },
    ],
  },
  {
    id: 'asc-tablones',
    kind: 'dilema',
    title: 'LOS TABLONES DE MADERA',
    text: 'La popular todavía es de tablones. Cambiarlos por cemento es caro; dejarlos es esperar el día que se rompa uno con gente arriba.',
    requires: { category: [...SOLO_ASCENSO.category] },
    options: [
      {
        label: 'Cambiarlos ahora',
        hint: 'Caro y sin ninguna gloria. Es lo que corresponde.',
        effects: { caja: -2.5, hinchada: 4, influencia: 3 },
      },
      {
        label: 'Reforzarlos y seguir',
        hint: '🎲 Aguantan. Hasta que un domingo no aguanten.',
        random: [
          { weight: 65, text: 'Aguantaron toda la temporada sin un ruido.', effects: { caja: -0.4 } },
          { weight: 35, text: 'Cedió un sector con gente arriba. Doce heridos leves y una causa.', effects: { hinchada: -16, caja: -3, influencia: -10 } },
        ],
      },
    ],
  },
  {
    id: 'asc-clasico-de-barrio',
    kind: 'color',
    title: 'EL CLÁSICO DE BARRIO',
    text: 'Se juega el clásico contra el club que está a doce cuadras. En la B esto es más importante que cualquier campeonato.',
    requires: { category: [...SOLO_ASCENSO.category] },
    weight: 2,
    options: [
      {
        label: 'Hacer bandera y bombos, a todo trapo',
        hint: 'La semana se vive distinto. Cuesta unos pesos.',
        effects: { caja: -0.4, hinchada: 7, plantel: 2 },
      },
      {
        label: 'Tratarlo como un partido más',
        hint: 'Profesional y frío. Nadie lo entiende.',
        effects: { hinchada: -4, plantel: 1 },
      },
    ],
  },
  {
    id: 'asc-subir-sin-plata',
    kind: 'dilema',
    title: 'SI SUBIMOS, ¿CON QUÉ?',
    text: 'El contador te muestra los números de la categoría de arriba: sueldos al doble, viajes al doble. Ascender sin reforzar es descender el año siguiente.',
    requires: { category: [...SOLO_ASCENSO.category], minSeason: 3 },
    options: [
      {
        label: 'Guardar plata desde ahora',
        hint: 'Este año el equipo es más flojo. El que viene, no.',
        effects: { plantel: -4, caja: 3 },
      },
      {
        label: 'Apostar todo a subir',
        hint: 'Si sale, sos un genio. Si no, quedaste sin nada.',
        effects: { plantel: 6, caja: -3, hinchada: 5 },
      },
      {
        label: 'No pensar tan adelante',
        hint: 'Un problema por vez.',
        effects: { influencia: 2 },
      },
    ],
  },
];
