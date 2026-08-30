'use client';

import { useEffect, useState, type CSSProperties } from 'react';

import { getClub } from '@/content/clubs';
import { faltaParaLaProxima, formatearEspera, presidenciaDelDia } from '@/lib/daily';
import { LEAGUES } from '@/lib/engine/types';
import { expectedPosition } from '@/lib/engine/season';
import { useTintaClub } from '@/lib/tema';

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
    let id: ReturnType<typeof setInterval> | undefined;

    const arrancar = () => {
      tick();
      id ??= setInterval(tick, 1000);
    };
    const frenar = () => {
      clearInterval(id);
      id = undefined;
    };
    const alCambiarVisibilidad = () => {
      if (document.visibilityState === 'visible') arrancar();
      else frenar();
    };

    alCambiarVisibilidad();
    document.addEventListener('visibilitychange', alCambiarVisibilidad);
    return () => {
      frenar();
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
    };
  }, []);

  const club = datos ? getClub(datos.clubId) : null;
  const tintaClub = useTintaClub(club);

  if (!datos || !club) {
    return <div className="min-h-[193px] border border-corondel bg-fondo-2/60" aria-hidden />;
  }

  return (
    <div
      className="min-h-[193px] border border-[var(--club)]/50 bg-fondo-2/60"
      style={{ '--club': tintaClub } as CSSProperties}
    >
      <div className="flex h-1" aria-hidden>
        <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
        <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
      </div>

      <div className="px-3 py-3">
        <p className="text-right font-tabla text-[11px] tracking-[0.06em] text-tinta-2 tabular-nums uppercase">
          cambia en {espera}
        </p>

        <p className="mt-1.5 font-titular text-[17px] leading-tight font-black text-tinta">
          {club.name}
        </p>
        <p className="font-cuerpo text-[13px] text-tinta-2">
          {LEAGUES[club.league].label} · te esperan{' '}
          {expectedPosition(club, club.league)}° de {LEAGUES[club.league].teams}
        </p>

        <p className="mt-2 font-cuerpo text-[13px] leading-snug text-tinta-2">
          Hoy todos juegan esta misma partida. Mismo club, misma suerte, mismos eventos.
        </p>

        {datos.yaJugada ? (
          <p className="mt-3 border-t border-corondel pt-2.5 font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
            Ya la jugaste. Volvé mañana.
          </p>
        ) : (
          <button
            type="button"
            onClick={onJugar}
            className="mt-3 min-h-11 w-full border border-corondel py-2.5 font-titular text-[13px] font-black tracking-[0.1em] text-tinta uppercase transition-colors hover:border-tinta"
          >
            Jugar la del día
          </button>
        )}
      </div>
    </div>
  );
}
