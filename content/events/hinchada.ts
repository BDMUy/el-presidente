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
];
