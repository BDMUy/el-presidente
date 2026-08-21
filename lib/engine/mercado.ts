import { CRACKS } from '@/content/parodias';
import { Rand } from './rng';
import type { Category, PlayerOffer } from './types';

const CHANCE_CRACK = 0.35;

const NOMBRES = [
  'Matías', 'Lucas', 'Nahuel', 'Julián', 'Facundo', 'Tomás', 'Agustín', 'Franco',
  'Bruno', 'Emiliano', 'Thiago', 'Valentín', 'Ramiro', 'Joaquín', 'Ignacio', 'Gonzalo',
  'Alan', 'Brian', 'Kevin', 'Maximiliano', 'Rodrigo', 'Santiago', 'Elías', 'Lautaro',
];

const APELLIDOS = [
  'Ferreyra', 'Quiroga', 'Bustamante', 'Ledesma', 'Ojeda', 'Sosa', 'Villalba', 'Cáceres',
  'Maidana', 'Peralta', 'Aguirre', 'Coronel', 'Barrios', 'Zárate', 'Bogado', 'Insúa',
  'Mansilla', 'Verón', 'Cabral', 'Rolón', 'Arce', 'Chávez', 'Godoy', 'Almirón',
  'Escalante', 'Rivarola', 'Toledo', 'Miranda', 'Alderete', 'Paredes',
];

const ARQUETIPOS_COMPRA = [
  { archetype: '9 de área', note: 'No baja a buscarla, pero adentro no perdona.' },
  { archetype: 'volante central', note: 'Corre por dos. Tarjeta fácil.' },
  { archetype: 'enganche zurdo', note: 'Un pase cada quince minutos que te gana el partido.' },
  { archetype: 'lateral que pasa', note: 'Va y viene toda la cancha. Defender no es lo suyo.' },
  { archetype: 'central de jerarquía', note: 'Habla adentro de la cancha. Eso vale.' },
  { archetype: 'extremo desequilibrante', note: 'Uno contra uno, siempre encara. A veces sale.' },
  { archetype: 'arquero de copa', note: 'Ataja un penal por serie. Después, veremos.' },
];

const ARQUETIPOS_LIBRE = [
  { archetype: 'veterano de retorno', note: 'Vuelve al club donde debutó. La gente lo va a amar.' },
  { archetype: 'libre del ascenso', note: 'Nadie lo conoce. Su representante insiste mucho.' },
  { archetype: 'campeón en decadencia', note: 'Ganó todo hace seis años. Las piernas se acuerdan a veces.' },
];

const ARQUETIPOS_VENTA = [
  { archetype: 'la joya del club', note: 'Salió de la pensión. La tribuna canta su nombre.', edad: [17, 21] },
  { archetype: 'el goleador', note: 'Mete la mitad de los goles del equipo.', edad: [23, 30] },
  { archetype: 'el capitán', note: 'Lleva la cinta desde hace cuatro años.', edad: [28, 34] },
] as const;

const PRICE_SCALE: Record<Category, number> = { primera: 1, nacional: 0.35, b: 0.15 };

function nombre(rand: Rand, usados: Set<string>): string {
  const disponibles = APELLIDOS.filter((a) => !usados.has(a));
  const apellido = rand.pick(disponibles.length > 0 ? disponibles : APELLIDOS);
  usados.add(apellido);
  return `${rand.pick(NOMBRES)} ${apellido}`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function generateOffers(
  category: Category,
  plantel: number,
  rand: Rand,
  season = 1,
  seed = 0,
): PlayerOffer[] {
  const scale = PRICE_SCALE[category];
  const offers: PlayerOffer[] = [];
  const apellidosUsados = new Set<string>();

  const hayCrack = rand.chance(CHANCE_CRACK);
  const slotCrack = rand.int(0, 2);
  const crack = CRACKS[(seed + season) % CRACKS.length];
  const nombreDe = (indice: number, usados: Set<string>): string =>
    hayCrack && indice === slotCrack ? crack : nombre(rand, usados);

  const fuerte = rand.pick(ARQUETIPOS_COMPRA);
  const deltaFuerte = rand.int(6, 11);
  offers.push({
    kind: 'compra',
    name: nombreDe(0, apellidosUsados),
    archetype: fuerte.archetype,
    age: rand.int(23, 29),
    plantelDelta: deltaFuerte,
    cost: round1(deltaFuerte * rand.float(0.55, 0.85) * scale),
    hinchadaDelta: 3,
    note: fuerte.note,
    risk: rand.float(0.08, 0.2),
  });

  const barato = rand.pick(ARQUETIPOS_LIBRE);
  const deltaBarato = rand.int(2, 5);
  offers.push({
    kind: 'libre',
    name: nombreDe(1, apellidosUsados),
    archetype: barato.archetype,
    age: rand.int(30, 36),
    plantelDelta: deltaBarato,
    cost: round1(deltaBarato * rand.float(0.1, 0.25) * scale),
    hinchadaDelta: barato.archetype === 'veterano de retorno' ? 6 : 0,
    note: barato.note,
    risk: rand.float(0.25, 0.45),
  });

  const venta = rand.pick(ARQUETIPOS_VENTA);
  const deltaVenta = rand.int(7, 13);
  const edad = rand.int(venta.edad[0], venta.edad[1]);
  const primaJuventud = edad < 22 ? 1.25 : edad < 28 ? 1 : 0.75;
  offers.push({
    kind: 'venta',
    name: nombreDe(2, apellidosUsados),
    archetype: venta.archetype,
    age: edad,
    plantelDelta: -deltaVenta,
    cost: -round1(deltaVenta * rand.float(1, 1.6) * primaJuventud * scale),
    hinchadaDelta: -rand.int(9, 16),
    note: venta.note,
    risk: 0,
  });

  return rand.shuffle(offers);
}
