import type { GameEvent } from '@/lib/engine/types';

export const COPAS: GameEvent[] = [
  {
    id: 'copa-viaje-imposible',
    kind: 'golpe',
    title: 'TRES MIL METROS DE ALTURA',
    text: 'Toca visitante en la altura, con escala y ocho horas de vuelo, y el domingo hay clásico. El cuerpo médico pide viajar con suplentes.',
    weight: 2,
    requires: { flag: 'continental' },
    options: [
      {
        label: 'Viajar con los titulares',
        hint: 'Se juega la copa en serio. El clásico se juega fundido.',
        effects: { plantel: -3, hinchada: 3 },
      },
      {
        label: 'Viajar con suplentes',
        hint: 'Se prioriza el clásico. La copa se complica.',
        effects: { hinchada: -5, influencia: -2 },
      },
      {
        label: 'Fletar un charter',
        hint: 'Carísimo. Llegan enteros a los dos partidos.',
        effects: { caja: -2.5, plantel: 3 },
      },
    ],
  },
  {
    id: 'copa-hinchas-detenidos',
    kind: 'golpe',
    title: 'HINCHAS DETENIDOS EN LA FRONTERA',
    text: 'Doscientos hinchas quedaron varados sin poder entrar al país vecino. Hay familias durmiendo en la terminal.',
    requires: { flag: 'continental' },
    options: [
      {
        label: 'Mandar al abogado del club y pagar hoteles',
        hint: 'Sale plata. Vuelven contando que el club los bancó.',
        effects: { caja: -1, hinchada: 11 },
      },
      {
        label: 'Es un problema de ellos',
        hint: 'Cierto y carísimo en otra moneda.',
        effects: { hinchada: -10 },
      },
      {
        label: 'Gestionarlo por arriba, sin gastar',
        hint: 'Cuesta influencia en vez de plata.',
        effects: { influencia: -8, hinchada: 7 },
      },
    ],
  },
  {
    id: 'copa-sorteo',
    kind: 'color',
    title: 'EL SORTEO DE GRUPOS',
    text: 'Te toca el grupo de la muerte: el campeón de Brasil, un equipo boliviano de altura y un clásico rioplatense.',
    requires: { flag: 'continental' },
    options: [
      {
        label: 'Salir a decir que se pasa igual',
        hint: 'La gente se ilusiona. Después hay que cumplir.',
        effects: { hinchada: 6, plantel: 1 },
      },
      {
        label: 'Bajar expectativas en público',
        hint: 'Realista y desangelado.',
        effects: { hinchada: -3, influencia: 3 },
      },
    ],
  },
  {
    id: 'copa-oferta-por-el-goleador',
    kind: 'dilema',
    title: 'LO QUIEREN EN MITAD DE LA COPA',
    text: 'Un club mexicano pone una cifra enorme por tu goleador, justo antes de los octavos. El pase se cierra en cuarenta y ocho horas.',
    requires: { flag: 'continental', minSeason: 2 },
    weight: 2,
    options: [
      {
        label: 'Venderlo',
        hint: 'La caja se arregla por dos años. La copa se termina acá.',
        effects: { caja: 12, plantel: -9, hinchada: -16 },
      },
      {
        label: 'Rechazar hasta que termine la copa',
        hint: 'La gente lo grita. El jugador puede no perdonarlo.',
        effects: { hinchada: 14, deferred: [{ inSeasons: 1, text: 'El goleador al que le frenaste el pase se fue libre y sin saludar.', effects: { plantel: -8, hinchada: -4 } }] },
      },
    ],
  },
  {
    id: 'copa-premio-por-pasar',
    kind: 'dilema',
    title: 'PREMIO POR PASAR DE FASE',
    text: 'El plantel pide, por escrito, un premio para jugar la llave. El capitán dice que en todos los clubes se paga.',
    requires: { flag: 'continental' },
    options: [
      {
        label: 'Pagar lo que piden',
        hint: 'Se juega motivado. La caja lo siente.',
        effects: { caja: -2.5, plantel: 4 },
      },
      {
        label: 'Ofrecer la mitad',
        hint: 'Nadie queda contento del todo.',
        effects: { caja: -1.2, plantel: 1 },
      },
      {
        label: 'No pagar nada',
        hint: 'Principios. Y un vestuario frío.',
        effects: { plantel: -4, influencia: 3 },
      },
    ],
  },
  {
    id: 'copa-tv-internacional',
    kind: 'color',
    title: 'TRANSMISIÓN A CUARENTA PAÍSES',
    text: 'El partido va para todo el continente. Marketing quiere aprovechar y llenar el estadio de banderas patrocinadas.',
    requires: { flag: 'continental' },
    options: [
      {
        label: 'Llenar de banderas de sponsors',
        hint: 'Entra plata. La popular ve tapado su trapo histórico.',
        effects: { caja: 2, hinchada: -6 },
      },
      {
        label: 'Que se vea el estadio como es',
        hint: 'Sin plata extra y con una postal que da vuelta el continente.',
        effects: { hinchada: 6, socios: 2 },
      },
    ],
  },
  {
    id: 'copa-eliminacion-dolorosa',
    kind: 'golpe',
    title: 'ELIMINADOS POR PENALES',
    text: 'Se fueron en cuartos, por penales, después de ganar de visitante. El micro tardó dos horas en salir del estadio.',
    requires: { flag: 'continental', minSeason: 2 },
    options: [
      {
        label: 'Bancar al plantel públicamente',
        hint: 'El vestuario lo registra. La gente quería sangre.',
        effects: { plantel: 3, hinchada: -4 },
      },
      {
        label: 'Anunciar cambios profundos',
        hint: 'La tribuna aplaude. El vestuario se paraliza.',
        effects: { hinchada: 5, plantel: -4 },
      },
      {
        label: 'No hablar hasta el lunes',
        hint: 'Se enfría solo. Más o menos.',
        effects: { hinchada: -2, influencia: 2 },
      },
    ],
  },
  {
    id: 'copa-intercontinental',
    kind: 'color',
    title: 'EL MUNDO MIRANDO',
    text: 'Al club lo invitan a un torneo internacional de pretemporada con dos europeos. Pagan el viaje y un cachet importante.',
    requires: { flag: 'continental', minSeason: 3 },
    options: [
      {
        label: 'Ir',
        hint: 'Plata y prestigio. Pretemporada arruinada.',
        effects: { caja: 3, plantel: -3, influencia: 5 },
      },
      {
        label: 'Declinar',
        hint: 'Pretemporada completa en casa.',
        effects: { plantel: 4 },
      },
    ],
  },
  {
    id: 'copa-la-altura',
    kind: 'dilema',
    title: 'SE JUEGA A TRES MIL METROS',
    text: 'Toca de visitante en la altura. El cuerpo médico pide viajar cinco días antes para aclimatar. Son cinco días de hotel para cuarenta personas.',
    requires: { flag: 'continental', minSeason: 2 },
    options: [
      {
        label: 'Viajar cinco días antes',
        hint: 'Carísimo, y es lo que dice la ciencia.',
        effects: { caja: -1.4, plantel: 3 },
      },
      {
        label: 'Llegar el día anterior',
        hint: 'Barato. Se juega con lo puesto y sin aire.',
        effects: { plantel: -4, hinchada: -2 },
      },
      {
        label: 'Pedir cambio de horario a la Conmebol',
        hint: 'Hay que gastar teléfonos para eso.',
        requires: { minInfluencia: 25 },
        effects: { influencia: -12, plantel: 2 },
      },
    ],
  },
  {
    id: 'copa-el-hincha-que-viajo-solo',
    kind: 'color',
    title: 'FUE UNO SOLO',
    text: 'A la revancha en Ecuador viajó un hincha. Uno. Se sacó una foto con la bandera del club en una tribuna vacía y la foto dio la vuelta al continente.',
    requires: { flag: 'continental' },
    options: [
      {
        label: 'Pagarle el vuelo de vuelta y traerlo al vestuario',
        hint: 'Sale poco y no se olvida nunca.',
        effects: { caja: -0.2, hinchada: 9, socios: 2 },
      },
      {
        label: 'Hacerle un posteo desde la cuenta del club',
        hint: 'Gratis y correcto. Se nota que es gratis.',
        effects: { hinchada: 3, socios: 1 },
      },
    ],
  },
  {
    id: 'copa-nacional-cruce-incomodo',
    kind: 'dilema',
    title: 'COPA DEL PAÍS: CONTRA UN EQUIPO DE ASCENSO',
    text: 'En la copa nacional, el sorteo cruzó al club con un equipo de la tercera categoría, a novecientos kilómetros, en una cancha de tierra y con la localía para ellos. Si perdés, es el papelón del año.',
    options: [
      {
        label: 'Viajar con los titulares y un charter',
        hint: 'Se toma en serio. El gasto no estaba en ningún presupuesto.',
        effects: { caja: -1.5, plantel: 1 },
      },
      {
        label: 'Ir en micro con un equipo alternativo',
        hint: 'Barato. Si sale mal, la semana es larga.',
        random: [
          { weight: 55, text: 'Los suplentes lo resolvieron con un gol de pelota parada y a otra cosa.', effects: { hinchada: 2 } },
          { weight: 45, text: 'Eliminados por un equipo de tercera. Los memes no perdonaron.', effects: { hinchada: -8, plantel: -1, influencia: -2 } },
        ],
      },
      {
        label: 'Mandar a la reserva completa y avisar que la prioridad es la liga',
        hint: 'Sincero y polémico. La copa se juega sola.',
        effects: { plantel: 2, hinchada: -4 },
      },
    ],
  },
];
