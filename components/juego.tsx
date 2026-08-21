'use client';

import { useCallback, useEffect, useState } from 'react';

import { getClub } from '@/content/clubs';
import { presidenciaDelDia } from '@/lib/daily';
import { applyChoice, replayRun, startRun } from '@/lib/engine/engine';
import { EVENTS_PER_SEASON, type GameState, type Modo } from '@/lib/engine/types';
import { borrar, guardar, leer, marcarActaVista, vioActa } from '@/lib/storage';
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
    setMostrarActa(!vioActa());
    setEnJuego(true);
    guardar({ seed, clubId, modo, choices: [], diaria: null });
    alTope();
  }, []);

  const empezarDiaria = useCallback(() => {
    const { seed, clubId, fecha } = presidenciaDelDia();
    setPartida({ state: startRun({ seed, clubId, modo: 'normal' }), diaria: fecha });
    setMostrarActa(!vioActa());
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
    marcarActaVista();
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
      <main>
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
    <main className="flex min-h-dvh flex-col">
      <Hud
        club={club}
        resources={state.resources}
        season={state.season}
        year={state.year}
        mandate={state.mandate}
        category={state.category}
        inhibido={state.phase.kind === 'mercado' && state.phase.inhibido}
      />

      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        {mostrarActa ? (
          <ActaAsuncion
            club={club}
            resources={state.resources}
            modo={state.modo}
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

      <footer className="mx-auto w-full max-w-xl px-4 pb-6">
        <button
          type="button"
          onClick={volverAlInicio}
          className="-mx-2 px-2 py-3 font-acta text-[11px] tracking-[0.14em] text-papel-2 uppercase underline underline-offset-4 transition-colors hover:text-papel"
        >
          ← Volver al inicio
        </button>
      </footer>
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
          club={getClub(state.clubId)}
          ending={phase.ending}
          diaria={diaria}
          onReiniciar={onReiniciar}
        />
      );
  }
}
