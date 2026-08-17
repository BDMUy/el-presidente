'use client';

/**
 * La tabla de posiciones, en la pantalla de arranque.
 *
 * Se pide al montar y se esconde entera si el ranking no está configurado: sin
 * base, este componente no existe y el arranque queda exactamente como estaba.
 *
 * Arranca en el ranking del día porque es el que invita a volver mañana. El
 * global premia la mejor partida de tu vida y no cambia seguido; el diario
 * cambia todos los días y es el que da la razón para entrar.
 */

import { useEffect, useState } from 'react';

import { CLUBS } from '@/content/clubs';
import { Cargando } from './cargando';

interface Fila {
  nombre: string;
  club_id: string;
  puntaje: number;
  temporadas: number;
  titulos: number;
  final: string;
}

type Tipo = 'diario' | 'global';

const CLUBES = new Map(CLUBS.map((c) => [c.id, c]));

export function Ranking() {
  const [tipo, setTipo] = useState<Tipo>('diario');
  const [filas, setFilas] = useState<Fila[] | null>(null);
  const [disponible, setDisponible] = useState<boolean | null>(null);

  useEffect(() => {
    let vivo = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- vuelve al estado de carga al cambiar de pestaña
    setFilas(null);
    fetch(`/api/ranking?tipo=${tipo}`)
      .then(async (r) => {
        if (!vivo) return;
        if (r.status === 503) {
          setDisponible(false);
          return;
        }
        const datos = (await r.json()) as { filas: Fila[] };
        setDisponible(true);
        setFilas(datos.filas ?? []);
      })
      .catch(() => vivo && setDisponible(false));
    return () => {
      vivo = false;
    };
  }, [tipo]);

  if (disponible === false || disponible === null) return null;

  return (
    <div className="mt-2 border border-linea">
      {/* Sin título propio: lo pone la sección que lo contiene. Cuando lo traía
          además acá, "Tabla de posiciones" se leía dos veces seguidas. */}
      <div className="flex items-center justify-end gap-2 border-b border-linea px-3 py-2.5">
        <div className="flex shrink-0 gap-1">
          {(['diario', 'global'] as Tipo[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              aria-pressed={tipo === t}
              // min-h-11 = 44px: el alto natural del texto daba 35 y quedaba
              // por debajo del blanco táctil mínimo.
              className={`flex min-h-11 items-center border px-3 font-acta text-[11px] tracking-[0.04em] uppercase transition-colors ${
                tipo === t
                  ? 'border-bronce-claro bg-bronce-claro/15 text-papel'
                  : 'border-linea text-papel-2 hover:text-papel'
              }`}
            >
              {t === 'diario' ? 'Hoy' : 'Global'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-2.5">
        {filas === null ? (
          <Cargando chico>Buscando la tabla…</Cargando>
        ) : filas.length === 0 ? (
          <p className="font-body text-[14px] leading-snug text-papel-2">
            {tipo === 'diario'
              ? 'Nadie envió su Presidencia del Día todavía. Podés ser el primero.'
              : 'La tabla histórica está vacía. Jugá una presidencia y entrá.'}
          </p>
        ) : (
          <ol className="space-y-1.5">
            {filas.slice(0, 10).map((fila, i) => {
              const club = CLUBES.get(fila.club_id);
              return (
                <li key={`${fila.nombre}-${i}`} className="flex gap-2.5">
                  <span className="w-5 shrink-0 pt-px text-right font-acta text-[12px] text-papel-2 tabular-nums">
                    {i + 1}
                  </span>
                  {club && (
                    <span
                      className="mt-1 flex h-4 w-1 shrink-0 flex-col overflow-hidden rounded-full"
                      aria-hidden
                    >
                      <span className="flex-1" style={{ backgroundColor: club.colors[0] }} />
                      <span className="flex-1" style={{ backgroundColor: club.colors[1] }} />
                    </span>
                  )}
                  {/* El puntaje va arriba, en la misma línea que el nombre, y la
                      ficha técnica ocupa sola el renglón de abajo.

                      No es una preferencia estética: compartiendo renglón con
                      el puntaje, la ficha se quedaba con 213px y la mejor
                      partida posible —"Argentino (Q) · 16 temp · 12 títulos"—
                      se cortaba a los 24px del final. Justo el que sobrevivió
                      las dieciséis temporadas era el único que no podía leer
                      su propia línea. Así tiene el ancho entero. */}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="min-w-0 flex-1 truncate font-display text-[14px] leading-tight font-bold text-papel">
                        {fila.nombre}
                      </span>
                      <span className="shrink-0 font-display text-[15px] leading-tight font-black text-papel tabular-nums">
                        {fila.puntaje.toLocaleString('es-AR')}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate font-acta text-[11px] text-papel-2">
                      {club?.short ?? fila.club_id} · {fila.temporadas} temp ·{' '}
                      {fila.titulos} {fila.titulos === 1 ? 'título' : 'títulos'}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
