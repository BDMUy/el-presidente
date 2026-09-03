import type { GameEvent } from '@/lib/engine/types';

export const HINCHADA: GameEvent[] = [
  {
    id: 'barra-plata',
    kind: 'dilema',
    title: 'LA BARRA PIDE',
    text: 'Vinieron cuatro a la sede. No amenazaron: pidieron. Entradas, micros y "una ayuda" para el viaje del domingo. Sonrieron todo el tiempo.',
    weight: 2,
    options: [
      {
        label: 'Darles lo que piden',
        hint: 'Paz social comprada. Vuelven en seis meses por más.',
        effects: {
          caja: -1.5,
          influencia: -5,
          hinchada: 3,
          flags: { barra_arreglada: true },
          flagsSuma: { prontuario: 1 },
        },
      },
      {
        label: 'Negarles todo',
        hint: 'Dignidad. Y un problema que no se resuelve solo.',
        random: [
          { weight: 40, text: 'Se fueron puteando y no pasó nada más. A veces alcanza con plantarse.', effects: { influencia: 8, hinchada: 2 } },
          { weight: 60, text: 'Al domingo siguiente colgaron un trapo pidiendo tu renuncia. Y bajaron a la platea.', effects: { hinchada: -11, influencia: -6 } },
        ],
      },
      {
        label: 'Meterlos en el club como "seguridad"',
        hint: 'Los controlás. Ahora son parte de la estructura.',
        effects: { caja: -0.8, influencia: -10, hinchada: 5, flags: { barra_adentro: true }, flagsSuma: { prontuario: 2 }, deferred: [{ inSeasons: 3, text: 'La barra que metiste adentro ya maneja la puerta del estadio. Y no te consulta.', effects: { influencia: -12, hinchada: -8 } }] },
      },
    ],
  },
  {
    id: 'cuota-social',
    kind: 'dilema',
    title: 'LA CUOTA SOCIAL',
    text: 'La inflación se comió el presupuesto. El tesorero llega con la planilla y la conclusión es obvia: o se aumenta la cuota, o no se llega a fin de año.',
    weight: 2,
    options: [
      {
        label: 'Aumentarla fuerte',
        hint: 'Entra plata. Se van socios y los que quedan te odian.',
        effects: { caja: 3, socios: -6, hinchada: -8 },
      },
      {
        label: 'Aumento mínimo',
        hint: 'No alcanza para nada, pero nadie se queja.',
        effects: { caja: 0.8, socios: -1 },
      },
      {
        label: 'Congelarla y salir a buscar socios nuevos',
        hint: 'Apuesta a volumen. Cuesta ahora, rinde después.',
        effects: { caja: -1.2, socios: 5, hinchada: 6 },
      },
    ],
  },
  {
    id: 'trapo-renuncia',
    kind: 'golpe',
    title: '"QUE SE VAYAN TODOS"',
    text: 'El trapo apareció colgado en la popular a los veinte minutos del primer tiempo. Las cámaras lo tomaron cuatro veces.',
    requires: { maxHinchada: 40, minSeason: 2 },
    options: [
      {
        label: 'Salir a dar la cara en conferencia',
        hint: 'Puede calmar las aguas o ser gasolina.',
        random: [
          { weight: 50, text: 'Diste la cara y la gente lo valoró. No te salvó, pero frenó la caída.', effects: { hinchada: 7, influencia: 4 } },
          { weight: 50, text: 'Te trabaste, te contradijiste y el video circuló todo el día.', effects: { hinchada: -8, influencia: -5 } },
        ],
      },
      {
        label: 'Silencio de radio',
        hint: 'No alimentás el incendio. Tampoco lo apagás.',
        effects: { hinchada: -3 },
      },
      {
        label: 'Anunciar refuerzos que todavía no cerraste',
        hint: 'Ganás dos semanas. Después hay que cumplir.',
        effects: { hinchada: 9, deferred: [{ inSeasons: 1, text: 'Los refuerzos que anunciaste nunca llegaron. La gente se acuerda de todo.', effects: { hinchada: -14, influencia: -8 } }] },
      },
    ],
  },
  {
    id: 'socio-vitalicio',
    kind: 'color',
    title: 'EL SOCIO NÚMERO UNO',
    text: 'Murió el socio más antiguo del club. Noventa y siete años, sesenta de platea. La familia pide que el cajón entre a la cancha.',
    options: [
      {
        label: 'Abrirle el estadio',
        hint: 'La gente no se va a olvidar de esto.',
        effects: { hinchada: 8, caja: -0.2 },
      },
      {
        label: 'Un minuto de silencio y nada más',
        hint: 'Protocolar. Correcto. Frío.',
        effects: { hinchada: -2 },
      },
    ],
  },
  {
    id: 'entradas-clasico',
    kind: 'dilema',
    title: 'LAS ENTRADAS DEL CLÁSICO',
    text: 'Hay diez mil socios y seis mil lugares. Alguien va a quedar afuera y va a hacer ruido.',
    options: [
      {
        label: 'Sorteo entre socios al día',
        hint: 'Justo, transparente y deja cuatro mil enojados.',
        effects: { hinchada: -2, socios: 2, influencia: 4 },
      },
      {
        label: 'Prioridad por antigüedad',
        hint: 'Los viejos te aman, los pibes se sienten expulsados.',
        effects: { hinchada: 1, socios: -2 },
      },
      {
        label: 'Vender el cupo restante a precio de reventa',
        hint: 'Entra plata. Sale un escándalo.',
        effects: { caja: 2.5, hinchada: -12, influencia: -6 },
      },
    ],
  },
  {
    id: 'banderazo',
    kind: 'color',
    title: 'BANDERAZO EN LA PUERTA',
    text: 'Se juntaron tres mil personas afuera del predio la noche antes de la final. Los jugadores salieron al balcón.',
    requires: { minHinchada: 55 },
    options: [
      {
        label: 'Bajar y hablarles',
        hint: 'Te ponés a la altura del momento.',
        effects: { hinchada: 7, influencia: 3 },
      },
      {
        label: 'Dejar que sea de los jugadores',
        hint: 'No te colgás de la foto. Nadie lo nota, pero está bien.',
        effects: { hinchada: 3, plantel: 2 },
      },
    ],
  },
  {
    id: 'obras-tribuna',
    kind: 'dilema',
    title: 'LA TRIBUNA SE CAE',
    text: 'El informe de ingeniería es lapidario: o se refacciona la popular, o en dos años la clausuran.',
    weight: 2,
    options: [
      {
        label: 'Hacer la obra completa',
        hint: 'Carísima ahora. Cambia el club para siempre.',
        effects: { caja: -9, deferred: [{ inSeasons: 3, text: 'Se inauguró la tribuna nueva. Entra el doble de gente y se nota en la caja.', effects: { socios: 12, hinchada: 15, caja: 3 } }] },
      },
      {
        label: 'Parche mínimo',
        hint: 'Aguanta. Hasta que no aguante.',
        effects: { caja: -2, deferred: [{ inSeasons: 4, text: 'Clausuraron la popular. El parche era un parche.', effects: { socios: -8, hinchada: -12, caja: -3 } }] },
      },
      {
        label: 'Buscar un sponsor que la pague',
        hint: 'Si aparece, es gratis. Si no, perdiste un año.',
        random: [
          { weight: 40, text: 'Una empresa puso el nombre y la plata. Salió gratis y salió bien.', effects: { socios: 8, hinchada: 6, influencia: -5 } },
          { weight: 60, text: 'Nadie quiso poner un peso. Perdiste una temporada entera buscando.', effects: { caja: -0.5, hinchada: -4 } },
        ],
      },
    ],
  },
  {
    id: 'hinchada-agradecida',
    kind: 'color',
    title: 'TE CANTARON A VOS',
    text: 'A los treinta del segundo tiempo, con el partido ganado, la popular cantó tu apellido. No pasa nunca.',
    requires: { minHinchada: 70, minSeason: 3 },
    options: [
      {
        label: 'Saludar desde el palco',
        hint: 'Te lo ganaste. Disfrutalo.',
        effects: { hinchada: 4, influencia: 6 },
      },
      {
        label: 'Quedarte sentado',
        hint: 'El cargo es prestado y vos lo sabés.',
        effects: { influencia: 3, hinchada: 2 },
      },
    ],
  },
  {
    id: 'hin-popular-clausurada',
    kind: 'golpe',
    title: 'CLAUSURAN LA POPULAR',
    text: 'Bengalas en el último partido. La clausuran tres fechas. Sin la popular, la cancha se convierte en un cine.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Aceptar la sanción',
        hint: 'Tres fechas sin recaudación y sin aliento.',
        effects: { caja: -1.6, hinchada: -6 },
      },
      {
        label: 'Apelar hasta el final',
        hint: 'Se puede dar vuelta. Y se puede empeorar.',
        random: [
          { weight: 40, text: 'Se levantó la clausura. La popular volvió y no se calló en noventa minutos.', effects: { hinchada: 9, influencia: -4 } },
          { weight: 60, text: 'Ratificaron la sanción y le sumaron dos fechas más por insistir.', effects: { caja: -2.4, hinchada: -9, influencia: -3 } },
        ],
      },
    ],
  },
  {
    id: 'hin-viaje-de-todos',
    kind: 'color',
    title: 'QUIEREN VIAJAR TODOS',
    text: 'Se juega a mil kilómetros y hay tres mil hinchas que quieren ir. Los micros cuestan una fortuna y la policía pide un operativo que sale más caro todavía.',
    options: [
      {
        label: 'Poner los micros el club',
        hint: 'Un gasto que no está en ningún presupuesto.',
        effects: { caja: -1.3, hinchada: 11 },
      },
      {
        label: 'Que se arregle cada uno',
        hint: 'Es lo lógico. También es lo frío.',
        effects: { hinchada: -4 },
      },
      {
        label: 'Subsidiar la mitad',
        hint: 'Media alegría, medio gasto.',
        effects: { caja: -0.7, hinchada: 5 },
      },
    ],
  },
  {
    id: 'hin-socio-de-toda-la-vida',
    kind: 'color',
    title: 'SE FUE UN SOCIO DE TODA LA VIDA',
    text: 'Murió un socio de noventa y un años. Tenía el carnet número catorce y no se perdió un partido de local en sesenta temporadas. La familia pide despedirlo en la cancha.',
    options: [
      {
        label: 'Abrir la cancha para el velatorio',
        hint: 'No sale nada y no se olvida nunca.',
        effects: { hinchada: 8, socios: 1.5 },
      },
      {
        label: 'Un minuto de silencio y una placa',
        hint: 'Correcto. Suficiente. Poco.',
        effects: { hinchada: 2 },
      },
    ],
  },
  {
    id: 'hin-nace-la-pena',
    kind: 'color',
    title: 'NACE UNA PEÑA NUEVA',
    text: 'Un grupo de socios jóvenes arma una peña alternativa a la barra: bombos propios, banderas propias, sin pedir nada a cambio. Todavía.',
    weight: 2,
    options: [
      {
        label: 'Darles un espacio en el club para ensayar',
        hint: 'Poca plata, mucho gesto.',
        effects: { hinchada: 4, caja: -0.3, flags: { arco_pena_a: true } },
      },
      {
        label: 'Dejarlos hacer, sin involucrarse',
        hint: 'No cuesta nada. Tampoco suma mucho.',
        effects: { hinchada: 2, flags: { arco_pena_a: true } },
      },
    ],
  },
  {
    id: 'hin-la-pena-pide-lugar',
    kind: 'dilema',
    title: 'LA PEÑA PIDE UN LUGAR FIJO',
    text: 'La peña alternativa creció tanto que ahora pide un sector fijo en la popular: el mismo que hoy ocupa la barra brava.',
    requires: { flag: 'arco_pena_a', minSeason: 3 },
    weight: 10,
    options: [
      {
        label: 'Dárselo y bancar el conflicto con la barra',
        hint: 'La popular cambia de dueño. No sin ruido.',
        effects: { hinchada: 8, influencia: -6, flags: { arco_pena_b: true } },
      },
      {
        label: 'Negociar un sector nuevo, más chico',
        hint: 'Nadie se va del todo conforme. Nadie se va del todo enojado.',
        effects: { hinchada: 3, caja: -0.5, flags: { arco_pena_b: true } },
      },
    ],
  },
  {
    id: 'hin-la-pena-hoy-manda',
    kind: 'color',
    title: 'LA QUE ERA UNA PEÑA HOY LE PONE EL COLOR A LA CANCHA',
    text: 'Años después de que la dejaste crecer, la peña alternativa es la que le pone el color a la popular. A la barra vieja casi no se la ve.',
    requires: { flag: 'arco_pena_b', minSeason: 6 },
    weight: 10,
    options: [
      {
        label: 'Reconocerlos oficialmente como la hinchada organizada',
        hint: 'Sella algo que la cancha ya decidió sola.',
        effects: { hinchada: 10, influencia: 3 },
      },
      {
        label: 'Mantener la ambigüedad de siempre',
        hint: 'Funciona. Hasta que deja de funcionar.',
        effects: { hinchada: 4 },
      },
    ],
  },
  {
    id: 'hin-banderazo-espontaneo',
    kind: 'color',
    title: 'BANDERAZO ESPONTÁNEO',
    text: 'Sin que nadie lo organice desde el club, cien socios se juntan una tarde de semana frente a la sede a alentar al plantel antes de un partido importante.',
    weight: 2,
    options: [
      {
        label: 'Salir a saludarlos',
        hint: 'Diez minutos que la gente cuenta durante meses.',
        effects: { hinchada: 6 },
      },
      {
        label: 'Mandar a alguien de prensa en tu lugar',
        hint: 'Queda cubierto. No es lo mismo y se nota.',
        effects: { hinchada: 2 },
      },
    ],
  },
  {
    id: 'hin-la-cantina-del-club',
    kind: 'dilema',
    title: 'LA CANTINA DE TODA LA VIDA',
    text: 'La cantina del club funciona igual desde hace treinta años y da pérdida todos los meses. Una cadena de comidas rápidas ofrece poner un local adentro, mismo lugar.',
    options: [
      {
        label: 'Aceptar la cadena',
        hint: 'La cantina que todos conocían deja de existir. Entra plata todos los meses.',
        effects: { caja: 1.8, hinchada: -5 },
      },
      {
        label: 'Sostenerla como está',
        hint: 'Se sigue perdiendo plata. Nadie se queja de eso en la platea.',
        effects: { caja: -0.6, hinchada: 3 },
      },
    ],
  },
  {
    id: 'hin-socio-fundador-cumple-100',
    kind: 'color',
    title: 'CIEN AÑOS DE UN SOCIO FUNDADOR',
    text: 'La familia de uno de los socios fundadores del club avisa que cumple cien años y quiere hacerle un homenaje en la cancha.',
    options: [
      {
        label: 'Organizar el homenaje en el entretiempo',
        hint: 'Cien años de historia parados en la mitad de la cancha.',
        effects: { caja: -0.3, hinchada: 5, socios: 2 },
      },
      {
        label: 'Mandarle una nota firmada',
        hint: 'Correcto. Y se nota la diferencia con lo otro.',
        effects: { hinchada: 1 },
      },
    ],
  },
  {
    id: 'hin-el-hincha-que-no-para-de-viajar',
    kind: 'color',
    title: 'EL QUE NUNCA SE PERDIÓ UNA',
    text: 'Hay un socio que viajó a cada partido de visitante en los últimos quince años, se lo pague quien se lo pague. Un canal de streaming quiere hacerle una nota.',
    options: [
      {
        label: 'Ayudarlo a coordinar la nota',
        hint: 'Buena prensa gratis, con una historia real detrás.',
        effects: { hinchada: 4, influencia: 1 },
      },
      {
        label: 'No meterse',
        hint: 'Que la nota salga como salga, sin el club en el medio.',
        effects: { hinchada: 1 },
      },
    ],
  },
  {
    id: 'arco-estadio-1',
    kind: 'dilema',
    title: 'LA MAQUETA DEL ESTADIO NUEVO',
    text: 'Un estudio trae la maqueta: la misma cancha, para el doble de gente y con todo a nuevo. La obra son cuatro años y una cifra que no entra en ningún presupuesto.',
    weight: 2,
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Anunciarla con acto y maqueta en el hall',
        hint: 'La gente se ilusiona. El primer ladrillo todavía no está.',
        effects: { hinchada: 8, influencia: 3, flags: { arco_estadio_1: true } },
      },
      {
        label: 'Aprobarla en silencio y empezar por los cimientos',
        hint: 'Sin foto y sin promesa. El pozo igual se ve desde la calle.',
        effects: { caja: -3, influencia: 2, flags: { arco_estadio_1: true } },
      },
    ],
  },
  {
    id: 'arco-estadio-2',
    kind: 'golpe',
    title: 'LA OBRA ESTÁ PARADA',
    text: 'La platea nueva quedó por la mitad. Se terminó la plata que había para eso y la estructura sin cerrar junta agua abajo de una lona.',
    requires: { flag: 'arco_estadio_1', minSeason: 6 },
    weight: 10,
    options: [
      {
        label: 'Frenar y cubrir el esqueleto hasta que haya fondos',
        hint: 'Aguanta a la intemperie. La gente pregunta cada domingo.',
        effects: { caja: -1, hinchada: -6, flags: { arco_estadio_2: true } },
      },
      {
        label: 'Endeudarse para no parar la obra',
        hint: 'El hormigón no espera. El crédito tampoco.',
        effects: { caja: -6, hinchada: 3, flags: { arco_estadio_2: true } },
      },
      {
        label: 'Vender palcos de la platea que todavía no existe',
        hint: 'Plata por adelantado contra una fecha de entrega que ya moviste dos veces.',
        effects: { caja: 4, hinchada: -3, flags: { arco_estadio_2: true } },
      },
    ],
  },
  {
    id: 'arco-estadio-3',
    kind: 'color',
    title: 'SE INAUGURA LA PLATEA',
    text: 'Ocho años después de la maqueta, la platea nueva abre un domingo. Entró el doble de gente y todavía huele a pintura.',
    requires: { flag: 'arco_estadio_2', minSeason: 10 },
    weight: 10,
    options: [
      {
        label: 'Ponerle el nombre del socio que empujó la obra desde el día uno',
        hint: 'El tuyo puede esperar. Este gesto no.',
        effects: { hinchada: 12, socios: 4, influencia: 3 },
      },
      {
        label: 'Abrirla sin nombre, con la tribuna llena y nada más',
        hint: 'La obra habla sola. Vos también, pero más bajo.',
        effects: { hinchada: 8, socios: 3, caja: 2 },
      },
    ],
  },
  {
    id: 'arco-barra-1',
    kind: 'color',
    title: 'LA BARRA PIDE PARA EL DÍA DEL NIÑO',
    text: 'Tres de la barra pasan por la sede con un pedido chico: juguetes y una tarde en el club para los pibes del barrio. Lo hacen con vos o sin vos, avisan de buen modo.',
    weight: 2,
    options: [
      {
        label: 'Poner el club y la plata de los juguetes',
        hint: 'Sale poco y queda una foto buena. También queda un precedente.',
        effects: { caja: -0.4, hinchada: 4, flags: { arco_barra_1: true } },
      },
      {
        label: 'Prestar el predio y que los juguetes los pongan ellos',
        hint: 'Colaborás sin abrir la caja. Toman nota igual.',
        effects: { hinchada: 2, flags: { arco_barra_1: true } },
      },
    ],
  },
  {
    id: 'arco-barra-2',
    kind: 'dilema',
    title: 'AHORA QUIEREN EL ESTACIONAMIENTO',
    text: 'El mismo grupo vuelve, con menos sonrisa. Piden manejar el estacionamiento del estadio los días de partido: ellos cobran, ellos ordenan. Dicen que así no hay lío.',
    requires: { flag: 'arco_barra_1', minSeason: 5 },
    weight: 10,
    options: [
      {
        label: 'Dárselo para tener la fiesta en paz',
        hint: 'Se termina la discusión de hoy. Empieza la de dentro de dos años.',
        effects: { caja: -1, influencia: -6, hinchada: 2, flags: { arco_barra_2: true }, flagsSuma: { prontuario: 1 } },
      },
      {
        label: 'Ofrecerles un puesto de choripán y nada más',
        hint: 'Les das algo, no el negocio. Se van midiendo la respuesta.',
        effects: { hinchada: -2, influencia: 2, flags: { arco_barra_2: true } },
      },
      {
        label: 'Decirles que no a todo',
        hint: 'Plantado. El domingo se ve si alcanzaba con plantarse.',
        effects: { influencia: 4, hinchada: -4, flags: { arco_barra_2: true } },
      },
    ],
  },
  {
    id: 'arco-barra-3',
    kind: 'golpe',
    title: 'EL QUIEBRE CON LA BARRA',
    text: 'El plantel se subió al micro para viajar y la barra lo frenó en la puerta del predio: no sale nadie hasta que se arregle lo del estacionamiento. Hay cámaras filmando desde la vereda.',
    requires: { flag: 'arco_barra_2', minSeason: 9 },
    weight: 10,
    options: [
      {
        label: 'Denunciarlos y prohibirles la entrada al club',
        hint: 'Se pudre del todo y salís en todos lados. Después hay que sostenerlo.',
        effects: { hinchada: -6, influencia: 6, plantel: -1 },
      },
      {
        label: 'Ceder ahora y ordenar el tema cuando bajen las cámaras',
        hint: 'El micro sale. La deuda con ellos también sigue saliendo.',
        effects: { influencia: -8, hinchada: 3, flagsSuma: { prontuario: 1 } },
      },
    ],
  },
  {
    id: 'hin-entradas-truchas',
    kind: 'golpe',
    title: 'ENTRADAS FALSAS EN LA PUERTA',
    text: 'Aparecieron cientos de entradas falsificadas para el partido más caro del año. En los molinetes hay gente con ticket pago que se queda afuera y no lo entiende. Falta media hora para que empiece.',
    options: [
      {
        label: 'Dejar entrar a todos y contar el lío después',
        hint: 'Nadie se pierde el partido. La caja no cierra por ningún lado.',
        effects: { caja: -1.2, hinchada: 4 },
      },
      {
        label: 'Cortar el ingreso y filtrar uno por uno',
        hint: 'Se cuida la recaudación. Media popular empieza el partido en la calle.',
        random: [
          { weight: 50, text: 'Se ordenó la fila y entró casi todo el mundo antes del segundo tiempo.', effects: { hinchada: -3 } },
          { weight: 50, text: 'Se armó un tumulto en la puerta, forzaron un molinete y salió en todos lados.', effects: { hinchada: -9, influencia: -4 } },
        ],
      },
      {
        label: 'Denunciar la maniobra y poner control digital para la próxima',
        hint: 'Se corta el negocio para adelante. Cuesta y no resuelve el hoy.',
        effects: { caja: -0.8, influencia: 3, hinchada: -1 },
      },
    ],
  },
  {
    id: 'hin-interna-de-la-barra',
    kind: 'golpe',
    title: 'LA BARRA SE PARTIÓ EN DOS',
    text: 'Dos facciones de la barra se pelearon por el manejo de los bombos y del sector de la popular. Vinieron los dos grupos a la sede, por separado, a pedirte que reconozcas a uno y no al otro.',
    options: [
      {
        label: 'No reconocer a ninguno y hablar solo con socios',
        hint: 'Te sacás el problema de encima. Los dos grupos quedan enojados con vos.',
        effects: { hinchada: -3, influencia: 4 },
      },
      {
        label: 'Mediar para que se repartan sin sangre',
        hint: 'Cuesta reuniones y desgaste. Baja un poco el ruido.',
        effects: { influencia: -4, hinchada: 2 },
      },
      {
        label: 'Dejar que lo arreglen entre ellos',
        hint: 'No gastás nada. El domingo se ve cómo salió.',
        random: [
          { weight: 45, text: 'Se acomodaron solos y la popular volvió a cantar como si nada.', effects: { hinchada: 2 } },
          { weight: 55, text: 'Se agarraron a la salida y la imagen la levantaron todos los canales.', effects: { hinchada: -7, influencia: -3 } },
        ],
      },
    ],
  },
  {
    id: 'hin-el-natatorio',
    kind: 'dilema',
    title: 'SE LLUEVE EL NATATORIO',
    text: 'La pileta cubierta tiene más socios que la platea un domingo cualquiera, y el techo hace dos años que pierde. Refaccionarla entera sale una fortuna; cerrarla es perder a las familias que van solo a eso.',
    options: [
      {
        label: 'Refaccionar todo el natatorio',
        hint: 'Un gasto grande hoy por algo que el fútbol no ve.',
        effects: {
          caja: -3,
          socios: 2,
          deferred: [
            { inSeasons: 2, text: 'El natatorio nuevo funciona a full todo el año y entran socios que nunca pisaron la cancha.', effects: { socios: 6, caja: 1.5 } },
          ],
        },
      },
      {
        label: 'Poner un parche en el techo y seguir',
        hint: 'Barato. Aguanta hasta que no aguante.',
        effects: { caja: -0.6, socios: -1 },
      },
      {
        label: 'Cerrarlo hasta que haya plata',
        hint: 'Se ahorra el mantenimiento. Se van las familias que iban por la pileta.',
        effects: { socios: -5, hinchada: -2 },
      },
    ],
  },
  {
    id: 'hin-aniversario-redondo',
    kind: 'color',
    title: 'EL CLUB CUMPLE CIEN AÑOS',
    text: 'Se viene el centenario y hay que decidir cómo se festeja. Marketing quiere una gala con cubiertos caros y mesas vendidas a empresas. La subcomisión del hincha quiere una jornada a puertas abiertas para el barrio.',
    options: [
      {
        label: 'La gala con mesas para sponsors',
        hint: 'Deja plata y una foto elegante. La popular no se siente parte.',
        effects: { caja: 1.5, hinchada: -3, socios: 1 },
      },
      {
        label: 'La jornada a puertas abiertas',
        hint: 'No entra un peso. Se llena de gente que lo va a contar por años.',
        effects: { caja: -0.6, hinchada: 7, socios: 2 },
      },
      {
        label: 'Las dos cosas, en un fin de semana partido',
        hint: 'Contentás a todos y organizás el doble.',
        effects: { caja: 0.4, hinchada: 3, influencia: -1 },
      },
    ],
  },
];
