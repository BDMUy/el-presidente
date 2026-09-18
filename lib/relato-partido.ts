import { Rand, seedFromString } from '@/lib/engine/rng';

// El motor decide si se gana o se pierde. Esto es el relato de ese resultado,
// no una simulación: se deriva de la misma semilla, nunca lo contradice y no
// nombra jugadores, porque el estado no tiene plantel con nombres.

export type TipoHito = 'gol-propio' | 'gol-rival' | 'aviso';

export interface Hito {
  minuto: number;
  tipo: TipoHito;
  texto: string;
  decisivo: boolean;
}

export interface RelatoPartido {
  propios: number;
  rival: number;
  hitos: Hito[];
}

const GOLES_PROPIOS = [
  'Centro llovido y cabezazo abajo.',
  'Contra de tres pases y definición cruzada.',
  'Rebote en la puerta del área y zurdazo.',
  'Penal, y el que patea no mira al arquero.',
  'Tiro libre al ángulo, de los que se cuentan.',
  'Pelota parada, segundo palo, gol.',
];

const GOLES_RIVAL = [
  'Error en la salida y no perdonaron.',
  'Córner, desvío y adentro.',
  'Contragolpe en el peor momento.',
  'Penal dudoso que el árbitro cobra igual.',
  'Pelotazo largo y espalda de los centrales.',
];

const AVISOS = [
  'Amarilla que deja al equipo jugando con cuidado.',
  'Palo del arquero rival y la gente se agarra la cabeza.',
  'Entra el pibe de la reserva y cambia el ritmo.',
  'El banco pide calma con las dos manos.',
  'Se frena el partido: viene la bandera del córner.',
];

export function relatoDePartido({
  won,
  clave,
}: {
  won: boolean;
  clave: string;
}): RelatoPartido {
  const rand = new Rand(seedFromString(clave));

  const propios = won ? rand.int(1, 3) : rand.int(0, 1);
  const rival = won ? rand.int(0, propios - 1) : propios + rand.int(1, 2);

  const minutos = rand
    .shuffle(Array.from({ length: 9 }, (_, i) => 8 + i * 10 + rand.int(0, 6)))
    .slice(0, propios + rival + rand.int(1, 2))
    .sort((a, b) => a - b);

  const pendientes = { propio: propios, rival };
  const hitos: Hito[] = minutos.map((minuto) => {
    const restantes = pendientes.propio + pendientes.rival;
    const hayLugar = restantes > 0;
    const tocaPropio = hayLugar && rand.chance(pendientes.propio / Math.max(1, restantes));

    if (hayLugar && tocaPropio) {
      pendientes.propio--;
      return { minuto, tipo: 'gol-propio', texto: rand.pick(GOLES_PROPIOS), decisivo: false };
    }
    if (hayLugar) {
      pendientes.rival--;
      return { minuto, tipo: 'gol-rival', texto: rand.pick(GOLES_RIVAL), decisivo: false };
    }
    return { minuto, tipo: 'aviso', texto: rand.pick(AVISOS), decisivo: false };
  });

  const golesFaltantes = pendientes.propio + pendientes.rival;
  for (let i = 0; i < golesFaltantes; i++) {
    const tipo: TipoHito = pendientes.propio > 0 ? 'gol-propio' : 'gol-rival';
    if (tipo === 'gol-propio') pendientes.propio--;
    else pendientes.rival--;
    hitos.push({
      minuto: 80 + i * 4 + rand.int(0, 3),
      tipo,
      texto: tipo === 'gol-propio' ? rand.pick(GOLES_PROPIOS) : rand.pick(GOLES_RIVAL),
      decisivo: false,
    });
  }
  hitos.sort((a, b) => a.minuto - b.minuto);

  const decisivo = [...hitos]
    .reverse()
    .find((h) => h.tipo === (won ? 'gol-propio' : 'gol-rival'));
  if (decisivo) decisivo.decisivo = true;

  return { propios, rival, hitos };
}
