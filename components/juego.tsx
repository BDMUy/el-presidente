'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getClub } from '@/content/clubs';
import { presidenciaDelDia } from '@/lib/daily';
import { applyChoice, replayRun, startRun } from '@/lib/engine/engine';
import { EVENTS_PER_SEASON, type GameState, type Modo } from '@/lib/engine/types';
import { borrar, guardar, leer } from '@/lib/storage';
import { ActaAsuncion } from './acta-asuncion';
import { Arranque } from './arranque';
import { Cargando } from './cargando';
import { FaseEleccion, FaseTemporada } from './fase-cierre';
import { FaseFin } from './fase-fin';
import { FaseEvento, FaseResultadoEvento } from './fase-evento';
import { FaseMercado } from './fase-mercado';
import { FaseMesaChica, FaseResultadoFinal } from './fase-mesa-chica';
import { Hud } from './hud';

interface Partida {
  state: GameState;
  diaria: string | null;
}

function alTope(): void {
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function Juego() {
  const [partida, setPartida] = useState<Partida | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarActa, setMostrarActa] = useState(false);

  const [enJuego, setEnJuego] = useState(false);

  const principalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const main = principalRef.current;
    if (!main) return;
    const heading = main.querySelector('h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.style.outline = 'none';
    }
    (heading ?? main).focus({ preventScroll: true });
  }, [enJuego, mostrarActa, partida?.state.choices.length]);

  useEffect(() => {
    const guardada = leer();
    if (guardada) {
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
      }
    }
    setCargando(false);
  }, []);

  const empezar = useCallback((clubId: string, modo: Modo) => {
    const seed = Math.floor(Math.random() * 0xffffffff);
    setPartida({ state: startRun({ seed, clubId, modo }), diaria: null });
    setMostrarActa(true);
    setEnJuego(true);
    guardar({ seed, clubId, modo, choices: [], diaria: null });
    alTope();
  }, []);

  const empezarDiaria = useCallback(() => {
    const { seed, clubId, fecha } = presidenciaDelDia();
    setPartida({ state: startRun({ seed, clubId, modo: 'normal' }), diaria: fecha });
    setMostrarActa(true);
    setEnJuego(true);
    guardar({ seed, clubId, modo: 'normal', choices: [], diaria: fecha });
    alTope();
  }, []);

  const continuar = useCallback(() => {
    setEnJuego(true);
    alTope();
  }, []);

  const volverAlInicio = useCallback(() => {
    setEnJuego(false);
    alTope();
  }, []);

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

  const reiniciar = useCallback(() => {
    borrar();
    setPartida(null);
    setEnJuego(false);
    alTope();
  }, []);

  if (cargando) {
    return (
      <main>
        <Cargando>Abriendo el expediente…</Cargando>
      </main>
    );
  }

  if (!enJuego || !partida) {
    return (
      <main ref={principalRef} id="principal" tabIndex={-1} className="focus:outline-none">
        <Arranque
          onEmpezar={empezar}
          onEmpezarDiaria={empezarDiaria}
          enCurso={
            partida
              ? {
                  club: getClub(partida.state.clubId),
                  season: partida.state.season,
                  year: partida.state.year,
                  diaria: partida.diaria !== null,
                  terminada: partida.state.status === 'terminado',
                }
              : null
          }
          onContinuar={continuar}
          onAbandonar={reiniciar}
        />
      </main>
    );
  }

  const { state, diaria } = partida;
  const club = getClub(state.clubId);

  return (
    <main
      ref={principalRef}
      id="principal"
      tabIndex={-1}
      className="flex min-h-dvh flex-col focus:outline-none"
    >
      <Hud
        club={club}
        resources={state.resources}
        season={state.season}
        year={state.year}
        mandate={state.mandate}
        league={state.league}
        inhibido={state.phase.kind === 'mercado' && state.phase.inhibido}
        onVolver={volverAlInicio}
      />

      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
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
            onReiniciar={reiniciar}
          />
        )}
      </div>
    </main>
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
