/**
 * Clubes argentinos, solo por nombre y colores.
 *
 * Sin escudos, sin fotos, sin planteles reales: nombre, colores y parámetros
 * de juego. `size` (1-10) es el peso institucional y define presupuesto,
 * socios, expectativa de la hinchada y calidad del plantel inicial.
 */

import type { Club } from '@/lib/engine/types';

export const CLUBS: Club[] = [
  // ── Liga Profesional ──────────────────────────────────────
  { id: 'boca', name: 'Boca Juniors', short: 'Boca', colors: ['#0a3a8c', '#f2c200'], category: 'primera', size: 10, nickname: 'el Xeneize' },
  { id: 'river', name: 'River Plate', short: 'River', colors: ['#ffffff', '#d81e3f'], category: 'primera', size: 10, nickname: 'el Millonario' },
  { id: 'racing', name: 'Racing Club', short: 'Racing', colors: ['#7ab8e6', '#ffffff'], category: 'primera', size: 9, nickname: 'la Academia' },
  { id: 'independiente', name: 'Independiente', short: 'Independiente', colors: ['#d32f2f', '#ffffff'], category: 'primera', size: 9, nickname: 'el Rojo' },
  { id: 'sanlorenzo', name: 'San Lorenzo', short: 'San Lorenzo', colors: ['#1b3f8b', '#c8102e'], category: 'primera', size: 8, nickname: 'el Ciclón' },
  { id: 'velez', name: 'Vélez Sarsfield', short: 'Vélez', colors: ['#ffffff', '#0a4ea3'], category: 'primera', size: 8, nickname: 'el Fortín' },
  { id: 'estudiantes', name: 'Estudiantes de La Plata', short: 'Estudiantes', colors: ['#e01e2b', '#ffffff'], category: 'primera', size: 7, nickname: 'el Pincha' },
  { id: 'central', name: 'Rosario Central', short: 'Central', colors: ['#1a4fa0', '#f2c200'], category: 'primera', size: 7, nickname: 'el Canalla' },
  { id: 'newells', name: "Newell's Old Boys", short: "Newell's", colors: ['#d3222a', '#000000'], category: 'primera', size: 7, nickname: 'la Lepra' },
  { id: 'talleres', name: 'Talleres', short: 'Talleres', colors: ['#1b4fa0', '#ffffff'], category: 'primera', size: 7, nickname: 'la T' },
  { id: 'belgrano', name: 'Belgrano', short: 'Belgrano', colors: ['#7ab8e6', '#ffffff'], category: 'primera', size: 6, nickname: 'el Pirata' },
  { id: 'lanus', name: 'Lanús', short: 'Lanús', colors: ['#7b1f2b', '#ffffff'], category: 'primera', size: 6, nickname: 'el Granate' },
  { id: 'huracan', name: 'Huracán', short: 'Huracán', colors: ['#ffffff', '#d81e3f'], category: 'primera', size: 6, nickname: 'el Globo' },
  { id: 'argentinos', name: 'Argentinos Juniors', short: 'Argentinos', colors: ['#d81e3f', '#ffffff'], category: 'primera', size: 6, nickname: 'el Bicho' },
  { id: 'gimnasia', name: 'Gimnasia y Esgrima La Plata', short: 'Gimnasia', colors: ['#1d5fa8', '#ffffff'], category: 'primera', size: 6, nickname: 'el Lobo' },
  { id: 'colon', name: 'Colón', short: 'Colón', colors: ['#d3222a', '#000000'], category: 'primera', size: 6, nickname: 'el Sabalero' },
  { id: 'banfield', name: 'Banfield', short: 'Banfield', colors: ['#1a6b3c', '#ffffff'], category: 'primera', size: 5, nickname: 'el Taladro' },
  { id: 'defensa', name: 'Defensa y Justicia', short: 'Defensa', colors: ['#f2c200', '#1a6b3c'], category: 'primera', size: 5, nickname: 'el Halcón' },
  { id: 'godoycruz', name: 'Godoy Cruz', short: 'Godoy Cruz', colors: ['#1a4fa0', '#ffffff'], category: 'primera', size: 5, nickname: 'el Tomba' },
  { id: 'instituto', name: 'Instituto', short: 'Instituto', colors: ['#d3222a', '#ffffff'], category: 'primera', size: 5, nickname: 'la Gloria' },
  { id: 'union', name: 'Unión', short: 'Unión', colors: ['#d3222a', '#ffffff'], category: 'primera', size: 5, nickname: 'el Tatengue' },
  { id: 'atltucuman', name: 'Atlético Tucumán', short: 'Atl. Tucumán', colors: ['#7ab8e6', '#ffffff'], category: 'primera', size: 5, nickname: 'el Decano' },
  { id: 'tigre', name: 'Tigre', short: 'Tigre', colors: ['#1a4fa0', '#d81e3f'], category: 'primera', size: 4, nickname: 'el Matador' },
  { id: 'sarmiento', name: 'Sarmiento', short: 'Sarmiento', colors: ['#1a6b3c', '#ffffff'], category: 'primera', size: 4, nickname: 'el Verde' },
  { id: 'platense', name: 'Platense', short: 'Platense', colors: ['#7b3f1f', '#ffffff'], category: 'primera', size: 4, nickname: 'el Calamar' },
  { id: 'centralcordoba', name: 'Central Córdoba', short: 'C. Córdoba', colors: ['#000000', '#ffffff'], category: 'primera', size: 4, nickname: 'el Ferroviario' },
  { id: 'indriv', name: 'Independiente Rivadavia', short: 'Ind. Rivadavia', colors: ['#1a4fa0', '#ffffff'], category: 'primera', size: 4, nickname: 'la Lepra mendocina' },
  { id: 'aldosivi', name: 'Aldosivi', short: 'Aldosivi', colors: ['#f2c200', '#1a6b3c'], category: 'primera', size: 3, nickname: 'el Tiburón' },
  { id: 'barracas', name: 'Barracas Central', short: 'Barracas', colors: ['#d3222a', '#ffffff'], category: 'primera', size: 3, nickname: 'el Guapo' },
  { id: 'riestra', name: 'Deportivo Riestra', short: 'Riestra', colors: ['#000000', '#f2c200'], category: 'primera', size: 3, nickname: 'el Blanquinegro' },

  // ── Primera Nacional ──────────────────────────────────────
  { id: 'quilmes', name: 'Quilmes', short: 'Quilmes', colors: ['#ffffff', '#1a4fa0'], category: 'nacional', size: 6, nickname: 'el Cervecero' },
  { id: 'ferro', name: 'Ferro Carril Oeste', short: 'Ferro', colors: ['#1a6b3c', '#ffffff'], category: 'nacional', size: 5, nickname: 'el Verdolaga' },
  { id: 'chacarita', name: 'Chacarita Juniors', short: 'Chacarita', colors: ['#d3222a', '#000000'], category: 'nacional', size: 5, nickname: 'el Funebrero' },
  { id: 'sanmartint', name: 'San Martín de Tucumán', short: 'San Martín (T)', colors: ['#d3222a', '#ffffff'], category: 'nacional', size: 5, nickname: 'el Santo' },
  { id: 'atlanta', name: 'Atlanta', short: 'Atlanta', colors: ['#f2c200', '#1a4fa0'], category: 'nacional', size: 4, nickname: 'el Bohemio' },
  { id: 'allboys', name: 'All Boys', short: 'All Boys', colors: ['#ffffff', '#000000'], category: 'nacional', size: 4, nickname: 'el Albo' },
  { id: 'chicago', name: 'Nueva Chicago', short: 'Chicago', colors: ['#1a6b3c', '#000000'], category: 'nacional', size: 4, nickname: 'el Torito' },
  { id: 'almagro', name: 'Almagro', short: 'Almagro', colors: ['#1a4fa0', '#ffffff'], category: 'nacional', size: 3, nickname: 'el Tricolor' },
  { id: 'temperley', name: 'Temperley', short: 'Temperley', colors: ['#7ab8e6', '#ffffff'], category: 'nacional', size: 3, nickname: 'el Gasolero' },
  { id: 'moron', name: 'Deportivo Morón', short: 'Morón', colors: ['#d3222a', '#ffffff'], category: 'nacional', size: 3, nickname: 'el Gallo' },
  { id: 'gimnasiam', name: 'Gimnasia y Esgrima de Mendoza', short: 'Gimnasia (M)', colors: ['#ffffff', '#1a4fa0'], category: 'nacional', size: 4, nickname: 'el Lobo mendocino' },
  { id: 'santelmo', name: 'San Telmo', short: 'San Telmo', colors: ['#1a4fa0', '#f2c200'], category: 'nacional', size: 2, nickname: 'el Candombero' },
  { id: 'defbelgrano', name: 'Defensores de Belgrano', short: 'Defensores', colors: ['#d3222a', '#ffffff'], category: 'nacional', size: 3, nickname: 'el Dragón' },
  { id: 'racingcba', name: 'Racing de Córdoba', short: 'Racing (C)', colors: ['#7ab8e6', '#ffffff'], category: 'nacional', size: 3, nickname: 'la Academia cordobesa' },
  { id: 'estudiantesrc', name: 'Estudiantes de Río Cuarto', short: 'Estudiantes (RC)', colors: ['#1a6b3c', '#ffffff'], category: 'nacional', size: 3 },
  { id: 'agropecuario', name: 'Agropecuario', short: 'Agropecuario', colors: ['#1a6b3c', '#ffffff'], category: 'nacional', size: 2, nickname: 'el Sojero' },
  { id: 'guemes', name: 'Güemes', short: 'Güemes', colors: ['#000000', '#ffffff'], category: 'nacional', size: 2, nickname: 'el Gaucho' },
  { id: 'mitre', name: 'Mitre', short: 'Mitre', colors: ['#f2c200', '#000000'], category: 'nacional', size: 2, nickname: 'el Aurinegro' },

  // ── Primera B ─────────────────────────────────────────────
  { id: 'losandes', name: 'Los Andes', short: 'Los Andes', colors: ['#d3222a', '#ffffff'], category: 'b', size: 3, nickname: 'el Milrayitas' },
  { id: 'colegiales', name: 'Colegiales', short: 'Colegiales', colors: ['#ffffff', '#000000'], category: 'b', size: 2, nickname: 'el Tricolor de Munro' },
  { id: 'acassuso', name: 'Acassuso', short: 'Acassuso', colors: ['#d3222a', '#1a4fa0'], category: 'b', size: 1, nickname: 'el Quemero de Boulogne' },
  { id: 'comunicaciones', name: 'Comunicaciones', short: 'Comunicaciones', colors: ['#1a6b3c', '#ffffff'], category: 'b', size: 2, nickname: 'el Cartero' },
  { id: 'tallerresre', name: 'Talleres de Remedios de Escalada', short: 'Talleres (RE)', colors: ['#d3222a', '#ffffff'], category: 'b', size: 2, nickname: 'el Albirrojo' },
  { id: 'canuelas', name: 'Cañuelas', short: 'Cañuelas', colors: ['#7b1f2b', '#ffffff'], category: 'b', size: 1, nickname: 'el Tambero' },
  { id: 'docksud', name: 'Sportivo Dock Sud', short: 'Dock Sud', colors: ['#1a4fa0', '#ffffff'], category: 'b', size: 1, nickname: 'el Docke' },
  { id: 'fenix', name: 'Fénix', short: 'Fénix', colors: ['#7b3f8b', '#ffffff'], category: 'b', size: 1, nickname: 'el Ave' },
  { id: 'sanmiguel', name: 'San Miguel', short: 'San Miguel', colors: ['#f2c200', '#d3222a'], category: 'b', size: 2, nickname: 'el Trueno Verde' },
  { id: 'excursionistas', name: 'Excursionistas', short: 'Excursionistas', colors: ['#ffffff', '#1a4fa0'], category: 'b', size: 2, nickname: 'el Villero' },
  { id: 'uaiurquiza', name: 'UAI Urquiza', short: 'UAI Urquiza', colors: ['#1a6b3c', '#ffffff'], category: 'b', size: 1 },
  { id: 'armenio', name: 'Deportivo Armenio', short: 'Armenio', colors: ['#d3222a', '#1a4fa0'], category: 'b', size: 1, nickname: 'el Tricolor' },
  { id: 'italiano', name: 'Sportivo Italiano', short: 'Italiano', colors: ['#1a4fa0', '#ffffff'], category: 'b', size: 1, nickname: 'el Tano' },
  { id: 'espanol', name: 'Deportivo Español', short: 'Español', colors: ['#d3222a', '#f2c200'], category: 'b', size: 2, nickname: 'el Gallego' },
  { id: 'argentinoq', name: 'Argentino de Quilmes', short: 'Argentino (Q)', colors: ['#1a6b3c', '#ffffff'], category: 'b', size: 1, nickname: 'el Mate' },
  { id: 'ituzaingo', name: 'Ituzaingó', short: 'Ituzaingó', colors: ['#1a4fa0', '#ffffff'], category: 'b', size: 1, nickname: 'el Verde' },
];

export const CLUBS_BY_ID: Record<string, Club> = Object.fromEntries(
  CLUBS.map((club) => [club.id, club]),
);

export function getClub(id: string): Club {
  const club = CLUBS_BY_ID[id];
  if (!club) throw new Error(`Club desconocido: ${id}`);
  return club;
}
