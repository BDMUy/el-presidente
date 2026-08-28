'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { marcarDiariaJugada } from '@/components/presidencia-del-dia';
import type { GameState } from '@/lib/engine/types';
import { guardarNombre, idDispositivo, nombreDelPresidente } from '@/lib/dispositivo';
import { Volanta } from './ui';

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
  const nombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let vivo = true;
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
      nombreRef.current?.focus();
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
      <div className="mt-7 border-t border-corondel pt-4">
        <Volanta>{diaria ? 'Ranking del día' : 'Ranking global'}</Volanta>
        <p className="mt-2 font-cuerpo text-[15px] leading-relaxed text-tinta">
          Tu presidencia entró a la tabla con{' '}
          <span className="font-semibold">{estado.puntaje.toLocaleString('es-AR')}</span> puntos.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7 border-t border-corondel pt-4">
      <Volanta>{diaria ? 'Ranking del día' : 'Ranking global'}</Volanta>

      <p className="mt-2 font-cuerpo text-[14px] leading-snug text-tinta-2">
        {diaria
          ? 'Hoy todos jugaron esta misma partida. Compará tu presidencia con la del resto.'
          : 'Entrá en la tabla histórica con esta presidencia.'}
      </p>

      <p className="mt-2 font-cuerpo text-[12px] leading-snug text-tinta-2">
        Al enviar guardamos tu nombre y tu partida para el ranking.{' '}
        <Link href="/privacidad" className="underline underline-offset-2 hover:text-tinta">
          Política de privacidad
        </Link>
        .
      </p>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
        className="mt-3 flex gap-2"
      >
        <label className="flex-1">
          <span className="sr-only">Tu nombre en la tabla</span>
          <input
            ref={nombreRef}
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={24}
            required
            aria-required
            aria-invalid={estado.fase === 'error'}
            aria-describedby={estado.fase === 'error' ? 'ranking-error' : undefined}
            placeholder="Tu nombre"
            className="w-full border border-corondel bg-fondo-2 px-3 py-2.5 font-cuerpo text-[15px] text-tinta placeholder:text-tinta-2 focus:border-tinta focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={estado.fase === 'enviando'}
          className="shrink-0 bg-tinta px-5 py-2.5 font-titular text-[13px] font-black tracking-[0.1em] text-fondo uppercase transition-colors active:bg-tinta-2 disabled:opacity-50"
        >
          {estado.fase === 'enviando' ? 'Enviando' : 'Enviar'}
        </button>
      </form>

      {estado.fase === 'error' && (
        <p id="ranking-error" role="alert" className="mt-2 font-cuerpo text-[14px] text-alerta">
          {estado.mensaje}
        </p>
      )}
    </div>
  );
}
