/**
 * Eventos de vestuario: el DT, el plantel, las internas.
 *
 * Regla de escritura: ninguna opción es gratis y ninguna es obviamente
 * correcta. Si al leer las dos opciones ya sabés cuál conviene, la carta está
 * mal escrita.
 */

import type { GameEvent } from '@/lib/engine/types';

export const VESTUARIO: GameEvent[] = [
  {
    id: 'dt-crisis',
    kind: 'dilema',
    title: 'EL DT HACE AGUA',
    text: 'Cuatro fechas sin ganar y el vestuario ya no lo escucha. La prensa te pregunta todos los días si lo vas a echar.',
    weight: 2,
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Echarlo',
        hint: 'Pagás la indemnización y traés a otro. Reinicio total.',
        effects: { caja: -2.5, plantel: -3, hinchada: 4 },
      },
      {
        label: 'Bancarlo en público',
        hint: 'Si se recupera, sos un visionario. Si no, caés con él.',
        random: [
          { weight: 45, text: 'El equipo reaccionó. Salir a bancarlo fue lo que necesitaba.', effects: { plantel: 5, hinchada: 8, influencia: 6 } },
          { weight: 55, text: 'Siguió perdiendo. Ahora sos vos el que no tiene salida.', effects: { hinchada: -12, influencia: -8 } },
        ],
      },
    ],
  },
  {
    id: 'capitan-renovacion',
    kind: 'dilema',
    title: 'LA RENOVACIÓN DEL CAPITÁN',
    text: 'Tiene 34 años, le queda medio año de contrato y pide dos temporadas más con aumento. La tribuna lo adora. El cuerpo técnico dice que ya no llega.',
    options: [
      {
        label: 'Renovarlo',
        hint: 'La gente lo festeja. El plantel se envejece.',
        effects: { caja: -1.8, hinchada: 9, plantel: -2 },
      },
      {
        label: 'Dejarlo libre',
        hint: 'Decisión fría y correcta. Te la van a cobrar igual.',
        effects: { hinchada: -13, plantel: -1, caja: 0.5 },
      },
      {
        label: 'Ofrecerle un año y puesto de dirigente',
        hint: 'Cuesta influencia convencerlo, pero cierra bien.',
        requires: { minInfluencia: 25 },
        effects: { influencia: -12, hinchada: 5, caja: -0.6 },
      },
    ],
  },
  {
    id: 'pibe-inferiores',
    kind: 'dilema',
    title: 'EL PIBE DE INFERIORES',
    text: 'Tiene 17 y en reserva hace cosas que no se ven hace años. Un club de Europa ya preguntó. El DT no lo quiere subir todavía.',
    options: [
      {
        label: 'Que debute ya',
        hint: 'Si explota, es tuyo. Si se quema, lo quemaste vos.',
        random: [
          { weight: 55, text: 'Debutó y metió dos. El estadio coreó su nombre.', effects: { plantel: 6, hinchada: 12, caja: 0.5 } },
          { weight: 45, text: 'Se lo comió la presión. Volvió a reserva sin confianza.', effects: { plantel: -1, hinchada: -4 } },
        ],
      },
      {
        label: 'Venderlo ahora',
        hint: 'Plata fresca, y la gente nunca te lo perdona.',
        effects: { caja: 7, hinchada: -18, plantel: -2 },
      },
      {
        label: 'Dejarlo madurar',
        hint: 'Lo correcto. Aburrido, pero correcto.',
        effects: { plantel: 2, flags: { pibe_madurando: true } },
      },
    ],
  },
  {
    id: 'sueldos-atrasados',
    kind: 'golpe',
    title: 'DOS MESES SIN COBRAR',
    text: 'El plantel se enteró de que los sueldos vuelven a salir tarde. Hay reunión de capitanes y la palabra "paro" apareció en el grupo de WhatsApp.',
    requires: { maxCaja: 3 },
    weight: 2,
    options: [
      {
        label: 'Pagar como sea',
        hint: 'Te endeudás más, pero el vestuario queda tranquilo.',
        effects: { caja: -4, plantel: 2 },
      },
      {
        label: 'Pedirles que aguanten',
        hint: 'Ganás tiempo. El equipo juega como si no le importara.',
        effects: { plantel: -6, hinchada: -4 },
      },
      {
        label: 'Adelantar plata de un sponsor',
        hint: 'Si el sponsor acepta, zafás. Si no, se filtra todo.',
        random: [
          { weight: 60, text: 'El sponsor adelantó el año. Zafaste por poco.', effects: { caja: 3, influencia: -6 } },
          { weight: 40, text: 'El sponsor dijo que no y alguien filtró la charla. Papelón.', effects: { hinchada: -9, influencia: -8, plantel: -4 } },
        ],
      },
    ],
  },
  {
    id: 'interna-vestuario',
    kind: 'golpe',
    title: 'SE PELEARON EN LA PRÁCTICA',
    text: 'El nueve y el capitán se agarraron a piñas delante de todos. Hay video. Alguien lo va a vender.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Multar a los dos y cerrarlo puertas adentro',
        hint: 'Autoridad. El vestuario se ordena, la prensa igual se entera.',
        effects: { plantel: 1, hinchada: -3, influencia: 3 },
      },
      {
        label: 'Vender al nueve',
        hint: 'Entra plata, se va el goleador.',
        effects: { caja: 5, plantel: -7, hinchada: -6 },
      },
      {
        label: 'Hacer de cuenta que no pasó',
        hint: 'O se olvida, o el video sale el domingo.',
        random: [
          { weight: 50, text: 'No salió nunca. Alguien cobró por no publicarlo.', effects: { caja: -1, influencia: -4 } },
          { weight: 50, text: 'Salió en todos lados. Quedaron como una manga de improvisados.', effects: { hinchada: -10, plantel: -3, influencia: -6 } },
        ],
      },
    ],
  },
  {
    id: 'oferta-europa',
    kind: 'dilema',
    title: 'OFERTA DESDE EUROPA',
    text: 'Llegó una oferta formal por tu mejor jugador. Es mucha plata, es media temporada antes de tiempo, y estás peleando el campeonato.',
    requires: { minSeason: 2, minPlantel: 45 },
    weight: 2,
    options: [
      {
        label: 'Venderlo',
        hint: 'Salva el año económico. Se cae el equipo en el peor momento.',
        effects: { caja: 11, plantel: -9, hinchada: -15 },
      },
      {
        label: 'Rechazarla',
        hint: 'La gente te aplaude de pie. El jugador se va libre en un año.',
        effects: { hinchada: 14, deferred: [{ inSeasons: 2, text: 'Se fue libre, como estaba cantado. No entró un peso.', effects: { plantel: -8, caja: 0 } }] },
      },
      {
        label: 'Venderlo con recompra',
        hint: 'Menos plata ahora, y una carta para más adelante.',
        requires: { minInfluencia: 30 },
        effects: { caja: 7, plantel: -9, hinchada: -6, influencia: -8, flags: { recompra: true } },
      },
    ],
  },
  {
    id: 'lesion-grave',
    kind: 'golpe',
    title: 'SE ROMPIÓ LOS LIGAMENTOS',
    text: 'El mejor del equipo se agarró la rodilla solo, sin que nadie lo tocara. Seis meses afuera, como mínimo.',
    requires: { minSeason: 2 },
    weight: 2,
    options: [
      {
        label: 'Operarlo con el mejor médico del país',
        hint: 'Caro. Vuelve entero.',
        effects: { caja: -1.5, plantel: -4 },
      },
      {
        label: 'Tratamiento conservador',
        hint: 'Barato. Puede volver mal.',
        random: [
          { weight: 45, text: 'Volvió bien y antes de lo previsto. Sale barato ser prudente.', effects: { plantel: -2 } },
          { weight: 55, text: 'Recayó. No volvió a ser el mismo jugador.', effects: { plantel: -8, hinchada: -5 } },
        ],
      },
    ],
  },
  {
    id: 'refuerzo-fracaso',
    kind: 'color',
    title: 'EL REFUERZO NO ANDA',
    text: 'El que trajiste como gran incorporación lleva doce partidos sin hacer nada. La tribuna ya le canta cosas.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Bancarlo públicamente',
        hint: 'Le baja la presión. La gente te lo suma a tu cuenta.',
        effects: { plantel: 2, hinchada: -5 },
      },
      {
        label: 'Rescindirle el contrato',
        hint: 'Admitís el error y pagás por admitirlo.',
        effects: { caja: -2, plantel: -2, hinchada: 3 },
      },
      {
        label: 'Prestarlo al ascenso',
        hint: 'Se lo saca de encima sin pagar todo.',
        effects: { caja: -0.5, plantel: -1, hinchada: 1 },
      },
    ],
  },
  {
    id: 'vest-companero-de-mas',
    kind: 'dilema',
    title: 'SOBRA UN JUGADOR',
    text: 'El DT te pide que saques del plantel a un jugador que tiene contrato dos años más. No rinde, cobra bien y en el vestuario lo quieren todos.',
    requires: { minSeason: 2 },
    options: [
      {
        label: 'Rescindirle el contrato',
        hint: 'Se va contento y caro. El vestuario toma nota.',
        effects: { caja: -2.2, plantel: -1, hinchada: -3 },
      },
      {
        label: 'Dejarlo entrenar aparte',
        hint: 'No cuesta un peso hoy. Cuesta después.',
        effects: { plantel: -4, hinchada: -2, influencia: -3 },
      },
      {
        label: 'Bancarlo y decirle al DT que lo use',
        hint: 'El plantel te lo agradece. El técnico, no.',
        effects: { plantel: -2, hinchada: 4, influencia: -4 },
      },
    ],
  },
  {
    id: 'vest-doble-turno',
    kind: 'dilema',
    title: 'EL DOBLE TURNO',
    text: 'El preparador físico quiere doble turno toda la pretemporada. Dice que en noviembre se nota. El plantel avisa por lo bajo que en noviembre están todos rotos.',
    options: [
      {
        label: 'Doble turno',
        hint: 'Llegan mejor. Alguno se rompe en el camino.',
        random: [
          { weight: 55, text: 'Llegaron enteros y se notó: el equipo corre más que nadie.', effects: { plantel: 7, hinchada: 3 } },
          { weight: 45, text: 'Tres desgarros en cinco fechas. Medio plantel mirando desde afuera.', effects: { plantel: -6, hinchada: -4 } },
        ],
      },
      {
        label: 'Carga normal',
        hint: 'Nadie se rompe. Nadie mejora tampoco.',
        effects: { plantel: 1 },
      },
    ],
  },
  {
    id: 'vest-arquero-suplente',
    kind: 'color',
    title: 'EL ARQUERO SUPLENTE HABLÓ',
    text: 'Lleva cuatro años sin atajar y dijo en una radio que en este club los puestos se ganan afuera de la cancha. Nadie le dio bola hasta que lo levantaron todos los portales.',
    options: [
      {
        label: 'Multarlo y sentarlo en la tribuna',
        hint: 'Disciplina. Y un vestuario que se calla por miedo.',
        effects: { plantel: -2, influencia: 4, hinchada: -2 },
      },
      {
        label: 'Ponerlo de titular el domingo',
        hint: 'Nadie lo vio venir. Puede salir cualquier cosa.',
        random: [
          { weight: 40, text: 'Atajó todo. La cancha coreó su nombre y el titular no dijo una palabra.', effects: { plantel: 3, hinchada: 8 } },
          { weight: 60, text: 'Le hicieron tres. Volvió al banco y esta vez no habló más.', effects: { plantel: -2, hinchada: -5 } },
        ],
      },
      {
        label: 'Hacer como que no pasó nada',
        hint: 'En dos días se olvida. O no.',
        effects: { hinchada: -1, influencia: -2 },
      },
    ],
  },
];
