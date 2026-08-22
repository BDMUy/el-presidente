'use client';

import { useEffect, useState } from 'react';

import { getClub } from '@/content/clubs';
import { faltaParaLaProxima, formatearEspera, presidenciaDelDia } from '@/lib/daily';
import { LEAGUES } from '@/lib/engine/types';
import { expectedPosition } from '@/lib/engine/season';

const KEY_JUGADA = 'el-presidente:diaria-jugada';

export function diariaJugada(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(KEY_JUGADA);
  } catch {
    return null;
  }
}

export function marcarDiariaJugada(fecha: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY_JUGADA, fecha);
  } catch {
  }
}

export function PresidenciaDelDia({ onJugar }: { onJugar: () => void }) {
  const [datos, setDatos] = useState<{
    clubId: string;
    fecha: string;
    yaJugada: boolean;
  } | null>(null);
  const [espera, setEspera] = useState('');

  useEffect(() => {
    const hoy = presidenciaDelDia();
    setDatos({ clubId: hoy.clubId, fecha: hoy.fecha, yaJugada: diariaJugada() === hoy.fecha });

    const tick = () => setEspera(formatearEspera(faltaParaLaProxima()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!datos) {
    return <div className="mt-6 h-[92px] border border-linea" aria-hidden />;
  }

  const club = getClub(datos.clubId);

  return (
    <div className="mt-2 border border-bronce-claro/50 bg-pano-alto/50">
      <div className="flex h-1" aria-hidden>
        <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
        <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
      </div>

      <div className="px-3 py-3">
        <p className="text-right font-acta text-[11px] tracking-[0.06em] text-papel-2 tabular-nums uppercase">
          cambia en {espera}
        </p>

        <p className="mt-1.5 font-display text-[17px] leading-tight font-black text-papel">
          {club.name}
        </p>
        <p className="font-body text-[13px] text-papel-2">
          {LEAGUES[club.league].label} · te esperan{' '}
          {expectedPosition(club, club.league)}° de {LEAGUES[club.league].teams}
        </p>

        <p className="mt-2 font-body text-[13px] leading-snug text-papel-2">
          Hoy todos juegan esta misma partida. Mismo club, misma suerte, mismos eventos.
        </p>

        {datos.yaJugada ? (
          <p className="mt-3 border-t border-linea pt-2.5 font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
            Ya la jugaste. Volvé mañana.
          </p>
        ) : (
          <button
            type="button"
            onClick={onJugar}
            className="mt-3 min-h-11 w-full bg-bronce-claro py-2.5 font-display text-[13px] font-black tracking-[0.1em] text-tinta uppercase transition-transform active:scale-[0.99]"
          >
            Jugar la del día
          </button>
        )}
      </div>
    </div>
  );
}
