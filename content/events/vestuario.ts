import type { GameEvent } from '@/lib/engine/types';

export const VESTUARIO: GameEvent[] = [
  {
    id: 'dt-crisis',
    kind: 'dilema',
    title: 'EL DT HACE AGUA',
    text: 'Cuatro fechas sin ganar y el vestuario ya no lo escucha. La prensa te pregunta todos los días si lo vas a echar.',
    weight: 2,
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Echarlo',
        hint: 'Pagás la indemnización y traés a otro. Reinicio total.',
        effects: { caja: -2.5, plantel: -3, hinchada: 4 },
      },
      {
        label: 'Bancarlo en público',
        hint: 'Si se recupera, sos un visionario. Si no, caés con él.',
        random: [
          { weight: 45, text: 'El equipo reaccionó. Salir a bancarlo fue lo que necesitaba.', effects: { plantel: 5, hinchada: 8, influencia: 6 } },
          { weight: 55, text: 'Siguió perdiendo. Ahora sos vos el que no tiene salida.', effects: { hinchada: -12, influencia: -8 } },
        ],
      },
    ],
  },
  {
    id: 'capitan-renovacion',
    kind: 'dilema',
    title: 'LA RENOVACIÓN DEL CAPITÁN',
    text: 'Tiene 34 años, le queda medio año de contrato y pide dos temporadas más con aumento. La tribuna lo adora. El cuerpo técnico dice que ya no llega.',
    options: [
      {
        label: 'Renovarlo',
        hint: 'La gente lo festeja. El plantel se envejece.',
        effects: { caja: -1.8, hinchada: 9, plantel: -2 },
      },
      {
        label: 'Dejarlo libre',
        hint: 'Decisión fría y correcta. Te la van a cobrar igual.',
        effects: { hinchada: -13, plantel: -1, caja: 0.5 },
      },
      {
        label: 'Ofrecerle un año y puesto de dirigente',
        hint: 'Cuesta influencia convencerlo, pero cierra bien.',
        requires: { minInfluencia: 25 },
        effects: { influencia: -12, hinchada: 5, caja: -0.6 },
      },
    ],
  },
  {
    id: 'pibe-inferiores',
    kind: 'dilema',
    title: 'EL PIBE DE INFERIORES',
    text: 'Tiene 17 y en reserva hace cosas que no se ven hace años. Un club de Europa ya preguntó. El DT no lo quiere subir todavía.',
    options: [
      {
        label: 'Que debute ya',
        hint: 'Si explota, es tuyo. Si se quema, lo quemaste vos.',
        random: [
          { weight: 55, text: 'Debutó y metió dos. El estadio coreó su nombre.', effects: { plantel: 6, hinchada: 12, caja: 0.5 } },
          { weight: 45, text: 'Se lo comió la presión. Volvió a reserva sin confianza.', effects: { plantel: -1, hinchada: -4 } },
        ],
      },
      {
        label: 'Venderlo ahora',
        hint: 'Plata fresca, y la gente nunca te lo perdona.',
        effects: { caja: 7, hinchada: -18, plantel: -2 },
      },
      {
        label: 'Dejarlo madurar',
        hint: 'Lo correcto. Aburrido, pero correcto.',
        effects: { plantel: 2, flags: { pibe_madurando: true } },
      },
    ],
  },
  {
    id: 'sueldos-atrasados',
    kind: 'golpe',
    title: 'DOS MESES SIN COBRAR',
    text: 'El plantel se enteró de que los sueldos vuelven a salir tarde. Hay reunión de capitanes y la palabra "paro" apareció en el grupo de WhatsApp.',
    requires: { maxCaja: 3 },
    weight: 2,
    options: [
      {
        label: 'Pagar como sea',
        hint: 'Te endeudás más, pero el vestuario queda tranquilo.',
        effects: { caja: -4, plantel: 2 },
      },
      {
        label: 'Pedirles que aguanten',
        hint: 'Ganás tiempo. El equipo juega como si no le importara.',
        effects: { plantel: -6, hinchada: -4 },
      },
      {
        label: 'Adelantar plata de un sponsor',
        hint: 'Si el sponsor acepta, zafás. Si no, se filtra todo.',
        random: [
          { weight: 60, text: 'El sponsor adelantó el año. Zafaste por poco.', effects: { caja: 3, influencia: -6 } },
          { weight: 40, text: 'El sponsor dijo que no y alguien filtró la charla. Papelón.', effects: { hinchada: -9, influencia: -8, plantel: -4 } },
        ],
      },
    ],
  },
  {
    id: 'interna-vestuario',
    kind: 'golpe',
    title: 'SE PELEARON EN LA PRÁCTICA',
    text: 'El nueve y el capitán se agarraron a piñas delante de todos. Hay video. Alguien lo va a vender.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Multar a los dos y cerrarlo puertas adentro',
        hint: 'Autoridad. El vestuario se ordena, la prensa igual se entera.',
        effects: { plantel: 1, hinchada: -3, influencia: 3 },
      },
      {
        label: 'Vender al nueve',
        hint: 'Entra plata, se va el goleador.',
        effects: { caja: 5, plantel: -7, hinchada: -6 },
      },
      {
        label: 'Hacer de cuenta que no pasó',
        hint: 'O se olvida, o el video sale el domingo.',
        random: [
          { weight: 50, text: 'No salió nunca. Alguien cobró por no publicarlo.', effects: { caja: -1, influencia: -4 } },
          { weight: 50, text: 'Salió en todos lados. Quedaron como una manga de improvisados.', effects: { hinchada: -10, plantel: -3, influencia: -6 } },
        ],
      },
    ],
  },
  {
    id: 'oferta-europa',
    kind: 'dilema',
    title: 'OFERTA DESDE EUROPA',
    text: 'Llegó una oferta formal por tu mejor jugador. Es mucha plata, es media temporada antes de tiempo, y estás peleando el campeonato.',
    requires: { minSeason: 2, minPlantel: 45 },
    weight: 2,
    options: [
      {
        label: 'Venderlo',
        hint: 'Salva el año económico. Se cae el equipo en el peor momento.',
        effects: { caja: 11, plantel: -9, hinchada: -15 },
      },
      {
        label: 'Rechazarla',
        hint: 'La gente te aplaude de pie. El jugador se va libre en un año.',
        effects: { hinchada: 14, deferred: [{ inSeasons: 2, text: 'Se fue libre, como estaba cantado. No entró un peso.', effects: { plantel: -8, caja: 0 } }] },
      },
      {
        label: 'Venderlo con recompra',
        hint: 'Menos plata ahora, y una carta para más adelante.',
        requires: { minInfluencia: 30 },
        effects: { caja: 7, plantel: -9, hinchada: -6, influencia: -8, flags: { recompra: true } },
      },
    ],
  },
  {
    id: 'lesion-grave',
    kind: 'golpe',
    title: 'SE ROMPIÓ LOS LIGAMENTOS',
    text: 'El mejor del equipo se agarró la rodilla solo, sin que nadie lo tocara. Seis meses afuera, como mínimo.',
    requires: { minSeason: 2 },
    weight: 2,
    options: [
      {
        label: 'Operarlo con el mejor médico del país',
        hint: 'Caro. Vuelve entero.',
        effects: { caja: -1.5, plantel: -4 },
      },
      {
        label: 'Tratamiento conservador',
        hint: 'Barato. Puede volver mal.',
        random: [
          { weight: 45, text: 'Volvió bien y antes de lo previsto. Sale barato ser prudente.', effects: { plantel: -2 } },
          { weight: 55, text: 'Recayó. No volvió a ser el mismo jugador.', effects: { plantel: -8, hinchada: -5 } },
        ],
      },
    ],
  },
  {
    id: 'refuerzo-fracaso',
    kind: 'color',
    title: 'EL REFUERZO NO ANDA',
    text: 'El que trajiste como gran incorporación lleva doce partidos sin hacer nada. La tribuna ya le canta cosas.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Bancarlo públicamente',
        hint: 'Le baja la presión. La gente te lo suma a tu cuenta.',
        effects: { plantel: 2, hinchada: -5 },
      },
      {
        label: 'Rescindirle el contrato',
        hint: 'Admitís el error y pagás por admitirlo.',
        effects: { caja: -2, plantel: -2, hinchada: 3 },
      },
      {
        label: 'Prestarlo al ascenso',
        hint: 'Se lo saca de encima sin pagar todo.',
        effects: { caja: -0.5, plantel: -1, hinchada: 1 },
      },
    ],
  },
  {
    id: 'vest-companero-de-mas',
    kind: 'dilema',
    title: 'SOBRA UN JUGADOR',
    text: 'El DT te pide que saques del plantel a un jugador que tiene contrato dos años más. No rinde, cobra bien y en el vestuario lo quieren todos.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Rescindirle el contrato',
        hint: 'Se va contento y caro. El vestuario toma nota.',
        effects: { caja: -2.2, plantel: -1, hinchada: -3 },
      },
      {
        label: 'Dejarlo entrenar aparte',
        hint: 'No cuesta un peso hoy. Cuesta después.',
        effects: { plantel: -4, hinchada: -2, influencia: -3 },
      },
      {
        label: 'Bancarlo y decirle al DT que lo use',
        hint: 'El plantel te lo agradece. El técnico, no.',
        effects: { plantel: -2, hinchada: 4, influencia: -4 },
      },
    ],
  },
  {
    id: 'vest-doble-turno',
    kind: 'dilema',
    title: 'EL DOBLE TURNO',
    text: 'El preparador físico quiere doble turno toda la pretemporada. Dice que en noviembre se nota. El plantel avisa por lo bajo que en noviembre están todos rotos.',
    options: [
      {
        label: 'Doble turno',
        hint: 'Llegan mejor. Alguno se rompe en el camino.',
        random: [
          { weight: 55, text: 'Llegaron enteros y se notó: el equipo corre más que nadie.', effects: { plantel: 7, hinchada: 3 } },
          { weight: 45, text: 'Tres desgarros en cinco fechas. Medio plantel mirando desde afuera.', effects: { plantel: -6, hinchada: -4 } },
        ],
      },
      {
        label: 'Carga normal',
        hint: 'Nadie se rompe. Nadie mejora tampoco.',
        effects: { plantel: 1 },
      },
    ],
  },
  {
    id: 'vest-arquero-suplente',
    kind: 'color',
    title: 'EL ARQUERO SUPLENTE HABLÓ',
    text: 'Lleva cuatro años sin atajar y dijo en una radio que en este club los puestos se ganan afuera de la cancha. Nadie le dio bola hasta que lo levantaron todos los portales.',
    options: [
      {
        label: 'Multarlo y sentarlo en la tribuna',
        hint: 'Disciplina. Y un vestuario que se calla por miedo.',
        effects: { plantel: -2, influencia: 4, hinchada: -2 },
      },
      {
        label: 'Ponerlo de titular el domingo',
        hint: 'Nadie lo vio venir. Puede salir cualquier cosa.',
        random: [
          { weight: 40, text: 'Atajó todo. La cancha coreó su nombre y el titular no dijo una palabra.', effects: { plantel: 3, hinchada: 8 } },
          { weight: 60, text: 'Le hicieron tres. Volvió al banco y esta vez no habló más.', effects: { plantel: -2, hinchada: -5 } },
        ],
      },
      {
        label: 'Hacer como que no pasó nada',
        hint: 'En dos días se olvida. O no.',
        effects: { hinchada: -1, influencia: -2 },
      },
    ],
  },
  {
    id: 'vest-nuevo-capitan',
    kind: 'dilema',
    title: 'HAY QUE ELEGIR CAPITÁN',
    text: 'El capitán histórico se fue en el último mercado. El DT te pasa dos nombres y te pide que decidas vos, "para que no parezca cosa suya".',
    weight: 2,
    options: [
      {
        label: 'El más veterano del plantel',
        hint: 'Autoridad garantizada. Cero sorpresas.',
        effects: { plantel: 1, influencia: 2 },
      },
      {
        label: 'El más joven con carácter',
        hint: 'Mensaje claro puertas adentro. No todos lo bancan.',
        effects: { plantel: 2, hinchada: 3 },
      },
    ],
  },
  {
    id: 'vest-partido-a-puertas-cerradas',
    kind: 'color',
    title: 'AMISTOSO A PUERTAS CERRADAS',
    text: 'Un amistoso de pretemporada sin cámaras ni prensa. Lo que se ve adentro no coincide con lo que se dice afuera.',
    weight: 2,
    options: [
      {
        label: 'Confiar en lo que muestra la cancha',
        hint: 'Un partido no es una temporada. Pero algo dice.',
        effects: { plantel: 2 },
      },
      {
        label: 'Confiar en lo que dice el DT',
        hint: 'Él los ve todos los días. Vos ves uno.',
        effects: { plantel: 1, influencia: 1 },
      },
    ],
  },
  {
    id: 'vest-el-que-no-corre',
    kind: 'dilema',
    title: 'EL QUE DEJÓ DE CORRER',
    text: 'Las estadísticas del cuerpo técnico son claras: el mejor jugador del plantel corre la mitad que hace dos años. Todavía define partidos.',
    options: [
      {
        label: 'Hablarlo con él en privado',
        hint: 'Puede tomarlo bien. Puede no tomarlo nada bien.',
        random: [
          { weight: 55, text: 'Lo tomó bien. Volvió a entrenar como antes.', effects: { plantel: 3, hinchada: 2 } },
          { weight: 45, text: 'Se ofendió. Rindió peor las siguientes fechas.', effects: { plantel: -2, hinchada: -1 } },
        ],
      },
      {
        label: 'No decir nada mientras siga metiendo goles',
        hint: 'Funciona hasta que deja de funcionar.',
        effects: { plantel: -1, hinchada: 1 },
      },
    ],
  },
  {
    id: 'vest-cumpleanos-del-plantel',
    kind: 'color',
    title: 'EL CUMPLEAÑOS DEL PLANTEL',
    text: 'Un jugador cumple años y organiza algo para todo el plantel. Te invita, "si tenés tiempo, presidente".',
    options: [
      {
        label: 'Ir y quedarte un rato',
        hint: 'Bajás a tierra. Algunos lo valoran, otros lo ven raro.',
        effects: { hinchada: 1, influencia: 1, plantel: 1 },
      },
      {
        label: 'Mandar un regalo y no ir',
        hint: 'Correcto y distante, como casi todo lo tuyo con ellos.',
        effects: { caja: -0.2 },
      },
    ],
  },
  {
    id: 'vest-el-cabecilla-del-grupo',
    kind: 'dilema',
    title: 'EL QUE MANEJA EL GRUPO',
    text: 'Hay un jugador que no es el capitán pero es el que realmente maneja el vestuario. El DT te lo confirma en voz baja: "sin él de tu lado, no arreglás nada ahí adentro".',
    options: [
      {
        label: 'Cultivar esa relación en privado',
        hint: 'Un canal informal que puede valer más que cualquier reunión.',
        effects: { plantel: 2, influencia: -1 },
      },
      {
        label: 'Ignorarlo y tratar a todos por igual',
        hint: 'Correcto en el papel. Más difícil en la práctica.',
        effects: { plantel: -1, influencia: 1 },
      },
    ],
  },
  {
    id: 'vest-el-que-pide-la-diez',
    kind: 'dilema',
    title: 'DOS QUIEREN LA CAMISETA DIEZ',
    text: 'El refuerzo nuevo pide la camiseta diez apenas firma. El que la usa hace tres años no está dispuesto a soltarla sin pelear.',
    options: [
      {
        label: 'Dársela al nuevo',
        hint: 'Mensaje claro sobre quién manda hoy en la cancha.',
        effects: { plantel: 1, hinchada: -2 },
      },
      {
        label: 'Que se la quede el de siempre',
        hint: 'Respeta lo ganado. El nuevo empieza con un sabor amargo.',
        effects: { hinchada: 1 },
      },
    ],
  },
  {
    id: 'vest-el-chef-nuevo',
    kind: 'color',
    title: 'UN NUTRICIONISTA QUIERE CAMBIAR TODO',
    text: 'El nutricionista nuevo propone tirar abajo el menú de toda la vida del predio. El plantel, sobre todo los más veteranos, no lo toma nada bien.',
    weight: 2,
    options: [
      {
        label: 'Bancar el cambio de menú',
        hint: 'A la ciencia le cuesta entrar a un vestuario acostumbrado a otra cosa.',
        effects: { caja: -0.4, plantel: 2 },
      },
      {
        label: 'Mantener el menú de siempre',
        hint: 'Nadie se queja. Tampoco cambia nada.',
        effects: { plantel: -1 },
      },
    ],
  },
  {
    id: 'arco-dt-1',
    kind: 'dilema',
    title: 'EL DT QUE ELEGISTE VOS',
    text: 'Trajiste a un técnico joven, sin nombre, con una idea. En la presentación te pusiste al lado y dijiste que el proyecto era a tres años, pase lo que pase.',
    weight: 2,
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Bancar en serio el discurso de los tres años',
        hint: 'Si sale, la idea lleva tu firma. Si no, también.',
        effects: { hinchada: 4, influencia: -2, flags: { arco_dt_1: true } },
      },
      {
        label: 'Firmarle un año con opción y no atarte tanto',
        hint: 'Menos épica en la presentación. Más margen en marzo.',
        effects: { influencia: 2, flags: { arco_dt_1: true } },
      },
    ],
  },
  {
    id: 'arco-dt-2',
    kind: 'dilema',
    title: 'LOS RESULTADOS NO ACOMPAÑAN',
    text: 'El equipo juega parecido a lo que prometía el proyecto, pero los puntos no aparecen. La platea se va antes del final y en la radio ya cuentan los partidos que le quedan.',
    requires: { flag: 'arco_dt_1', minSeason: 6 },
    weight: 10,
    options: [
      {
        label: 'Salir a bancarlo de nuevo, con la cara',
        hint: 'Doblás la apuesta en público. No hay tercera conferencia para esto.',
        effects: { hinchada: -3, influencia: -2, flags: { arco_dt_banco: true } },
      },
      {
        label: 'Agradecerle y cerrar el proyecto',
        hint: 'Pagás la indemnización y te comés el yo lo presenté.',
        effects: { caja: -2, plantel: -2, hinchada: 3, flags: { arco_dt_ruptura: true } },
      },
    ],
  },
  {
    id: 'arco-dt-3a',
    kind: 'color',
    title: 'EL PROYECTO DEL DT DIO VUELTA',
    text: 'Al DT que bancaste dos veces se le acomodó el equipo justo cuando ya nadie daba nada. Terminó la temporada dando la vuelta y con la platea cantándole el nombre.',
    requires: { flag: 'arco_dt_banco', minSeason: 10 },
    weight: 10,
    options: [
      {
        label: 'Renovarlo por tres años sin cláusulas raras',
        hint: 'Se lo ganó. Los grandes ya preguntan por él.',
        effects: { hinchada: 10, influencia: 6, caja: -1 },
      },
      {
        label: 'Festejar el título y dejar la renovación para más adelante',
        hint: 'Te ahorrás la charla incómoda. Alguno la lee como desconfianza.',
        effects: { hinchada: 6, influencia: 2 },
      },
    ],
  },
  {
    id: 'arco-dt-3b',
    kind: 'color',
    title: 'EL DT QUE SOLTASTE ANDA BIEN LEJOS',
    text: 'El técnico que echaste agarró a otro club de la categoría y lo tiene arriba, jugando de memoria. Cada fecha, un periodista te pregunta si te arrepentís.',
    requires: { flag: 'arco_dt_ruptura', minSeason: 10 },
    weight: 10,
    options: [
      {
        label: 'Admitir que la idea era buena y el momento malo',
        hint: 'Honestidad que no cambia la tabla, pero se agradece.',
        effects: { hinchada: 3, influencia: 2 },
      },
      {
        label: 'Defender la decisión y mirar para adelante',
        hint: 'Cada gol de ellos te lo van a poner en la cuenta igual.',
        effects: { influencia: 1, hinchada: -2 },
      },
    ],
  },
  {
    id: 'arco-figura-1',
    kind: 'color',
    title: 'EL GRANDE PREGUNTÓ POR TU FIGURA',
    text: 'Un dirigente del club más grande del país se cruzó con el tuyo en un palco y, como al pasar, preguntó cuánto costaría tu mejor jugador. No hubo oferta. Todavía.',
    weight: 2,
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Contestar que no está en venta y cortar ahí',
        hint: 'Corto y claro. Ellos tienen tiempo y vos un solo jugador así.',
        effects: { influencia: 2, flags: { arco_figura_1: true } },
      },
      {
        label: 'Escuchar hasta dónde llegan, sin comprometerse',
        hint: 'Saber el número no cuesta nada. O cuesta, si se filtra.',
        effects: { hinchada: -2, flags: { arco_figura_1: true } },
      },
    ],
  },
  {
    id: 'arco-figura-2',
    kind: 'dilema',
    title: 'VUELVEN, Y AHORA CON UN NÚMERO',
    text: 'El grande pone una oferta formal por tu figura. Es la venta más grande de la historia del club, y el jugador ya dijo por lo bajo que le gustaría el paso. Estás peleando cosas importantes esta temporada.',
    requires: { flag: 'arco_figura_1', minSeason: 6 },
    weight: 10,
    options: [
      {
        label: 'Venderlo ahora, con la cifra en la mesa',
        hint: 'La plata ordena el club por años. La platea tarda en entenderlo.',
        effects: { caja: 10, plantel: -8, hinchada: -10, flags: { arco_figura_2: true } },
      },
      {
        label: 'Rechazar y renovarle con una cláusula más alta',
        hint: 'Se queda un año más, caro. El grande vuelve en junio.',
        effects: { caja: -2, hinchada: 8, influencia: -3, flags: { arco_figura_2: true } },
      },
      {
        label: 'Decirle que se queda esta temporada y después se habla',
        hint: 'Ganás seis meses. El jugador juega pensando en otra cosa.',
        effects: { plantel: -3, hinchada: 2, flags: { arco_figura_2: true } },
      },
    ],
  },
  {
    id: 'arco-figura-3',
    kind: 'dilema',
    title: 'LA TERCERA VEZ POR TU FIGURA',
    text: 'El grande vuelve por tercera vez. Al jugador le queda poco contrato y esta es la última ventana en la que el club puede sacar algo. La oferta bajó respecto de la de hace dos años.',
    requires: { flag: 'arco_figura_2', minSeason: 10 },
    weight: 10,
    options: [
      {
        label: 'Venderlo por lo que haya',
        hint: 'Menos de lo que valía. Más que cero, que es lo que entra si se va libre.',
        effects: { caja: 5, plantel: -7, hinchada: -6 },
      },
      {
        label: 'Retenerlo hasta que se le termine el contrato',
        hint: 'La gente lo disfruta un año más. La caja no ve un peso.',
        effects: { hinchada: 6, plantel: 1, deferred: [{ inSeasons: 2, text: 'Tu figura se fue libre al grande, sin dejar un peso. Estaba cantado.', effects: { plantel: -6, hinchada: -3 } }] },
      },
    ],
  },
  {
    id: 'vest-cruce-con-el-dt',
    kind: 'golpe',
    title: 'SE LE PLANTÓ AL DT EN LA PRÁCTICA',
    text: 'El titular más caro del plantel le contestó al DT delante de todos y se fue al vestuario antes de que terminara el entrenamiento. Los que estaban ahí ya lo contaron en tres radios.',
    options: [
      {
        label: 'Respaldar al DT y multar al jugador',
        hint: 'Ordena el vestuario. El jugador y su representante toman nota.',
        effects: { plantel: -2, influencia: 3, hinchada: 1 },
      },
      {
        label: 'Bajar un cambio y arreglarlo puertas adentro',
        hint: 'Se apaga el incendio de hoy. Nadie queda del todo conforme.',
        effects: { plantel: 1, influencia: -2 },
      },
      {
        label: 'Ponerlo en la lista de transferibles',
        hint: 'Mensaje claro. Y un titular menos si nadie lo compra.',
        effects: { plantel: -3, hinchada: -2 },
      },
    ],
  },
  {
    id: 'vest-refuerzo-no-se-adapta',
    kind: 'dilema',
    title: 'EL REFUERZO NO SE HALLA EN LA CIUDAD',
    text: 'El extranjero que trajiste para ser figura no se acostumbra. La familia se volvió al país a los dos meses y él pide que le rescindan para irse con ellos. En la cancha se le nota.',
    options: [
      {
        label: 'Rescindirle y cortar por lo sano',
        hint: 'Se va un sueldo alto y una apuesta que no salió.',
        effects: { caja: -1.5, plantel: -3, hinchada: -2 },
      },
      {
        label: 'Pagarle el pasaje a la familia y darle tiempo',
        hint: 'Un gasto chico contra la chance de recuperar la inversión.',
        effects: { caja: -0.6, plantel: 2, hinchada: 1 },
      },
      {
        label: 'Prestarlo a un club de su país',
        hint: 'No cobrás el préstamo entero y te sacás el sueldo de encima.',
        effects: { caja: -0.4, plantel: -2 },
      },
    ],
  },
  {
    id: 'vest-posteo-desafortunado',
    kind: 'color',
    title: 'EL VIDEO DEL BOLICHE',
    text: 'Se viralizó un video de dos titulares en un boliche a las cinco de la mañana, tres días antes del clásico y con el equipo sin ganar hace un mes. Ellos dicen que era el cumpleaños de un primo.',
    options: [
      {
        label: 'Multarlos y hacerlo público',
        hint: 'La gente pide un gesto. El vestuario se ordena por miedo.',
        effects: { plantel: -1, hinchada: 3, influencia: 2 },
      },
      {
        label: 'Resolverlo adentro sin comunicados',
        hint: 'No le das aire al tema. Alguno lo lee como que no pasó nada.',
        random: [
          { weight: 55, text: 'En una semana nadie se acordaba. El clásico lo taparon con un buen partido.', effects: { plantel: 1, hinchada: 1 } },
          { weight: 45, text: 'Perdieron el clásico y el video volvió a circular con otra intención.', effects: { hinchada: -6, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'vest-fecha-fifa',
    kind: 'dilema',
    title: 'SE VAN TRES CON LA SELECCIÓN',
    text: 'Fecha de eliminatorias: tres titulares se van con sus selecciones y vuelven cuarenta y ocho horas antes del partido, cruzando el continente. La liga no mueve la fecha para nadie.',
    options: [
      {
        label: 'Jugar con los pibes de la reserva',
        hint: 'Los titulares descansan. El resultado del fin de semana es una incógnita.',
        effects: { plantel: -2, hinchada: -1 },
      },
      {
        label: 'Ponerlos apenas bajan del avión',
        hint: 'El once de siempre, fundido y con el cuerpo en otro huso horario.',
        random: [
          { weight: 50, text: 'Aguantaron con lo justo y sacaron un empate que servía.', effects: { plantel: -1 } },
          { weight: 50, text: 'Se quedaron sin piernas a los sesenta y lo perdieron sobre la hora.', effects: { plantel: -3, hinchada: -4 } },
        ],
      },
      {
        label: 'Pedir la postergación con informe médico',
        hint: 'Cuesta gestión y buena voluntad ajena.',
        effects: { influencia: -4, plantel: 1 },
      },
    ],
  },
  {
    id: 'vest-el-que-no-quiere-volar',
    kind: 'dilema',
    title: 'EL LATERAL LE TIENE MIEDO AL AVIÓN',
    text: 'Después de un vuelo con turbulencia, uno de los titulares avisa que no se sube más a un avión. A los partidos del norte se llega en avión o no se llega.',
    options: [
      {
        label: 'Bancarle el micro veinte horas cada viaje',
        hint: 'Llega molido a la mitad de los partidos de visitante.',
        effects: { caja: -0.5, plantel: -1 },
      },
      {
        label: 'Pagarle sesiones con un especialista',
        hint: 'Puede resolverse. Lleva su tiempo.',
        effects: { caja: -0.4, plantel: 1 },
      },
      {
        label: 'Decirle que viaja como todos o no juega',
        hint: 'Autoridad. Y un titular que capaz no está el domingo.',
        effects: { plantel: -2, influencia: 2 },
      },
    ],
  },
];
