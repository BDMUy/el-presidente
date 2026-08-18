/**
 * Cuando las cosas van mal.
 *
 * Todas estas cartas piden un recurso en el piso. Existen para que la caída
 * tenga textura propia y no sea solo un número bajando: cuando la hinchada te
 * odia o la caja está en rojo, el juego tiene que sonar distinto.
 *
 * Casi ninguna ofrece una salida limpia. En una crisis las opciones buenas ya
 * se gastaron.
 */

import type { GameEvent } from '@/lib/engine/types';

export const CRISIS: GameEvent[] = [
  {
    id: 'cri-escrache',
    kind: 'golpe',
    title: 'ESCRACHE EN LA PUERTA DE TU CASA',
    text: 'Cuarenta personas con bombos frente a tu casa un jueves a la noche. Tu familia mirando por la ventana.',
    weight: 2,
    requires: { maxHinchada: 30, minSeason: 2 },
    options: [
      {
        label: 'Salir a hablar con ellos',
        hint: 'Se puede desarmar. O puede empeorar mucho.',
        random: [
          { weight: 45, text: 'Saliste, los escuchaste una hora y se fueron. Alguno hasta te dio la mano.', effects: { hinchada: 9, influencia: 4 } },
          { weight: 55, text: 'Te insultaron dos horas y filmaron todo. El video tiene medio millón de reproducciones.', effects: { hinchada: -8, influencia: -6 } },
        ],
      },
      {
        label: 'Llamar a la policía',
        hint: 'Se van esa noche. Y no se olvidan nunca.',
        effects: { hinchada: -12, influencia: -3 },
      },
      {
        label: 'Apagar las luces y esperar',
        hint: 'Se cansan a las tres de la mañana.',
        effects: { hinchada: -4 },
      },
    ],
  },
  {
    id: 'cri-renuncia-masiva',
    kind: 'golpe',
    title: 'RENUNCIA LA COMISIÓN',
    text: 'Cuatro vocales presentaron la renuncia el mismo día y con la misma redacción. Es una operación y todos lo saben.',
    requires: { maxInfluencia: 25, minSeason: 3 },
    options: [
      {
        label: 'Aceptarlas y nombrar gente propia',
        hint: 'Te quedás solo pero mandando.',
        effects: { influencia: -5, hinchada: -4, flags: { comision_propia: true } },
      },
      {
        label: 'Convencer a dos de que se queden',
        hint: 'Cuesta favores. La comisión sobrevive.',
        effects: { influencia: -10, hinchada: 2 },
      },
      {
        label: 'Denunciar la operación en público',
        hint: 'Escándalo abierto. La gente elige un bando.',
        effects: { hinchada: 5, influencia: -8 },
      },
    ],
  },
  {
    id: 'cri-embargo',
    kind: 'golpe',
    title: 'EMBARGARON LA CUENTA',
    text: 'Un juez trabó la cuenta del club por una deuda vieja. No se puede pagar ni la luz del predio.',
    weight: 2,
    requires: { maxCaja: 0, minSeason: 2 },
    options: [
      {
        label: 'Pedir un préstamo puente a un socio',
        hint: 'Se destraba. Le vas a deber a alguien que cobra.',
        effects: { caja: 3, influencia: -10, flags: { debe_a_socio: true } },
      },
      {
        label: 'Vender lo que sea, ya',
        hint: 'Se salva la semana. Se hunde el equipo.',
        effects: { caja: 5, plantel: -7, hinchada: -8 },
      },
      {
        label: 'Aguantar el embargo',
        hint: 'Sueldos impagos y todo lo que viene con eso.',
        effects: { plantel: -5, hinchada: -6, influencia: -4 },
      },
    ],
  },
  {
    id: 'cri-dt-renuncia',
    kind: 'golpe',
    title: 'RENUNCIÓ EL DT EN CONFERENCIA',
    text: 'No te avisó. Lo dijo en el micrófono, delante de todos, y agregó que "el problema del club no está en el vestuario".',
    requires: { maxHinchada: 40, minSeason: 2 },
    options: [
      {
        label: 'Responderle en el momento',
        hint: 'Te sacás la bronca. Queda todo filmado.',
        effects: { hinchada: -6, influencia: -5, plantel: -2 },
      },
      {
        label: 'Agradecerle y no responder',
        hint: 'Elegancia. Nadie la va a valorar hoy.',
        effects: { influencia: 5, hinchada: 2 },
      },
      {
        label: 'Ascender al DT de la reserva',
        hint: 'Barato, y a la gente le gusta lo de la casa.',
        effects: { caja: 0.5, hinchada: 5, plantel: -2 },
      },
    ],
  },
  {
    id: 'cri-descenso-en-juego',
    kind: 'dilema',
    title: 'SE JUEGA LA PERMANENCIA',
    text: 'Faltan cuatro fechas y el descenso está a dos puntos. Alguien sugiere, con mucho cuidado, que hay partidos que se pueden hablar.',
    weight: 2,
    requires: { maxPlantel: 45, minSeason: 3 },
    options: [
      {
        label: 'Hablar el partido',
        hint: 'Sube muchísimo la chance de salvarse. Y queda gente que sabe.',
        effects: {
          plantel: 6,
          influencia: -14,
          deferred: [{ inSeasons: 2, text: 'Salió una escucha de aquel partido del final. El club quedó marcado.', effects: { hinchada: -18, influencia: -12 } }],
        },
      },
      {
        label: 'Ni loco',
        hint: 'Te salvás o te vas, pero limpio.',
        effects: { influencia: 6, hinchada: 4 },
      },
      {
        label: 'Poner premio por punto',
        hint: 'Lo caro y legal.',
        effects: { caja: -2.5, plantel: 4 },
      },
    ],
  },
  {
    id: 'cri-plantel-paro',
    kind: 'golpe',
    title: 'EL PLANTEL PARA',
    text: 'No se entrenó. Los jugadores hicieron una ronda en el círculo central y se fueron a los vestuarios. Tres meses sin cobrar.',
    requires: { maxCaja: -5 },
    options: [
      {
        label: 'Pagar aunque sea un mes',
        hint: 'Vuelven a entrenar. La deuda sigue.',
        effects: { caja: -3, plantel: 3 },
      },
      {
        label: 'Poner a los pibes de la reserva',
        hint: 'Se juega igual, con chicos de dieciocho.',
        effects: { plantel: -8, hinchada: 4, caja: 1 },
      },
      {
        label: 'Hablar de frente y pedir tiempo',
        hint: 'Depende de cuánto te crean todavía.',
        random: [
          { weight: 40, text: 'Te dieron un mes. El capitán salió a bancarte en la puerta.', effects: { plantel: 2, hinchada: 3 } },
          { weight: 60, text: 'No te creyeron. Dos jugadores se fueron libres esa misma semana.', effects: { plantel: -6, hinchada: -5 } },
        ],
      },
    ],
  },
  {
    id: 'cri-mecenas-cobra',
    kind: 'golpe',
    title: 'EL SOCIO QUE PRESTÓ VIENE A COBRAR',
    text: 'El que te sacó del embargo quiere ahora decidir los refuerzos. Dice que es lo justo.',
    requires: { flag: 'debe_a_socio', minSeason: 2 },
    options: [
      {
        label: 'Dejarlo elegir',
        hint: 'Se paga la deuda con poder. Trae a sus representados.',
        effects: { caja: 2, plantel: 2, influencia: -12, hinchada: -6 },
      },
      {
        label: 'Devolverle la plata como sea',
        hint: 'Te sacás el problema de encima. Duele.',
        effects: { caja: -4, influencia: 8 },
      },
    ],
  },
  {
    id: 'cri-prensa-jauria',
    kind: 'golpe',
    title: 'TODOS PIDIENDO TU RENUNCIA',
    text: 'Los cuatro programas partidarios del club abrieron con lo mismo: que te vayas. Uno hasta hizo un conteo de días.',
    requires: { maxHinchada: 25, minSeason: 3 },
    options: [
      {
        label: 'Convocar a elecciones anticipadas',
        hint: 'Jugada osada: si ganás, quedás blindado.',
        effects: { hinchada: 8, influencia: -6 },
      },
      {
        label: 'Encerrarte a trabajar',
        hint: 'Ni una declaración durante dos meses.',
        effects: { influencia: 3, hinchada: -3 },
      },
      {
        label: 'Comprar dos programas con pauta',
        hint: 'Baja el volumen. Se nota y se paga.',
        effects: { caja: -2, hinchada: 4, influencia: -8 },
      },
    ],
  },
  {
    id: 'cri-ultima-carta',
    kind: 'dilema',
    title: 'LA ÚLTIMA CARTA',
    text: 'Un empresario ofrece hacerse cargo de todo: paga la deuda, refuerza el plantel y pone su marca en el nombre del estadio. Durante diez años.',
    requires: { maxCaja: -10, minSeason: 4 },
    options: [
      {
        label: 'Aceptar',
        hint: 'El club se salva y deja de llamarse como se llamaba.',
        effects: { caja: 16, plantel: 6, hinchada: -22, influencia: -10 },
      },
      {
        label: 'Rechazar',
        hint: 'El nombre queda intacto. La deuda también.',
        effects: { hinchada: 10, influencia: 5 },
      },
    ],
  },
  {
    id: 'cri-luz-cortada',
    kind: 'golpe',
    title: 'CORTARON LA LUZ EN EL PREDIO',
    text: 'Sin aviso y a la mañana. Los del plantel se enteraron cuando abrieron el vestuario y no había agua caliente. Afuera hay tres camionetas de canales.',
    requires: { maxCaja: -6, minSeason: 2 },
    options: [
      {
        label: 'Pagar con lo que sea',
        hint: 'Se saca de donde no hay.',
        effects: { caja: -1.4, hinchada: 2 },
      },
      {
        label: 'Entrenar en un club amigo',
        hint: 'Un favor grande, que se devuelve algún día.',
        effects: { influencia: -9, plantel: -2 },
      },
      {
        label: 'Que entrenen igual',
        hint: 'Con lo que hay. Se ve desde la calle.',
        effects: { plantel: -4, hinchada: -7 },
      },
    ],
  },
  {
    id: 'cri-utileria-vacia',
    kind: 'golpe',
    title: 'NO HAY PELOTAS',
    text: 'El proveedor cortó el crédito. Quedan once pelotas para todo el club, contando inferiores. El utilero las junta después de cada práctica como si fueran de él.',
    requires: { maxCaja: -3, minSeason: 2 },
    options: [
      {
        label: 'Comprar al contado lo mínimo',
        hint: 'Alcanza para el mes. Nada más.',
        effects: { caja: -0.5 },
      },
      {
        label: 'Pedirle a la gente que done',
        hint: 'La hinchada responde. Y se entera de todo.',
        effects: { hinchada: -3, socios: 1, plantel: 1 },
      },
      {
        label: 'Que las inferiores presten las suyas',
        hint: 'La primera entrena. Los pibes miran.',
        effects: { plantel: 1, hinchada: -4 },
      },
    ],
  },
  {
    id: 'cri-nadie-atiende',
    kind: 'golpe',
    title: 'YA NO TE ATIENDE NADIE',
    text: 'Llamaste a cuatro dirigentes que hace dos años te devolvían el llamado en el acto. Ninguno atendió. El quinto te hizo decir que estaba en una reunión.',
    requires: { maxInfluencia: 15, minSeason: 3 },
    options: [
      {
        label: 'Insistir hasta que alguno ceda',
        hint: 'Humillante y a veces sirve.',
        random: [
          { weight: 40, text: 'Uno te atendió y te dio una mano. Dijo que no lo contaras.', effects: { influencia: 9, caja: 0.6 } },
          { weight: 60, text: 'Ninguno atendió. La versión de que estás terminado ya circula sola.', effects: { influencia: -5, hinchada: -6 } },
        ],
      },
      {
        label: 'Dejar de llamar',
        hint: 'Se arregla sin ellos. Todo cuesta el doble.',
        effects: { caja: -0.8, hinchada: 3 },
      },
    ],
  },
];
