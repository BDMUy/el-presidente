'use client';

import { useState } from 'react';
import { getClub } from '@/content/clubs';
import { applyChoice } from '@/lib/engine/engine';
import { EVENTS_PER_SEASON, type GameState } from '@/lib/engine/types';
import { FaseEvento, FaseResultadoEvento } from './fase-evento';
import { FaseMercado } from './fase-mercado';
import { FaseMesaChica, FaseResultadoFinal } from './fase-mesa-chica';
import { FaseTemporada, FaseEleccion } from './fase-cierre';
import { FaseFin } from './fase-fin';
import { Hud } from './hud';
import { encodeRun } from '@/lib/share';

export function QaPalco({ muestras }: { muestras: GameState[] }) {
  const [state, setState] = useState(muestras[0]);
  const club = getClub(state.clubId);
  const phase = state.phase;
  const elegir = (i: number) => setState(applyChoice(state, i));
  const continuar = () => elegir(0);
  return <main data-pantalla="juego" className="min-h-dvh">
    <a href={`/p/${encodeRun({ seed: state.seed, clubId: state.clubId, modo: state.modo, choices: state.choices })}`}>Ver resumen de prueba</a>
    <label>Escena de prueba<select aria-label="Escena de prueba" className="min-h-11 bg-fondo-2" value={muestras.findIndex(s => s === state)} onChange={e => setState(muestras[Number(e.target.value)])}>{muestras.map((s,i) => <option value={i} key={s.phase.kind}>{s.phase.kind}</option>)}</select></label>
    <Hud club={club} resources={state.resources} season={state.season} year={state.year} mandate={state.mandate} league={state.league} inhibido={false} onVolver={() => setState(muestras[0])} onAjustes={() => {}} />
    <div key={phase.kind} className="superficie-palco px-4 py-4">
      {phase.kind === 'mercado' && <FaseMercado offers={phase.offers} inhibido={phase.inhibido} restantes={phase.restantes} season={state.season} caja={state.resources.caja} onElegir={elegir} />}
      {phase.kind === 'evento' && <FaseEvento club={club} event={phase.event} available={phase.available} enLaTemporada={state.eventsThisSeason} porTemporada={EVENTS_PER_SEASON} onElegir={elegir} />}
      {phase.kind === 'resultado-evento' && <FaseResultadoEvento club={club} text={phase.text} effects={phase.effects} onContinuar={continuar} />}
      {phase.kind === 'mesa-chica' && <FaseMesaChica match={phase.match} onDefinir={elegir} />}
      {phase.kind === 'resultado-final' && <FaseResultadoFinal won={phase.won} text={phase.text} match={phase.match} onContinuar={continuar} />}
      {phase.kind === 'temporada' && <FaseTemporada state={state} result={phase.result} onContinuar={continuar} />}
      {phase.kind === 'eleccion' && <FaseEleccion result={phase.result} season={state.season} onContinuar={continuar} />}
      {phase.kind === 'fin' && <FaseFin state={state} club={club} ending={phase.ending} diaria={null} onReiniciar={() => setState(muestras[0])} />}
    </div>
  </main>;
}
