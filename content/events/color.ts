import type { GameEvent } from '@/lib/engine/types';

export const COLOR: GameEvent[] = [
  {
    id: 'micro-roto',
    kind: 'color',
    title: 'SE ROMPIÓ EL MICRO',
    text: 'El micro del plantel se quedó en la ruta camino a la cancha de visitante. Los jugadores subieron fotos desde la banquina.',
    requires: { league: ['ar-nacional', 'ar-b', 'uy-segunda', 'pe-segunda', 'co-segunda', 'cl-segunda', 'py-segunda', 'bo-segunda', 'ec-segunda', 've-segunda', 'br-segunda'] },
    options: [
      {
        label: 'Alquilar otro de urgencia',
        hint: 'Sale caro un domingo a la noche.',
        effects: { caja: -0.4, plantel: 1 },
      },
      {
        label: 'Que viajen en combis',
        hint: 'Llegan. De mal humor, pero llegan.',
        effects: { plantel: -2, hinchada: -1 },
      },
    ],
  },
  {
    id: 'camiseta-retro',
    kind: 'color',
    title: 'LA CAMISETA RETRO',
    text: 'Marketing propone sacar la camiseta del equipo campeón del 87. Los de diseño quieren "modernizarla".',
    options: [
      {
        label: 'Idéntica a la original',
        hint: 'Se agota en dos días.',
        effects: { caja: 1.2, hinchada: 5 },
      },
      {
        label: 'Versión modernizada',
        hint: 'Nadie la quiere. Ni los nostálgicos ni los pibes.',
        effects: { caja: 0.3, hinchada: -3 },
      },
    ],
  },
  {
    id: 'documental',
    kind: 'color',
    title: 'QUIEREN FILMAR UN DOCUMENTAL',
    text: 'Una plataforma quiere meter cámaras en el vestuario toda la temporada. Pagan bien.',
    requires: { minSeason: 3 },
    options: [
      {
        label: 'Abrir las puertas',
        hint: 'Puede ser una campaña de marketing o un papelón filmado.',
        random: [
          { weight: 50, text: 'El documental fue un éxito. El club sumó hinchas en todo el país.', effects: { socios: 6, caja: 2, hinchada: 6 } },
          { weight: 50, text: 'Quedó filmada una discusión de vestuario que dio la vuelta al mundo.', effects: { plantel: -4, hinchada: -6, caja: 2 } },
        ],
      },
      {
        label: 'Decir que no',
        hint: 'El vestuario es el vestuario.',
        effects: { plantel: 2 },
      },
    ],
  },
  {
    id: 'clasico-semana',
    kind: 'color',
    title: 'SEMANA DE CLÁSICO',
    text: 'No se habla de otra cosa desde el lunes. Te piden una declaración fuerte.',
    weight: 2,
    options: [
      {
        label: 'Calentar el clásico',
        hint: 'La gente te ama esta semana. El rival también se calienta.',
        effects: { hinchada: 6, plantel: -2 },
      },
      {
        label: 'Bajar los decibeles',
        hint: 'Institucional. Aburrido. Sano.',
        effects: { influencia: 4, hinchada: -2, plantel: 2 },
      },
    ],
  },
  {
    id: 'estatua-idolo',
    kind: 'color',
    title: 'LA ESTATUA DEL ÍDOLO',
    text: 'Los socios juntaron plata para hacerle una estatua al máximo goleador de la historia del club. Falta que vos pongas el resto.',
    requires: { minSeason: 4 },
    options: [
      {
        label: 'Poner la diferencia',
        hint: 'Un gesto que no se olvida.',
        effects: { caja: -0.8, hinchada: 9 },
      },
      {
        label: 'Que la junten ellos',
        hint: 'Ahorrás poco y perdés bastante.',
        effects: { hinchada: -6 },
      },
    ],
  },
  {
    id: 'cancha-inundada',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la AFA no quiere reprogramar.',
    requires: { country: ['argentina'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'cancha-inundada-uy',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la AUF no quiere reprogramar.',
    requires: { country: ['uruguay'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'cancha-inundada-pe',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la FPF no quiere reprogramar.',
    requires: { country: ['peru'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'cancha-inundada-co',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la Dimayor no quiere reprogramar.',
    requires: { country: ['colombia'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'cancha-inundada-cl',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la ANFP no quiere reprogramar.',
    requires: { country: ['chile'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'cancha-inundada-py',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la APF no quiere reprogramar.',
    requires: { country: ['paraguay'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'cancha-inundada-bo',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la FBF no quiere reprogramar.',
    requires: { country: ['bolivia'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'cancha-inundada-ec',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la LigaPro no quiere reprogramar.',
    requires: { country: ['ecuador'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'cancha-inundada-ve',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la FVF no quiere reprogramar.',
    requires: { country: ['venezuela'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'cancha-inundada-br',
    kind: 'golpe',
    title: 'SE INUNDÓ LA CANCHA',
    text: 'Llovió tres días seguidos y el campo de juego es una laguna. Hay partido el domingo y la CBF no quiere reprogramar.',
    requires: { country: ['brasil'] },
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: 'Depende de con quién hables.',
        random: [
          { weight: 45, text: 'Aceptaron postergarlo. Se jugó dos semanas después con la cancha impecable.', effects: { influencia: -4, plantel: 2 } },
          { weight: 55, text: 'No aceptaron. Se jugó igual y encima quedaste como el que quiso especular.', effects: { hinchada: -4, plantel: -2 } },
        ],
      },
    ],
  },
  {
    id: 'gira-exterior',
    kind: 'dilema',
    title: 'GIRA POR ASIA',
    text: 'Ofrecen tres amistosos en pretemporada con un cheque importante. Son veinte días afuera y catorce horas de vuelo.',
    requires: { league: ['ar-primera', 'uy-primera', 'pe-primera', 'co-primera', 'cl-primera', 'py-primera', 'bo-primera', 'ec-primera', 've-primera', 'br-primera'], minSize: 6 },
    options: [
      {
        label: 'Ir',
        hint: 'Plata fresca. El equipo arranca el torneo fundido.',
        effects: { caja: 4, plantel: -4 },
      },
      {
        label: 'Quedarse a hacer pretemporada en serio',
        hint: 'Sin plata, pero con equipo.',
        effects: { plantel: 4, caja: -0.5 },
      },
    ],
  },
  {
    id: 'ascenso-suenio',
    kind: 'color',
    title: 'EL SUEÑO DEL ASCENSO',
    text: 'Un hincha te para en la calle y te dice que su viejo se murió sin verlos en Primera. No te pide nada. Solo te lo dice.',
    requires: { league: ['ar-nacional', 'ar-b', 'uy-segunda', 'pe-segunda', 'co-segunda', 'cl-segunda', 'py-segunda', 'bo-segunda', 'ec-segunda', 've-segunda', 'br-segunda'] },
    options: [
      {
        label: 'Prometerle que van a subir',
        hint: 'Prometer es gratis hasta que no lo es.',
        effects: { hinchada: 4, flags: { promesa_ascenso: true } },
      },
      {
        label: 'Escucharlo y no prometer nada',
        hint: 'Honesto.',
        effects: { hinchada: 1, influencia: 2 },
      },
    ],
  },
  {
    id: 'col-mascota',
    kind: 'color',
    title: 'LA MASCOTA DEL CLUB',
    text: 'Marketing quiere una mascota para las redes. Trajeron el boceto: un animal con la camiseta puesta y los ojos muy abiertos. Nadie en la reunión se anima a decir lo que todos piensan.',
    options: [
      {
        label: 'Aprobarla',
        hint: 'A los pibes les encanta. A la popular no.',
        effects: { socios: 2, hinchada: -3, caja: -0.3 },
      },
      {
        label: 'Cajonearla',
        hint: 'Te ahorrás el papelón y el ingreso.',
        effects: { influencia: 1 },
      },
    ],
  },
  {
    id: 'col-famoso-del-club',
    kind: 'color',
    title: 'UN FAMOSO ES DEL CLUB',
    text: 'Un cantante que llena estadios contó en la tele que es hincha desde chico. Nadie lo sabía. Ahora quiere venir a la cancha y cantar antes del clásico.',
    options: [
      {
        label: 'Que cante',
        hint: 'Media hora de show antes del partido más tenso del año.',
        random: [
          { weight: 55, text: 'Cantó, se emocionó y la cancha lo aplaudió de pie. Se habló toda la semana.', effects: { hinchada: 7, socios: 3 } },
          { weight: 45, text: 'Se le fue la mano, cantó de más y el equipo salió frío. La popular lo silbó.', effects: { hinchada: -5 } },
        ],
      },
      {
        label: 'Invitarlo al palco y nada más',
        hint: 'Una foto, un café, cero riesgo.',
        effects: { socios: 1, hinchada: 1 },
      },
    ],
  },
  {
    id: 'col-camiseta-del-primer-titulo',
    kind: 'color',
    title: 'APARECIÓ UNA CAMISETA',
    text: 'Un coleccionista tiene la camiseta del primer campeonato del club. Auténtica, con el barro de aquella tarde todavía pegado. La vende, y no barata.',
    options: [
      {
        label: 'Comprarla para el museo',
        hint: 'Plata que no vuelve, en una vitrina que emociona.',
        effects: { caja: -0.9, hinchada: 6, socios: 1 },
      },
      {
        label: 'Pedirle que la preste',
        hint: 'Sale gratis. Se la lleva cuando quiera.',
        effects: { hinchada: 2 },
      },
      {
        label: 'Dejarla pasar',
        hint: 'Es una camiseta vieja. Eso decís vos.',
        effects: { hinchada: -2 },
      },
    ],
  },
  {
    id: 'col-el-hincha-disfrazado',
    kind: 'color',
    title: 'EL HINCHA DEL DISFRAZ',
    text: 'Hace diez años que un socio va a la cancha disfrazado del mismo personaje. Ya es más conocido que la mitad del plantel. Pide una acreditación oficial.',
    options: [
      {
        label: 'Dársela',
        hint: 'Formaliza algo que ya era parte del folclore.',
        effects: { hinchada: 3, caja: -0.1 },
      },
      {
        label: 'Que siga como siempre, sin papeles',
        hint: 'Menos trámite. Menos reconocimiento también.',
        effects: { hinchada: 1 },
      },
    ],
  },
  {
    id: 'col-cambio-de-himno',
    kind: 'dilema',
    title: 'QUIEREN MODERNIZAR EL HIMNO',
    text: 'Un grupo de socios propone grabar una nueva versión del himno del club, con una banda conocida. Dicen que el original ya casi no se escucha bien en la cancha.',
    options: [
      {
        label: 'Aprobar la nueva versión',
        hint: 'Suena mejor. Los de siempre van a extrañar la vieja.',
        effects: { caja: -0.4, hinchada: -2, socios: 2 },
      },
      {
        label: 'Dejar el himno como está',
        hint: 'Se sigue escuchando mal. Nadie te lo reclama en la cara.',
        effects: { hinchada: 1 },
      },
    ],
  },
  {
    id: 'col-mural-en-la-sede',
    kind: 'color',
    title: 'UN MURAL PARA LA SEDE',
    text: 'Un grupo de socios artistas se ofrece a pintar gratis un mural gigante en la pared externa de la sede, con la historia del club. Piden solo la pintura.',
    weight: 2,
    options: [
      {
        label: 'Financiar la pintura y dejarlos trabajar',
        hint: 'Poca plata para algo que va a quedar años.',
        effects: { caja: -0.3, hinchada: 4, socios: 1 },
      },
      {
        label: 'Pedir que primero lo aprueben en comisión',
        hint: 'Correcto y burocrático. El entusiasmo se puede enfriar.',
        effects: { influencia: 1 },
      },
    ],
  },
  {
    id: 'col-el-utilero-historico',
    kind: 'color',
    title: 'EL UTILERO DE TODA LA VIDA SE JUBILA',
    text: 'El utilero lleva treinta y dos años en el club, cuatro presidencias más que la tuya. Anuncia que se jubila a fin de año.',
    options: [
      {
        label: 'Hacerle un homenaje en la cancha',
        hint: 'Treinta y dos años no los tiene ningún jugador de este plantel.',
        effects: { caja: -0.2, hinchada: 4, socios: 1 },
      },
      {
        label: 'Un simple acto interno',
        hint: 'Correcto puertas adentro. Nadie de afuera se entera.',
        effects: { hinchada: 1 },
      },
    ],
  },
  {
    id: 'col-la-foto-viral',
    kind: 'color',
    title: 'UNA FOTO VIEJA SE HIZO VIRAL',
    text: 'Una foto de un festejo de los años noventa, mal escaneada, empieza a circular en las redes con miles de comentarios. Te preguntan si el club la va a usar para algo.',
    options: [
      {
        label: 'Imprimirla y venderla como póster oficial',
        hint: 'Nostalgia que se puede colgar en la pared. Y que se puede cobrar.',
        effects: { caja: 0.6, hinchada: 3 },
      },
      {
        label: 'Dejar que circule sola, sin meterse',
        hint: 'Es de la gente. Que siga siendo de la gente.',
        effects: { hinchada: 2 },
      },
    ],
  },
  {
    id: 'col-veraneo',
    kind: 'dilema',
    title: 'TORNEO DE VERANO EN LA COSTA',
    text: 'Un empresario arma un cuadrangular de verano en la costa y ofrece un cachet importante por llevar al equipo. Son cuatro días con hotel frente al mar, dos partidos y mucha cámara.',
    options: [
      {
        label: 'Ir a jugar el veraneo',
        hint: 'Plata fresca y prensa liviana. La pretemporada seria queda a medias.',
        random: [
          { weight: 55, text: 'Se llevaron el cuadrangular y volvieron enchufados. Salió redondo.', effects: { caja: 2, plantel: 1, hinchada: 3 } },
          { weight: 45, text: 'Cuatro días de playa y asado. Arrancaron el torneo pesados.', effects: { caja: 2, plantel: -3 } },
        ],
      },
      {
        label: 'Quedarse a hacer pretemporada de verdad',
        hint: 'Sin cachet, con doble turno y sin distracciones.',
        effects: { plantel: 3, caja: -0.3 },
      },
    ],
  },
  {
    id: 'col-ola-de-calor',
    kind: 'color',
    title: 'CUARENTA GRADOS Y PARTIDO AL MEDIODÍA',
    text: 'Ola de calor histórica y el fixture pone el partido a las dos de la tarde, con la popular sin una sombra. La liga contesta que el horario lo pone la televisión y que no se cambia.',
    options: [
      {
        label: 'Repartir agua y armar puestos de hidratación gratis',
        hint: 'Un gasto chico que la gente agradece con el termómetro así.',
        effects: { caja: -0.4, hinchada: 4 },
      },
      {
        label: 'Sumarse al reclamo del resto de los clubes por los horarios',
        hint: 'Juntos pesan más. La tele igual no mueve nada este fin de semana.',
        effects: { influencia: -2, hinchada: 2 },
      },
    ],
  },
  {
    id: 'col-exjugador-en-la-mala',
    kind: 'color',
    title: 'UN ÍDOLO DE LOS NOVENTA PIDE UNA MANO',
    text: 'Uno de los referentes del último equipo campeón de aquella década está enfermo y sin obra social. No salió a pedir nada en público: mandó un mensaje a un dirigente viejo preguntando si el club podía ayudarlo.',
    options: [
      {
        label: 'Cubrirle el tratamiento en silencio',
        hint: 'No sale en ningún lado. Es lo que corresponde y punto.',
        effects: { caja: -1, hinchada: 3, influencia: 2 },
      },
      {
        label: 'Organizarle un partido homenaje a beneficio',
        hint: 'Junta plata y lo pone otra vez en la cancha. También lo expone.',
        effects: { caja: 0.4, hinchada: 6, socios: 2 },
      },
      {
        label: 'Darle un puesto de trabajo en el club',
        hint: 'Una solución de fondo, no un parche. Hay que hacerle lugar.',
        effects: { caja: -0.5, hinchada: 4, influencia: 1 },
      },
    ],
  },
  {
    id: 'col-streamer-del-club',
    kind: 'color',
    title: 'EL STREAMER QUE LLENA ESTADIOS VIRTUALES',
    text: 'Un streamer con más público que muchos partidos de primera contó que es hincha del club de toda la vida. Ofrece transmitir contenido desde adentro a cambio de acceso al vestuario y a los entrenamientos.',
    options: [
      {
        label: 'Abrirle la puerta con reglas claras',
        hint: 'Llega a un público que el club no toca. El vestuario no lo pidió.',
        effects: { socios: 3, hinchada: 1, plantel: -1 },
      },
      {
        label: 'Darle acceso solo a zonas comunes, no al vestuario',
        hint: 'Menos ruido puertas adentro. Menos material para él también.',
        effects: { socios: 1, hinchada: 1 },
      },
      {
        label: 'Agradecer y dejarlo afuera',
        hint: 'El vestuario es el vestuario. Se pierde una vidriera enorme.',
        effects: { plantel: 1, socios: -1 },
      },
    ],
  },
  {
    id: 'col-escudo-inspirado',
    kind: 'color',
    title: 'UNA MARCA COPIA EL ESCUDO',
    text: 'Una cadena de ropa sacó una línea entera con un escudo "inspirado" en el del club: los mismos colores, la misma forma, una letra cambiada. Se vende en todo el país y el club no ve un peso.',
    options: [
      {
        label: 'Mandar cartas documento y salir a la carga',
        hint: 'Podés hacerlos parar. Lleva abogados y tiempo.',
        effects: { caja: -0.5, influencia: 2 },
      },
      {
        label: 'Ofrecerles una licencia oficial y cobrar por cada prenda',
        hint: 'Si ya lo usan, que lo paguen. Algunos socios lo van a ver como venderse.',
        effects: { caja: 1.6, hinchada: -3 },
      },
      {
        label: 'Sacar la línea oficial más barata y competirles',
        hint: 'El club pone su propia versión en la calle. Hay que producirla.',
        effects: { caja: 0.4, hinchada: 2 },
      },
    ],
  },
];
