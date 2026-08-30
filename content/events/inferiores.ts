import type { GameEvent } from '@/lib/engine/types';

export const INFERIORES: GameEvent[] = [
  {
    id: 'inf-pension-se-llueve',
    kind: 'golpe',
    title: 'SE LLUEVE LA PENSIÓN',
    text: 'Veintiocho pibes duermen en la pensión y el techo del ala vieja no aguanta otra tormenta. Un padre de Corrientes llamó preguntando si su hijo está bien.',
    options: [
      {
        label: 'Arreglar el techo entero',
        hint: 'Sale caro y no lo ve nadie. Salvo ellos.',
        effects: { caja: -1.4, hinchada: 3, plantel: 2 },
      },
      {
        label: 'Poner baldes y esperar el verano',
        hint: 'Gratis hasta que alguien saque una foto.',
        random: [
          { weight: 55, text: 'Aguantó hasta el verano y se arregló en silencio. Nadie se enteró.', effects: {} },
          { weight: 45, text: 'Salió la foto de los baldes en la pensión. Un club de Primera, decía el epígrafe.', effects: { hinchada: -9, socios: -2 } },
        ],
      },
      {
        label: 'Mandar a los chicos a sus casas dos meses',
        hint: 'Se ahorra todo. Vuelven la mitad.',
        effects: { caja: 0.4, plantel: -4, hinchada: -5 },
      },
    ],
  },
  {
    id: 'inf-representante-ronda',
    kind: 'dilema',
    title: 'UN REPRESENTANTE ANDA DANDO VUELTAS',
    text: 'Está apareciendo en los entrenamientos de sexta. Le paga el colectivo a tres chicos y les compró los botines. Todavía no pidió nada.',
    options: [
      {
        label: 'Prohibirle la entrada al predio',
        hint: 'Se lleva a los tres a otro club. Y a dos más.',
        effects: { plantel: -3, influencia: 3 },
      },
      {
        label: 'Sentarse a hablar y repartir',
        hint: 'El club cobra su parte. Y le debe una.',
        effects: { caja: 1.2, influencia: -6 },
      },
      {
        label: 'Que el club pague los botines',
        hint: 'Le sacás la excusa. Sale plata todos los meses.',
        effects: { caja: -0.5, plantel: 2, hinchada: 2 },
      },
    ],
  },
  {
    id: 'inf-debut-del-pibe',
    kind: 'dilema',
    title: 'EL PIBE ESTÁ PARA DEBUTAR',
    text: 'Diecisiete años, la rompe en reserva y la tribuna ya sabe cómo se llama. El DT dice que le falta cuerpo. El representante dice que si no juega, se va.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Que debute el domingo',
        hint: 'La gente se enamora. O lo funden en tres partidos.',
        random: [
          { weight: 50, text: 'Entró, encaró dos veces y la cancha se paró. Ya es de ellos.', effects: { plantel: 4, hinchada: 12, socios: 2 } },
          { weight: 50, text: 'Lo marcaron entre dos, no la tocó y salió llorando. Le costó un año recuperarse.', effects: { plantel: -3, hinchada: -4 } },
        ],
      },
      {
        label: 'Un año más en reserva',
        hint: 'Lo correcto para él. El representante toma nota.',
        effects: { plantel: 1, hinchada: -3 },
      },
      {
        label: 'Renovarle el contrato primero',
        hint: 'Lo atás antes de exponerlo. Cuesta.',
        effects: { caja: -0.9, plantel: 2, hinchada: 4 },
      },
    ],
  },
  {
    id: 'inf-torneo-en-europa',
    kind: 'dilema',
    title: 'INVITAN A LA SÉPTIMA A EUROPA',
    text: 'Un torneo de juveniles en España quiere al club. Pagan la mitad de los pasajes. La otra mitad son veinte chicos y cuatro entrenadores.',
    options: [
      {
        label: 'Ir',
        hint: 'Vidriera para los chicos, agujero para la caja.',
        effects: { caja: -1.7, plantel: 3, hinchada: 4, socios: 1 },
      },
      {
        label: 'Agradecer y no ir',
        hint: 'Nadie se entera. Salvo los veinte chicos.',
        effects: { hinchada: -2 },
      },
      {
        label: 'Ir buscando compradores',
        hint: 'Se va con la valija llena de fichas de jugadores.',
        random: [
          { weight: 45, text: 'Volvieron con dos ofertas firmes por chicos de sexta. El viaje se pagó solo tres veces.', effects: { caja: 2.8, plantel: -2 } },
          { weight: 55, text: 'Nadie ofreció nada. Volvieron con el gasto hecho y los chicos preguntando por qué los miraban tanto.', effects: { caja: -1.7, hinchada: -3 } },
        ],
      },
    ],
  },
  {
    id: 'inf-cancha-auxiliar',
    kind: 'dilema',
    title: 'LA AUXILIAR NO TIENE LUCES',
    text: 'Las inferiores entrenan hasta que se hace de noche, y en invierno eso es las cinco de la tarde. Media hora menos de entrenamiento por día, todos los días.',
    options: [
      {
        label: 'Poner las torres de luz',
        hint: 'Una inversión que rinde recién en tres años.',
        effects: {
          caja: -2.1,
          deferred: [
            {
              inSeasons: 3,
              text: 'La camada que entrenó de noche todos los inviernos llegó a primera entera.',
              effects: { plantel: 7, hinchada: 5 },
            },
          ],
        },
      },
      {
        label: 'Alquilar una cancha con luces dos veces por semana',
        hint: 'Menos plata de golpe, todos los meses.',
        effects: { caja: -0.6, plantel: 1 },
      },
      {
        label: 'Que entrenen de mañana',
        hint: 'Gratis. Los que van al colegio, no van más.',
        effects: { plantel: -2, hinchada: -3 },
      },
    ],
  },
  {
    id: 'inf-juvenil-libre',
    kind: 'golpe',
    title: 'EL JUVENIL SE VA LIBRE',
    text: 'Diecinueve años, primer contrato vencido, y el club se olvidó de renovarlo. Ahora firmó en Europa y el club se queda sin nada.',
    requires: { minSeason: 3 },
    options: [
      {
        label: 'Reclamar formación ante la FIFA',
        hint: 'Es poco, es lento y es lo que corresponde.',
        effects: {
          influencia: -4,
          deferred: [
            {
              inSeasons: 2,
              text: 'Salió lo de la indemnización por formación del juvenil que se fue libre.',
              effects: { caja: 1.4 },
            },
          ],
        },
      },
      {
        label: 'Echar al que manejaba los contratos',
        hint: 'Alguien tiene que pagar. Y alguien va a tener que aprender de nuevo.',
        effects: { influencia: 4, plantel: -1, hinchada: 2 },
      },
      {
        label: 'Tragarse el sapo y revisar todos los contratos',
        hint: 'No arregla este. Evita los próximos.',
        effects: { caja: -0.4, hinchada: -3, plantel: 3 },
      },
    ],
  },
  {
    id: 'inf-el-cocinero',
    kind: 'color',
    title: 'SE JUBILA EL COCINERO',
    text: 'Cuarenta y un años cocinando para la pensión. Por sus milanesas pasaron cuatro campeones del mundo y trescientos que no llegaron a nada. Se jubila en marzo.',
    options: [
      {
        label: 'Homenaje en el entretiempo del domingo',
        hint: 'Sale una placa y algunas lágrimas.',
        effects: { hinchada: 6, socios: 1 },
      },
      {
        label: 'Ponerle su nombre al comedor',
        hint: 'Cuesta menos que una placa y dura más.',
        effects: { hinchada: 4, plantel: 1 },
      },
      {
        label: 'Un apretón de manos y a otra cosa',
        hint: 'Se va igual. Los chicos miran.',
        effects: { plantel: -1, hinchada: -2 },
      },
    ],
  },
  {
    id: 'inf-la-joya-emerge',
    kind: 'color',
    title: 'HAY UNO QUE JUEGA DISTINTO',
    text: 'En la séptima división hay un pibe que juega distinto a los demás. El profe de inferiores lo viene subiendo de a poco a los entrenamientos de primera.',
    weight: 2,
    options: [
      {
        label: 'Subirlo ya a los entrenamientos de primera',
        hint: 'Se apura el proceso. Puede quemarlo, puede acelerarlo.',
        effects: { plantel: 2, hinchada: 3, flags: { arco_joya_a: true } },
      },
      {
        label: 'Dejarlo un año más en inferiores',
        hint: 'Lo correcto. Menos vistoso.',
        effects: { plantel: 1, flags: { arco_joya_a: true } },
      },
    ],
  },
  {
    id: 'inf-joya-oferta-europea',
    kind: 'dilema',
    title: 'LO QUIEREN EN EUROPA',
    text: 'Un club europeo pone sobre la mesa una cifra que el club no vio nunca en su historia por el pibe que subiste de inferiores.',
    requires: { flag: 'arco_joya_a', minSeason: 5 },
    weight: 10,
    options: [
      {
        label: 'Venderlo',
        hint: 'Plata que cambia el club. La tribuna no lo va a olvidar tan rápido.',
        effects: { caja: 12, hinchada: -8, plantel: -6, flags: { arco_joya_vendida: true } },
      },
      {
        label: 'Rechazar la oferta y retenerlo',
        hint: 'Apuesta a que vale más quedándose. El club se lo debe.',
        effects: { hinchada: 6, influencia: -4, flags: { arco_joya_quedo: true } },
      },
    ],
  },
  {
    id: 'inf-joya-triunfa-afuera',
    kind: 'color',
    title: 'EL QUE VENDISTE ES FIGURA',
    text: 'El pibe que vendiste es titular en Europa y lo empiezan a nombrar en la selección. Los memes te comparan con el que dejó ir a una joya por poca plata.',
    requires: { flag: 'arco_joya_vendida', minSeason: 9 },
    weight: 10,
    options: [
      {
        label: 'Reivindicar la venta en una entrevista',
        hint: 'Con la plata que entró se ordenaron las cuentas. Que lo digan los números.',
        effects: { influencia: 4, hinchada: -3 },
      },
      {
        label: 'No decir nada',
        hint: 'Cada vez que juega, alguien te lo va a recordar igual.',
        effects: { hinchada: 2 },
      },
    ],
  },
  {
    id: 'inf-joya-capitan',
    kind: 'color',
    title: 'EL PIBE QUE NO VENDISTE ES CAPITÁN',
    text: 'El pibe de inferiores que no vendiste lleva hoy la cinta y es el ídolo de la popular. Le ofrecen ponerle su nombre a las divisiones inferiores.',
    requires: { flag: 'arco_joya_quedo', minSeason: 9 },
    weight: 10,
    options: [
      {
        label: 'Aceptar',
        hint: 'Va a jugar con jugadores que crecieron mirando su nombre en la puerta.',
        effects: { hinchada: 10, socios: 3 },
      },
      {
        label: 'Esperar a que se retire',
        hint: 'Protocolar. Correcto. Un poco tibio.',
        effects: { hinchada: 3, influencia: 2 },
      },
    ],
  },
  {
    id: 'inf-nuevo-predio',
    kind: 'dilema',
    title: 'SE PUEDE AMPLIAR EL PREDIO',
    text: 'El terreno lindero al predio de inferiores está en venta. Comprarlo permitiría duplicar la cantidad de chicos que entrenan ahí.',
    weight: 2,
    options: [
      {
        label: 'Comprarlo',
        hint: 'Inversión a largo plazo. El resultado se ve en años, no en meses.',
        effects: { caja: -3, plantel: 1, socios: 2 },
      },
      {
        label: 'Seguir con el predio actual',
        hint: 'No se gasta nada. Tampoco crece nada.',
        effects: { influencia: 1 },
      },
    ],
  },
  {
    id: 'inf-madre-de-un-juvenil',
    kind: 'dilema',
    title: 'UNA MADRE PIDE HABLAR CON VOS',
    text: 'La madre de un chico de inferiores pide una reunión con el presidente, algo que nunca pasa. Dice que a su hijo lo maltratan en los entrenamientos.',
    weight: 2,
    options: [
      {
        label: 'Recibirla e investigar el reclamo',
        hint: 'Puede ser un exceso real de algún entrenador. Puede ser otra cosa.',
        random: [
          { weight: 50, text: 'El reclamo era real. Se corrigió a tiempo, sin escándalo.', effects: { influencia: 3, hinchada: 1 } },
          { weight: 50, text: 'No había nada de fondo, pero la reunión incomodó a todo el cuerpo técnico.', effects: { influencia: -1, plantel: -1 } },
        ],
      },
      {
        label: 'Derivarlo directamente a inferiores',
        hint: 'No es tu función bajar a ese detalle. Tampoco parece que a nadie más le importe.',
        effects: { influencia: -2 },
      },
    ],
  },
  {
    id: 'inf-torneo-local-de-menores',
    kind: 'color',
    title: 'ORGANIZAR UN TORNEO DE MENORES',
    text: 'Clubes del barrio proponen organizar un torneo relámpago de menores usando la cancha auxiliar un fin de semana.',
    options: [
      {
        label: 'Prestar la cancha y sumarse',
        hint: 'Un gesto para el barrio que no cuesta casi nada.',
        effects: { caja: -0.1, hinchada: 2, socios: 1 },
      },
      {
        label: 'Declinar la invitación',
        hint: 'La cancha auxiliar sigue libre para el plantel.',
        effects: { plantel: 1 },
      },
    ],
  },
];
