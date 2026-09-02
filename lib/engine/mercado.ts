import { CRACKS } from '@/content/parodias';
import { APELLIDOS, NOMBRES } from '@/content/nombres';
import { Rand, seedFromString } from './rng';
import type { Country, LeagueId, PlayerOffer } from './types';
import { countryOf } from './types';

const CHANCE_CRACK = 0.35;

const CHANCE_MOVIMIENTO_EXTRA = 0.5;

const ARQUETIPOS_COMPRA = [
  '9 de área',
  'volante central',
  'enganche zurdo',
  'lateral que pasa',
  'central de jerarquía',
  'extremo desequilibrante',
  'arquero de copa',
  'media punta que camina el partido y aparece en el 81',
  'central veterano que ya no gira pero coloca',
  'lateral de proyección que no sabe marcar',
  'doble cinco de marca y relevo',
  'segundo punta que la baja y asiste',
  'carrilero que solo va para adelante',
  'líbero que sale jugando limpio',
  'volante mixto que llega siempre al área rival',
  'nueve de relevo que aguanta de espaldas y descarga',
  'arquero joven de reflejo rápido y pies flojos',
  'cinco de contención que reparte corto y no arriesga',
  'goleador de área chica, cero despliegue',
  'zaguero brusco, siempre al borde de la amarilla',
];

const ARQUETIPOS_LIBRE = [
  'veterano de retorno',
  'libre del ascenso',
  'campeón en decadencia',
  'rescindido de un grande',
  'ex juvenil de selección que nunca terminó de explotar',
  'volante que volvió de afuera sin ritmo',
  'delantero que estuvo un año parado por una lesión',
  'lateral libre que pide poco y cumple',
  'arquero suplente eterno con ganas de atajar',
  'mediocampista que colgó los botines y se arrepintió',
];

const ARQUETIPOS_VENTA = [
  { archetype: 'la joya del club', edad: [17, 21] },
  { archetype: 'el goleador', edad: [23, 30] },
  { archetype: 'el capitán', edad: [28, 34] },
  { archetype: 'el juvenil que piden de afuera', edad: [18, 21] },
  { archetype: 'el volante que sostiene el equipo', edad: [24, 30] },
  { archetype: 'el lateral que mira Europa', edad: [19, 23] },
  { archetype: 'el goleador veterano que todavía la mete', edad: [30, 35] },
  { archetype: 'el zaguero titular indiscutido', edad: [25, 31] },
  { archetype: 'el enganche que la rompe hace un año', edad: [20, 24] },
  { archetype: 'el arquero que ataja todo', edad: [26, 32] },
] as const;

const ARQUETIPOS_PRESTAMO = [
  'suplente que no juega en su club',
  'juvenil a préstamo con opción',
  'recambio de una liga grande',
  'figura de un grande que perdió el puesto',
  'delantero que necesita minutos para el Preolímpico',
  'central que vuelve de una lesión larga',
  'volante prestado por un club hermano',
  'wing que un grande cede para que sume ritmo',
];

const ARQUETIPOS_CESION = [
  { archetype: 'juvenil que no suma minutos', edad: [18, 22] },
  { archetype: 'suplente que pide salir', edad: [22, 28] },
  { archetype: 'tercer arquero que quiere atajar en algún lado', edad: [20, 26] },
  { archetype: 'lateral relegado por el refuerzo', edad: [23, 29] },
  { archetype: 'juvenil de la última camada sin lugar', edad: [17, 20] },
  { archetype: 'volante que quedó afuera de la lista', edad: [24, 30] },
] as const;

const NOTAS_COMPRA = [
  'No baja a buscarla, pero adentro no perdona.',
  'Corre por dos. Tarjeta fácil.',
  'Un pase cada quince minutos que te gana el partido.',
  'Va y viene toda la cancha. Defender no es lo suyo.',
  'Habla adentro de la cancha. Eso vale.',
  'Uno contra uno, siempre encara. A veces sale.',
  'Ataja un penal por serie. Después, veremos.',
  'Se rompió dos veces en tres años. El precio lo dice.',
  'El representante ya habló con tres clubes más.',
  'Tiene contrato hasta junio. Después se va libre.',
  'Rinde de local. De visitante desaparece.',
  'Trece goles la temporada pasada, casi todos de penal.',
  'Cae bien en el vestuario. En la cancha, a veces.',
  'Viene de jugar poco. Tres meses para agarrar ritmo.',
  'Pide ficha de titular y jugar siempre.',
  'Lo miran de la primera de un grande. Ahora o nunca.',
  'Aguanta los noventa minutos. Físico no le falta.',
  'Firma ya si le arreglás el pase con su club.',
];

const NOTAS_LIBRE = [
  'Vuelve al club donde debutó. La gente lo va a amar.',
  'Nadie lo conoce. Su representante insiste mucho.',
  'Ganó todo hace seis años. Las piernas se acuerdan a veces.',
  'Sin club desde diciembre. Entrena solo.',
  'Pide contrato por un año y premio por objetivos.',
  'A esta altura juega por poca plata y revancha.',
  'Llega entero. Jugó todo el año en el ascenso.',
  'Hace seis meses que no compite. Va a costar ponerlo.',
  'El grupo lo conoce. Adentro no va a haber problema.',
  'Tiene 34 y otra temporada en las piernas, dice él.',
  'Su último club lo dejó libre para bajar el sueldo.',
  'No pide plata de entrada. Todo a fin de año.',
];

const NOTAS_VENTA = [
  'Salió de la pensión. La tribuna canta su nombre.',
  'Mete la mitad de los goles del equipo.',
  'Lleva la cinta desde hace cuatro años.',
  'La oferta llega de afuera y paga en dólares.',
  'Tiene cláusula y la van a pagar completa.',
  'Pidió salir. Si se queda, juega de mala gana.',
  'El club necesita la plata más que al jugador.',
  'Renueva o se va libre en seis meses. Definí ahora.',
  'La hinchada se va a enojar, pero el número cierra.',
  'Lo quiere un rival directo. Eso pesa.',
  'Es la venta que salva el balance del año.',
  'Rinde hace un año largo. El precio no va a subir más.',
];

const NOTAS_PRESTAMO = [
  'Viene a sumar minutos. Si explota, después se habla la compra.',
  'Lo mandan a foguearse un año. El dueño mira de afuera.',
  'Baja de categoría por una temporada. Trae roce que acá no sobra.',
  'El club de origen paga parte del sueldo.',
  'Un año sin cargo y con opción de compra.',
  'Si juega veinte partidos, la compra se hace obligatoria.',
  'Viene por seis meses. Después se vuelve a hablar.',
  'Lo cede un grande para que no pierda ritmo.',
  'Sin opción de compra. Un año y vuelve a su club.',
  'Llega con lo justo de pretemporada. Metelo de a poco.',
];

const NOTAS_CESION = [
  'Se va a préstamo a foguearse. Vuelve con roce o no vuelve mejor.',
  'No entra en los planes de esta temporada. Un préstamo destraba todo.',
  'Se va sin cargo. Le seguimos pagando parte del sueldo.',
  'Un año afuera y vuelve. O lo compran, si les sirve.',
  'Libera un cupo y baja la masa salarial.',
  'Pidió jugar. Acá no lo iba a hacer.',
  'Vuelve en diciembre, salvo que ejerzan la opción.',
  'Mejor que sume minutos afuera y no que se oxide en el banco.',
];

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

function notaPorSemilla(
  pool: readonly string[],
  seed: number,
  season: number,
  slot: string,
): string {
  return pool[seedFromString(`${seed}:${season}:${slot}`) % pool.length];
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
    const archetype = rand.pick(ARQUETIPOS_COMPRA);
    const deltaFuerte = rand.int(6, 11);
    offers.push({
      kind: 'compra',
      name: nombreDe(indice++, apellidosUsados),
      archetype,
      age: rand.int(23, 29),
      plantelDelta: deltaFuerte,
      cost: round1(deltaFuerte * rand.float(0.55, 0.85) * scale),
      hinchadaDelta: 3,
      note: notaPorSemilla(NOTAS_COMPRA, seed, season, `compra-${i}`),
      risk: rand.float(0.08, 0.2),
    });
  }

  const barato = rand.pick(ARQUETIPOS_LIBRE);
  const deltaBarato = rand.int(2, 5);
  offers.push({
    kind: 'libre',
    name: nombreDe(indice++, apellidosUsados),
    archetype: barato,
    age: rand.int(30, 36),
    plantelDelta: deltaBarato,
    cost: round1(deltaBarato * rand.float(0.1, 0.25) * scale),
    hinchadaDelta: barato === 'veterano de retorno' ? 6 : 0,
    note: notaPorSemilla(NOTAS_LIBRE, seed, season, 'libre'),
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
      note: notaPorSemilla(NOTAS_VENTA, seed, season, `venta-${i}`),
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
        archetype: prestamo,
        age: rand.int(19, 27),
        plantelDelta: deltaPrestamo,
        cost: round1(deltaPrestamo * rand.float(0.15, 0.3) * scale),
        hinchadaDelta: 1,
        note: notaPorSemilla(NOTAS_PRESTAMO, seed, season, 'prestamo'),
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
        note: notaPorSemilla(NOTAS_CESION, seed, season, 'cesion'),
        risk: 0,
      });
    }
  }

  return rand.shuffle(offers);
}
