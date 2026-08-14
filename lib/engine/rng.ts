/**
 * PRNG determinista y serializable.
 *
 * Todo el azar del juego pasa por acá. El estado es un solo número, así que
 * viaja dentro de GameState y se puede reproducir exactamente igual en el
 * cliente y en el servidor. Eso es lo que permite verificar puntajes.
 */

/** mulberry32: rápido, buena distribución, estado de 32 bits. */
export function nextFloat(s: number): { value: number; state: number } {
  let a = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, state: a };
}

/**
 * Envoltorio mutable sobre el PRNG.
 *
 * Se usa dentro de una transición: se crea con `new Rand(state.rng)`, se tira
 * todo el azar que haga falta, y al final se guarda `r.s` de vuelta en el
 * estado. La transición sigue siendo pura vista desde afuera.
 */
export class Rand {
  constructor(public s: number) {}

  /** [0, 1) */
  next(): number {
    const { value, state } = nextFloat(this.s);
    this.s = state;
    return value;
  }

  /** Entero en [min, max], ambos inclusive. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Float en [min, max). */
  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** true con probabilidad p. */
  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  /** Elige un elemento respetando pesos relativos. */
  weighted<T>(items: readonly T[], weightOf: (item: T) => number): T {
    const total = items.reduce((sum, item) => sum + Math.max(0, weightOf(item)), 0);
    if (total <= 0) return this.pick(items);
    let roll = this.next() * total;
    for (const item of items) {
      roll -= Math.max(0, weightOf(item));
      if (roll <= 0) return item;
    }
    return items[items.length - 1];
  }

  /** Copia barajada (Fisher-Yates). No muta el original. */
  shuffle<T>(items: readonly T[]): T[] {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  /**
   * Normal estándar por Box-Muller. Se usa para el ruido de la resolución
   * deportiva: da colas suaves en vez del corte duro de una uniforme.
   */
  normal(): number {
    const u = 1 - this.next();
    const v = this.next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
}

/** Convierte un string (ej. la fecha del día) en una semilla numérica. */
export function seedFromString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
