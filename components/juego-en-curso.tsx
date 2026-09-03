'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getClub } from '@/content/clubs';
import { applyChoice, replayRun, startRun } from '@/lib/engine/engine';
import { EVENTS_PER_SEASON, type GameState, type Modo } from '@/lib/engine/types';
import { borrar, guardar, leer } from '@/lib/storage';
import { ActaAsuncion } from './acta-asuncion';
import { FaseEleccion, FaseTemporada } from './fase-cierre';
import { FaseEvento, FaseResultadoEvento } from './fase-evento';
import { FaseFin } from './fase-fin';
import { FaseMercado } from './fase-mercado';
import { FaseMesaChica, FaseResultadoFinal } from './fase-mesa-chica';
import { Hud } from './hud';

export type Inicio =
  | { tipo: 'nueva'; seed: number; clubId: string; modo: Modo; diaria: string | null }
  | { tipo: 'guardada' };

export interface Resumen {
  clubId: string;
  season: number;
  year: number;
  diaria: boolean;
  terminada: boolean;
  choices: number;
  acta: boolean;
}

interface Partida {
  state: GameState;
  diaria: string | null;
}

function alTope(): void {
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function JuegoEnCurso({
  inicio,
  activo,
  onResumen,
  onVolver,
  onReiniciar,
  onAjustes,
}: {
  inicio: Inicio;
  activo: boolean;
  onResumen: (resumen: Resumen) => void;
  onVolver: () => void;
  onReiniciar: () => void;
  onAjustes: () => void;
}) {
  const [partida, setPartida] = useState<Partida | null>(null);
  const [mostrarActa, setMostrarActa] = useState(false);
  const faseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inicio.tipo === 'nueva') {
      const { seed, clubId, modo, diaria } = inicio;
      setPartida({ state: startRun({ seed, clubId, modo }), diaria });
      setMostrarActa(true);
      guardar({ seed, clubId, modo, choices: [], diaria });
      return;
    }

    const guardada = leer();
    if (!guardada) {
      onReiniciar();
      return;
    }
    try {
      setPartida({
        state: replayRun(
          guardada.seed,
          guardada.clubId,
          guardada.choices,
          guardada.modo ?? 'normal',
        ),
        diaria: guardada.diaria ?? null,
      });
    } catch {
      borrar();
      onReiniciar();
    }
  }, [inicio, onReiniciar]);

  useEffect(() => {
    if (!partida) return;
    onResumen({
      clubId: partida.state.clubId,
      season: partida.state.season,
      year: partida.state.year,
      diaria: partida.diaria !== null,
      terminada: partida.state.status === 'terminado',
      choices: partida.state.choices.length,
      acta: mostrarActa,
    });
  }, [partida, mostrarActa, onResumen]);

  const cerrarActa = useCallback(() => {
    setMostrarActa(false);
  }, []);

  const elegir = useCallback((choice: number) => {
    setPartida((actual) => {
      if (!actual) return actual;
      const siguiente = applyChoice(actual.state, choice);
      guardar({
        seed: siguiente.seed,
        clubId: siguiente.clubId,
        modo: siguiente.modo,
        choices: siguiente.choices,
        diaria: actual.diaria,
      });
      return { state: siguiente, diaria: actual.diaria };
    });
    alTope();
  }, []);

  useEffect(() => {
    if (!activo || !partida) return;
    const cont = faseRef.current;
    if (!cont) return;
    const kind = mostrarActa ? 'acta' : partida.state.phase.kind;
    const acuse =
      kind === 'acta' ||
      kind === 'resultado-evento' ||
      kind === 'temporada' ||
      kind === 'eleccion' ||
      kind === 'resultado-final' ||
      kind === 'fin';
    const objetivo = acuse
      ? cont.querySelector<HTMLElement>('[data-continuar]')
      : (cont.querySelector<HTMLElement>('[data-foco-fase]') ??
        cont.querySelector<HTMLElement>('[role="radio"][tabindex="0"]') ??
        cont.querySelector<HTMLElement>('button:not([disabled])'));
    objetivo?.focus({ preventScroll: true });
  }, [activo, partida, mostrarActa]);

  if (!activo || !partida) return null;

  const { state, diaria } = partida;
  const club = getClub(state.clubId);

  return (
    <>
      <Hud
        club={club}
        resources={state.resources}
        season={state.season}
        year={state.year}
        mandate={state.mandate}
        league={state.league}
        inhibido={state.phase.kind === 'mercado' && state.phase.inhibido}
        onVolver={onVolver}
        onAjustes={onAjustes}
      />

      <div
        ref={faseRef}
        className="mx-auto w-full max-w-xl flex-1 px-4 py-6 pl-[max(1rem,var(--sae-left))] pr-[max(1rem,var(--sae-right))]"
      >
        {mostrarActa ? (
          <ActaAsuncion
            club={club}
            resources={state.resources}
            modo={state.modo}
            seed={state.seed}
            onAsumir={cerrarActa}
          />
        ) : (
          <Pantalla
            key={state.choices.length}
            state={state}
            diaria={diaria}
            onElegir={elegir}
            onReiniciar={onReiniciar}
          />
        )}
      </div>
    </>
  );
}

function Pantalla({
  state,
  diaria,
  onElegir,
  onReiniciar,
}: {
  state: GameState;
  diaria: string | null;
  onElegir: (choice: number) => void;
  onReiniciar: () => void;
}) {
  const { phase } = state;
  const club = getClub(state.clubId);

  switch (phase.kind) {
    case 'mercado':
      return (
        <FaseMercado
          offers={phase.offers}
          inhibido={phase.inhibido}
          restantes={phase.restantes}
          season={state.season}
          caja={state.resources.caja}
          onElegir={onElegir}
        />
      );

    case 'evento':
      return (
        <FaseEvento
          club={club}
          event={phase.event}
          available={phase.available}
          enLaTemporada={state.eventsThisSeason}
          porTemporada={EVENTS_PER_SEASON}
          onElegir={onElegir}
        />
      );

    case 'resultado-evento':
      return (
        <FaseResultadoEvento
          club={club}
          text={phase.text}
          effects={phase.effects}
          onContinuar={() => onElegir(0)}
        />
      );

    case 'mesa-chica':
      return <FaseMesaChica match={phase.match} onDefinir={onElegir} />;

    case 'resultado-final':
      return (
        <FaseResultadoFinal
          won={phase.won}
          text={phase.text}
          match={phase.match}
          onContinuar={() => onElegir(0)}
        />
      );

    case 'temporada':
      return (
        <FaseTemporada state={state} result={phase.result} onContinuar={() => onElegir(0)} />
      );

    case 'eleccion':
      return (
        <FaseEleccion
          result={phase.result}
          season={state.season}
          onContinuar={() => onElegir(0)}
        />
      );

    case 'fin':
      return (
        <FaseFin
          state={state}
          club={club}
          ending={phase.ending}
          diaria={diaria}
          onReiniciar={onReiniciar}
        />
      );
  }
}
