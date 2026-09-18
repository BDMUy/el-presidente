import { HINCHADA_ELECCION } from '@/lib/engine/types';

export const CLIMA_TRIBUNA: Record<'bien' | 'tibio' | 'mal', readonly string[]> = {
  bien: [
    'Con este tipo nos quedamos diez años más.',
    'Se nota que hay conducción. Hacía falta.',
    'Por primera vez en años, vamos a la cancha tranquilos.',
    'Que siga firmando lo que quiera, total sabe lo que hace.',
  ],
  tibio: [
    'Ni fu ni fa. Que gane el domingo y hablamos.',
    'Todavía le damos crédito, pero no para siempre.',
    'La gente mira de reojo. No es odio, es paciencia.',
    'Hay ruido en la sede, pero nadie junta firmas todavía.',
  ],
  mal: [
    'Que se vaya. Y que devuelva lo que se llevó.',
    'El domingo hay bandera contra el palco.',
    'Ya nadie lo defiende ni en la sede.',
    'Si pierde otra vez, no lo dejan entrar al predio.',
  ],
};

export const CLIMA_PRENSA: Record<'bien' | 'tibio' | 'mal', readonly string[]> = {
  bien: [
    'La gestión muestra números y nadie la puede contradecir.',
    'De candidato testimonial a ejemplo de administración.',
    'El dirigente que aprendió a ganar sin romper la caja.',
  ],
  tibio: [
    'Una gestión que todavía no se define: ni escándalo ni epopeya.',
    'Fuentes del club hablan de tensión contenida.',
    'El balance da, pero la tribuna pide algo más que planillas.',
  ],
  mal: [
    'Crece el malestar y en la sede ya se habla de asamblea.',
    'La oposición cuenta votos y no le faltan muchos.',
    'Un mandato en caída libre, según los propios dirigentes.',
  ],
};

export type Clima = keyof typeof CLIMA_TRIBUNA;

export function climaDeHinchada(hinchada: number): Clima {
  if (hinchada >= 70) return 'bien';
  if (hinchada >= HINCHADA_ELECCION) return 'tibio';
  return 'mal';
}

export function vozDeSemilla(
  bolsas: Record<Clima, readonly string[]>,
  clima: Clima,
  seed: number,
  season: number,
): string {
  const bolsa = bolsas[clima];
  return bolsa[Math.abs(seed + season * 7) % bolsa.length];
}
