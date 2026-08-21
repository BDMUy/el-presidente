import { logrosDeLaPartida } from '@/content/logros';
import { computeScore } from '@/lib/engine/election';
import type { GameState, TitleId } from '@/lib/engine/types';

const KEY = 'el-presidente:vitrina';

export interface Vitrina {
  titulos: TitleId[];
  logros: string[];
  partidas: number;
  mejorPuntaje: number;
  mejorClub: string | null;
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
  titulosNuevos: TitleId[];
  logrosNuevos: string[];
  esRecord: boolean;
}

export function registrarPartida(state: GameState): Novedades {
  const actual = leerVitrina();
  const marca = huella(state);

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
  }
}

export function borrarVitrina(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
  }
}
