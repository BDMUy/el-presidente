'use client';

/**
 * Envío de la presidencia al ranking.
 *
 * Manda `{seed, clubId, choices}`: las decisiones, nunca el puntaje. El
 * servidor reproduce la partida y calcula el número él mismo. Por eso este
 * componente no tiene forma de mentir aunque alguien lo modifique.
 *
 * Si el ranking todavía no está configurado, el servidor responde 503 y acá no
 * se muestra nada. El juego funciona igual: el ranking es un agregado.
 */

import { useCallback, useEffect, useState } from 'react';

import { marcarDiariaJugada } from '@/components/presidencia-del-dia';
import type { GameState } from '@/lib/engine/types';
import { guardarNombre, idDispositivo, nombreDelPresidente } from '@/lib/dispositivo';
import { Membrete } from './ui';

type Estado =
  | { fase: 'cargando' }
  | { fase: 'no-disponible' }
  | { fase: 'listo' }
  | { fase: 'enviando' }
  | { fase: 'enviado'; puntaje: number }
  | { fase: 'error'; mensaje: string };

export function EnvioAlRanking({ state, diaria }: { state: GameState; diaria: string | null }) {
  const [estado, setEstado] = useState<Estado>({ fase: 'cargando' });
  const [nombre, setNombre] = useState('');

  // Se pregunta primero si el ranking existe, para no ofrecer un formulario
  // que después no va a poder enviar nada.
  useEffect(() => {
    let vivo = true;
    // Ya viene resuelto: el que puso el jugador, o el de dirigente que le
    // tocó. El campo nunca arranca vacío, así que nadie llega hasta acá para
    // que recién el botón le diga que le falta un nombre.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el nombre guardado solo existe en el cliente
    setNombre(nombreDelPresidente());
    fetch('/api/ranking?tipo=global')
      .then((r) => {
        if (!vivo) return;
        setEstado(r.status === 503 ? { fase: 'no-disponible' } : { fase: 'listo' });
      })
      .catch(() => vivo && setEstado({ fase: 'no-disponible' }));
    return () => {
      vivo = false;
    };
  }, []);

  const enviar = useCallback(async () => {
    const limpio = nombre.trim();
    if (limpio.length === 0) {
      setEstado({ fase: 'error', mensaje: 'Poné un nombre para aparecer en la tabla.' });
      return;
    }

    setEstado({ fase: 'enviando' });
    guardarNombre(limpio);

    try {
      const r = await fetch('/api/puntaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispositivo: idDispositivo(),
          nombre: limpio,
          seed: state.seed,
          clubId: state.clubId,
          modo: state.modo,
          choices: state.choices,
          diaria: diaria !== null,
        }),
      });
      const datos = (await r.json()) as { ok: boolean; puntaje?: number; error?: string };

      if (!r.ok) {
        setEstado({ fase: 'error', mensaje: datos.error ?? 'No se pudo enviar.' });
        return;
      }

      if (diaria) marcarDiariaJugada(diaria);
      setEstado({ fase: 'enviado', puntaje: datos.puntaje ?? 0 });
    } catch {
      setEstado({ fase: 'error', mensaje: 'No hay conexión. Probá de nuevo.' });
    }
  }, [nombre, state, diaria]);

  if (estado.fase === 'cargando' || estado.fase === 'no-disponible') return null;

  if (estado.fase === 'enviado') {
    return (
      <div className="mt-7 border-t border-hoja-linea pt-4">
        <Membrete>{diaria ? 'Ranking del día' : 'Ranking global'}</Membrete>
        <p className="mt-2 font-body text-[15px] leading-relaxed text-tinta">
          Tu presidencia entró a la tabla con{' '}
          <span className="font-semibold">{estado.puntaje.toLocaleString('es-AR')}</span> puntos.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7 border-t border-hoja-linea pt-4">
      <Membrete>{diaria ? 'Ranking del día' : 'Ranking global'}</Membrete>

      <p className="mt-2 font-body text-[14px] leading-snug text-tinta-2">
        {diaria
          ? 'Hoy todos jugaron esta misma partida. Compará tu presidencia con la del resto.'
          : 'Entrá en la tabla histórica con esta presidencia.'}
      </p>

      <div className="mt-3 flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Tu nombre en la tabla</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={24}
            placeholder="Tu nombre"
            className="w-full border border-hoja-linea bg-transparent px-3 py-2.5 font-body text-[15px] text-tinta placeholder:text-tinta-2 focus:border-tinta focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={enviar}
          disabled={estado.fase === 'enviando'}
          className="shrink-0 bg-tinta px-5 py-2.5 font-display text-[13px] font-black tracking-[0.1em] text-hoja uppercase transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {estado.fase === 'enviando' ? 'Enviando' : 'Enviar'}
        </button>
      </div>

      {estado.fase === 'error' && (
        <p className="mt-2 font-body text-[14px] text-sello">{estado.mensaje}</p>
      )}
    </div>
  );
}
