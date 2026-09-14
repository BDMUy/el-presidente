'use client';

import { useEffect, useState, type CSSProperties } from 'react';

import { getClub } from '@/content/clubs';
import { faltaParaLaProxima, formatearEspera, presidenciaDelDia } from '@/lib/daily';
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
        className="min-h-[120px] bg-fondo-2"
        aria-hidden
      />
    );
  }

  return (
    <section
      data-recorrido="diaria"
      className="pb-6 border-b border-corondel"
      style={{ '--club': tintaClub } as CSSProperties}
    >
      <div className="flex h-1" aria-hidden>
        <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
        <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
      </div>

      <div className="pt-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <Volanta as="h2">Presidencia del día</Volanta>
          <p className="shrink-0 font-tabla text-[0.75rem] tracking-[0.06em] text-tinta-2 tabular-nums uppercase">
            {espera} para otra
          </p>
        </div>

        <div className="mt-3 grid grid-cols-1 items-center gap-3">
          <div className="min-w-0">
            <p className="font-titular text-[20px] leading-tight font-black break-words text-tinta">
              {club.name}
            </p>
            <p className="mt-1 font-cuerpo text-[0.875rem] leading-snug text-tinta-2">
              El mismo desafío para todos. Un intento por día.
            </p>
          </div>

          <div className="">
            {datos.yaJugada ? (
              <p className="border-t border-corondel pt-2.5 font-tabla text-[0.75rem] tracking-[0.06em] text-tinta-2 uppercase sm:border-0 sm:pt-0">
                Ya la jugaste. Volvé mañana.
              </p>
            ) : (
              <button
                type="button"
                onClick={onJugar}
                className="min-h-11 w-full border border-corondel px-3 py-3 font-titular text-[0.75rem] font-black tracking-[0.06em] text-tinta uppercase transition-colors hover:bg-[var(--club)]/10"
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
