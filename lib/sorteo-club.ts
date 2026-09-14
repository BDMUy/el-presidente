import { CLUBS } from '@/content/clubs';
import { countryOf } from '@/lib/engine/types';

export function sortearClubPorDestino(azar: () => number) {
  const elegir = <T,>(opciones: readonly T[]): T => opciones[Math.floor(azar() * opciones.length)];
  const pais = elegir([...new Set(CLUBS.map((club) => countryOf(club.league)))]);
  const delPais = CLUBS.filter((club) => countryOf(club.league) === pais);
  const liga = elegir([...new Set(delPais.map((club) => club.league))]);
  const clubes = delPais.filter((club) => club.league === liga);
  return { pais, liga, club: elegir(clubes) };
}
