import type { EventOption } from '@/lib/engine/types';
import { RECURSOS_POR_ID } from '@/lib/recursos';

export type Grado = 1 | 2 | 3;
export type Signo = '+' | '−' | 'neutro';

export interface Impacto {
  id: string;
  label: string;
  signo: Signo;
  grado: Grado;
}

type RecursoNumerico = 'caja' | 'hinchada' | 'socios' | 'plantel' | 'influencia';

const ORDEN_RECURSOS: readonly RecursoNumerico[] = ['caja', 'hinchada', 'socios', 'plantel', 'influencia'];

const CORTES: Record<RecursoNumerico, [number, number]> = {
  caja: [0.9, 2],
  hinchada: [4, 7],
  socios: [1, 2],
  plantel: [2, 3],
  influencia: [4, 8],
};

function gradoDe(recurso: RecursoNumerico, valorAbsoluto: number): Grado {
  const [p33, p66] = CORTES[recurso];
  if (valorAbsoluto <= p33) return 1;
  if (valorAbsoluto <= p66) return 2;
  return 3;
}

export function impactoDeOpcion(option: EventOption): Impacto[] | null {
  if (option.random && option.random.length > 0) return null;

  const effects = option.effects;
  if (!effects) return [];

  const tokens: Impacto[] = [];

  for (const recurso of ORDEN_RECURSOS) {
    const valor = effects[recurso];
    if (!valor) continue;
    tokens.push({
      id: recurso,
      label: RECURSOS_POR_ID[recurso].label.toUpperCase(),
      signo: valor > 0 ? '+' : '−',
      grado: gradoDe(recurso, Math.abs(valor)),
    });
  }

  if (effects.flagsSuma?.prontuario) {
    tokens.push({ id: 'prontuario', label: 'PRONTUARIO', signo: '−', grado: 2 });
  }

  if (effects.deferred && effects.deferred.length > 0) {
    tokens.push({ id: 'despues', label: 'DESPUÉS', signo: 'neutro', grado: 1 });
  }

  return tokens;
}
