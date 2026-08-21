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
];
