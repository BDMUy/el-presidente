// Escalares de tuning globales, en un solo lugar para auditarlos de un vistazo y
// para que `scripts/simulate.ts` los barra con `--set clave=valor`.
//
// El motor los lee por referencia. En una partida real, un replay del servidor o
// un test, NADIE muta este objeto: los valores por defecto son parte del
// determinismo de `(seed, club, modo, choices)`. Solo `scripts/` puede llamar a
// `ajustarBalance` para explorar puntos de balance.

export const BALANCE = {
  // Resultado deportivo
  dispersionLiga: 7,
  ruidoTemporada: 11,

  // Economía
  ingresoPorSocio: 0.045,

  // Desgaste entre temporadas
  decaimientoPlantelTier1: -9,
  decaimientoPlantelTier2: -7.25,
  desgasteCargoCoef: 0.8,

  // Mercado de pases
  chanceCrack: 0.35,
  chanceMovimientoExtra: 0.5,

  // Umbrales de final anticipado
  deudaQuiebra: -40,
  deudaEnLlamas: -22,

  // Puntaje final
  puntosPorTemporada: 18,
  puntajeHinchada: 4,
  puntajeCaja: 3,
  puntajeSocios: 1.2,
  puntajeAscenso: 60,
  puntajeDescenso: 140,
  puntosEstatuaBase: 200,
  puntosEstatuaLarga: 400,
};

export type ClaveBalance = keyof typeof BALANCE;

export function ajustarBalance(overrides: Record<string, number>): void {
  for (const [clave, valor] of Object.entries(overrides)) {
    if (!(clave in BALANCE)) {
      throw new Error(`Balance no tiene la clave "${clave}". Son: ${Object.keys(BALANCE).join(', ')}`);
    }
    if (!Number.isFinite(valor)) {
      throw new Error(`Valor no numérico para "${clave}": ${valor}`);
    }
    BALANCE[clave as ClaveBalance] = valor;
  }
}
