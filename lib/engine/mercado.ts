import { CRACKS } from '@/content/parodias';
import { APELLIDOS, NOMBRES } from '@/content/nombres';
import { Rand } from './rng';
import type { Country, LeagueId, PlayerOffer } from './types';
import { countryOf } from './types';

const CHANCE_CRACK = 0.35;

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

const PRICE_SCALE: Record<LeagueId, number> = {
  'ar-primera': 1, 'ar-nacional': 0.35, 'ar-b': 0.15,
  'uy-primera': 0.8, 'uy-segunda': 0.2,
};

function nombre(country: Country, rand: Rand, usados: Set<string>): string {
  const apellidos = APELLIDOS[country];
  const disponibles = apellidos.filter((a) => !usados.has(a));
  const apellido = rand.pick(disponibles.length > 0 ? disponibles : apellidos);
  usados.add(apellido);
  return `${rand.pick(NOMBRES[country])} ${apellido}`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function generateOffers(
  league: LeagueId,
  plantel: number,
  rand: Rand,
  season = 1,
  seed = 0,
): PlayerOffer[] {
  const country: Country = countryOf(league);
  const scale = PRICE_SCALE[league];
  const offers: PlayerOffer[] = [];
  const apellidosUsados = new Set<string>();

  const cracks = CRACKS[country];
  const hayCrack = rand.chance(CHANCE_CRACK);
  const slotCrack = rand.int(0, 2);
  const crack = cracks[(seed + season) % cracks.length];
  const nombreDe = (indice: number, usados: Set<string>): string =>
    hayCrack && indice === slotCrack ? crack : nombre(country, rand, usados);

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
