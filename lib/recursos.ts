/**
 * Qué es cada recurso, en la voz del juego.
 *
 * Fuente única: la usan el acta de asunción (que enseña una vez) y las celdas
 * del carnet (que responden cuando te olvidaste en la temporada nueve). Si la
 * explicación viviera en dos lados, tarde o temprano dirían cosas distintas.
 *
 * Cada texto tiene que responder dos preguntas: qué es, y qué lo mueve. Sin la
 * segunda, el jugador no puede planificar.
 */

import type { Resources } from '@/lib/engine/types';

export interface RecursoDef {
  id: keyof Resources;
  label: string;
  /** Qué es y qué lo mueve. Dos o tres frases, no más. */
  texto: string;
  /** La consecuencia dura, si la tiene. Se destaca aparte. */
  limite?: string;
}

export const RECURSOS: readonly RecursoDef[] = [
  {
    id: 'caja',
    label: 'Caja',
    texto:
      'La plata del club, en millones de dólares. Entra por cuotas de socios, televisión, premios y ventas; sale en sueldos, fichajes y obras. Puede ir a negativo: eso es deuda, y la deuda cobra intereses todas las temporadas.',
    limite: 'Con 18 millones de deuda el club queda inhibido y no podés incorporar a nadie.',
  },
  {
    id: 'hinchada',
    label: 'Hinchada',
    texto:
      'Cuánto te quiere la gente, de 0 a 100. Sube con títulos, ascensos y decisiones que la tribuna aplaude. Baja cuando vendés ídolos, aumentás la cuota o el equipo termina peor de lo que se esperaba de él.',
    limite: 'Es tu vida: cada cuatro temporadas se vota, y por debajo de 45 perdés la elección.',
  },
  {
    id: 'socios',
    label: 'Socios',
    texto:
      'Cuántos socios tiene el club, en miles. Son tu único ingreso que no depende de ganar: cobrás cuota todas las temporadas. Crecen con los buenos resultados y con la cuota barata.',
  },
  {
    id: 'plantel',
    label: 'Plantel',
    texto:
      'El nivel del equipo, de 0 a 100. Es lo único que define dónde terminás en la tabla y con qué chances llegás a una final. Se desgasta solo cada temporada: si no comprás, baja.',
    limite: 'Vos armás el plantel; el plantel juega. Los partidos no los definís vos.',
  },
  {
    id: 'influencia',
    label: 'Influencia',
    texto:
      'Tu peso ante la AFA, la prensa y la interna del club, de 0 a 100. Se gana votando con los de arriba, ganando finales y siendo reelecto. Se gasta en blindarte de una operación, en sobrevivir una asamblea y en gestiones que no conviene detallar.',
    limite: 'Suma votos en la elección: alcanza para sostener un mandato mediocre.',
  },
];

export const RECURSOS_POR_ID: Record<keyof Resources, RecursoDef> = Object.fromEntries(
  RECURSOS.map((r) => [r.id, r]),
) as Record<keyof Resources, RecursoDef>;
