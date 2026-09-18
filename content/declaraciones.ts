import type { Modo } from '@/lib/engine/types';

export const DECLARACIONES: readonly string[] = [
  'Acá no vengo a hacer negocios. Vengo a hacer historia. Si de paso se hace un negocio, va a ser para el club.',
  'El club es de los socios. Yo firmo, pero la casa es de ustedes.',
  'No prometo títulos. Prometo que nadie se lleva nada sin que yo me entere.',
  'Vengo a poner la cara. El que quiera hablar, que hable conmigo y no con el diario.',
  'Las cuentas las vamos a mostrar. Todas. Después no digan que no avisé.',
  'Al plantel le pido una sola cosa: que corra. Lo demás lo arreglo yo.',
  'Desde hoy, el que se equivoca paga. Empezando por mí.',
  'Me voy a sentar con todos. Con todos es con todos, aclaro.',
];

export const DECLARACIONES_EN_LLAMAS: readonly string[] = [
  'Recibimos un club fundido. No voy a decir quién lo fundió, pero varios están en esta sala.',
  'La caja está vacía y el plantel es lo único que quedó. Hagan sus cuentas.',
  'No vengo a prometer refuerzos. Vengo a que el club llegue a fin de mes.',
  'Si hay que vender, se vende. Prefiero un club pobre a un club cerrado.',
  'Me hago cargo del incendio. Que quede escrito quién dejó la estufa prendida.',
  'Pido paciencia. Es lo único que puedo pagar por ahora.',
];

export function declaracionDeSemilla(seed: number, modo: Modo): string {
  const bolsa = modo === 'llamas' ? DECLARACIONES_EN_LLAMAS : DECLARACIONES;
  return bolsa[Math.abs(seed) % bolsa.length];
}
