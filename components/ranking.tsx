'use client';

import { useEffect, useState } from 'react';

import { CLUBS } from '@/content/clubs';
import { MODOS, TEMPORADAS_POR_MODO, type Modo } from '@/lib/engine/types';
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

const CORTO: Record<Modo, string> = { corta: '8', normal: '16', larga: '32', llamas: 'Llamas' };

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

  if (disponible === null) return null;

  if (disponible === false)
    return (
      <p className="mt-2 font-cuerpo text-[0.875rem] leading-snug text-tinta-2">
        La tabla no está disponible ahora. Probá más tarde.
      </p>
    );

  return (
    <div className="mt-2">
      <div className="flex items-center justify-start gap-2 border-b border-corondel py-2.5">
        <div className="flex shrink-0 gap-1">
          {(['diario', 'global'] as Tipo[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              aria-pressed={tipo === t}
              className={`flex min-h-11 items-center border px-3 font-tabla text-[0.75rem] tracking-[0.04em] uppercase transition-colors ${
                tipo === t
                  ? 'border-tinta bg-tinta/12 text-tinta'
                  : 'border-corondel text-tinta-2 hover:text-tinta'
              }`}
            >
              {t === 'diario' ? 'Hoy' : 'Global'}
            </button>
          ))}
        </div>
      </div>

      {tipo === 'global' && (
        <div
          className="flex flex-wrap items-center gap-2 border-b border-corondel py-2"
          role="group"
          aria-label="Duración"
        >
          <span className="shrink-0 font-tabla text-[0.75rem] tracking-[0.06em] text-tinta-2 uppercase">
            Temporadas
          </span>
          <div className="flex flex-wrap gap-1">
            {MODOS.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={modo === m}
                aria-label={
                  m === 'llamas'
                    ? `Llamas · ${TEMPORADAS_POR_MODO.llamas} temporadas`
                    : `${TEMPORADAS_POR_MODO[m]} temporadas`
                }
                onClick={() => setModo(m)}
                className={`flex min-h-11 min-w-11 items-center justify-center border px-2.5 font-tabla text-[0.75rem] tabular-nums transition-colors ${
                  modo === m
                    ? 'border-tinta bg-tinta/12 text-tinta'
                    : 'border-corondel text-tinta-2 hover:text-tinta'
                }`}
              >
                {CORTO[m]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="py-3">
        {filas === null ? (
          <Cargando chico>Buscando la tabla…</Cargando>
        ) : filas.length === 0 ? (
          <p className="font-cuerpo text-[0.875rem] leading-snug text-tinta-2">
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
                  <span className="w-5 shrink-0 pt-px text-right font-tabla text-[0.75rem] text-tinta-2 tabular-nums">
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
                      <span className="min-w-0 flex-1 truncate font-titular text-[0.875rem] leading-tight font-bold text-tinta">
                        {fila.nombre}
                      </span>
                      <span className="shrink-0 font-titular text-[0.9375rem] leading-tight font-black text-tinta tabular-nums">
                        {fila.puntaje.toLocaleString('es-AR')}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate font-tabla text-[0.75rem] text-tinta-2">
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
