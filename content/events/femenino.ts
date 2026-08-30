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
  {
    id: 'fem-nueva-dt',
    kind: 'dilema',
    title: 'HAY QUE ELEGIR UNA NUEVA DT',
    text: 'La DT del plantel femenino renunció para dirigir en el exterior. Hay dos candidatas: una ex jugadora del club sin experiencia como técnica, y una DT con currículum pero de afuera.',
    weight: 2,
    options: [
      {
        label: 'La ex jugadora del club',
        hint: 'Conoce la casa. Va a aprender el resto en el cargo.',
        effects: { hinchada: 3, plantel: -1 },
      },
      {
        label: 'La DT con experiencia, de afuera',
        hint: 'Menos identidad, más pizarrón.',
        effects: { plantel: 2, hinchada: -1 },
      },
    ],
  },
  {
    id: 'fem-liga-profesional',
    kind: 'dilema',
    title: 'LA LIGA SE PROFESIONALIZA',
    text: 'La liga femenina exige a partir de ahora contratos profesionales y un piso salarial para poder participar. El plantel hoy funciona a pura vocación.',
    options: [
      {
        label: 'Profesionalizar el plantel completo',
        hint: 'Se cumple la exigencia. Sale caro de un día para el otro.',
        effects: { caja: -2, hinchada: 8, socios: 2 },
      },
      {
        label: 'Profesionalizar solo a las titulares',
        hint: 'Cumple lo mínimo. El resto del plantel sigue como estaba.',
        effects: { caja: -0.8, hinchada: 2 },
      },
    ],
  },
  {
    id: 'fem-gira-internacional',
    kind: 'color',
    title: 'INVITACIÓN A UNA GIRA',
    text: 'Un torneo amistoso en el exterior invita al plantel femenino a participar, con los pasajes pagos pero sin premio en caso de no clasificar.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Aceptar la gira',
        hint: 'Experiencia internacional. Ninguna garantía de resultado.',
        effects: { caja: -0.5, plantel: 2, hinchada: 3 },
      },
      {
        label: 'Declinar la invitación',
        hint: 'Se ahorra el gasto. También la experiencia.',
        effects: { influencia: 1 },
      },
    ],
  },
  {
    id: 'fem-reclamo-salarial',
    kind: 'golpe',
    title: 'RECLAMO SALARIAL DEL PLANTEL FEMENINO',
    text: 'El plantel femenino hace público que cobra una fracción de lo que cobra el plantel masculino por el mismo trabajo. El reclamo llega a la prensa antes que a tu escritorio.',
    weight: 2,
    options: [
      {
        label: 'Anunciar una equiparación gradual',
        hint: 'No resuelve todo hoy. Marca una dirección.',
        effects: { caja: -1.5, hinchada: 6, influencia: 2 },
      },
      {
        label: 'Defender la estructura salarial actual',
        hint: 'La estructura no cambia. El reclamo tampoco se apaga.',
        effects: { hinchada: -4, influencia: -2 },
      },
    ],
  },
  {
    id: 'fem-la-primera-que-debuto',
    kind: 'color',
    title: 'HOMENAJE A LA PRIMERA QUE DEBUTÓ',
    text: 'La primera jugadora que debutó con la camiseta del club, hace más de veinte años, sigue yendo a la cancha cada fin de semana como una socia más. Nadie la reconoce en la fila.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Reconocerla en un acto oficial',
        hint: 'Un lugar en la historia que hoy no tiene.',
        effects: { hinchada: 4, socios: 1 },
      },
      {
        label: 'Dejar que siga siendo una socia más, como ella prefiere',
        hint: 'Respeta su anonimato. También lo perpetúa.',
        effects: { hinchada: 1 },
      },
    ],
  },
  {
    id: 'fem-sponsor-propio',
    kind: 'dilema',
    title: 'UN SPONSOR SOLO PARA EL FEMENINO',
    text: 'Una marca deportiva ofrece ser sponsor exclusivo del plantel femenino, con su propio logo en una camiseta distinta a la del plantel masculino.',
    weight: 2,
    options: [
      {
        label: 'Aceptar el sponsor exclusivo',
        hint: 'Entra plata que hoy no entra. También separa las dos camisetas.',
        effects: { caja: 1.5, hinchada: 3 },
      },
      {
        label: 'Insistir en un sponsor único para todo el club',
        hint: 'Una sola camiseta, un solo logo. Y ningún sponsor nuevo por ahora.',
        effects: { influencia: 1 },
      },
    ],
  },
];
