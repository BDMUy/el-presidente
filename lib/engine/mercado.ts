/**
 * Mercado de pases: tres cartas por temporada.
 *
 * Los jugadores son 100% ficticios y se generan proceduralmente. Eso evita
 * depender de datos reales que envejecen y deja el contenido del juego
 * enteramente bajo control.
 */

import { Rand } from './rng';
import type { Category, PlayerOffer } from './types';

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
  { archetype: 'la joya del club', note: 'Salió de la pensión. La tribuna canta su nombre.' },
  { archetype: 'el goleador', note: 'Mete la mitad de los goles del equipo.' },
  { archetype: 'el capitán', note: 'Lleva la cinta desde hace cuatro años.' },
];

/** Escala de precios por categoría, en millones. */
const PRICE_SCALE: Record<Category, number> = { primera: 1, nacional: 0.35, b: 0.15 };

function nombre(rand: Rand): string {
  return `${rand.pick(NOMBRES)} ${rand.pick(APELLIDOS)}`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Genera las tres ofertas de la ventana de pases.
 *
 * Siempre hay al menos una venta disponible cuando el plantel es bueno: la
 * tentación de vender al ídolo tiene que estar sobre la mesa, porque es el
 * dilema central del rol.
 */
export function generateOffers(
  category: Category,
  plantel: number,
  rand: Rand,
): PlayerOffer[] {
  const scale = PRICE_SCALE[category];
  const offers: PlayerOffer[] = [];

  // Una compra fuerte: cara, pero mueve la aguja.
  const fuerte = rand.pick(ARQUETIPOS_COMPRA);
  const deltaFuerte = rand.int(6, 11);
  offers.push({
    kind: 'compra',
    name: nombre(rand),
    archetype: fuerte.archetype,
    age: rand.int(23, 29),
    plantelDelta: deltaFuerte,
    cost: round1(deltaFuerte * rand.float(0.55, 0.85) * scale),
    hinchadaDelta: 3,
    note: fuerte.note,
    risk: rand.float(0.08, 0.2),
  });

  // Un libre o una apuesta barata.
  const barato = rand.pick(ARQUETIPOS_LIBRE);
  const deltaBarato = rand.int(2, 5);
  offers.push({
    kind: 'libre',
    name: nombre(rand),
    archetype: barato.archetype,
    age: rand.int(30, 36),
    plantelDelta: deltaBarato,
    cost: round1(deltaBarato * rand.float(0.1, 0.25) * scale),
    hinchadaDelta: barato.archetype === 'veterano de retorno' ? 6 : 0,
    note: barato.note,
    risk: rand.float(0.25, 0.45),
  });

  // La venta: entra plata, se cae el plantel y la gente te lo cobra.
  const venta = rand.pick(ARQUETIPOS_VENTA);
  const deltaVenta = rand.int(7, 13);
  offers.push({
    kind: 'venta',
    name: nombre(rand),
    archetype: venta.archetype,
    age: rand.int(19, 24),
    plantelDelta: -deltaVenta,
    cost: -round1(deltaVenta * rand.float(1.1, 1.9) * scale),
    hinchadaDelta: -rand.int(9, 16),
    note: venta.note,
    risk: 0,
  });

  return rand.shuffle(offers);
}

/** Texto de la consecuencia que se muestra en la carta antes de elegir. */
export function offerHint(offer: PlayerOffer): string {
  const plata =
    offer.cost > 0
      ? `−US$ ${offer.cost}M`
      : offer.cost < 0
        ? `+US$ ${Math.abs(offer.cost)}M`
        : 'gratis';
  const plantel = offer.plantelDelta >= 0 ? `+${offer.plantelDelta}` : `${offer.plantelDelta}`;
  const gente =
    offer.hinchadaDelta > 0
      ? `, la gente lo festeja`
      : offer.hinchadaDelta < 0
        ? `, la gente te lo va a cobrar`
        : '';
  return `${plata} · plantel ${plantel}${gente}`;
}
