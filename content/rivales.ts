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
  colombia: [
    'Millonarios', 'Atlético Nacional', 'América de Cali', 'Independiente Santa Fe', 'Independiente Medellín',
    'Junior', 'Deportivo Cali', 'Once Caldas', 'Deportes Tolima', 'Atlético Bucaramanga', 'Cúcuta Deportivo', 'Envigado',
  ],
  chile: [
    'Colo-Colo', 'U. de Chile', 'U. Católica', 'Everton', "O'Higgins", 'Cobreloa',
    'Unión Española', 'Palestino', 'Audax Italiano', 'Huachipato', 'Wanderers', 'Coquimbo Unido',
  ],
  paraguay: [
    'Olimpia', 'Cerro Porteño', 'Libertad', 'Guaraní', 'Nacional', 'Luqueño',
    '2 de Mayo', 'Recoleta', 'Trinidense', 'Ameliano', 'San Lorenzo', 'Rubio Ñu',
  ],
};
