'use client';

import { useEffect, useState } from 'react';

import { LOGROS } from '@/content/logros';
import { getClub } from '@/content/clubs';
import { TITLES } from '@/lib/engine/types';
import { leerVitrina, type Vitrina } from '@/lib/vitrina';
import { Sello } from './ui';

export function VitrinaPanel() {
  const [vitrina, setVitrina] = useState<Vitrina | null>(null);
  const [abierta, setAbierta] = useState(false);

  useEffect(() => {
    const leida = leerVitrina();
    if (leida.partidas > 0) setVitrina(leida);
  }, []);

  if (!vitrina) return null;

  const club = vitrina.mejorClub ? getClub(vitrina.mejorClub) : null;
  const conseguidos = new Set(vitrina.logros);

  return (
    <div className="mt-6 border border-linea">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-papel/5"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
            Tu vitrina · {vitrina.partidas}{' '}
            {vitrina.partidas === 1 ? 'presidencia' : 'presidencias'}
          </span>
          <span className="mt-0.5 block font-display text-[15px] leading-tight font-bold text-papel">
            Mejor puntaje {vitrina.mejorPuntaje.toLocaleString('es-AR')}
            {club && <span className="font-body font-normal text-papel-2"> con {club.short}</span>}
          </span>
        </span>
        <span className="shrink-0 font-acta text-[11px] tracking-[0.06em] text-bronce-claro uppercase">
          {abierta ? 'Cerrar' : 'Ver'}
        </span>
      </button>

      {abierta && (
        <div className="border-t border-linea px-3 py-3">
          <p className="font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
            Copas ganadas ({vitrina.titulos.length} de {Object.keys(TITLES).length})
          </p>
          {vitrina.titulos.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {vitrina.titulos.map((id) => (
                <li key={id}>
                  <Sello tono="bronce" sobrePano>
                    {TITLES[id].label}
                  </Sello>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 font-body text-[14px] text-papel-2">Todavía ninguna.</p>
          )}

          <p className="mt-4 font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
            Logros ({conseguidos.size} de {LOGROS.length})
          </p>
          <ul className="mt-2 space-y-1.5">
            {LOGROS.map((logro) => {
              const hecho = conseguidos.has(logro.id);
              if (logro.oculto && !hecho) {
                return (
                  <li key={logro.id} className="font-body text-[13px] text-papel-2 italic">
                    Logro oculto
                  </li>
                );
              }
              return (
                <li key={logro.id} className="flex gap-2">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 border ${
                      hecho ? 'border-bronce-claro bg-bronce-claro' : 'border-papel-2'
                    }`}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span
                      className={`block font-display text-[14px] leading-tight font-bold ${
                        hecho ? 'text-papel' : 'text-papel-2'
                      }`}
                    >
                      {logro.label}
                    </span>
                    {!hecho && (
                      <span className="block font-body text-[13px] leading-snug text-papel-2">
                        {logro.pista}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
