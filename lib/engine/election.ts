import { Rand } from './rng';
import type { Club, ElectionResult, Ending, EndingId, GameState, Modo } from './types';
import {
  HINCHADA_ASAMBLEA,
  LEAGUES,
  SEASONS_PER_MANDATE,
  TEMPORADAS_POR_MODO,
  TITLES,
} from './types';

const OPOSITORES = [
  'la Lista Celeste',
  'la agrupación "Volver a las Fuentes"',
  'el bloque opositor del Salón Cultural',
  'la lista que arma el ex tesorero',
  'la agrupación de socios vitalicios',
];

export const DEUDA_QUIEBRA = -40;

export function resolveElection(state: GameState, rand: Rand): ElectionResult {
  const { resources, titles, season } = state;
  const mandateStart = season - 4;
  const titlesThisMandate = titles.filter((t) => t.season > mandateStart).length;

  let votes =
    resources.hinchada * 0.75 +
    resources.influencia * 0.25 +
    titlesThisMandate * 4 +
    rand.normal() * 5;

  if (resources.caja < 0) {
    votes -= Math.min(15, -resources.caja * 0.4);
  }

  votes = Math.min(95, Math.max(5, Math.round(votes)));
  const rival = rand.pick(OPOSITORES);
  const won = votes >= 50;

  return {
    won,
    votes,
    rival,
    summary: resumenElectoral(won, votes, rival),
  };
}

function resumenElectoral(won: boolean, votes: number, rival: string): string {
  if (won) {
    if (votes >= 75) {
      return `Ganaste con el ${votes}% de los votos, una diferencia que no dejó margen para el reclamo. ${capitalize(rival)} ni pidió el recuento.`;
    }
    if (votes >= 60) {
      return `Ganaste con el ${votes}% de los votos. ${capitalize(rival)} pidió recuento y perdió también eso.`;
    }
    return `Ganaste raspando, con el ${votes}% de los votos. ${capitalize(rival)} impugnó todo lo que pudo impugnar.`;
  }

  if (votes <= 25) {
    return `Perdiste feo. Sacaste el ${votes}% y ${rival} se queda con el club sin discusión posible.`;
  }
  if (votes <= 40) {
    return `Perdiste. Sacaste el ${votes}% y ${rival} se queda con el club.`;
  }
  return `Perdiste por un puñado de votos: el ${votes}% contra ${rival}. Una asamblea distinta y esto termina distinto.`;
}

export function isElectionSeason(season: number, modo: Modo = 'normal'): boolean {
  return season % SEASONS_PER_MANDATE === 0 && season < TEMPORADAS_POR_MODO[modo];
}

export function checkEarlyExit(state: GameState): EndingId | null {
  if (state.resources.caja <= DEUDA_QUIEBRA) return 'quiebra';
  if (state.resources.hinchada <= HINCHADA_ASAMBLEA) return 'asamblea';
  if (state.descensos >= 3) return 'descenso-fatal';
  return null;
}

const PUNTOS_ESTATUA: Record<Modo, number> = {
  corta: 200,
  normal: 200,
  larga: 400,
  llamas: 200,
};

export function puntosParaEstatua(modo: Modo): number {
  return PUNTOS_ESTATUA[modo];
}

function prontuarioTolerado(modo: Modo): number {
  return TEMPORADAS_POR_MODO[modo] / 4;
}

export function finalEnding(state: GameState): EndingId {
  const { resources, titles, descensos, flags } = state;
  const puntosTitulos = titles.reduce((sum, t) => sum + TITLES[t.id].points, 0);
  const prontuario = typeof flags.prontuario === 'number' ? flags.prontuario : 0;

  if (
    resources.hinchada >= 75 &&
    puntosTitulos >= puntosParaEstatua(state.modo) &&
    descensos === 0 &&
    prontuario < prontuarioTolerado(state.modo)
  ) {
    return 'estatua';
  }
  return 'reelecto-gris';
}

function matiz(state: GameState, club: Club): string {
  const { resources, titles, descensos, ascensos, history } = state;
  const puntos = titles.reduce((sum, t) => sum + TITLES[t.id].points, 0);
  const continental = titles.some((t) => t.id === 'libertadores' || t.id === 'sudamericana');
  const empezoEn = history[0]?.league;

  if (state.modo === 'llamas' && state.season >= TEMPORADAS_POR_MODO.llamas) {
    return (
      'Recibiste el club con veintidós millones de deuda, la gente en contra y un plantel ' +
      'que no podías pagar, y llegaste hasta el final. Nadie se acuerda de cómo lo recibiste. ' +
      'Vos sí.'
    );
  }
  if (state.modo === 'larga' && state.season >= TEMPORADAS_POR_MODO.larga) {
    return (
      'Treinta y dos años en el sillón y te faltaron tres. Bantiago Sernabéu llegó a los ' +
      'treinta y cinco y por eso la cancha lleva su nombre; Julio Rondona duró lo mismo, ' +
      'pero detrás de un escritorio en Viamonte. Tres temporadas separan una presidencia ' +
      'larga de una leyenda.'
    );
  }
  if (continental) {
    return 'Hay una noche, en una cancha del continente, que la gente va a contarles a sus nietos.';
  }
  if (empezoEn && LEAGUES[empezoEn].relegatesTo === null && LEAGUES[state.league].promotesTo === null) {
    return `Recibiste a ${club.name} en la B y lo dejaste en Primera. Eso no se borra con ninguna auditoría.`;
  }
  if (ascensos > 0 && descensos > 0) {
    return 'Subiste y bajaste con el mismo club. La gente se acuerda más del descenso, siempre.';
  }
  if (descensos > 0) {
    return 'El descenso quedó pegado a tu apellido y ningún título posterior lo despegó.';
  }
  if (resources.caja < 0) {
    return 'Dejaste la vitrina más llena y la caja más vacía. Alguien va a tener que ordenar eso.';
  }
  if (puntos === 0 && resources.caja > 25) {
    return 'Entregaste las cuentas impecables y la vitrina intacta. Nadie hace canciones con un balance.';
  }
  if (resources.influencia > 70) {
    return 'Te vas con más teléfonos útiles que cuando llegaste. En este ambiente, eso es un patrimonio.';
  }
  if (resources.socios > 90) {
    return `${club.name} tiene hoy más socios que en toda su historia. Eso también es una obra.`;
  }
  return 'Con el tiempo, el balance de tu gestión va a depender de quién lo cuente.';
}

export function mandatosDe(modo: Modo): number {
  return TEMPORADAS_POR_MODO[modo] / SEASONS_PER_MANDATE;
}

const EN_LETRAS: Record<number, string> = {
  2: 'dos',
  3: 'tres',
  4: 'cuatro',
  5: 'cinco',
  6: 'seis',
  7: 'siete',
  8: 'ocho',
  16: 'dieciséis',
  32: 'treinta y dos',
};

export function enLetras(n: number): string {
  return EN_LETRAS[n] ?? String(n);
}

const letras = enLetras;

export function buildEnding(id: EndingId, state: GameState, club: Club): Ending {
  const años = state.season;
  const titulos = state.titles.length;
  const temporadas = TEMPORADAS_POR_MODO[state.modo];
  const mandatos = mandatosDe(state.modo);

  const balanceTitulos =
    titulos > 0
      ? `${titulos} ${plural(titulos, 'título', 'títulos')} en la vitrina`
      : state.descensos > 0
        ? 'Sin títulos y con algún que otro sobresalto'
        : 'Sin títulos, pero sin catástrofes';
  const balanceCuentas =
    state.resources.caja >= 0 ? 'las cuentas más o menos en orden' : 'una deuda que le queda al que te sucede';

  const endings: Record<EndingId, Ending> = {
    estatua: {
      id: 'estatua',
      title: 'TU NOMBRE EN LA TRIBUNA',
      text: `${capitalize(letras(temporadas))} años, ${titulos} ${plural(titulos, 'título', 'títulos')} y un club que no se parece en nada al que recibiste. La asamblea votó por unanimidad ponerle tu nombre a la tribuna sur. Fuiste a la inauguración y no pudiste hablar.`,
    },
    'reelecto-gris': {
      id: 'reelecto-gris',
      title: 'CUMPLISTE',
      text: `Terminaste los ${letras(mandatos)} mandatos. ${balanceTitulos}, ${balanceCuentas} y ${club.name} de pie. No te van a hacer una estatua. Tampoco te van a putear en el barrio.`,
    },
    'derrota-electoral': {
      id: 'derrota-electoral',
      title: 'LA GENTE VOTÓ',
      text: `${años} ${plural(años, 'año', 'años')} en el sillón y la gente eligió otra cosa. Entregaste las llaves un martes a la mañana, sin cámaras. El nuevo presidente prometió "recuperar la identidad del club".`,
    },
    asamblea: {
      id: 'asamblea',
      title: 'TE VOLTEÓ LA ASAMBLEA',
      text: `No hizo falta esperar a las elecciones. La asamblea extraordinaria se llenó de socios que no aparecían hacía años y te sacaron a mano alzada. Saliste por la puerta de atrás con un bolso y dos carpetas.`,
    },
    quiebra: {
      id: 'quiebra',
      title: 'EL CLUB FUNDIDO',
      text: `La deuda se comió todo. Embargos, sueldos impagos, jugadores que se fueron libres y una causa penal con tu nombre en la carátula. ${club.name} va a tardar una década en recuperarse de tu gestión.`,
    },
    'descenso-fatal': {
      id: 'descenso-fatal',
      title: `${capitalize(letras(state.descensos))} descensos`.toUpperCase(),
      text: `${capitalize(letras(state.descensos))} descensos en una misma presidencia. No hay influencia que aguante eso. Te fuiste antes de que te echaran, y ni así te ahorraste el escrache en la puerta de tu casa.`,
    },
  };

  const base = endings[id];
  return { ...base, text: `${base.text} ${matiz(state, club)}` };
}

const PUNTOS_POR_TEMPORADA = 18;

export function puntajePorTemporadas(state: GameState): number {
  return state.season * PUNTOS_POR_TEMPORADA;
}

export function computeScore(state: GameState): number {
  const puntosTitulos = state.titles.reduce((sum, t) => sum + TITLES[t.id].points, 0);

  const score =
    puntosTitulos +
    puntajePorTemporadas(state) +
    state.resources.hinchada * 4 +
    Math.max(0, state.resources.caja) * 3 +
    state.resources.socios * 1.2 +
    state.ascensos * 60 -
    state.descensos * 140;

  return Math.max(0, Math.round(score));
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
