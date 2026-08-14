'use client';

/**
 * El orquestador: sostiene el estado de la partida y elige qué pantalla mostrar.
 *
 * Toda la lógica vive en el motor; acá solo se despacha por `phase.kind` y se
 * guarda el progreso. Si esta capa crece, es señal de que algo que debería ser
 * regla del juego se está colando en la UI.
 */

import { useCallback, useEffect, useState } from 'react';

import { getClub } from '@/content/clubs';
import { applyChoice, replayRun, startRun } from '@/lib/engine/engine';
import type { GameState, Resources } from '@/lib/engine/types';
import { borrar, guardar, leer, marcarActaVista, vioActa } from '@/lib/storage';
import { ActaAsuncion } from './acta-asuncion';
import { Arranque } from './arranque';
import { FaseEleccion, FaseTemporada } from './fase-cierre';
import { FaseFin } from './fase-fin';
import { FaseEvento, FaseResultadoEvento } from './fase-evento';
import { FaseMercado } from './fase-mercado';
import { FaseMesaChica, FaseResultadoFinal } from './fase-mesa-chica';
import { Hud } from './hud';

/**
 * Los recursos de la pantalla anterior viajan en el estado, no en un ref: se
 * leen durante el render para dibujar las flechas del carnet, y un ref leído
 * en render es una desincronización esperando a pasar.
 */
interface Partida {
  state: GameState;
  previas: Resources | null;
}

export function Juego() {
  const [partida, setPartida] = useState<Partida | null>(null);
  const [cargando, setCargando] = useState(true);
  /** El acta de asunción se muestra una sola vez en la vida del jugador. */
  const [mostrarActa, setMostrarActa] = useState(false);

  // Restaurar la partida en curso, si el contenido no cambió desde entonces.
  // localStorage no existe en el prerender, así que esto solo puede pasar
  // después del montaje.
  useEffect(() => {
    const guardada = leer();
    if (guardada) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- la partida guardada solo se puede leer en el cliente
        setPartida({ state: replayRun(guardada.seed, guardada.clubId, guardada.choices), previas: null });
      } catch {
        borrar();
      }
    }
    setCargando(false);
  }, []);

  const empezar = useCallback((clubId: string) => {
    const seed = Math.floor(Math.random() * 0xffffffff);
    setPartida({ state: startRun({ seed, clubId }), previas: null });
    setMostrarActa(!vioActa());
    guardar({ seed, clubId, choices: [] });
  }, []);

  const cerrarActa = useCallback(() => {
    marcarActaVista();
    setMostrarActa(false);
  }, []);

  const elegir = useCallback((choice: number) => {
    setPartida((actual) => {
      if (!actual) return actual;
      const siguiente = applyChoice(actual.state, choice);
      guardar({ seed: siguiente.seed, clubId: siguiente.clubId, choices: siguiente.choices });
      return { state: siguiente, previas: actual.state.resources };
    });
    // Cada pantalla es una hoja nueva sobre la mesa: se lee desde arriba.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const reiniciar = useCallback(() => {
    borrar();
    setPartida(null);
  }, []);

  if (cargando) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="font-acta text-[11px] tracking-[0.2em] text-papel-2 uppercase">
          Abriendo el expediente…
        </p>
      </main>
    );
  }

  if (!partida) {
    return (
      <main>
        <Arranque onEmpezar={empezar} />
      </main>
    );
  }

  const { state, previas } = partida;
  const club = getClub(state.clubId);

  return (
    <main className="flex min-h-dvh flex-col">
      <Hud
        club={club}
        resources={state.resources}
        previas={previas}
        season={state.season}
        year={state.year}
        mandate={state.mandate}
        category={state.category}
        inhibido={state.phase.kind === 'mercado' && state.phase.inhibido}
      />

      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        {mostrarActa ? (
          <ActaAsuncion club={club} resources={state.resources} onAsumir={cerrarActa} />
        ) : (
          <Pantalla state={state} onElegir={elegir} onReiniciar={reiniciar} />
        )}
      </div>

      <footer className="mx-auto w-full max-w-xl px-4 pb-6">
        <button
          type="button"
          onClick={reiniciar}
          className="font-acta text-[11px] tracking-[0.14em] text-papel-2 uppercase underline underline-offset-4 hover:text-papel-2"
        >
          Renunciar y empezar otra
        </button>
      </footer>
    </main>
  );
}

function Pantalla({
  state,
  onElegir,
  onReiniciar,
}: {
  state: GameState;
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
          onElegir={onElegir}
        />
      );

    case 'evento':
      return (
        <FaseEvento
          event={phase.event}
          available={phase.available}
          season={state.season}
          acta={state.usedEvents.length}
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
          onReiniciar={onReiniciar}
        />
      );
  }
}
