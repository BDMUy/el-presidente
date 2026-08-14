/**
 * La vitrina: lo que sobrevive a una presidencia.
 *
 * Es el único estado que cruza partidas. Los títulos ganados, los logros
 * desbloqueados y el mejor puntaje se acumulan en el dispositivo, sin cuenta.
 *
 * A diferencia de la partida en curso, esto NO lleva versión de contenido: si
 * mañana agrego cartas nuevas, nadie debería perder la Libertadores que ganó.
 * Los IDs de título y de logro son el contrato estable.
 */

import { logrosDeLaPartida } from '@/content/logros';
import { computeScore } from '@/lib/engine/election';
import type { GameState, TitleId } from '@/lib/engine/types';

const KEY = 'el-presidente:vitrina';

export interface Vitrina {
  /** Títulos ganados alguna vez, en cualquier partida. */
  titulos: TitleId[];
  logros: string[];
  partidas: number;
  mejorPuntaje: number;
  /** Club de la mejor presidencia, para mostrarla al lado del puntaje. */
  mejorClub: string | null;
  /**
   * Huella de la última presidencia registrada.
   *
   * La partida terminada se sigue restaurando al recargar, para no perder el
   * epílogo. Sin esta marca, cada recarga en una sesión nueva volvía a sumar
   * la misma presidencia y el contador crecía solo.
   */
  ultimaHuella: string | null;
}

const VACIA: Vitrina = {
  titulos: [],
  logros: [],
  partidas: 0,
  mejorPuntaje: 0,
  mejorClub: null,
  ultimaHuella: null,
};

/** Identifica una presidencia concreta: semilla más recorrido. */
function huella(state: GameState): string {
  return `${state.seed}:${state.choices.length}:${state.season}`;
}

export function leerVitrina(): Vitrina {
  if (typeof window === 'undefined') return VACIA;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return VACIA;
    const parsed = JSON.parse(raw) as Partial<Vitrina>;
    return {
      titulos: Array.isArray(parsed.titulos) ? parsed.titulos : [],
      logros: Array.isArray(parsed.logros) ? parsed.logros : [],
      partidas: typeof parsed.partidas === 'number' ? parsed.partidas : 0,
      mejorPuntaje: typeof parsed.mejorPuntaje === 'number' ? parsed.mejorPuntaje : 0,
      mejorClub: typeof parsed.mejorClub === 'string' ? parsed.mejorClub : null,
      ultimaHuella: typeof parsed.ultimaHuella === 'string' ? parsed.ultimaHuella : null,
    };
  } catch {
    return VACIA;
  }
}

export interface Novedades {
  vitrina: Vitrina;
  /** Títulos que entran a la vitrina por primera vez. */
  titulosNuevos: TitleId[];
  logrosNuevos: string[];
  esRecord: boolean;
}

/**
 * Suma una presidencia terminada a la vitrina y devuelve qué hay de nuevo.
 *
 * Devolver las novedades y no solo el total es lo que permite celebrarlas en
 * el epílogo: sin esto, ganar tu primera Libertadores se vería igual que
 * ganar la cuarta.
 */
export function registrarPartida(state: GameState): Novedades {
  const actual = leerVitrina();
  const marca = huella(state);

  // Ya estaba registrada: se devuelve la vitrina como está, sin novedades.
  // Volver a mostrar el epílogo no puede volver a sumar la presidencia.
  if (actual.ultimaHuella === marca) {
    return { vitrina: actual, titulosNuevos: [], logrosNuevos: [], esRecord: false };
  }

  const puntaje = computeScore(state);

  const titulosNuevos = [...new Set(state.titles.map((t) => t.id))].filter(
    (id) => !actual.titulos.includes(id),
  );
  const logrosNuevos = logrosDeLaPartida(state).filter((id) => !actual.logros.includes(id));
  const esRecord = puntaje > actual.mejorPuntaje;

  const vitrina: Vitrina = {
    titulos: [...actual.titulos, ...titulosNuevos],
    logros: [...actual.logros, ...logrosNuevos],
    partidas: actual.partidas + 1,
    mejorPuntaje: Math.max(actual.mejorPuntaje, puntaje),
    mejorClub: esRecord ? state.clubId : actual.mejorClub,
    ultimaHuella: marca,
  };

  guardarVitrina(vitrina);
  return { vitrina, titulosNuevos, logrosNuevos, esRecord };
}

function guardarVitrina(vitrina: Vitrina): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(vitrina));
  } catch {
    // Sin almacenamiento la vitrina no persiste. El juego sigue andando.
  }
}

export function borrarVitrina(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nada que hacer.
  }
}
