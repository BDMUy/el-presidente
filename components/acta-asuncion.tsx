'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';

import { nombreDelPresidente, retratoDeSemilla } from '@/lib/dispositivo';
import { enLetras, mandatosDe } from '@/lib/engine/election';
import type { Club, Modo, Resources } from '@/lib/engine/types';
import { entero, plataCorta, socios } from '@/lib/format';
import { RECURSOS } from '@/lib/recursos';
import { useTintaClub } from '@/lib/tema';
import { Continuar, Ladillo, Puntos, Recuadro, Titular, Volanta } from './ui';

export function ActaAsuncion({
  club,
  resources,
  modo,
  seed,
  onAsumir,
}: {
  club: Club;
  resources: Resources;
  modo: Modo;
  seed: number;
  onAsumir: () => void;
}) {
  const mandatos = mandatosDe(modo);
  const tintaClub = useTintaClub(club);
  const retrato = retratoDeSemilla(seed);

  const [nombre, setNombre] = useState('');
  const [abierto, setAbierto] = useState<keyof Resources | null>(null);
  useEffect(() => {
    setNombre(nombreDelPresidente());
  }, []);

  const valor = (id: keyof Resources): string => {
    if (id === 'caja') return plataCorta(resources.caja);
    if (id === 'socios') return socios(resources.socios);
    return entero(resources[id]);
  };

  return (
    <div style={{ '--club': tintaClub } as CSSProperties}>
      <Recuadro acento="club">
        <div className="mb-4 flex h-1" aria-hidden>
          <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
          <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
        </div>

        <div className="flex items-start justify-between gap-4">
          <Volanta>Acta de asunción · {club.name}</Volanta>
          <Ladillo tono="club" animado className="shrink-0">
            Asumido
          </Ladillo>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Titular>Recibís el club</Titular>

            {nombre && (
              <p className="mt-2 flex items-baseline font-tabla text-[0.75rem] tracking-[0.06em] uppercase">
                <span className="text-tinta-2">Presidente</span>
                <Puntos />
                <span
                  className="border-b-2 pb-0.5 font-bold text-tinta"
                  style={{ borderColor: club.colors[1] }}
                >
                  {nombre}
                </span>
              </p>
            )}
          </div>

          {retrato && (
            <div className="mt-1 h-24 w-24 shrink-0 overflow-hidden border border-tinta-2 bg-fondo-2">
              <Image
                src={`/dirigentes/${retrato}.png`}
                alt=""
                width={192}
                height={192}
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}
        </div>

        <p className="mt-3 font-cuerpo text-[1rem] leading-relaxed text-tinta">
          {modo === 'llamas'
            ? 'Ganaste la elección porque no se presentó nadie más.'
            : 'Ganaste la elección.'}{' '}
          Tenés {enLetras(mandatos)} mandatos para hacer historia.
          Vos armás el plantel; los partidos los juega el equipo.
        </p>

        {modo === 'llamas' && (
          <p className="mt-3 border-l-2 border-alerta pl-3 font-cuerpo text-[1rem] leading-relaxed text-tinta">
            La gestión anterior dejó la deuda y se fue. Lo único que el club tiene para vender es
            el plantel, que es lo único que el club tiene para ganar.
          </p>
        )}

        <Continuar onClick={onAsumir}>
          Abrir el mercado <span className="flecha-accion" aria-hidden>→</span>
        </Continuar>

        <details className="mt-4 border-t border-corondel">
          <summary className="min-h-11 cursor-pointer py-3 font-tabla text-[0.75rem] text-tinta-2 uppercase">
            Cómo está el club al asumir <span className="indicador-mas" aria-hidden>+</span>
          </summary>
          <ul className="mt-1">
            {RECURSOS.map((recurso) => {
              const abiertoAca = abierto === recurso.id;
              return (
                <li key={recurso.id} className="border-t border-corondel">
                  <button
                    type="button"
                    onClick={() => setAbierto((a) => (a === recurso.id ? null : recurso.id))}
                    aria-expanded={abiertoAca}
                    className="flex min-h-11 w-full items-baseline gap-2 py-2.5 text-left"
                  >
                    <span className="font-tabla text-[0.8125rem] font-bold text-tinta uppercase">
                      {recurso.label}
                    </span>
                    <Puntos />
                    <span className="font-tabla text-[0.8125rem] font-bold text-tinta tabular-nums">
                      {valor(recurso.id)}
                    </span>
                    <span
                      aria-hidden
                      className={`shrink-0 self-center font-titular text-[0.75rem] text-tinta-3 transition-transform duration-200 ${
                        abiertoAca ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {abiertoAca && (
                    <div className="entrar-nota pb-3">
                      <p className="font-cuerpo text-[0.875rem] leading-snug text-tinta-2">
                        {recurso.texto}
                      </p>
                      {recurso.limite && (
                        <p className="mt-1.5 border-l-2 border-alerta pl-2.5 font-cuerpo text-[0.8125rem] leading-snug text-tinta-2">
                          {recurso.limite}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </details>

        <p className="mt-2 font-cuerpo text-[0.875rem] leading-snug text-tinta-2">
          Tocá las cifras de arriba cuando quieras entender cada recurso.
        </p>
      </Recuadro>
    </div>
  );
}
