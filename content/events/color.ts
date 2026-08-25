import type { GameEvent } from '@/lib/engine/types';

export const COLOR: GameEvent[] = [
  {
    id: 'micro-roto',
    kind: 'color',
    title: 'SE ROMPIÓ EL MICRO',
    text: 'El micro del plantel se quedó en la ruta camino a la cancha de visitante. Los jugadores subieron fotos desde la banquina.',
    requires: { league: ['ar-nacional', 'ar-b', 'uy-segunda', 'pe-segunda', 'co-segunda', 'cl-segunda', 'py-segunda', 'bo-segunda'] },
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
    id: 'gira-exterior',
    kind: 'dilema',
    title: 'GIRA POR ASIA',
    text: 'Ofrecen tres amistosos en pretemporada con un cheque importante. Son veinte días afuera y catorce horas de vuelo.',
    requires: { league: ['ar-primera', 'uy-primera', 'pe-primera', 'co-primera', 'cl-primera', 'py-primera', 'bo-primera'], minSize: 6 },
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
    requires: { league: ['ar-nacional', 'ar-b', 'uy-segunda', 'pe-segunda', 'co-segunda', 'cl-segunda', 'py-segunda', 'bo-segunda'] },
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
];
