import { DEUDA_INHIBICION, type PlayerOffer } from './engine/types';

export function cajaTras(caja: number, seleccion: PlayerOffer[]): number {
  return Math.round(seleccion.reduce((total, o) => total - o.cost, caja) * 10) / 10;
}

export function motivoBloqueo(
  offer: PlayerOffer,
  elegidas: PlayerOffer[],
  caja: number,
  restantes: number,
): string | null {
  if (elegidas.includes(offer)) return null;
  if (elegidas.length >= restantes) return `Ya elegiste ${restantes}`;
  if (cajaTras(caja, [...elegidas, offer]) <= DEUDA_INHIBICION) return 'Te inhibe el club';
  return null;
}
