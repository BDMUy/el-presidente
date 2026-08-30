import { CRACKS } from '@/content/parodias';
import { APELLIDOS, NOMBRES } from '@/content/nombres';
import { Rand } from './rng';
import type { Country, LeagueId, PlayerOffer } from './types';
import { countryOf } from './types';

const CHANCE_CRACK = 0.35;

const CHANCE_MOVIMIENTO_EXTRA = 0.5;

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

const ARQUETIPOS_PRESTAMO = [
  { archetype: 'suplente que no juega en su club', note: 'Viene a sumar minutos. Si explota, después se habla la compra.' },
  { archetype: 'juvenil a préstamo con opción', note: 'Lo mandan a foguearse un año. El dueño mira de afuera.' },
  { archetype: 'recambio de una liga grande', note: 'Baja de categoría por una temporada. Trae roce que acá no sobra.' },
];

const ARQUETIPOS_CESION = [
  { archetype: 'juvenil que no suma minutos', note: 'Se va a préstamo a foguearse. Vuelve con roce o no vuelve mejor.', edad: [18, 22] },
  { archetype: 'suplente que pide salir', note: 'No entra en los planes de esta temporada. Un préstamo destraba todo.', edad: [22, 28] },
] as const;

const PRICE_SCALE: Record<LeagueId, number> = {
  'ar-primera': 1, 'ar-nacional': 0.35, 'ar-b': 0.15,
  'uy-primera': 0.8, 'uy-segunda': 0.2,
  'pe-primera': 0.8, 'pe-segunda': 0.2,
  'co-primera': 0.9, 'co-segunda': 0.2,
  'cl-primera': 0.85, 'cl-segunda': 0.2,
  'py-primera': 0.75, 'py-segunda': 0.2,
  'bo-primera': 0.7, 'bo-segunda': 0.2,
  'ec-primera': 0.85, 'ec-segunda': 0.2,
  've-primera': 0.65, 've-segunda': 0.2,
  'br-primera': 1.1, 'br-segunda': 0.3,
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
  const slotCrack = rand.int(0, 5);
  const crack = cracks[(seed + season) % cracks.length];
  const nombreDe = (indice: number, usados: Set<string>): string =>
    hayCrack && indice === slotCrack ? crack : nombre(country, rand, usados);

  let indice = 0;

  for (let i = 0; i < 2; i++) {
    const fuerte = rand.pick(ARQUETIPOS_COMPRA);
    const deltaFuerte = rand.int(6, 11);
    offers.push({
      kind: 'compra',
      name: nombreDe(indice++, apellidosUsados),
      archetype: fuerte.archetype,
      age: rand.int(23, 29),
      plantelDelta: deltaFuerte,
      cost: round1(deltaFuerte * rand.float(0.55, 0.85) * scale),
      hinchadaDelta: 3,
      note: fuerte.note,
      risk: rand.float(0.08, 0.2),
    });
  }

  const barato = rand.pick(ARQUETIPOS_LIBRE);
  const deltaBarato = rand.int(2, 5);
  offers.push({
    kind: 'libre',
    name: nombreDe(indice++, apellidosUsados),
    archetype: barato.archetype,
    age: rand.int(30, 36),
    plantelDelta: deltaBarato,
    cost: round1(deltaBarato * rand.float(0.1, 0.25) * scale),
    hinchadaDelta: barato.archetype === 'veterano de retorno' ? 6 : 0,
    note: barato.note,
    risk: rand.float(0.25, 0.45),
  });

  for (let i = 0; i < 2; i++) {
    const venta = rand.pick(ARQUETIPOS_VENTA);
    const deltaVenta = rand.int(7, 13);
    const edad = rand.int(venta.edad[0], venta.edad[1]);
    const primaJuventud = edad < 22 ? 1.25 : edad < 28 ? 1 : 0.75;
    offers.push({
      kind: 'venta',
      name: nombreDe(indice++, apellidosUsados),
      archetype: venta.archetype,
      age: edad,
      plantelDelta: -deltaVenta,
      cost: -round1(deltaVenta * rand.float(1, 1.6) * primaJuventud * scale),
      hinchadaDelta: -rand.int(9, 16),
      note: venta.note,
      risk: 0,
    });
  }

  if (rand.chance(CHANCE_MOVIMIENTO_EXTRA)) {
    if (rand.chance(0.5)) {
      const prestamo = rand.pick(ARQUETIPOS_PRESTAMO);
      const deltaPrestamo = rand.int(4, 8);
      offers.push({
        kind: 'prestamo',
        name: nombreDe(indice++, apellidosUsados),
        archetype: prestamo.archetype,
        age: rand.int(19, 27),
        plantelDelta: deltaPrestamo,
        cost: round1(deltaPrestamo * rand.float(0.15, 0.3) * scale),
        hinchadaDelta: 1,
        note: prestamo.note,
        risk: rand.float(0.2, 0.4),
      });
    } else {
      const cesion = rand.pick(ARQUETIPOS_CESION);
      const deltaCesion = rand.int(3, 7);
      const edad = rand.int(cesion.edad[0], cesion.edad[1]);
      offers.push({
        kind: 'cesion',
        name: nombreDe(indice++, apellidosUsados),
        archetype: cesion.archetype,
        age: edad,
        plantelDelta: -deltaCesion,
        cost: -round1(deltaCesion * rand.float(0.05, 0.15) * scale),
        hinchadaDelta: -rand.int(2, 5),
        note: cesion.note,
        risk: 0,
      });
    }
  }

  return rand.shuffle(offers);
}
