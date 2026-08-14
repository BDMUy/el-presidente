/**
 * "Pasan cosas": los eventos que le dan sabor a la presidencia.
 *
 * Efectos chicos a propósito. Están para que el mundo se sienta vivo, no para
 * mover el balance. Varios están condicionados por categoría, porque no es lo
 * mismo la semana del clásico en Primera que un martes en la B.
 */

import type { GameEvent } from '@/lib/engine/types';

export const COLOR: GameEvent[] = [
  {
    id: 'micro-roto',
    kind: 'color',
    title: 'SE ROMPIÓ EL MICRO',
    text: 'El micro del plantel se quedó en la ruta camino a Santiago. Los jugadores subieron fotos desde la banquina.',
    requires: { category: ['nacional', 'b'] },
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
        hint: '🎲 Puede ser una campaña de marketing o un papelón filmado.',
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
    options: [
      {
        label: 'Trabajar toda la noche para dejarla jugable',
        hint: 'Se juega. El campo queda destruido por dos meses.',
        effects: { caja: -0.5, plantel: -2 },
      },
      {
        label: 'Pedir postergación con informe técnico',
        hint: '🎲 Depende de con quién hables.',
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
    requires: { category: ['primera'], minSize: 6 },
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
    title: 'EL SUEÑO DE LA B',
    text: 'Un hincha te para en la calle y te dice que su viejo se murió sin verlos en Primera. No te pide nada. Solo te lo dice.',
    requires: { category: ['b', 'nacional'] },
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
];
