'use client';

import { useEffect, useState } from 'react';

import { CLUBS } from '@/content/clubs';
import { MODOS, type Modo } from '@/lib/engine/types';
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

const CORTO: Record<Modo, string> = { corta: '8', normal: '16', larga: '32', llamas: '16🔥' };

const VACIO: Record<Modo, string> = {
  corta: 'una presidencia de 8 temporadas',
  normal: 'una presidencia de 16 temporadas',
  larga: 'una presidencia de 32 temporadas',
  llamas: 'una presidencia en llamas',
};

export function Ranking() {
  const [tipo, setTipo] = useState<Tipo>('diario');
  const [modo, setModo] = useState<Modo>('normal');
  const [filas, setFilas] = useState<Fila[] | null>(null);
  const [disponible, setDisponible] = useState<boolean | null>(null);

  useEffect(() => {
    let vivo = true;
    setFilas(null);
    fetch(`/api/ranking?tipo=${tipo}&modo=${modo}`)
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
  }, [tipo, modo]);

  if (disponible === false || disponible === null) return null;

  return (
    <div className="mt-2 border border-linea">
      <div className="flex items-center justify-end gap-2 border-b border-linea px-3 py-2.5">
        <div className="flex shrink-0 gap-1">
          {(['diario', 'global'] as Tipo[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              aria-pressed={tipo === t}
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

      {tipo === 'global' && (
        <div
          className="flex items-center gap-2 border-b border-linea px-3 py-2"
          role="tablist"
          aria-label="Duración"
        >
          <span className="shrink-0 font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
            Temporadas
          </span>
          <div className="flex gap-1">
            {MODOS.map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={modo === m}
                onClick={() => setModo(m)}
                className={`flex min-h-11 min-w-11 items-center justify-center border px-2.5 font-acta text-[11px] tabular-nums transition-colors ${
                  modo === m
                    ? 'border-bronce-claro bg-bronce-claro/15 text-papel'
                    : 'border-linea text-papel-2 hover:text-papel'
                }`}
              >
                {CORTO[m]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 py-2.5">
        {filas === null ? (
          <Cargando chico>Buscando la tabla…</Cargando>
        ) : filas.length === 0 ? (
          <p className="font-body text-[14px] leading-snug text-papel-2">
            {tipo === 'diario'
              ? 'Nadie envió su Presidencia del Día todavía. Podés ser el primero.'
              : `Todavía nadie terminó ${VACIO[modo]}. Podés ser el primero.`}
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
