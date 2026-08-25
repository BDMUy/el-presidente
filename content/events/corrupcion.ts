import type { GameEvent } from '@/lib/engine/types';

const SUCIO = { flagsSuma: { prontuario: 1 } };

export const CORRUPCION: GameEvent[] = [
  {
    id: 'cor-sobre-del-arbitro',
    kind: 'dilema',
    title: 'ALGUIEN CONOCE AL ÁRBITRO',
    text: 'Un dirigente de la vieja guardia te dice, sin decirlo, que el árbitro del domingo es amigo y que se puede hablar. Aclara que él no se mete, que solo comenta.',
    options: [
      {
        label: 'Que hable',
        hint: 'Suele funcionar. Y suele quedar registrado en algún lado.',
        effects: { ...SUCIO, plantel: 2, hinchada: 2, influencia: -6 },
      },
      {
        label: 'Decirle que no',
        hint: 'Se juega como se pueda. El viejo toma nota.',
        effects: { influencia: -3 },
      },
    ],
  },
  {
    id: 'cor-doble-contrato',
    kind: 'dilema',
    title: 'EL CONTRATO DE AFUERA',
    text: 'El representante del refuerzo propone dos contratos: uno registrado, por poco, y otro por afuera. Dice que así lo hacen todos y que el club se ahorra impuestos.',
    options: [
      {
        label: 'Firmar los dos',
        hint: 'Sale mucho más barato hoy.',
        effects: { ...SUCIO, caja: 0.9, plantel: 2 },
      },
      {
        label: 'Solo el registrado',
        hint: 'Todo en blanco y todo más caro.',
        effects: { caja: -1.4, plantel: 3 },
      },
      {
        label: 'Dejar pasar el refuerzo',
        hint: 'Ni plata ni jugador ni problema.',
        effects: { hinchada: -3 },
      },
    ],
  },
  {
    id: 'cor-obra-sobreprecio',
    kind: 'dilema',
    title: 'LA LICITACIÓN DE LA OBRA',
    text: 'Tres presupuestos para refaccionar los vestuarios. El más caro es de una empresa que ofrece devolverle al club una parte por afuera. En efectivo.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Adjudicarle a esa',
        hint: 'La obra sale igual. La diferencia entra en un sobre.',
        effects: { ...SUCIO, caja: 1.3, influencia: -5 },
      },
      {
        label: 'Adjudicar al más barato',
        hint: 'Lo que corresponde. La obra queda igual de fea.',
        effects: { caja: -0.9, plantel: 1 },
      },
      {
        label: 'Llamar a licitación pública',
        hint: 'Tarda seis meses y queda impecable.',
        effects: { caja: -1.3, hinchada: 4, influencia: 3 },
      },
    ],
  },
  {
    id: 'cor-entradas-que-no-existen',
    kind: 'dilema',
    title: 'LAS ENTRADAS QUE NO SE IMPRIMEN',
    text: 'El encargado de boletería te explica que con la cancha llena nadie cuenta las populares una por una, y que hay una diferencia que podría no figurar.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Que no figure',
        hint: 'Plata que entra y no está en ningún papel.',
        effects: { ...SUCIO, caja: 0.9, hinchada: -1 },
      },
      {
        label: 'Poner molinetes y que se cuente todo',
        hint: 'Se termina el negocio de varios. Incluido el tuyo.',
        effects: { caja: -1.1, influencia: -6, hinchada: 3 },
      },
    ],
  },
  {
    id: 'cor-viaje-de-la-familia',
    kind: 'dilema',
    title: 'LA DELEGACIÓN A LA COPA',
    text: 'Viaja el plantel y hay lugares de sobra en el charter. La comisión sugiere completarlo con familiares. El club paga.',
    options: [
      {
        label: 'Que suban todos',
        hint: 'Nadie lo va a mirar. Hasta que alguien lo mire.',
        effects: { ...SUCIO, caja: -0.7, influencia: 2 },
      },
      {
        label: 'Solo la delegación deportiva',
        hint: 'Correcto, y te ganás una tanda de enemigos internos.',
        effects: { influencia: -5, caja: 0.3 },
      },
    ],
  },
  {
    id: 'cor-utilero-que-vende',
    kind: 'color',
    title: 'FALTAN CAMISETAS',
    text: 'El utilero lleva veinte años en el club y se están vendiendo camisetas de utilería en las ferias. Todos saben quién es. Nadie quiere decirlo.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Echarlo',
        hint: 'Se termina el robo. Y veinte años de historia.',
        effects: { hinchada: -4, plantel: -1, influencia: 3 },
      },
      {
        label: 'Hablarlo en privado y dejarlo pasar',
        hint: 'Se arregla entre nosotros. Como todo acá.',
        effects: { ...SUCIO, hinchada: 1 },
      },
      {
        label: 'Poner control de inventario',
        hint: 'Cuesta plata y se sabe para qué es.',
        effects: { caja: -0.4, influencia: -2, hinchada: 2 },
      },
    ],
  },
  {
    id: 'cor-periodista-en-nomina',
    kind: 'dilema',
    title: 'EL PERIODISTA QUE PODRÍA SER AMIGO',
    text: 'El que más te pega en la radio hace notas de prensa para tres empresas. Se ofrece a hacer también la del club, con una factura mensual razonable.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Contratarlo',
        hint: 'Deja de pegarte mañana mismo.',
        effects: { ...SUCIO, caja: -0.6, hinchada: 3, influencia: 1 },
      },
      {
        label: 'No contratarlo',
        hint: 'Te sigue pegando. Al menos es gratis.',
        effects: { hinchada: -4 },
      },
    ],
  },

  {
    id: 'cor-primera-nota',
    kind: 'golpe',
    title: 'UNA NOTA CON PREGUNTAS',
    text: 'Un portal chico publicó una nota sobre movimientos raros en el club. No prueba nada y no la levantó nadie. Pero está escrita, y tiene fechas.',
    weight: 3,
    requires: { minFlag: { prontuario: 2 } },
    options: [
      {
        label: 'Desmentir con un comunicado',
        hint: 'Le das entidad a algo que nadie leyó.',
        effects: { hinchada: -6, influencia: -2 },
      },
      {
        label: 'No decir nada',
        hint: 'Se apaga solo. Y queda dando vueltas.',
        effects: { hinchada: -4 },
      },
      {
        label: 'Pedirle a un amigo que le baje el volumen',
        hint: 'Un favor más que se debe.',
        effects: { ...SUCIO, influencia: -4 },
      },
    ],
  },
  {
    id: 'cor-periodista-insiste',
    kind: 'golpe',
    title: 'EL PERIODISTA NO AFLOJA',
    text: 'Ya no es un portal chico. Es alguien que labura, que consiguió dos facturas y que llama a la gente del club uno por uno. Te pidió una entrevista.',
    weight: 3,
    requires: { minFlag: { prontuario: 3 }, minSeason: 3 },
    options: [
      {
        label: 'Darle la entrevista y bancarse las preguntas',
        hint: 'Dos horas incómodas. Se respeta, y se paga igual.',
        effects: { hinchada: -5, influencia: -8 },
      },
      {
        label: 'Mandarle abogados',
        hint: 'Se calla o se agranda. No hay punto medio.',
        random: [
          { weight: 45, text: 'La carta documento lo frenó en seco. No volvió a nombrar al club.', effects: { influencia: -6, hinchada: -2 } },
          { weight: 55, text: 'Publicó la carta documento arriba de la nota. Ahora la levantaron todos.', effects: { hinchada: -12, influencia: -8, flagsSuma: { prontuario: 1 } } },
        ],
      },
      {
        label: 'Ofrecerle una pauta publicitaria',
        hint: 'Funcionó otras veces. Y esas veces también se supieron.',
        effects: { ...SUCIO, caja: -0.9, hinchada: -2 },
      },
    ],
  },
  {
    id: 'cor-auditoria-interna',
    kind: 'golpe',
    title: 'LA COMISIÓN REVISORA DE CUENTAS',
    text: 'El órgano que por estatuto controla al presidente pidió los libros de los últimos tres ejercicios. Están en su derecho y esta vez no son de los tuyos.',
    weight: 3,
    requires: { minFlag: { prontuario: 4 }, minSeason: 4 },
    options: [
      {
        label: 'Entregar todo',
        hint: 'Lo que encuentren, encontrado está.',
        effects: {
          hinchada: -4,
          influencia: -6,
          deferred: [
            {
              inSeasons: 2,
              text: 'El informe de la revisora de cuentas salió publicado. No fue amable.',
              effects: { hinchada: -10, influencia: -8 },
            },
          ],
        },
      },
      {
        label: 'Entregar lo que se pueda',
        hint: 'Faltan carpetas. Se nota que faltan.',
        effects: { ...SUCIO, hinchada: -6, influencia: -4 },
      },
      {
        label: 'Voltear la comisión revisora',
        hint: 'Cuesta cada teléfono que te queda.',
        requires: { minInfluencia: 35 },
        effects: { ...SUCIO, influencia: -22, hinchada: -5 },
      },
    ],
  },
  {
    id: 'cor-allanamiento',
    kind: 'golpe',
    title: 'ALLANARON LA SEDE',
    text: 'Siete de la mañana. Se llevaron computadoras, carpetas y el disco de la administración. Los móviles transmitieron en vivo desde la puerta del club.',
    weight: 3,
    requires: { minFlag: { prontuario: 5 }, minSeason: 4 },
    options: [
      {
        label: 'Dar la cara en conferencia',
        hint: 'Nadie te va a creer. Peor es esconderse.',
        effects: { hinchada: -8, influencia: -6 },
      },
      {
        label: 'Silencio y abogados',
        hint: 'Lo que dice tu abogado. Lo que la gente lee es otra cosa.',
        effects: { hinchada: -14, caja: -1.2 },
      },
      {
        label: 'Echarle la culpa al tesorero',
        hint: 'Alguien tiene que ser. No sos vos.',
        effects: { ...SUCIO, hinchada: -5, influencia: -10 },
      },
    ],
  },
  {
    id: 'cor-socios-piden-la-cabeza',
    kind: 'golpe',
    title: 'JUNTAN FIRMAS PARA VOLTEARTE',
    text: 'Una agrupación de socios juntó las firmas necesarias para pedir tu destitución. No hablan de resultados deportivos. Hablan de plata.',
    weight: 3,
    requires: { minFlag: { prontuario: 6 }, minSeason: 5 },
    options: [
      {
        label: 'Ir a la asamblea y defenderte',
        hint: 'Cara a cara con la gente que te quiere afuera.',
        random: [
          { weight: 40, text: 'Hablaste dos horas y te salvaste por poco. Muy poco.', effects: { hinchada: -3, influencia: -14 } },
          { weight: 60, text: 'No te dejaron terminar. Salió en todos lados el video de la silbatina.', effects: { hinchada: -16, influencia: -12 } },
        ],
      },
      {
        label: 'Darles lugares en la comisión',
        hint: 'Los que firmaban ahora están adentro. Y adentro se ve todo.',
        effects: { influencia: -12, hinchada: -2 },
      },
      {
        label: 'Comprar las firmas que hagan falta',
        hint: 'La forma más cara y más rápida de seguir.',
        requires: { minCaja: 3 },
        effects: { ...SUCIO, caja: -3.2, hinchada: -4, influencia: -8 },
      },
    ],
  },
  {
    id: 'cor-la-causa',
    kind: 'golpe',
    title: 'TENÉS UNA CAUSA',
    text: 'Administración fraudulenta en perjuicio del club. Tu nombre en la carátula, con número de expediente. El juzgado te citó para el mes que viene.',
    weight: 3,
    requires: { minFlag: { prontuario: 7 }, minSeason: 5 },
    options: [
      {
        label: 'Presentarte y colaborar',
        hint: 'Lo único que puede terminar bien. Va a tardar años.',
        effects: { hinchada: -6, influencia: -8 },
      },
      {
        label: 'Poner el mejor abogado que exista',
        hint: 'Se puede ganar. Cuesta lo que cuesta.',
        effects: { caja: -4.5, hinchada: -4 },
      },
      {
        label: 'Renunciar antes de que sea peor',
        hint: 'Te vas por tu propio pie. No es poco.',
        effects: { hinchada: -10, influencia: -15 },
      },
    ],
  },
  {
    id: 'cor-inhabilitacion',
    kind: 'golpe',
    title: 'PIDEN INHABILITARTE',
    text: 'La AFA analiza inhabilitarte para ejercer cargos en el fútbol. No es una condena penal: es peor, porque no necesita juicio y sale la semana que viene.',
    weight: 3,
    requires: { minFlag: { prontuario: 8 }, minSeason: 6, country: ['argentina'] },
    options: [
      {
        label: 'Aceptar y poner a alguien de confianza',
        hint: 'Salís del cargo y seguís mandando. Eso creés.',
        effects: { influencia: -12, hinchada: -8 },
      },
      {
        label: 'Negociar con los que mandan',
        hint: 'Todo lo que te queda, en una llamada.',
        requires: { minInfluencia: 25 },
        effects: { influencia: -25, hinchada: -6 },
      },
      {
        label: 'Ir de frente y pelearla',
        hint: 'Sin teléfonos, con la gente. Puede alcanzar.',
        random: [
          { weight: 35, text: 'La hinchada coreó tu nombre durante nueve minutos y la AFA archivó el expediente.', effects: { hinchada: 4, influencia: -6 } },
          { weight: 65, text: 'Te inhabilitaron igual. Firmaste la salida un jueves, sin cámaras.', effects: { hinchada: -20, influencia: -20 } },
        ],
      },
    ],
  },
  {
    id: 'cor-inhabilitacion-uy',
    kind: 'golpe',
    title: 'PIDEN INHABILITARTE',
    text: 'La AUF analiza inhabilitarte para ejercer cargos en el fútbol. No es una condena penal: es peor, porque no necesita juicio y sale la semana que viene.',
    weight: 3,
    requires: { minFlag: { prontuario: 8 }, minSeason: 6, country: ['uruguay'] },
    options: [
      {
        label: 'Aceptar y poner a alguien de confianza',
        hint: 'Salís del cargo y seguís mandando. Eso creés.',
        effects: { influencia: -12, hinchada: -8 },
      },
      {
        label: 'Negociar con los que mandan',
        hint: 'Todo lo que te queda, en una llamada.',
        requires: { minInfluencia: 25 },
        effects: { influencia: -25, hinchada: -6 },
      },
      {
        label: 'Ir de frente y pelearla',
        hint: 'Sin teléfonos, con la gente. Puede alcanzar.',
        random: [
          { weight: 35, text: 'La hinchada coreó tu nombre durante nueve minutos y la AUF archivó el expediente.', effects: { hinchada: 4, influencia: -6 } },
          { weight: 65, text: 'Te inhabilitaron igual. Firmaste la salida un jueves, sin cámaras.', effects: { hinchada: -20, influencia: -20 } },
        ],
      },
    ],
  },
  {
    id: 'cor-inhabilitacion-pe',
    kind: 'golpe',
    title: 'PIDEN INHABILITARTE',
    text: 'La FPF analiza inhabilitarte para ejercer cargos en el fútbol. No es una condena penal: es peor, porque no necesita juicio y sale la semana que viene.',
    weight: 3,
    requires: { minFlag: { prontuario: 8 }, minSeason: 6, country: ['peru'] },
    options: [
      {
        label: 'Aceptar y poner a alguien de confianza',
        hint: 'Salís del cargo y seguís mandando. Eso creés.',
        effects: { influencia: -12, hinchada: -8 },
      },
      {
        label: 'Negociar con los que mandan',
        hint: 'Todo lo que te queda, en una llamada.',
        requires: { minInfluencia: 25 },
        effects: { influencia: -25, hinchada: -6 },
      },
      {
        label: 'Ir de frente y pelearla',
        hint: 'Sin teléfonos, con la gente. Puede alcanzar.',
        random: [
          { weight: 35, text: 'La hinchada coreó tu nombre durante nueve minutos y la FPF archivó el expediente.', effects: { hinchada: 4, influencia: -6 } },
          { weight: 65, text: 'Te inhabilitaron igual. Firmaste la salida un jueves, sin cámaras.', effects: { hinchada: -20, influencia: -20 } },
        ],
      },
    ],
  },
  {
    id: 'cor-inhabilitacion-co',
    kind: 'golpe',
    title: 'PIDEN INHABILITARTE',
    text: 'La Dimayor analiza inhabilitarte para ejercer cargos en el fútbol. No es una condena penal: es peor, porque no necesita juicio y sale la semana que viene.',
    weight: 3,
    requires: { minFlag: { prontuario: 8 }, minSeason: 6, country: ['colombia'] },
    options: [
      {
        label: 'Aceptar y poner a alguien de confianza',
        hint: 'Salís del cargo y seguís mandando. Eso creés.',
        effects: { influencia: -12, hinchada: -8 },
      },
      {
        label: 'Negociar con los que mandan',
        hint: 'Todo lo que te queda, en una llamada.',
        requires: { minInfluencia: 25 },
        effects: { influencia: -25, hinchada: -6 },
      },
      {
        label: 'Ir de frente y pelearla',
        hint: 'Sin teléfonos, con la gente. Puede alcanzar.',
        random: [
          { weight: 35, text: 'La hinchada coreó tu nombre durante nueve minutos y la Dimayor archivó el expediente.', effects: { hinchada: 4, influencia: -6 } },
          { weight: 65, text: 'Te inhabilitaron igual. Firmaste la salida un jueves, sin cámaras.', effects: { hinchada: -20, influencia: -20 } },
        ],
      },
    ],
  },
  {
    id: 'cor-inhabilitacion-cl',
    kind: 'golpe',
    title: 'PIDEN INHABILITARTE',
    text: 'La ANFP analiza inhabilitarte para ejercer cargos en el fútbol. No es una condena penal: es peor, porque no necesita juicio y sale la semana que viene.',
    weight: 3,
    requires: { minFlag: { prontuario: 8 }, minSeason: 6, country: ['chile'] },
    options: [
      {
        label: 'Aceptar y poner a alguien de confianza',
        hint: 'Salís del cargo y seguís mandando. Eso creés.',
        effects: { influencia: -12, hinchada: -8 },
      },
      {
        label: 'Negociar con los que mandan',
        hint: 'Todo lo que te queda, en una llamada.',
        requires: { minInfluencia: 25 },
        effects: { influencia: -25, hinchada: -6 },
      },
      {
        label: 'Ir de frente y pelearla',
        hint: 'Sin teléfonos, con la gente. Puede alcanzar.',
        random: [
          { weight: 35, text: 'La hinchada coreó tu nombre durante nueve minutos y la ANFP archivó el expediente.', effects: { hinchada: 4, influencia: -6 } },
          { weight: 65, text: 'Te inhabilitaron igual. Firmaste la salida un jueves, sin cámaras.', effects: { hinchada: -20, influencia: -20 } },
        ],
      },
    ],
  },
  {
    id: 'cor-el-arrepentido',
    kind: 'golpe',
    title: 'ALGUIEN SE ARREPINTIÓ',
    text: 'Uno de los que estuvo en todas se sentó a declarar. Fechas, montos, apellidos. El tuyo aparece catorce veces.',
    weight: 3,
    requires: { minFlag: { prontuario: 9 }, minSeason: 6 },
    options: [
      {
        label: 'Desmentirlo públicamente',
        hint: 'Tu palabra contra la de alguien que tiene papeles.',
        effects: { hinchada: -12, influencia: -6 },
      },
      {
        label: 'Arreglar con él por afuera',
        hint: 'Todavía puede desdecirse. Todavía.',
        requires: { minCaja: 2 },
        effects: { ...SUCIO, caja: -2.8, hinchada: -4 },
      },
      {
        label: 'Declarar vos también',
        hint: 'Contás todo y arrastrás a varios. Ninguno te lo perdona.',
        effects: { hinchada: -18, influencia: -14 },
      },
    ],
  },
];
