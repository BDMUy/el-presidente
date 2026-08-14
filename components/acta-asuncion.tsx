'use client';

/**
 * El acta de asunción: lo primero que ve un jugador nuevo.
 *
 * Enseña los cinco recursos sin ser un tutorial, porque es diegética: es el
 * papel que te entregan cuando asumís, con el inventario de lo que recibís.
 *
 * Deliberadamente vive fuera del motor. No es una decisión, no cambia el
 * estado y no entra en el log de la partida: si fuera una fase del juego,
 * agregaría una elección al log y rompería la compatibilidad de las partidas
 * guardadas cada vez que la tocáramos.
 */

import type { Club, Resources } from '@/lib/engine/types';
import { entero, plataCorta, socios } from '@/lib/format';
import { RECURSOS } from '@/lib/recursos';
import { Continuar, Membrete, Papel, Puntos, Sello, Titulo } from './ui';

export function ActaAsuncion({
  club,
  resources,
  onAsumir,
}: {
  club: Club;
  resources: Resources;
  onAsumir: () => void;
}) {
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
        <p className="mt-3 font-body text-[16px] leading-relaxed text-tinta">
          Ganaste la elección. Tenés cuatro mandatos de cuatro temporadas para que no te echen, y
          esto es todo con lo que contás. Los partidos no los jugás vos: armás el plantel y el
          plantel responde.
        </p>
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
