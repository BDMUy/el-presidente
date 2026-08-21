'use client';

import { useEffect, useState } from 'react';

import { nombreDelPresidente } from '@/lib/dispositivo';
import { enLetras, mandatosDe } from '@/lib/engine/election';
import type { Club, Modo, Resources } from '@/lib/engine/types';
import { entero, plataCorta, socios } from '@/lib/format';
import { RECURSOS } from '@/lib/recursos';
import { Continuar, Membrete, Papel, Puntos, Sello, Titulo } from './ui';

export function ActaAsuncion({
  club,
  resources,
  modo,
  onAsumir,
}: {
  club: Club;
  resources: Resources;
  modo: Modo;
  onAsumir: () => void;
}) {
  const mandatos = mandatosDe(modo);

  const [nombre, setNombre] = useState('');
  useEffect(() => {
    setNombre(nombreDelPresidente());
  }, []);

  const valor = (id: keyof Resources): string => {
    if (id === 'caja') return plataCorta(resources.caja);
    if (id === 'socios') return socios(resources.socios);
    return entero(resources[id]);
  };

  return (
    <Papel torcido={1}>
      <div className="flex h-1.5 -mx-5 -mt-5 mb-5 sm:-mx-7 sm:-mt-7" aria-hidden>
        <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
        <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
      </div>

      <div className="flex items-start justify-between gap-4">
        <Membrete>Acta de asunción · {club.name}</Membrete>
        <Sello tono="bronce" animado className="shrink-0">
          Asumido
        </Sello>
      </div>

      <div className="mt-4">
        <Titulo>Recibís el club</Titulo>

        {nombre && (
          <p className="mt-2 flex items-baseline font-acta text-[12px] tracking-[0.06em] uppercase">
            <span className="text-tinta-2">Presidente</span>
            <Puntos />
            <span className="font-bold text-tinta">{nombre}</span>
          </p>
        )}

        <p className="mt-3 font-body text-[16px] leading-relaxed text-tinta">
          {modo === 'llamas'
            ? 'Ganaste la elección porque no se presentó nadie más.'
            : 'Ganaste la elección.'}{' '}
          Tenés {enLetras(mandatos)} {mandatos === 1 ? 'mandato' : 'mandatos'} de cuatro
          temporadas para que no te echen, y esto es todo con lo que contás. Los partidos no los
          jugás vos: armás el plantel y el plantel responde.
        </p>

        {modo === 'llamas' && (
          <p className="mt-3 border-l-2 border-sello pl-3 font-body text-[16px] leading-relaxed text-tinta">
            La gestión anterior dejó la deuda y se fue. Lo único que el club tiene para vender es
            el plantel, que es lo único que el club tiene para ganar.
          </p>
        )}
      </div>

      <div className="mt-6">
        <Membrete>Inventario</Membrete>
        <ul className="mt-3 space-y-4">
          {RECURSOS.map((recurso) => (
            <li key={recurso.id} className="border-t border-hoja-linea pt-3">
              <p className="flex items-baseline font-acta text-[13px] font-bold uppercase">
                <span className="text-tinta">{recurso.label}</span>
                <Puntos />
                <span className="text-tinta tabular-nums">{valor(recurso.id)}</span>
              </p>
              <p className="mt-1.5 font-body text-[14px] leading-snug text-tinta-2">
                {recurso.texto}
              </p>
              {recurso.limite && (
                <p className="mt-1.5 border-l-2 border-sello pl-2.5 font-body text-[13px] leading-snug text-tinta-2">
                  {recurso.limite}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 border-t border-hoja-linea pt-4 font-acta text-[12px] leading-relaxed tracking-wide text-tinta-2 uppercase">
        Podés volver a leer cualquiera de estos tocándolo en la barra de arriba.
      </p>

      <Continuar onClick={onAsumir}>Asumir el cargo</Continuar>
    </Papel>
  );
}
