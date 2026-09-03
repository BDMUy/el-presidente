'use client';

import { useState, type CSSProperties } from 'react';

import { LEAGUES, type Club, type Resources } from '@/lib/engine/types';
import { entero, plataCorta, socios } from '@/lib/format';
import { RECURSOS_POR_ID } from '@/lib/recursos';
import { useTintaClub } from '@/lib/tema';
import { BarraSuperior } from './barra-superior';
import { Cifra } from './ui';

export interface HudProps {
  club: Club;
  resources: Resources;
  season: number;
  year: number;
  mandate: number;
  league: Club['league'];
  inhibido: boolean;
  onVolver: () => void;
  onAjustes: () => void;
}

export function Hud({
  club,
  resources,
  season,
  year,
  mandate,
  league,
  inhibido,
  onVolver,
  onAjustes,
}: HudProps) {
  const [abierto, setAbierto] = useState<keyof Resources | null>(null);
  const tintaClub = useTintaClub(club);

  const alternar = (campo: keyof Resources) =>
    setAbierto((actual) => (actual === campo ? null : campo));

  const detalle = abierto ? RECURSOS_POR_ID[abierto] : null;

  const [vistos, setVistos] = useState(resources);
  const [previo, setPrevio] = useState<Resources | null>(null);
  if (vistos !== resources) {
    setPrevio(vistos);
    setVistos(resources);
  }

  const cambio = (campo: keyof Resources) => {
    const texto = previo && formatearDelta(campo, resources[campo] - previo[campo]);
    return texto
      ? { delta: texto, deltaTono: texto.startsWith('−') ? ('alerta' as const) : ('favorable' as const) }
      : undefined;
  };

  return (
    <header
      className="sticky top-0 z-20"
      style={{ '--club': tintaClub } as CSSProperties}
    >
      <div className="mx-auto max-w-xl bg-fondo-2/97 backdrop-blur" style={{ paddingTop: 'var(--sae-top)' }}>
        <div className="px-3 sm:px-4">
          <BarraSuperior onVolver={onVolver} onAjustes={onAjustes} />
        </div>

        <div className="flex items-baseline justify-between gap-3 px-3 pt-2.5 sm:px-4">
          <p
            className="truncate font-titular text-[15px] leading-none font-black tracking-tight text-tinta"
            style={{ fontStretch: '75%' }}
          >
            {club.name}
          </p>
          <p className="shrink-0 font-tabla text-[11px] font-bold tracking-[0.06em] text-tinta-2 uppercase tabular-nums">
            T{season} · {year}
          </p>
        </div>

        <p className="mt-1 px-3 font-tabla text-[11px] font-bold tracking-[0.06em] text-[var(--club)] uppercase sm:px-4">
          {LEAGUES[league].label} · Mandato {mandate}
          {inhibido && <span className="ml-2 text-alerta">· inhibido</span>}
        </p>

        <div
          data-recorrido="hud-recursos"
          className="mt-2 grid grid-cols-3 gap-1 border-t border-corondel px-2 py-2 divide-corondel min-[360px]:grid-cols-5 min-[360px]:divide-x sm:px-3"
        >
          <Cifra
            label="Caja"
            valor={plataCorta(resources.caja)}
            alerta={resources.caja < 0}
            abierta={abierto === 'caja'}
            onToggle={() => alternar('caja')}
            retraso={0}
            {...cambio('caja')}
          />
          <Cifra
            label="Hinchada"
            valor={entero(resources.hinchada)}
            alerta={resources.hinchada < 25}
            abierta={abierto === 'hinchada'}
            onToggle={() => alternar('hinchada')}
            retraso={40}
            {...cambio('hinchada')}
          />
          <Cifra
            label="Socios"
            valor={socios(resources.socios)}
            abierta={abierto === 'socios'}
            onToggle={() => alternar('socios')}
            retraso={80}
            {...cambio('socios')}
          />
          <Cifra
            label="Plantel"
            valor={entero(resources.plantel)}
            abierta={abierto === 'plantel'}
            onToggle={() => alternar('plantel')}
            retraso={120}
            {...cambio('plantel')}
          />
          <Cifra
            label="Influencia"
            valor={entero(resources.influencia)}
            abierta={abierto === 'influencia'}
            onToggle={() => alternar('influencia')}
            retraso={160}
            {...cambio('influencia')}
          />
        </div>

        {detalle && (
          <div className="entrar-nota border-t border-corondel bg-fondo/60 px-3 py-3 sm:px-4">
            <p className="font-tabla text-[11px] font-bold tracking-[0.1em] text-[var(--club)] uppercase">
              {detalle.label}
            </p>
            <p className="mt-1.5 font-cuerpo text-[14px] leading-snug text-tinta">{detalle.texto}</p>
            {detalle.limite && (
              <p className="mt-2 border-l-2 border-alerta pl-2.5 font-cuerpo text-[13px] leading-snug text-tinta-2">
                {detalle.limite}
              </p>
            )}
            <button
              type="button"
              onClick={() => setAbierto(null)}
              className="mt-2.5 font-tabla text-[11px] font-bold tracking-[0.1em] text-tinta-2 uppercase underline underline-offset-4 hover:text-tinta"
            >
              Cerrar
            </button>
          </div>
        )}

        <div className="flex h-1" aria-hidden>
          <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
          <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
        </div>
      </div>
    </header>
  );
}

function formatearDelta(campo: keyof Resources, d: number): string | null {
  if (campo === 'caja') {
    if (Math.abs(d) < 0.05) return null;
    const abs = Math.abs(d);
    const num = abs < 10 ? abs.toFixed(1).replace('.', ',') : String(Math.round(abs));
    return `${d > 0 ? '+' : '−'}${num}M`;
  }
  const r = Math.round(d);
  if (r === 0) return null;
  const unidad = campo === 'socios' ? 'k' : '';
  return `${r > 0 ? '+' : '−'}${Math.abs(r)}${unidad}`;
}
