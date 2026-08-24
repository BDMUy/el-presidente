import type { Country } from '@/lib/engine/types';

export const RIVALES: Record<Country, string[]> = {
  argentina: [
    'Boca', 'River', 'Racing', 'Independiente', 'San Lorenzo', 'Vélez',
    'Estudiantes', 'Lanús', 'Talleres', "Newell's", 'Rosario Central', 'Huracán',
  ],
  uruguay: [
    'Peñarol', 'Nacional', 'Danubio', 'Defensor', 'Liverpool', 'Wanderers',
    'Cerro', 'Racing', 'Progreso', 'Boston River', 'Cerro Largo', 'Rentistas',
  ],
  peru: [
    'Alianza Lima', 'Universitario', 'Sporting Cristal', 'Melgar', 'Cienciano', 'Sport Boys',
    'Cusco FC', 'Garcilaso', 'Sport Huancayo', 'ADT', 'Alianza Atlético', 'Binacional',
  ],
};
