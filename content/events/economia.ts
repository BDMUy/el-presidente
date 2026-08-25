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
        hint: 'Si el envión sigue, es plata. Si se corta, quedás con depósito lleno.',
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
    requires: { minSeason: 3, league: ['ar-primera', 'uy-primera', 'pe-primera', 'co-primera', 'cl-primera'] },
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
        hint: 'Si aparece, zafás gratis. Si no, perdiste la ventana.',
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
        hint: 'A las apuradas se consigue menos.',
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
    requires: { minSeason: 2, country: ['argentina'] },
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
    id: 'eco-crisis-vecina',
    kind: 'golpe',
    title: 'SE FRENÓ EL CRUCE',
    text: 'La devaluación del lado argentino paró en seco el turismo de compras. El free shop que te puso el nombre en la camiseta pide renegociar a la baja, o se va.',
    requires: { minSeason: 2, country: ['uruguay'] },
    weight: 2,
    options: [
      {
        label: 'Aceptar la rebaja',
        hint: 'Se cobra menos, pero se sigue cobrando.',
        effects: { caja: -2.5 },
      },
      {
        label: 'Rescindirle y salir a buscar otro',
        hint: 'Unos meses sin nadie en el pecho. Y sin esa plata tampoco.',
        effects: { caja: -4, influencia: 2 },
      },
      {
        label: 'Buscar uno que le apueste al mercado local, no al turista',
        hint: 'Menos plata que antes, pero no depende de lo que pase del otro lado del río.',
        effects: { caja: -1.5, hinchada: -2 },
      },
    ],
  },
  {
    id: 'eco-guerra-tv',
    kind: 'golpe',
    title: 'GUERRA DE SEÑALES',
    text: 'El canal que tiene los derechos del torneo entra en conflicto con el que se los quiere quedar. Nadie sabe todavía en qué pantalla se ve el partido del domingo, y el cheque de este mes se retrasa.',
    requires: { minSeason: 2, country: ['peru'] },
    weight: 2,
    options: [
      {
        label: 'Aceptar cobrar menos hasta que se resuelva',
        hint: 'Una fracción de lo pactado, hasta que el lío se destrabe.',
        effects: { caja: -2.5 },
      },
      {
        label: 'Armar una señal propia por streaming',
        hint: 'Cuesta ponerla en pie. Después no depende de nadie más.',
        effects: { caja: -1.5, influencia: 2 },
      },
      {
        label: 'Presionar junto al resto de los clubes',
        hint: 'Juntos pesan más. El conflicto se estira igual un tiempo.',
        effects: {
          influencia: -3,
          hinchada: -1,
          deferred: [{ inSeasons: 1, text: 'El conflicto se resolvió y volvió la señal. Cobraste lo que te debían.', effects: { caja: 3 } }],
        },
      },
    ],
  },
  {
    id: 'eco-oferta-ficha',
    kind: 'golpe',
    title: 'QUIEREN LA FICHA',
    text: 'Un grupo inversor de otra ciudad ofrece comprar la ficha del club para trasladarla. Pasa seguido acá: la plata alcanza para salir de todos los problemas.',
    requires: { minSeason: 2, country: ['colombia'] },
    weight: 2,
    options: [
      {
        label: 'Escuchar la oferta y negociar',
        hint: 'Entra plata fuerte. La hinchada se entera y no lo toma bien.',
        effects: { caja: 5, hinchada: -12, influencia: -3 },
      },
      {
        label: 'Rechazarla de plano',
        hint: 'La gente respira. La ficha, sin comprador, vale menos si algún día hace falta venderla.',
        effects: { hinchada: 8, influencia: 2 },
      },
      {
        label: 'Usarla de amenaza para pedir ayuda a la alcaldía',
        hint: 'Juego de café con leche. A veces sale bien.',
        random: [
          { weight: 50, text: 'La alcaldía aportó para retenerlos. Se salvó el nombre y entró algo de plata.', effects: { caja: 2, influencia: 3 } },
          { weight: 50, text: 'La alcaldía no mordió el anzuelo. Quedaste pidiendo en público y sin nada.', effects: { influencia: -6, hinchada: -4 } },
        ],
      },
    ],
  },
  {
    id: 'eco-opa-bolsa',
    kind: 'golpe',
    title: 'ENTRÓ UN FONDO A LA BOLSA',
    text: 'La sociedad anónima que controla al club cotiza en bolsa, y un fondo de inversión empezó a comprar en silencio. Ya juntó más del cinco por ciento y no da señales de parar.',
    requires: { minSeason: 2, country: ['chile'] },
    weight: 2,
    options: [
      {
        label: 'Salir a comprar acciones para blindarte',
        hint: 'Cuesta caja. El control del directorio sigue siendo tuyo.',
        effects: { caja: -3, influencia: 4 },
      },
      {
        label: 'No hacer nada, la mayoría la tenés vos',
        hint: 'Ahorrás la plata. El fondo puede seguir comprando igual.',
        random: [
          { weight: 55, text: 'El fondo se cansó y vendió su posición con una diferencia menor. Todo sigue como estaba.', effects: { influencia: 2 } },
          { weight: 45, text: 'El fondo juntó suficiente para pedir un directorio y ahora opina de todo.', effects: { influencia: -8, caja: 1 } },
        ],
      },
      {
        label: 'Ofrecerle un lugar en el directorio antes de que lo pida',
        hint: 'Cede poder a cambio de tenerlo de tu lado.',
        effects: { influencia: -5, caja: 2 },
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
        hint: 'Si te creen, no pasa nada.',
        random: [
          { weight: 45, text: 'Se lo comieron. Al día siguiente ya nadie hablaba del tema.', effects: { influencia: 2 } },
          { weight: 55, text: 'Nadie te creyó y la palabra "vaciamiento" apareció en un titular.', effects: { hinchada: -9, influencia: -8 } },
        ],
      },
    ],
  },
  {
    id: 'eco-luz-impaga',
    kind: 'golpe',
    title: 'LA FACTURA DE LA LUZ',
    text: 'Tres meses sin pagar la luz del predio y del estadio. Mandaron el aviso de corte. El partido del domingo es a las nueve de la noche.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Pagar todo de una',
        hint: 'Duele en la caja y se termina el problema.',
        effects: { caja: -1.9 },
      },
      {
        label: 'Pedir un plan de pagos',
        hint: 'Menos ahora, más después y con interés.',
        effects: {
          caja: -0.6,
          deferred: [
            {
              inSeasons: 2,
              text: 'Vencieron las cuotas del plan de la luz, con intereses.',
              effects: { caja: -1.8 },
            },
          ],
        },
      },
      {
        label: 'Mover el partido a la tarde',
        hint: 'Menos gente, menos recaudación, menos vergüenza.',
        effects: { caja: -0.4, hinchada: -4 },
      },
    ],
  },
  {
    id: 'eco-la-marca-manda',
    kind: 'dilema',
    title: 'LA MARCA QUIERE MANDAR',
    text: 'La marca de indumentaria renueva, pero pide elegir el diseño de la camiseta sin consultar. Dicen que saben lo que se vende.',
    options: [
      {
        label: 'Firmar igual',
        hint: 'Entra plata. Sale una camiseta que no elegiste.',
        effects: { caja: 3.4, hinchada: -6 },
      },
      {
        label: 'Exigir tener la última palabra',
        hint: 'Menos plata, la camiseta de siempre.',
        effects: { caja: 1.6, hinchada: 4 },
      },
      {
        label: 'Buscar otra marca',
        hint: 'Una temporada sin sponsor de indumentaria mientras negociás.',
        random: [
          { weight: 45, text: 'Apareció una marca chica que te dejó hacer todo a tu manera, y la camiseta fue un éxito.', effects: { caja: 2.2, hinchada: 8, socios: 2 } },
          { weight: 55, text: 'No apareció nadie mejor. Volviste a la misma marca con menos plata que antes.', effects: { caja: 0.8, hinchada: -3 } },
        ],
      },
    ],
  },
  {
    id: 'eco-juicio-viejo',
    kind: 'golpe',
    title: 'UN JUICIO DE HACE VEINTE AÑOS',
    text: 'Un jugador que pasó tres meses por el club en los noventa ganó un juicio laboral. Con intereses, la cifra es una locura para lo que fue.',
    requires: { minSeason: 3 },
    options: [
      {
        label: 'Pagar y cerrar el tema',
        hint: 'Un agujero grande, de una sola vez.',
        effects: { caja: -3.6 },
      },
      {
        label: 'Apelar',
        hint: 'Ganás tiempo. Los intereses no paran.',
        effects: {
          deferred: [
            {
              inSeasons: 2,
              text: 'Se cayó la apelación del juicio viejo. Con dos años más de intereses.',
              effects: { caja: -5.2, hinchada: -3 },
            },
          ],
        },
      },
      {
        label: 'Negociar una quita',
        hint: 'Cuesta influencia y algo de orgullo.',
        requires: { minInfluencia: 20 },
        effects: { caja: -2.1, influencia: -8 },
      },
    ],
  },
];
