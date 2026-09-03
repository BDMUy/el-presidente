import type { GameEvent } from '@/lib/engine/types';

export const DIRIGENCIA: GameEvent[] = [
  {
    id: 'afa-voto',
    kind: 'dilema',
    title: 'TE PIDEN EL VOTO',
    text: 'Llamaron de arriba. Necesitan tu voto en la próxima asamblea para un cambio de reglamento que no te beneficia en nada. A cambio, "el club va a estar bien acompañado".',
    weight: 2,
    options: [
      {
        label: 'Votar con ellos',
        hint: 'Te ganás padrinos. Y una deuda de favor.',
        effects: {
          influencia: 14,
          caja: 1.5,
          flags: { debe_favor: true },
          flagsSuma: { prontuario: 1 },
        },
      },
      {
        label: 'Votar en contra',
        hint: 'Independencia. Y una lista de gente que se acuerda.',
        effects: { influencia: -10, hinchada: 6 },
      },
      {
        label: 'Faltar a la asamblea',
        hint: 'No quedás bien con nadie, no quedás mal con nadie.',
        effects: { influencia: -3 },
      },
    ],
  },
  {
    id: 'sponsor-dudoso',
    kind: 'dilema',
    title: 'EL SPONSOR DE LA CAMISETA',
    text: 'La mejor oferta por el frente de la camiseta viene de una app de apuestas. Duplica lo que paga el sponsor actual.',
    weight: 2,
    options: [
      {
        label: 'Firmar',
        hint: 'Mucha plata. Un sector de los socios va a hacer ruido.',
        effects: { caja: 6, hinchada: -7, socios: -2 },
      },
      {
        label: 'Rechazar por principios',
        hint: 'Quedás bien parado y con la mitad de la plata.',
        effects: { caja: 2.5, hinchada: 6 },
      },
      {
        label: 'Ponerlo solo en la espalda',
        hint: 'La solución tibia que no conforma del todo a nadie.',
        effects: { caja: 4, hinchada: -2 },
      },
    ],
  },
  {
    id: 'auditoria',
    kind: 'golpe',
    title: 'AUDITORÍA SORPRESA',
    text: 'La comisión revisora de cuentas pidió los libros de los últimos tres años. Uno de los que firma es de la lista opositora.',
    requires: { minSeason: 3 },
    options: [
      {
        label: 'Abrir todo',
        hint: 'Si está limpio, salís fortalecido.',
        random: [
          { weight: 60, text: 'No encontraron nada. La transparencia te dio aire político.', effects: { influencia: 12, hinchada: 6 } },
          { weight: 40, text: 'Encontraron gastos que no sabías explicar. Aunque no sean tuyos, llevan tu firma.', effects: { influencia: -14, hinchada: -10 } },
        ],
      },
      {
        label: 'Trabar el pedido con formalismos',
        hint: 'Ganás tiempo y confirmás la sospecha.',
        effects: { influencia: -6, hinchada: -8, flags: { auditoria_trabada: true } },
      },
      {
        label: 'Negociar con el opositor',
        hint: 'Le das un cargo. Se termina el problema.',
        requires: { minInfluencia: 20 },
        effects: { influencia: -12, caja: -0.8, hinchada: -2 },
      },
    ],
  },
  {
    id: 'predio-tierras',
    kind: 'dilema',
    title: 'LAS TIERRAS DEL PREDIO',
    text: 'Un desarrollador quiere comprar la mitad del predio de entrenamiento para hacer torres. La plata resuelve todos tus problemas de golpe.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Vender',
        hint: 'La caja se arregla hoy. Las inferiores se arruinan para siempre.',
        effects: { caja: 16, hinchada: -20, deferred: [{ inSeasons: 4, text: 'Sin predio, las inferiores dejaron de producir. Ya no sale nadie de abajo.', effects: { plantel: -8 } }] },
      },
      {
        label: 'No vender',
        hint: 'Lo correcto. Y no resuelve nada de lo urgente.',
        effects: { hinchada: 8, influencia: 5 },
      },
      {
        label: 'Alquilar una parte',
        hint: 'Menos plata, menos daño.',
        effects: { caja: 4, hinchada: -5 },
      },
    ],
  },
  {
    id: 'periodista-enemigo',
    kind: 'golpe',
    title: 'EL PERIODISTA QUE TE ODIA',
    text: 'Hay un tipo en la radio que hace ocho meses te pega todos los días. Hoy dijo que tenés una cuenta afuera.',
    options: [
      {
        label: 'Mandarle una carta documento',
        hint: 'Le das entidad. Se agranda.',
        effects: { influencia: -4, hinchada: -3, caja: -0.3 },
      },
      {
        label: 'Ignorarlo',
        hint: 'Se desinfla solo. O no.',
        effects: { hinchada: -2 },
      },
      {
        label: 'Pautar publicidad en su programa',
        hint: 'Se compra el silencio. Se paga el silencio.',
        effects: { caja: -1.5, influencia: -6, hinchada: 4, flags: { prensa_comprada: true } },
      },
    ],
  },
  {
    id: 'oferta-mandato',
    kind: 'dilema',
    title: 'TE OFRECEN IRTE',
    text: 'Un grupo inversor quiere gerenciar el fútbol del club. A vos te ofrecen quedarte de presidente decorativo, con sueldo.',
    requires: { minSeason: 5, maxHinchada: 55 },
    options: [
      {
        label: 'Aceptar',
        hint: 'Entra muchísima plata. Dejás de decidir vos.',
        effects: { caja: 20, influencia: -20, hinchada: -14, flags: { gerenciado: true } },
      },
      {
        label: 'Rechazar de plano',
        hint: 'El club sigue siendo de los socios. Y sigue sin plata.',
        effects: { hinchada: 12, influencia: 8 },
      },
    ],
  },
  {
    id: 'arbitro-designacion',
    kind: 'dilema',
    title: 'LA DESIGNACIÓN',
    text: 'Te avisan quién dirige el clásico. Es el mismo que te expulsó a dos el año pasado. Podés hacer una gestión para que lo cambien.',
    requires: { minInfluencia: 25 },
    options: [
      {
        label: 'Hacer la gestión',
        hint: 'Funciona. Y alguien lo va a saber.',
        effects: { influencia: -14, plantel: 3, deferred: [{ inSeasons: 2, text: 'Se filtró la gestión por el árbitro del clásico. Quedaste como el que arregla.', effects: { hinchada: -10, influencia: -8 } }] },
      },
      {
        label: 'Quejarte públicamente',
        hint: 'Le ponés presión al árbitro y quedás como llorón.',
        effects: { hinchada: 3, influencia: -5 },
      },
      {
        label: 'No hacer nada',
        hint: 'Que el equipo se arregle solo.',
        effects: { influencia: 3 },
      },
    ],
  },
  {
    id: 'deuda-afip',
    kind: 'golpe',
    title: 'LA DEUDA VIEJA',
    text: 'Apareció una deuda impositiva de la gestión anterior que nadie te había mencionado. Con intereses, es una cifra que asusta.',
    requires: { minSeason: 2 },
    weight: 2,
    options: [
      {
        label: 'Entrar en un plan de pagos',
        hint: 'Duele todos los meses, pero se ordena.',
        effects: { caja: -3.5, influencia: 4 },
      },
      {
        label: 'Judicializarla',
        hint: 'Podés ganar tiempo. O perderlo todo con costas.',
        random: [
          { weight: 45, text: 'La justicia frenó la ejecución. Ganaste tres años.', effects: { influencia: 6 } },
          { weight: 55, text: 'Perdiste con costas. Ahora es peor que antes.', effects: { caja: -7, influencia: -8 } },
        ],
      },
      {
        label: 'Echarle la culpa en público a la gestión anterior',
        hint: 'Políticamente rendidor. No paga la deuda.',
        effects: { hinchada: 5, influencia: -3, caja: -1 },
      },
    ],
  },
  {
    id: 'dir-vice-ambicioso',
    kind: 'dilema',
    title: 'EL VICE SE PERFILA',
    text: 'Tu vicepresidente empezó a dar notas solo. Habla de una etapa nueva y nunca te nombra. La comisión se hace la desentendida.',
    requires: { minSeason: 3 },
    options: [
      {
        label: 'Sacarlo del cargo',
        hint: 'Cortás la interna. Se lleva a su gente con él.',
        effects: { influencia: -10, hinchada: -3 },
      },
      {
        label: 'Darle una parcela de poder',
        hint: 'Lo callás dándole lo que quiere. Por ahora.',
        effects: { influencia: -5, caja: -0.8 },
      },
      {
        label: 'Dejarlo hablar',
        hint: 'Si se quema solo, mejor. Si no, ya sabés.',
        random: [
          { weight: 45, text: 'Habló de más y la gente lo mandó a callar. Se replegó solo.', effects: { influencia: 8 } },
          { weight: 55, text: 'Le fue creciendo la lista. Ahora tiene estructura propia.', effects: { influencia: -12, hinchada: -4 } },
        ],
      },
    ],
  },
  {
    id: 'dir-asamblea-cuentas',
    kind: 'golpe',
    title: 'ASAMBLEA POR LAS CUENTAS',
    text: 'La oposición juntó firmas para una asamblea extraordinaria. Quieren que expliques el balance renglón por renglón, en el salón, con micrófono abierto.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Ir y dar la cara',
        hint: 'Cuatro horas de pie. Se respeta, aunque duela.',
        effects: { hinchada: 6, influencia: -4 },
      },
      {
        label: 'Mandar al tesorero',
        hint: 'No te exponés. Tampoco quedás bien.',
        effects: { hinchada: -6, influencia: 2 },
      },
      {
        label: 'Suspenderla por un vicio de forma',
        hint: 'Cuesta muchos teléfonos y una fama.',
        requires: { minInfluencia: 30 },
        effects: { influencia: -16, hinchada: -8 },
      },
    ],
  },
  {
    id: 'dir-elecciones-anticipadas',
    kind: 'dilema',
    title: 'TE PIDEN ADELANTAR',
    text: 'Un grupo de socios históricos te propone adelantar las elecciones. Dicen que si las ganás ahora te quedás tranquilo cuatro años más.',
    requires: { minSeason: 3, minHinchada: 55 },
    options: [
      {
        label: 'Adelantarlas',
        hint: 'Ganás legitimidad. Gastás todo lo que tenías guardado.',
        effects: { influencia: -14, hinchada: 10 },
      },
      {
        label: 'Cumplir el mandato como estaba',
        hint: 'Institucional y aburrido. Nadie te lo va a agradecer.',
        effects: { influencia: 3 },
      },
    ],
  },
  {
    id: 'dir-sponsor-ofrece-mas',
    kind: 'dilema',
    title: 'EL SPONSOR OFRECE EL TRIPLE',
    text: 'La marca que viste la camiseta ofrece renovar por el triple. A cambio pide exclusividad total y "tener una silla" en las decisiones deportivas.',
    weight: 2,
    options: [
      {
        label: 'Firmar todo, condiciones incluidas',
        hint: 'Entra la plata. También entra alguien que no elegiste.',
        effects: { caja: 4, influencia: -6, flags: { arco_sponsor_a: true } },
      },
      {
        label: 'Firmar solo la plata, no las condiciones',
        hint: 'Menos guita, ninguna silla nueva en la mesa.',
        effects: { caja: 1.5, flags: { arco_sponsor_a: true } },
      },
    ],
  },
  {
    id: 'dir-sponsor-mete-mano',
    kind: 'golpe',
    title: 'EL SPONSOR SUGIERE UN FICHAJE',
    text: 'El sponsor pide que fiches a un jugador que representa el agente de su propio dueño. Lo llaman "sugerencia". No suena a sugerencia.',
    requires: { flag: 'arco_sponsor_a', minSeason: 3 },
    weight: 10,
    options: [
      {
        label: 'Ficharlo para no perder el contrato',
        hint: 'El sponsor queda contento. El plantel, no tanto.',
        effects: { caja: 3, plantel: -2, influencia: -8, flags: { arco_sponsor_b_cedio: true } },
      },
      {
        label: 'Negarse y arriesgar el contrato',
        hint: 'El plantel lo decidís vos. Puede salir caro.',
        effects: { caja: -2, influencia: 6, flags: { arco_sponsor_b_planto: true } },
      },
    ],
  },
  {
    id: 'dir-sponsor-se-va',
    kind: 'color',
    title: 'EL SPONSOR SE BAJÓ, COMO DIJO',
    text: 'El sponsor cumplió la amenaza y no renovó. Conseguiste uno nuevo, más chico, sin condiciones raras.',
    requires: { flag: 'arco_sponsor_b_planto', minSeason: 6 },
    weight: 10,
    options: [
      {
        label: 'Aceptar el nuevo trato tal cual viene',
        hint: 'Menos plata, cero dolores de cabeza.',
        effects: { caja: -1, influencia: 4 },
      },
      {
        label: 'Salir a buscar uno más grande',
        hint: 'Puede tardar. Puede no aparecer.',
        effects: { caja: -2, influencia: 2, hinchada: 3 },
      },
    ],
  },
  {
    id: 'dir-sponsor-explota',
    kind: 'golpe',
    title: 'EL FICHAJE DEL SPONSOR NUNCA FUNCIONÓ',
    text: 'El jugador que te impuso el sponsor nunca jugó un partido bueno. Un cronista preguntó en conferencia quién decide los fichajes en este club.',
    requires: { flag: 'arco_sponsor_b_cedio', minSeason: 6 },
    weight: 10,
    options: [
      {
        label: 'Cortar el vínculo con el sponsor',
        hint: 'Se pierde la plata. Se recupera el club.',
        effects: { caja: -3, influencia: 6 },
      },
      {
        label: 'Aguantar hasta que termine el contrato',
        hint: 'Menos ruido ahora. El jugador sigue sin rendir.',
        effects: { influencia: -5, plantel: -1 },
      },
    ],
  },
  {
    id: 'dir-vocal-que-renuncia',
    kind: 'golpe',
    title: 'UN VOCAL RENUNCIA EN PLENA REUNIÓN',
    text: 'En medio de una reunión de comisión, un vocal se para, dice que "no puede seguir avalando esto" y se va dando un portazo. Nadie termina de entender a qué se refería.',
    weight: 2,
    options: [
      {
        label: 'Salir a explicar públicamente qué pasó',
        hint: 'Controlás el relato. También lo alimentás.',
        effects: { influencia: 2, hinchada: -2 },
      },
      {
        label: 'No hacer declaraciones',
        hint: 'El silencio deja que cada uno complete la historia como quiera.',
        effects: { influencia: -3 },
      },
    ],
  },
  {
    id: 'dir-invitacion-a-un-congreso',
    kind: 'color',
    title: 'TE INVITAN A UN CONGRESO DE DIRIGENTES',
    text: 'Un congreso regional de dirigencia deportiva te invita como panelista. Es prestigio, es una foto, y son tres días fuera del club en plena temporada.',
    options: [
      {
        label: 'Ir',
        hint: 'Contactos que después sirven. Tres días sin estar encima de nada.',
        effects: { influencia: 5, caja: -0.3 },
      },
      {
        label: 'Mandar a alguien de tu confianza',
        hint: 'Menos foto para vos. Alguien más gana peso propio.',
        effects: { influencia: 1 },
      },
    ],
  },
  {
    id: 'dir-pedido-de-informes',
    kind: 'dilema',
    title: 'PEDIDO DE INFORMES DE LA OPOSICIÓN',
    text: 'La lista opositora presenta un pedido formal de informes: quiere el detalle completo de los últimos contratos firmados por la comisión.',
    options: [
      {
        label: 'Entregar todo lo pedido',
        hint: 'Transparencia total. También munición, si algo no cierra del todo.',
        effects: { influencia: 4, caja: -0.2 },
      },
      {
        label: 'Entregar lo mínimo que exige el estatuto',
        hint: 'Cumplís la letra. La sospecha queda igual, o peor.',
        effects: { influencia: -2 },
      },
    ],
  },
  {
    id: 'dir-el-que-quiere-tu-lugar',
    kind: 'dilema',
    title: 'EL QUE YA SE VE COMO PRESIDENTE',
    text: 'Un dirigente joven de tu propia lista empieza a moverse solo: reuniones que no te avisa, socios que dice representar. Todavía no dijo nada en público.',
    requires: { minSeason: 3 },
    options: [
      {
        label: 'Darle un rol de peso para tenerlo cerca',
        hint: 'Lo sumás adentro. También le das más para mostrar.',
        effects: { influencia: -3, plantel: 1 },
      },
      {
        label: 'Marcarle la cancha en privado',
        hint: 'Directo. Puede ordenarlo o puede acelerar la ruptura.',
        effects: { influencia: 3, hinchada: -1 },
      },
    ],
  },
  {
    id: 'arco-promesa-1',
    kind: 'color',
    title: 'EL CIERRE DE CAMPAÑA',
    text: 'Arranca la campaña por la reelección y armás el acto de cierre. Arriba del escenario vas a prometer algo concreto, para que quede grabado.',
    weight: 2,
    requires: { minSeason: 2, maxSeason: 6 },
    options: [
      {
        label: 'Prometer que nunca se vende a un pibe de inferiores',
        hint: 'Se aplaude fuerte. Y queda en video.',
        effects: { hinchada: 6, flags: { arco_promesa_1: true } },
      },
      {
        label: 'Prometer el club sin deudas en cuatro años',
        hint: 'Suena a gestión seria. El que lo filma sabe contar.',
        effects: { hinchada: 4, influencia: 2, flags: { arco_promesa_1: true } },
      },
      {
        label: 'Prometer solo una gestión sin sorpresas',
        hint: 'Lo más prudente que se puede decir con un micrófono en la mano. Quedó dicho igual.',
        effects: { influencia: 3, flags: { arco_promesa_1: true } },
      },
    ],
  },
  {
    id: 'arco-promesa-2',
    kind: 'golpe',
    title: 'DESENTERRARON EL VIDEO',
    text: 'Dos mandatos después, una cuenta partidaria sube el video de aquel cierre con la promesa en primer plano y la fecha sobreimpresa. Tiene más vistas que cualquier gol del año.',
    requires: { flag: 'arco_promesa_1', minSeason: 11 },
    weight: 10,
    options: [
      {
        label: 'Explicar en conferencia qué cambió y por qué',
        hint: 'Argumento razonable contra un video de veinte segundos.',
        effects: { hinchada: -4, influencia: 3 },
      },
      {
        label: 'Ratificar la promesa y jurar cumplirla antes de irte',
        hint: 'Volvés a atarte a algo. El reloj corre más rápido que vos.',
        effects: { hinchada: 5, influencia: -3 },
      },
      {
        label: 'No decir nada y dejar que pase',
        hint: 'En una semana hay otro tema. La promesa queda flotando.',
        effects: { hinchada: -2 },
      },
    ],
  },
  {
    id: 'arco-promesa-3',
    kind: 'dilema',
    title: 'TE TOCA RENDIR CUENTAS DE LA PROMESA',
    text: 'En tu último acto como presidente, alguien de la platea te grita la promesa de campaña, palabra por palabra. Todos esperan qué contestás.',
    requires: { flag: 'arco_promesa_1', minSeason: 14 },
    weight: 10,
    options: [
      {
        label: 'Reconocer lo que no se cumplió, sin vueltas',
        hint: 'Cierra mejor de lo que parece. Nadie esperaba que lo dijeras.',
        effects: { hinchada: 6, influencia: 4 },
      },
      {
        label: 'Enumerar todo lo otro que sí se hizo',
        hint: 'Defensa sólida. También suena a que esquivaste la pregunta.',
        effects: { hinchada: 1, influencia: 2 },
      },
    ],
  },
  {
    id: 'dir-multa-de-la-federacion',
    kind: 'golpe',
    title: 'MULTA DEL TRIBUNAL DE DISCIPLINA',
    text: 'La federación multó al club por una suma de cosas chicas: bengalas en la popular, el equipo visitante demorado en la puerta y un cartel de un sponsor sin autorizar. La cifra, sumada, no es chica.',
    options: [
      {
        label: 'Pagarla y no hacer ruido',
        hint: 'Se termina rápido. Duele en la caja.',
        effects: { caja: -1.6 },
      },
      {
        label: 'Apelar punto por punto',
        hint: 'Se puede bajar. También se puede quedar peor por insistir.',
        random: [
          { weight: 50, text: 'Bajaron la multa a la mitad y quedó un antecedente a favor.', effects: { caja: -0.7, influencia: 2 } },
          { weight: 50, text: 'Ratificaron todo y sumaron costas por hacerles perder el tiempo.', effects: { caja: -2.3, influencia: -3 } },
        ],
      },
      {
        label: 'Pagar y salir a cruzar a la federación en los medios',
        hint: 'La gente te acompaña. Arriba te lo anotan.',
        effects: { caja: -1.6, hinchada: 4, influencia: -5 },
      },
    ],
  },
  {
    id: 'dir-acto-politico-en-la-sede',
    kind: 'dilema',
    title: 'QUIEREN LA SEDE PARA UN ACTO',
    text: 'En plena campaña, el espacio de un candidato pide alquilar el salón de actos del club para una presentación. Pagan bien y por adelantado. La mitad de la comisión dice que el club no se mete en política.',
    options: [
      {
        label: 'Alquilar el salón como a cualquiera',
        hint: 'Entra plata. Al club lo van a asociar con ese cartel igual.',
        effects: { caja: 1.4, hinchada: -4, influencia: -2 },
      },
      {
        label: 'Decir que no y aclararlo por escrito',
        hint: 'El club queda afuera del barro. El que pidió se acuerda.',
        effects: { influencia: -3, hinchada: 3 },
      },
      {
        label: 'Ofrecer el salón a todos los espacios por igual',
        hint: 'Prolijo y trabajoso. Nadie queda afuera, nadie del todo contento.',
        effects: { caja: 0.6, influencia: 2 },
      },
    ],
  },
  {
    id: 'dir-audio-filtrado',
    kind: 'golpe',
    title: 'SE FILTRÓ UN AUDIO DE COMISIÓN',
    text: 'Un audio de una reunión de comisión llegó a un programa partidario. No hay nada ilegal, pero se escucha a un dirigente hablar mal de un referente del plantel y a otro reírse. Editado, suena peor.',
    options: [
      {
        label: 'Poner el audio completo en contexto',
        hint: 'La versión entera es menos jugosa. No todos van a escucharla.',
        effects: { influencia: 1, hinchada: -2 },
      },
      {
        label: 'Buscar puertas adentro quién grabó',
        hint: 'Podés encontrar al que filtró. Mientras tanto, la reunión se enfría.',
        effects: { influencia: -2, plantel: -1 },
      },
      {
        label: 'No decir nada y que pase',
        hint: 'En una semana hay otro tema. Puede que este no.',
        effects: { hinchada: -3 },
      },
    ],
  },
  {
    id: 'dir-voto-electronico',
    kind: 'dilema',
    title: 'LA ASAMBLEA POR VOTO ELECTRÓNICO',
    text: 'Un sector propone modernizar la asamblea con voto electrónico y padrón digital. Ahorra una jornada entera de conteo a mano. La oposición ya salió a decir que es un mecanismo para dibujar el resultado.',
    options: [
      {
        label: 'Implementarlo para la próxima asamblea',
        hint: 'Más ágil y prolijo. La sospecha va a estar igual en la sala.',
        effects: { caja: -0.6, influencia: 3, hinchada: -2 },
      },
      {
        label: 'Dejar el sistema de siempre',
        hint: 'Nadie puede acusarte de nada. Y son doce horas de conteo.',
        effects: { influencia: -1 },
      },
      {
        label: 'Probarlo con auditoría de las dos listas',
        hint: 'Cuesta más y baja el ruido. La oposición firma o queda expuesta.',
        effects: { caja: -1, influencia: 4 },
      },
    ],
  },
  {
    id: 'dir-rumor-de-venta',
    kind: 'dilema',
    title: 'EL MERCADO YA LOS DA POR VENDIDOS',
    text: 'Media docena de portales publican que el club está por vender a tres titulares para tapar un agujero. No hay ninguna oferta sobre la mesa, pero los representantes llaman todos los días y el vestuario lee todo.',
    options: [
      {
        label: 'Salir a desmentir con un comunicado firme',
        hint: 'Calma al vestuario esta semana. Si después vendés a alguno, quedás pegado.',
        effects: { hinchada: 3, plantel: 2, influencia: -2 },
      },
      {
        label: 'No confirmar ni desmentir nada',
        hint: 'No te atás a nada. El rumor sigue creciendo solo.',
        effects: { plantel: -3, hinchada: -2 },
      },
      {
        label: 'Bajar al vestuario a mostrar los números',
        hint: 'La transparencia los calma. También los deja ver que el club está corto.',
        effects: { plantel: 3, hinchada: -1, influencia: -1 },
      },
    ],
  },
  {
    id: 'dir-paro-de-empleados',
    kind: 'golpe',
    title: 'PARAN LOS EMPLEADOS DEL CLUB',
    text: 'Boleteros, maestranza y la gente del predio hacen asamblea y amenazan con no abrir el estadio el domingo. Hace meses que el sueldo les llega tarde y devaluado.',
    options: [
      {
        label: 'Sentarse a negociar una recomposición',
        hint: 'Se destraba el domingo. Es más plata fija todos los meses.',
        effects: { caja: -1.4, influencia: 2 },
      },
      {
        label: 'Contratar una empresa tercerizada para el partido',
        hint: 'El domingo se juega. Adentro queda un clima que no se arregla con eso.',
        effects: { caja: -0.8, influencia: -4, hinchada: -2 },
      },
      {
        label: 'Pedirles que aguanten una fecha más',
        hint: 'Ganás una semana. Y algo de bronca acumulada.',
        effects: { influencia: -2, hinchada: -2 },
      },
    ],
  },
];
