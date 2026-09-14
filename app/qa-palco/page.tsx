import { notFound } from 'next/navigation';
import { CLUBS } from '@/content/clubs';
import { applyChoice, optionCount, startRun } from '@/lib/engine/engine';
import type { GameState } from '@/lib/engine/types';
import { QaPalco } from '@/components/qa-palco';

export default function Page() {
  if (process.env.NODE_ENV === 'production') notFound();
  const muestras = new Map<string, GameState>();
  for (let seed = 1; seed <= 12 && muestras.size < 8; seed++) {
    let state = startRun({ seed, clubId: CLUBS[0].id, modo: 'corta' });
    for (let turno = 0; turno < 300; turno++) {
      if (!muestras.has(state.phase.kind)) muestras.set(state.phase.kind, state);
      if (state.status === 'terminado') break;
      const cantidad = state.phase.kind === 'mesa-chica' ? 1 : optionCount(state);
      const opciones = Array.from({ length: cantidad }, (_, i) => applyChoice(state, i));
      state = opciones.reduce((a, b) => {
        const valor = (s: GameState) => s.resources.hinchada * 2 + s.resources.plantel * 3 + s.resources.influencia + s.resources.caja / 1000000;
        return valor(b) > valor(a) ? b : a;
      });
    }
  }
  return <QaPalco muestras={[...muestras.values()]} />;
}
