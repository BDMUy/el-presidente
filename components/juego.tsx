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
import { presidenciaDelDia } from '@/lib/daily';
import { applyChoice, replayRun, startRun } from '@/lib/engine/engine';
import { EVENTS_PER_SEASON, type GameState } from '@/lib/engine/types';
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
  /** Fecha de la Presidencia del Día, o null si es una partida libre. */
  diaria: string | null;
}

/** Cada pantalla es una hoja nueva sobre la mesa: se lee desde arriba. */
function alTope(): void {
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function Juego() {
  const [partida, setPartida] = useState<Partida | null>(null);
  const [cargando, setCargando] = useState(true);
  /** El acta de asunción se muestra una sola vez en la vida del jugador. */
  const [mostrarActa, setMostrarActa] = useState(false);

  /**
   * Si se está adentro de la partida o en el inicio.
   *
   * Antes no existía: tener una partida guardada era estar jugándola, y la
   * única salida era renunciar, que la borraba. O sea que para mirar la tabla
   * de posiciones había que abandonar la presidencia en curso. Ahora el inicio
   * es un lugar al que se puede volver, y la partida sigue esperando.
   */
  const [enJuego, setEnJuego] = useState(false);

  // Restaurar la partida en curso, si el contenido no cambió desde entonces.
  // localStorage no existe en el prerender, así que esto solo puede pasar
  // después del montaje.
  useEffect(() => {
    const guardada = leer();
    if (guardada) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- la partida guardada solo se puede leer en el cliente
        setPartida({
          state: replayRun(guardada.seed, guardada.clubId, guardada.choices),
          diaria: guardada.diaria ?? null,
        });
      } catch {
        borrar();
      }
    }
    setCargando(false);
  }, []);

  const empezar = useCallback((clubId: string) => {
    const seed = Math.floor(Math.random() * 0xffffffff);
    setPartida({ state: startRun({ seed, clubId }), diaria: null });
    setMostrarActa(!vioActa());
    setEnJuego(true);
    guardar({ seed, clubId, choices: [], diaria: null });
    // Sin esto se entraba al club con el scroll donde había quedado el padrón,
    // así que la primera pantalla de la presidencia aparecía por la mitad.
    alTope();
  }, []);

  // La del día no se elige: la partida sale de la fecha, igual en todos los
  // dispositivos y en el servidor que después valida el envío.
  const empezarDiaria = useCallback(() => {
    const { seed, clubId, fecha } = presidenciaDelDia();
    setPartida({ state: startRun({ seed, clubId }), diaria: fecha });
    setMostrarActa(!vioActa());
    setEnJuego(true);
    guardar({ seed, clubId, choices: [], diaria: fecha });
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

  // Se arranca siempre en el inicio, aunque haya partida guardada. Entrar
  // directo a la partida escondía el resto del juego —la del día, la tabla, la
  // vitrina— a cualquiera que hubiera empezado una presidencia y no la hubiera
  // terminado, que es el estado normal de alguien que vuelve al otro día.
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
          <ActaAsuncion club={club} resources={state.resources} onAsumir={cerrarActa} />
        ) : (
          // La key por decisión tomada no es cosmética: las pantallas que ahora
          // guardan una selección sin firmar viven en la misma posición del
          // árbol una tras otra, y sin esto React reusaría la instancia y la
          // opción elegida en un acta aparecería ya marcada en la siguiente.
          <Pantalla
            key={state.choices.length}
            state={state}
            diaria={diaria}
            onElegir={elegir}
            onReiniciar={reiniciar}
          />
        )}
      </div>

      {/* Volver al inicio, no renunciar: la presidencia queda como está y se
          retoma desde el botón de continuar. Renunciar —que borra la partida—
          vive ahora en el inicio, al lado de la que se va a borrar, que es
          donde se puede ver qué se está tirando. */}
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
