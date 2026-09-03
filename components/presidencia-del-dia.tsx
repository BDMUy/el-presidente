'use client';

import { useEffect, useState, type CSSProperties } from 'react';

import { getClub } from '@/content/clubs';
import { faltaParaLaProxima, formatearEspera, presidenciaDelDia } from '@/lib/daily';
import { LEAGUES } from '@/lib/engine/types';
import { expectedPosition } from '@/lib/engine/season';
import { useTintaClub } from '@/lib/tema';
import { Volanta } from './ui';

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
      id ??= setInterval(tick, 60_000);
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
    return (
      <div
        className="mt-8 min-h-[268px] border border-corondel bg-fondo-2/60 sm:min-h-[204px]"
        aria-hidden
      />
    );
  }

  return (
    <section
      data-recorrido="diaria"
      className="mt-8 border border-[var(--club)]/50 bg-fondo-2/60"
      style={{ '--club': tintaClub } as CSSProperties}
    >
      <div className="flex h-1" aria-hidden>
        <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
        <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
      </div>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-baseline justify-between gap-3">
          <Volanta as="h2">Presidencia del día</Volanta>
          <p className="shrink-0 font-tabla text-[11px] tracking-[0.06em] text-tinta-2 tabular-nums uppercase">
            cambia en {espera}
          </p>
        </div>

        <div className="mt-4 sm:flex sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <p className="font-titular text-[22px] leading-tight font-black text-tinta sm:text-[24px]">
              {club.name}
            </p>
            <p className="mt-0.5 font-cuerpo text-[14px] text-tinta-2">
              {LEAGUES[club.league].label} · te esperan{' '}
              {expectedPosition(club, club.league)}° de {LEAGUES[club.league].teams}
            </p>

            <p className="mt-3 max-w-[54ch] font-cuerpo text-[15px] leading-relaxed text-tinta">
              Una partida por día, la misma para todo el mundo: el mismo club, la misma suerte y
              los mismos eventos. Al terminar entrás en el ranking del día.
            </p>
            <p className="mt-2 max-w-[54ch] border-l-2 border-alerta pl-3 font-cuerpo text-[14px] leading-snug text-tinta-2">
              Tenés una sola oportunidad: cuando la jugás, queda jugada hasta mañana.
            </p>
          </div>

          <div className="mt-4 shrink-0 sm:mt-0 sm:w-48">
            {datos.yaJugada ? (
              <p className="border-t border-corondel pt-2.5 font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase sm:border-0 sm:pt-0">
                Ya la jugaste. Volvé mañana.
              </p>
            ) : (
              <button
                type="button"
                onClick={onJugar}
                className="min-h-11 w-full bg-[var(--club)] px-4 py-3 font-titular text-[14px] font-black tracking-[0.1em] text-fondo uppercase transition-opacity active:opacity-90"
              >
                Jugar la del día
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
