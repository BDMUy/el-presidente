'use client';

import { useEffect, useId, useState } from 'react';
import Image from 'next/image';

import { LOGROS } from '@/content/logros';
import { getClub } from '@/content/clubs';
import { TITLES } from '@/lib/engine/types';
import { leerVitrina, type Vitrina } from '@/lib/vitrina';
import { GrillaTrofeos } from './grilla-trofeos';

export function VitrinaPanel() {
  const [vitrina, setVitrina] = useState<Vitrina | null>(null);
  const [abierta, setAbierta] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const leida = leerVitrina();
    setVitrina(leida);
  }, []);

  if (!vitrina) return null;

  if (vitrina.partidas === 0) {
    return (
      <details className="mt-6">
        <summary className="fila-abrir flex min-h-11 cursor-pointer items-center justify-between px-3 py-2.5 font-titular font-bold">Tu vitrina</summary>
        <Image src="/ilustraciones/vitrina-vacia.webp" alt="" width={1264} height={848} sizes="(max-width: 600px) 85vw, 400px" className="mt-2 h-24 w-full object-cover object-center" />
        <div className="py-3">
          <h2 className="font-titular text-[0.9375rem] font-bold">Esta vitrina te espera</h2>
          <p className="mt-1 font-cuerpo text-[0.875rem] text-tinta-2">Las copas y los logros que consigas van a quedar acá.</p>
        </div>
      </details>
    );
  }

  const club = vitrina.mejorClub ? getClub(vitrina.mejorClub) : null;
  const conseguidos = new Set(vitrina.logros);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        aria-controls={panelId}
        className="fila-abrir flex min-h-11 w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-tabla text-[0.75rem] tracking-[0.06em] text-tinta-2 uppercase">
            Tu vitrina · {vitrina.partidas}{' '}
            {vitrina.partidas === 1 ? 'presidencia' : 'presidencias'}
          </span>
          <span className="mt-0.5 block font-titular text-[0.9375rem] leading-tight font-bold text-tinta">
            Mejor puntaje {vitrina.mejorPuntaje.toLocaleString('es-AR')}
            {club && <span className="font-cuerpo font-normal text-tinta-2"> con {club.short}</span>}
          </span>
        </span>
      </button>

      {abierta && (
        <div id={panelId} className="entrar-nota border-t border-corondel py-3">
          <p className="font-tabla text-[0.75rem] tracking-[0.06em] text-tinta-2 uppercase">
            Copas ganadas ({vitrina.titulos.length} de {Object.keys(TITLES).length})
          </p>
          {vitrina.titulos.length > 0 ? (
            <GrillaTrofeos titulos={new Map(vitrina.titulos.map((id) => [id, 1]))} />
          ) : (
            <p className="mt-1.5 font-cuerpo text-[0.875rem] text-tinta-2">Todavía ninguna.</p>
          )}

          <p className="mt-4 font-tabla text-[0.75rem] tracking-[0.06em] text-tinta-2 uppercase">
            Logros ({conseguidos.size} de {LOGROS.length})
          </p>
          <ul className="mt-2 space-y-1.5">
            {LOGROS.map((logro) => {
              const hecho = conseguidos.has(logro.id);
              if (logro.oculto && !hecho) {
                return (
                  <li key={logro.id} className="font-cuerpo text-[0.8125rem] text-tinta-2 italic">
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
                      className={`block font-titular text-[0.875rem] leading-tight font-bold ${
                        hecho ? 'text-tinta' : 'text-tinta-2'
                      }`}
                    >
                      <span className="sr-only">
                        {hecho ? 'Conseguido: ' : 'Pendiente: '}
                      </span>
                      {logro.label}
                    </span>
                    {!hecho && (
                      <span className="block font-cuerpo text-[0.8125rem] leading-snug text-tinta-2">
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
