import type { GameEvent } from '@/lib/engine/types';

export const FEMENINO: GameEvent[] = [
  {
    id: 'fem-horario-del-predio',
    kind: 'dilema',
    title: 'EL PREDIO NO ALCANZA',
    text: 'El plantel femenino entrena a las siete de la mañana porque es el único horario que quedó libre. Pidieron una reunión para hablar de eso.',
    options: [
      {
        label: 'Darles el horario de la tarde',
        hint: 'Alguien de masculina se corre. Y se queja.',
        effects: { plantel: -1, hinchada: 4, socios: 1 },
      },
      {
        label: 'Alquilar una cancha más',
        hint: 'Se arregla con plata, que es lo que no hay.',
        effects: { caja: -0.9, hinchada: 3 },
      },
      {
        label: 'Que sigan a las siete',
        hint: 'Nadie se corre. Se van dos titulares.',
        effects: { hinchada: -5, socios: -1 },
      },
    ],
  },
  {
    id: 'fem-primera-vez-en-la-cancha',
    kind: 'dilema',
    title: 'QUIEREN JUGAR EN LA CANCHA GRANDE',
    text: 'El clásico femenino se juega en la auxiliar, como siempre. Esta vez piden el estadio. Abrirlo por noventa minutos cuesta lo mismo que un partido de primera.',
    options: [
      {
        label: 'Abrir el estadio',
        hint: 'Sale caro. Puede no ir nadie.',
        random: [
          { weight: 55, text: 'Se llenó la popular. Nadie esperaba eso, y menos los que decían que no iba a ir nadie.', effects: { caja: -0.4, hinchada: 11, socios: 4 } },
          { weight: 45, text: 'Fueron seiscientas personas en un estadio para cuarenta mil. Las fotos fueron crueles.', effects: { caja: -1.1, hinchada: -3 } },
        ],
      },
      {
        label: 'Dejarlo en la auxiliar',
        hint: 'Prolijo, barato y del año pasado.',
        effects: { hinchada: -3 },
      },
      {
        label: 'Abrirlo con entrada gratis',
        hint: 'Te asegurás la foto. No entra un peso.',
        effects: { caja: -1.1, hinchada: 8, socios: 3 },
      },
    ],
  },
  {
    id: 'fem-sponsor-de-la-foto',
    kind: 'dilema',
    title: 'EL SPONSOR QUIERE LA FOTO',
    text: 'Una empresa ofrece plata para el femenino. La quiere toda en la campaña de marzo, con las jugadoras posando, y nada para el micro ni para los sueldos.',
    options: [
      {
        label: 'Firmar y usar la plata donde haga falta',
        hint: 'Entra plata. Las jugadoras posan igual.',
        effects: { caja: 1.5, hinchada: -2 },
      },
      {
        label: 'Exigir que parte vaya a sueldos',
        hint: 'Menos plata, y un plantel que se entera.',
        effects: { caja: 0.7, hinchada: 5, plantel: 1 },
      },
      {
        label: 'Rechazarlo',
        hint: 'Digno y carísimo.',
        effects: { hinchada: 3, socios: -1 },
      },
    ],
  },
  {
    id: 'fem-el-micro-no-llego',
    kind: 'golpe',
    title: 'EL MICRO NO LLEGÓ',
    text: 'El plantel esperó dos horas en la puerta del club para viajar a jugar afuera. El micro no apareció nunca. Alguien se olvidó de confirmar.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Pagar remises y que lleguen como sea',
        hint: 'Llegan tarde y caros, pero llegan.',
        effects: { caja: -0.5, plantel: -1, hinchada: 1 },
      },
      {
        label: 'Suspender el viaje',
        hint: 'Puntos perdidos y un plantel que entendió el mensaje.',
        effects: { plantel: -3, hinchada: -7 },
      },
      {
        label: 'Contratar un servicio fijo para toda la temporada',
        hint: 'Caro, y no vuelve a pasar.',
        effects: { caja: -1.2, hinchada: 5, plantel: 2 },
      },
    ],
  },
  {
    id: 'fem-jugadora-a-europa',
    kind: 'dilema',
    title: 'SE LA LLEVAN A EUROPA',
    text: 'Un club español la quiere. Ofrecen poco dinero, porque en el femenino los pases son así, y ella quiere ir. Es la capitana y la que llena la auxiliar.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Dejarla ir sin pedir nada',
        hint: 'Se gana un club al que las jugadoras quieren venir.',
        effects: { plantel: -3, hinchada: 6, socios: 1 },
      },
      {
        label: 'Negociar hasta el último peso',
        hint: 'Entra algo. Se cuenta en todos los vestuarios.',
        effects: { caja: 0.8, plantel: -3, hinchada: -4 },
      },
      {
        label: 'Ofrecerle quedarse con mejor contrato',
        hint: 'Puede aceptar. Puede irse igual.',
        random: [
          { weight: 40, text: 'Se quedó. Salió en todos lados que acá se le paga a las jugadoras.', effects: { caja: -0.7, hinchada: 9, plantel: 2, socios: 2 } },
          { weight: 60, text: 'Se fue igual, y la oferta quedó como un gesto que nadie le pidió.', effects: { caja: -0.2, plantel: -3, hinchada: 2 } },
        ],
      },
    ],
  },
  {
    id: 'fem-escuelita-del-barrio',
    kind: 'color',
    title: 'LA ESCUELITA SE LLENÓ',
    text: 'Abrieron la escuelita femenina para chicas del barrio esperando treinta. Se anotaron ciento noventa. No hay entrenadoras ni pelotas para tantas.',
    options: [
      {
        label: 'Contratar entrenadoras y ampliarla',
        hint: 'Cuesta ahora. Vuelve dentro de mucho.',
        effects: {
          caja: -0.8,
          socios: 4,
          hinchada: 5,
          deferred: [
            {
              inSeasons: 4,
              text: 'De aquella escuelita que se llenó salió la base del plantel femenino de hoy.',
              effects: { plantel: 4, hinchada: 6, socios: 3 },
            },
          ],
        },
      },
      {
        label: 'Poner un cupo de treinta',
        hint: 'Se manejan las que entran. Y las ciento sesenta que no.',
        effects: { socios: 1, hinchada: -2 },
      },
    ],
  },
  {
    id: 'fem-camiseta-propia',
    kind: 'color',
    title: 'LA CAMISETA NO ES LA DE ELLAS',
    text: 'El femenino juega con camisetas de hombre talle S. La marca dice que hacer un molde propio no le cierra por la cantidad.',
    options: [
      {
        label: 'Pagar el molde el club',
        hint: 'Un gasto raro que se nota en la cancha.',
        effects: { caja: -0.6, hinchada: 4, plantel: 1 },
      },
      {
        label: 'Presionar a la marca en la renovación',
        hint: 'Sale gratis y cuesta en otro lado.',
        effects: { caja: -0.9, hinchada: 3 },
      },
      {
        label: 'Que sigan con las de talle S',
        hint: 'Nadie de afuera se entera. Ellas sí.',
        effects: { plantel: -1, hinchada: -3 },
      },
    ],
  },
];
