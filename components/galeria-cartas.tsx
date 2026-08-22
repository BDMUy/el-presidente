'use client';

import { useMemo, useState } from 'react';

import { ASCENSO } from '@/content/events/ascenso';
import { COLOR } from '@/content/events/color';
import { COPAS } from '@/content/events/copas';
import { CORRUPCION } from '@/content/events/corrupcion';
import { CRISIS } from '@/content/events/crisis';
import { DIRIGENCIA } from '@/content/events/dirigencia';
import { ECONOMIA } from '@/content/events/economia';
import { FEMENINO } from '@/content/events/femenino';
import { HINCHADA } from '@/content/events/hinchada';
import { INFERIORES } from '@/content/events/inferiores';
import { LEGADO } from '@/content/events/legado';
import { VESTUARIO } from '@/content/events/vestuario';
import type { Condition, GameEvent } from '@/lib/engine/types';
import { FaseEvento } from './fase-evento';

interface Frente {
  archivo: string;
  cartas: GameEvent[];
}

const FRENTES: Frente[] = [
  { archivo: 'vestuario', cartas: VESTUARIO },
  { archivo: 'hinchada', cartas: HINCHADA },
  { archivo: 'dirigencia', cartas: DIRIGENCIA },
  { archivo: 'color', cartas: COLOR },
  { archivo: 'economia', cartas: ECONOMIA },
  { archivo: 'inferiores', cartas: INFERIORES },
  { archivo: 'femenino', cartas: FEMENINO },
  { archivo: 'corrupcion', cartas: CORRUPCION },
  { archivo: 'ascenso', cartas: ASCENSO },
  { archivo: 'copas', cartas: COPAS },
  { archivo: 'crisis', cartas: CRISIS },
  { archivo: 'legado', cartas: LEGADO },
];

export function GaleriaCartas() {
  const [frente, setFrente] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [verConsecuencias, setVerConsecuencias] = useState(true);

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return FRENTES.filter((f) => frente === 'todos' || f.archivo === frente)
      .map((f) => ({
        ...f,
        cartas: texto
          ? f.cartas.filter((c) =>
              `${c.id} ${c.title} ${c.text} ${c.options.map((o) => `${o.label} ${o.hint}`).join(' ')}`
                .toLowerCase()
                .includes(texto),
            )
          : f.cartas,
      }))
      .filter((f) => f.cartas.length > 0);
  }, [frente, busqueda]);

  const total = visibles.reduce((n, f) => n + f.cartas.length, 0);

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-20 border-b border-pano-borde bg-pano-alto/97 backdrop-blur">
        <div className="mx-auto w-full max-w-xl px-4 py-3">
          <p className="font-acta text-[11px] tracking-[0.14em] text-papel-2 uppercase">
            Galería de actas · {total} {total === 1 ? 'carta' : 'cartas'}
          </p>

          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en el texto de las cartas"
            className="mt-2 min-h-11 w-full border border-linea bg-pano px-3 font-body text-[15px] text-papel placeholder:text-papel-2"
          />

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip activo={frente === 'todos'} onClick={() => setFrente('todos')}>
              todos
            </Chip>
            {FRENTES.map((f) => (
              <Chip key={f.archivo} activo={frente === f.archivo} onClick={() => setFrente(f.archivo)}>
                {f.archivo}
              </Chip>
            ))}
          </div>

          <label className="mt-2 flex min-h-11 items-center gap-2 font-acta text-[11px] tracking-[0.1em] text-papel-2 uppercase">
            <input
              type="checkbox"
              checked={verConsecuencias}
              onChange={(e) => setVerConsecuencias(e.target.checked)}
              className="size-4 accent-papel"
            />
            Ver las consecuencias
          </label>
        </div>
      </div>

      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        {visibles.map((f) => (
          <section key={f.archivo}>
            <h2 className="mt-8 mb-3 font-display text-[13px] font-black tracking-[0.14em] text-papel uppercase first:mt-0">
              {f.archivo} · {f.cartas.length}
            </h2>

            {f.cartas.map((carta) => (
              <Ficha key={carta.id} carta={carta} verConsecuencias={verConsecuencias} />
            ))}
          </section>
        ))}

        {total === 0 && (
          <p className="font-body text-[15px] text-papel-2">
            Ninguna carta dice eso.
          </p>
        )}
      </div>
    </main>
  );
}

function Ficha({ carta, verConsecuencias }: { carta: GameEvent; verConsecuencias: boolean }) {
  const todas = carta.options.map((_, i) => i);

  return (
    <section className="mb-10">
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-acta text-[10px] tracking-[0.08em] text-papel-2 uppercase">
        <span className="text-papel">{carta.id}</span>
        {carta.once && <span>· única</span>}
        {carta.weight !== undefined && <span>· peso {carta.weight}</span>}
        {carta.requires && <span>· {describirCondicion(carta.requires)}</span>}
      </div>

      <FaseEvento
        event={carta}
        available={todas}
        enLaTemporada={1}
        porTemporada={4}
        onElegir={() => {}}
      />

      {verConsecuencias && <Consecuencias carta={carta} />}
    </section>
  );
}

function Consecuencias({ carta }: { carta: GameEvent }) {
  return (
    <div className="mt-3 border-l-2 border-pano-borde pl-3">
      {carta.options.map((option, i) => (
        <div key={i} className="mt-2 first:mt-0">
          <p className="font-acta text-[10px] tracking-[0.08em] text-papel-2 uppercase">
            {option.label}
            {option.requires && ` · ${describirCondicion(option.requires)}`}
          </p>

          {option.random ? (
            <ul>
              {option.random.map((salida, j) => (
                <li key={j} className="mt-1 font-body text-[14px] leading-snug text-papel">
                  <span className="font-acta text-[11px] text-papel-2">
                    {Math.round((salida.weight / pesoTotal(option.random!)) * 100)}%{' '}
                  </span>
                  {salida.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 font-body text-[14px] leading-snug text-papel">{option.hint}</p>
          )}

          {(option.effects?.deferred ?? []).map((d, j) => (
            <p key={j} className="mt-1 font-body text-[14px] leading-snug text-bronce">
              en {d.inSeasons} {d.inSeasons === 1 ? 'temporada' : 'temporadas'}: {d.text}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

function pesoTotal(salidas: { weight: number }[]): number {
  return salidas.reduce((n, s) => n + s.weight, 0) || 1;
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1.5 font-acta text-[10px] tracking-[0.08em] uppercase ${
        activo ? 'bg-papel text-tinta' : 'border border-linea text-papel-2'
      }`}
    >
      {children}
    </button>
  );
}

function describirCondicion(c: Condition): string {
  const partes: string[] = [];
  if (c.minSeason) partes.push(`desde la ${c.minSeason}`);
  if (c.maxSeason) partes.push(`hasta la ${c.maxSeason}`);
  if (c.league) partes.push(c.league.join('/'));
  if (c.country) partes.push(c.country.join('/'));
  if (c.minCaja !== undefined) partes.push(`caja ≥ ${c.minCaja}`);
  if (c.maxCaja !== undefined) partes.push(`caja ≤ ${c.maxCaja}`);
  if (c.minHinchada !== undefined) partes.push(`hinchada ≥ ${c.minHinchada}`);
  if (c.maxHinchada !== undefined) partes.push(`hinchada ≤ ${c.maxHinchada}`);
  if (c.minInfluencia !== undefined) partes.push(`influencia ≥ ${c.minInfluencia}`);
  if (c.maxInfluencia !== undefined) partes.push(`influencia ≤ ${c.maxInfluencia}`);
  if (c.minPlantel !== undefined) partes.push(`plantel ≥ ${c.minPlantel}`);
  if (c.maxPlantel !== undefined) partes.push(`plantel ≤ ${c.maxPlantel}`);
  if (c.minSize !== undefined) partes.push(`club ≥ ${c.minSize}`);
  if (c.maxSize !== undefined) partes.push(`club ≤ ${c.maxSize}`);
  if (c.flag) partes.push(c.flag);
  if (c.notFlag) partes.push(`sin ${c.notFlag}`);
  for (const [nombre, minimo] of Object.entries(c.minFlag ?? {})) {
    partes.push(`${nombre} ≥ ${minimo}`);
  }
  return partes.join(', ');
}
