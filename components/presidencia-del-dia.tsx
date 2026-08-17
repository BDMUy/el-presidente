'use client';

/**
 * La Presidencia del Día, en la pantalla de arranque.
 *
 * Todos reciben la misma partida: mismo club, misma suerte, mismos eventos. Es
 * lo que hace comparable el ranking diario, y por eso el club se muestra de
 * entrada en vez de dejarlo elegir.
 *
 * La cuenta regresiva se calcula en el cliente a partir de la fecha argentina,
 * la misma función que usa el servidor para validar el envío. No hay reloj que
 * coordinar entre los dos.
 */

import { useEffect, useState } from 'react';

import { getClub } from '@/content/clubs';
import { faltaParaLaProxima, formatearEspera, presidenciaDelDia } from '@/lib/daily';
import { CATEGORY_RULES } from '@/lib/engine/types';
import { expectedPosition } from '@/lib/engine/season';

const KEY_JUGADA = 'el-presidente:diaria-jugada';

/** Qué fecha de Presidencia del Día ya jugó este dispositivo. */
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
    // Sin almacenamiento el tope real lo impone el servidor igual.
  }
}

export function PresidenciaDelDia({ onJugar }: { onJugar: () => void }) {
  // El render inicial no puede depender del reloj ni de localStorage o la
  // hidratación no coincide con el HTML del servidor. Todo se resuelve
  // después del montaje.
  const [datos, setDatos] = useState<{
    clubId: string;
    fecha: string;
    yaJugada: boolean;
  } | null>(null);
  const [espera, setEspera] = useState('');

  useEffect(() => {
    const hoy = presidenciaDelDia();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depende del reloj y de localStorage
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
        {/* Sin el título "Presidencia del día": lo pone la sección que lo
            contiene, y acá se leía dos veces seguidas. Queda el reloj, que es
            el dato y no el rótulo. */}
        <p className="text-right font-acta text-[11px] tracking-[0.06em] text-papel-2 tabular-nums uppercase">
          cambia en {espera}
        </p>

        <p className="mt-1.5 font-display text-[17px] leading-tight font-black text-papel">
          {club.name}
        </p>
        <p className="font-body text-[13px] text-papel-2">
          {CATEGORY_RULES[club.category].label} · te esperan{' '}
          {expectedPosition(club, club.category)}° de {CATEGORY_RULES[club.category].teams}
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
            className="mt-3 w-full bg-bronce-claro py-2.5 font-display text-[13px] font-black tracking-[0.1em] text-tinta uppercase transition-transform active:scale-[0.99]"
          >
            Jugar la del día
          </button>
        )}
      </div>
    </div>
  );
}
