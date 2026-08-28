'use client';

import { useEffect, useId, useState } from 'react';

import { LOGROS } from '@/content/logros';
import { getClub } from '@/content/clubs';
import { TITLES } from '@/lib/engine/types';
import { leerVitrina, type Vitrina } from '@/lib/vitrina';
import { Ladillo } from './ui';

export function VitrinaPanel() {
  const [vitrina, setVitrina] = useState<Vitrina | null>(null);
  const [abierta, setAbierta] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const leida = leerVitrina();
    if (leida.partidas > 0) setVitrina(leida);
  }, []);

  if (!vitrina) return null;

  const club = vitrina.mejorClub ? getClub(vitrina.mejorClub) : null;
  const conseguidos = new Set(vitrina.logros);

  return (
    <div className="mt-6 border border-corondel">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-tinta/6"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
            Tu vitrina · {vitrina.partidas}{' '}
            {vitrina.partidas === 1 ? 'presidencia' : 'presidencias'}
          </span>
          <span className="mt-0.5 block font-titular text-[15px] leading-tight font-bold text-tinta">
            Mejor puntaje {vitrina.mejorPuntaje.toLocaleString('es-AR')}
            {club && <span className="font-cuerpo font-normal text-tinta-2"> con {club.short}</span>}
          </span>
        </span>
        <span className="shrink-0 font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
          {abierta ? 'Cerrar' : 'Ver'}
        </span>
      </button>

      {abierta && (
        <div id={panelId} className="border-t border-corondel px-3 py-3">
          <p className="font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
            Copas ganadas ({vitrina.titulos.length} de {Object.keys(TITLES).length})
          </p>
          {vitrina.titulos.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {vitrina.titulos.map((id) => (
                <li key={id}>
                  <Ladillo tono="tinta">
                    {TITLES[id].label}
                  </Ladillo>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 font-cuerpo text-[14px] text-tinta-2">Todavía ninguna.</p>
          )}

          <p className="mt-4 font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
            Logros ({conseguidos.size} de {LOGROS.length})
          </p>
          <ul className="mt-2 space-y-1.5">
            {LOGROS.map((logro) => {
              const hecho = conseguidos.has(logro.id);
              if (logro.oculto && !hecho) {
                return (
                  <li key={logro.id} className="font-cuerpo text-[13px] text-tinta-2 italic">
                    Logro oculto
                  </li>
                );
              }
              return (
                <li key={logro.id} className="flex gap-2">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 border ${
                      hecho ? 'border-tinta bg-tinta' : 'border-tinta-2'
                    }`}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span
                      className={`block font-titular text-[14px] leading-tight font-bold ${
                        hecho ? 'text-tinta' : 'text-tinta-2'
                      }`}
                    >
                      <span className="sr-only">
                        {hecho ? 'Conseguido: ' : 'Pendiente: '}
                      </span>
                      {logro.label}
                    </span>
                    {!hecho && (
                      <span className="block font-cuerpo text-[13px] leading-snug text-tinta-2">
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
