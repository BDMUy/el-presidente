/**
 * Plata: sponsors, televisión, entradas, deuda, merchandising.
 *
 * Es el frente donde casi siempre existe la opción de resolver hoy pagando
 * mañana. Varias de estas cartas usan efectos diferidos justamente para eso:
 * la decisión se toma en la temporada 3 y la factura llega en la 6, cuando ya
 * te olvidaste de que la firmaste.
 */

import type { GameEvent } from '@/lib/engine/types';

export const ECONOMIA: GameEvent[] = [
  {
    id: 'eco-adelanto-tv',
    kind: 'dilema',
    title: 'ADELANTO DE TELEVISIÓN',
    text: 'Ofrecen adelantarte tres años de derechos de TV en un solo pago. Es una montaña de plata hoy y tres temporadas cobrando cero.',
    weight: 2,
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Tomar el adelanto',
        hint: 'Entra todo junto. Las próximas tres temporadas vas a extrañarlo.',
        effects: {
          caja: 9,
          deferred: [
            { inSeasons: 2, text: 'Segunda temporada sin cobrar TV: ya se siente.', effects: { caja: -4 } },
            { inSeasons: 3, text: 'Tercera temporada sin TV. El adelanto se terminó de pagar solo.', effects: { caja: -4 } },
          ],
        },
      },
      {
        label: 'Cobrar como siempre',
        hint: 'Nada cambia. Que es exactamente el problema.',
        effects: { caja: 0.5, influencia: 3 },
      },
    ],
  },
  {
    id: 'eco-camiseta-record',
    kind: 'color',
    title: 'SE AGOTÓ LA CAMISETA',
    text: 'La camiseta nueva se agotó en cuarenta y ocho horas. El proveedor pregunta si duplicamos la producción.',
    requires: { minHinchada: 55 },
    options: [
      {
        label: 'Duplicar el pedido',
        hint: '🎲 Si el envión sigue, es plata. Si se corta, quedás con depósito lleno.',
        random: [
          { weight: 60, text: 'Se vendió todo otra vez. El merchandising salvó el trimestre.', effects: { caja: 2.5, socios: 2 } },
          { weight: 40, text: 'Se cortó el envión y quedaron ocho mil camisetas en el depósito.', effects: { caja: -1.5 } },
        ],
      },
      {
        label: 'Mantener la producción',
        hint: 'Se agota rápido y la gente se queda con ganas. No es lo peor.',
        effects: { caja: 1, hinchada: 2 },
      },
    ],
  },
  {
    id: 'eco-palcos',
    kind: 'dilema',
    title: 'PALCOS VIP',
    text: 'Una consultora propone convertir el sector central de la platea en palcos corporativos. Son mil socios menos y mucha plata más.',
    requires: { minSeason: 3, category: ['primera'] },
    options: [
      {
        label: 'Construirlos',
        hint: 'Ingreso alto y estable. Mil familias pierden su lugar de siempre.',
        effects: { caja: -3, socios: -4, hinchada: -9, deferred: [{ inSeasons: 2, text: 'Los palcos están llenos todos los domingos. La caja lo agradece.', effects: { caja: 5 } }] },
      },
      {
        label: 'No tocar la platea',
        hint: 'La platea sigue siendo de los socios. Y el presupuesto sigue corto.',
        effects: { hinchada: 6, influencia: 3 },
      },
      {
        label: 'Palcos, pero en la cabecera vacía',
        hint: 'Menos plata, ningún socio desalojado. Cuesta más obra.',
        effects: { caja: -5, deferred: [{ inSeasons: 3, text: 'Los palcos de la cabecera funcionan. Nadie tuvo que mudarse.', effects: { caja: 4, socios: 1 } }] },
      },
    ],
  },
  {
    id: 'eco-deuda-jugadores',
    kind: 'golpe',
    title: 'RECLAMO EN LA FIFA',
    text: 'Tres jugadores que se fueron hace dos años reclamaron ante la FIFA por sueldos impagos. Si no arreglás, viene la inhibición.',
    requires: { minSeason: 3, maxCaja: 8 },
    weight: 2,
    options: [
      {
        label: 'Arreglar y pagar',
        hint: 'Duele la caja, pero el club puede seguir fichando.',
        effects: { caja: -5, influencia: 3 },
      },
      {
        label: 'Estirar el expediente',
        hint: 'Ganás tiempo. La inhibición te espera a la vuelta.',
        effects: {
          influencia: -5,
          deferred: [{ inSeasons: 2, text: 'Llegó la inhibición por el reclamo que no arreglaste. No se puede fichar.', effects: { caja: -8, hinchada: -6 } }],
        },
      },
      {
        label: 'Pedirle a un socio mecenas que lo cubra',
        hint: '🎲 Si aparece, zafás gratis. Si no, perdiste la ventana.',
        random: [
          { weight: 45, text: 'Un socio empresario puso la plata sin pedir nada. Por ahora.', effects: { caja: -0.5, influencia: -6 } },
          { weight: 55, text: 'Nadie puso un peso y el plazo venció igual.', effects: { caja: -6, hinchada: -5 } },
        ],
      },
    ],
  },
  {
    id: 'eco-sponsor-se-va',
    kind: 'golpe',
    title: 'SE VA EL SPONSOR PRINCIPAL',
    text: 'La empresa que estaba en el frente de la camiseta desde hace seis años no renueva. Se enteraron por un comunicado.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Salir a buscar reemplazo ya',
        hint: '🎲 A las apuradas se consigue menos.',
        random: [
          { weight: 50, text: 'Apareció uno del rubro alimenticio. Paga menos, pero paga.', effects: { caja: 2 } },
          { weight: 50, text: 'No apareció nadie a tiempo. Se arranca el torneo con el frente vacío.', effects: { caja: -2, hinchada: -4 } },
        ],
      },
      {
        label: 'Bajar el precio para retenerlo',
        hint: 'Se queda, pero pagando bastante menos que antes.',
        effects: { caja: 1.5, influencia: -3 },
      },
      {
        label: 'Vender el frente a una marca del barrio',
        hint: 'Poca plata y mucha identidad. La gente lo festeja.',
        effects: { caja: 0.8, hinchada: 8, socios: 2 },
      },
    ],
  },
  {
    id: 'eco-cancha-alquilada',
    kind: 'dilema',
    title: 'ALQUILAR EL ESTADIO',
    text: 'Una productora quiere el estadio para tres recitales en pleno torneo. El campo de juego queda hecho un desastre.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Aceptar los tres',
        hint: 'Mucha plata. El equipo juega dos meses sobre un potrero.',
        effects: { caja: 5, plantel: -4, hinchada: -3 },
      },
      {
        label: 'Aceptar uno solo',
        hint: 'La mitad de la plata y la mitad del daño.',
        effects: { caja: 2.5, plantel: -1 },
      },
      {
        label: 'Rechazar',
        hint: 'El césped impecable no paga sueldos.',
        effects: { plantel: 2, influencia: 2 },
      },
    ],
  },
  {
    id: 'eco-fideicomiso',
    kind: 'dilema',
    title: 'EL FIDEICOMISO',
    text: 'Un estudio propone armar un fideicomiso con los derechos federativos de las inferiores. Plata ahora contra un porcentaje de todo lo que salga.',
    requires: { minSeason: 4 },
    options: [
      {
        label: 'Firmarlo',
        hint: 'Entra plata ya. Cada pibe que salga vale la mitad.',
        effects: {
          caja: 8,
          flags: { fideicomiso: true },
          deferred: [{ inSeasons: 4, text: 'El fideicomiso se llevó la mitad de la venta del pibe que salió campeón con vos.', effects: { caja: -6, hinchada: -8 } }],
        },
      },
      {
        label: 'No firmar',
        hint: 'El club se queda con todo lo suyo. Y sin plata hoy.',
        effects: { influencia: 4, hinchada: 3 },
      },
    ],
  },
  {
    id: 'eco-cuota-plus',
    kind: 'dilema',
    title: 'LA CUOTA PLUS',
    text: 'Marketing propone una categoría de socio premium: paga el triple y entra siempre, aunque la cancha esté llena.',
    requires: { minSeason: 3 },
    options: [
      {
        label: 'Lanzarla',
        hint: 'Ingreso fuerte. La popular va a decir que se vende el club.',
        effects: { caja: 3.5, socios: 3, hinchada: -8 },
      },
      {
        label: 'Lanzarla sin prioridad de entrada',
        hint: 'Solo beneficios simbólicos. Menos plata, cero conflicto.',
        effects: { caja: 1.2, socios: 1 },
      },
      {
        label: 'Descartarla',
        hint: 'Un socio es un socio. Punto.',
        effects: { hinchada: 5 },
      },
    ],
  },
  {
    id: 'eco-devaluacion',
    kind: 'golpe',
    title: 'SE DISPARÓ EL DÓLAR',
    text: 'Amaneció con una devaluación del cuarenta por ciento. Los contratos de los extranjeros están en dólares. Los ingresos, no.',
    requires: { minSeason: 2 },
    weight: 2,
    options: [
      {
        label: 'Renegociar contratos uno por uno',
        hint: 'Se salva plata. El vestuario se entera de todo.',
        effects: { caja: 2, plantel: -3, influencia: -3 },
      },
      {
        label: 'Bancar los contratos como están',
        hint: 'El plantel te lo agradece. La caja lo sufre.',
        effects: { caja: -4, plantel: 3, hinchada: 2 },
      },
      {
        label: 'Vender un extranjero al exterior',
        hint: 'Cobrás en dólares y te sacás un sueldo de encima.',
        effects: { caja: 5, plantel: -5, hinchada: -4 },
      },
    ],
  },
  {
    id: 'eco-museo',
    kind: 'color',
    title: 'EL MUSEO DEL CLUB',
    text: 'Un grupo de socios historiadores armó, gratis, un museo con camisetas y copas viejas. Piden un salón y una llave.',
    requires: { minSeason: 3 },
    options: [
      {
        label: 'Darles el salón',
        hint: 'Cuesta casi nada y toca una fibra.',
        effects: { caja: -0.3, hinchada: 6, socios: 1 },
      },
      {
        label: 'Ofrecerles un pasillo',
        hint: 'La respuesta burocrática. Nadie se enoja, nadie se emociona.',
        effects: { hinchada: -1 },
      },
    ],
  },
  {
    id: 'eco-hotel-concentracion',
    kind: 'dilema',
    title: 'HOTEL DE CONCENTRACIÓN',
    text: 'El predio no tiene dónde concentrar y se paga hotel todas las fechas. Construir habitaciones sale caro una sola vez.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Construirlas',
        hint: 'Inversión grande. Se paga sola en unas temporadas.',
        effects: { caja: -4, deferred: [{ inSeasons: 3, text: 'Las habitaciones del predio están listas: se terminó el gasto de hotel.', effects: { caja: 2.5, plantel: 3 } }] },
      },
      {
        label: 'Seguir con el hotel',
        hint: 'Sale caro todos los meses, para siempre.',
        effects: { caja: -1 },
      },
    ],
  },
  {
    id: 'eco-cheque-voladores',
    kind: 'golpe',
    title: 'CHEQUES SIN FONDOS',
    text: 'Rebotaron dos cheques del club. El tesorero jura que fue un error de la cuenta. La noticia ya está en la radio.',
    requires: { maxCaja: 4, minSeason: 3 },
    options: [
      {
        label: 'Cubrirlos de urgencia',
        hint: 'Se tapa antes de que crezca.',
        effects: { caja: -2.5, influencia: -2 },
      },
      {
        label: 'Echar al tesorero',
        hint: 'Alguien tiene que pagarla. La deuda igual queda.',
        effects: { caja: -1.5, influencia: -6, hinchada: 3 },
      },
      {
        label: 'Salir a explicar que fue un error bancario',
        hint: '🎲 Si te creen, no pasa nada.',
        random: [
          { weight: 45, text: 'Se lo comieron. Al día siguiente ya nadie hablaba del tema.', effects: { influencia: 2 } },
          { weight: 55, text: 'Nadie te creyó y la palabra "vaciamiento" apareció en un titular.', effects: { hinchada: -9, influencia: -8 } },
        ],
      },
    ],
  },
];
