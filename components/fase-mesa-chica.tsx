'use client';

import { useMemo, useState } from 'react';

import { enLetras } from '@/lib/engine/election';
import { assignmentCost, assignmentIndex, costoPorFicha, winProbability } from '@/lib/engine/mesa-chica';
import {
  FICHAS_MESA_CHICA,
  FRENTES,
  type BigMatch,
  type Frente,
  type FrenteDef,
  type MesaChicaAssignment,
} from '@/lib/engine/types';
import { plata } from '@/lib/format';
import { Continuar, Ladillo, Recuadro, Titular, Volanta } from './ui';

const VACIO: MesaChicaAssignment = { plantel: 0, dt: 0, hinchada: 0, prensa: 0, gestion: 0 };

const EN_PANTALLA: readonly FrenteDef[] = [...FRENTES].sort((a, b) => b.winPerFicha - a.winPerFicha);

function etiquetaDeCosto(frente: Frente): string {
  const { caja, influencia, hinchada } = costoPorFicha(frente);
  const partes: string[] = [];
  if (caja) partes.push(plata(Math.abs(caja)));
  if (influencia) partes.push(`${Math.abs(influencia)} de influencia`);
  if (hinchada && hinchada > 0) partes.push(`+${hinchada} hinchada`);
  return partes.length > 0 ? partes.join(' · ') : 'no cuesta nada';
}

export function FaseMesaChica({
  match,
  onDefinir,
}: {
  match: BigMatch;
  onDefinir: (choice: number) => void;
}) {
  const [reparto, setReparto] = useState<MesaChicaAssignment>(VACIO);
  const [verCostos, setVerCostos] = useState(false);

  const usadas = useMemo(() => Object.values(reparto).reduce((s, n) => s + n, 0), [reparto]);
  const disponibles = FICHAS_MESA_CHICA - usadas;

  const probabilidad = winProbability(match, reparto);
  const base = winProbability(match, VACIO);
  const ganado = Math.max(0, probabilidad - base);
  const costo = assignmentCost(reparto);

  const poner = (frente: Frente) => {
    if (disponibles === 0) return;
    setReparto((prev) => ({ ...prev, [frente]: prev[frente] + 1 }));
  };

  const sacar = (frente: Frente) => {
    setReparto((prev) => ({ ...prev, [frente]: Math.max(0, prev[frente] - 1) }));
  };

  return (
    <div>
      <div className="text-center">
        <Volanta>La mesa chica</Volanta>
        <h1 className="mt-2 text-balance font-titular text-[clamp(1.5rem,7vw,2rem)] leading-[1.05] font-black tracking-tight text-tinta uppercase">
          {match.label}
        </h1>
        <p className="mt-1.5 font-cuerpo text-[15px] text-tinta-2">contra {match.rival}</p>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-center gap-2">
          <p className="font-titular text-[3.75rem] leading-[0.85] font-black tabular-nums text-tinta">
            {Math.round(probabilidad * 100)}
            <span className="text-2xl">%</span>
          </p>
          {ganado > 0 && (
            <p className="pb-2 font-titular text-[20px] leading-none font-black tabular-nums text-tinta">
              +{Math.round(ganado * 100)}
            </p>
          )}
        </div>

        <div className="mt-3 flex h-2.5 w-full overflow-hidden border border-corondel" aria-hidden>
          <div
            className="bg-tinta-2 transition-[width] duration-300 ease-out"
            style={{ width: `${base * 100}%` }}
          />
          <div
            className="bg-tinta transition-[width] duration-300 ease-out"
            style={{ width: `${ganado * 100}%` }}
          />
        </div>
        <p className="mt-1.5 text-center font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
          {usadas === 0
            ? 'de ganarla si no movés un dedo'
            : `de ganarla · ${Math.round(base * 100)}% ya eran tuyos`}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {Math.round(probabilidad * 100)}% de ganar
        {ganado > 0 ? `, contra ${Math.round(base * 100)}% sin mover fichas` : ''}.{' '}
        {disponibles === 0
          ? 'Todas las fichas repartidas.'
          : `${disponibles} ${disponibles === 1 ? 'ficha' : 'fichas'} sin repartir.`}
      </p>

      <div className="mt-6 flex items-center justify-center gap-2.5">
        {Array.from({ length: FICHAS_MESA_CHICA }, (_, i) => (
          <span
            key={i}
            className={`h-8 w-8 rounded-full border-2 transition-all duration-200 ${
              i < disponibles
                ? 'border-tinta bg-tinta/30'
                : 'scale-90 border-dashed border-corondel'
            }`}
            aria-hidden
          />
        ))}
        <span className="ml-1 font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
          {disponibles === 0
            ? 'todo repartido'
            : `${disponibles} ${disponibles === 1 ? 'ficha' : 'fichas'} por repartir`}
        </span>
      </div>

      <div className="mt-6">
        <p className="font-cuerpo text-[14px] leading-snug text-tinta-2">
          Tenés {enLetras(FICHAS_MESA_CHICA)} fichas para repartir entre los frentes con los botones{' '}
          <span className="font-tabla text-tinta">−</span> y{' '}
          <span className="font-tabla text-tinta">+</span>. Cada una sube la probabilidad de ganar.
        </p>
        <button
          type="button"
          onClick={() => setVerCostos((v) => !v)}
          aria-expanded={verCostos}
          className="mt-1.5 min-h-11 font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase underline underline-offset-4 hover:text-tinta"
        >
          {verCostos ? 'Ocultar lo que cuesta cada frente' : 'Ver lo que cuesta cada frente'}
        </button>
      </div>

      <ul className="mt-3 space-y-2">
        {EN_PANTALLA.map((frente) => (
          <FilaFrente
            key={frente.id}
            frente={frente}
            puestas={reparto[frente.id]}
            hayFichas={disponibles > 0}
            verCostos={verCostos}
            onPoner={() => poner(frente.id)}
            onSacar={() => sacar(frente.id)}
          />
        ))}
      </ul>

      <div
        className="sticky bottom-0 -mx-4 mt-5 border-t-4 border-tinta bg-fondo-2/97 px-4 pt-3 backdrop-blur"
        style={{ paddingBottom: 'calc(0.75rem + var(--sae-bottom))' }}
      >
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="flex items-baseline gap-1.5 font-titular leading-none font-black tabular-nums">
              <span className="text-[26px] text-tinta">{Math.round(probabilidad * 100)}%</span>
              {ganado > 0 && (
                <span className="text-[15px] text-tinta">
                  +{Math.round(ganado * 100)}
                </span>
              )}
            </p>
            <p className="mt-1 font-tabla text-[11px] leading-tight tracking-[0.02em] text-tinta-2 uppercase">
              {usadas === 0
                ? `${FICHAS_MESA_CHICA} fichas sin usar`
                : [
                    costo.caja ? plata(Math.abs(costo.caja)) : null,
                    costo.influencia ? `${Math.abs(costo.influencia)} de influencia` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDefinir(assignmentIndex(reparto))}
            className={`shrink-0 px-5 py-3.5 font-titular text-[13px] font-black tracking-[0.1em] uppercase transition-colors ${
              usadas > 0 ? 'bg-tinta text-fondo active:bg-tinta-2' : 'border-2 border-corondel text-tinta-2'
            }`}
          >
            {usadas === 0 ? 'No mover nada' : 'Que se juegue'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilaFrente({
  frente,
  puestas,
  hayFichas,
  verCostos,
  onPoner,
  onSacar,
}: {
  frente: FrenteDef;
  puestas: number;
  hayFichas: boolean;
  verCostos: boolean;
  onPoner: () => void;
  onSacar: () => void;
}) {
  const activo = puestas > 0;
  const botonStepper =
    'flex min-h-11 min-w-11 shrink-0 items-center justify-center border border-corondel font-titular text-[20px] leading-none font-black text-tinta transition-colors hover:border-tinta active:bg-tinta/15 disabled:opacity-40 disabled:hover:border-corondel';

  return (
    <li
      className={`border px-3 py-2.5 transition-colors ${
        activo ? 'border-tinta/70 bg-tinta/12' : 'border-corondel bg-fondo-2/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline gap-2">
            <span className="font-titular text-[15px] leading-tight font-bold tracking-tight text-tinta">
              {frente.label}
            </span>
            <span className="shrink-0 font-titular text-[13px] leading-none font-black tabular-nums text-tinta">
              +{Math.round(frente.winPerFicha * 100)}%
            </span>
          </p>

          <p className="mt-0.5 font-cuerpo text-[14px] leading-snug text-tinta-2">{frente.desc}</p>

          {verCostos && (
            <p className="entrar-nota mt-1.5 flex flex-wrap items-baseline gap-x-2 font-tabla text-[11px] tracking-[0.04em] uppercase">
              <span className="text-tinta-2">{etiquetaDeCosto(frente.id)}</span>
              {frente.riesgo && <span className="text-alerta">· {frente.riesgo}</span>}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onSacar}
            disabled={puestas === 0}
            aria-label={`Sacar una ficha de ${frente.label}. Lleva ${puestas} de ${FICHAS_MESA_CHICA}.`}
            className={botonStepper}
          >
            −
          </button>

          <span className="flex w-10 items-center justify-center gap-1" aria-hidden>
            {Array.from({ length: FICHAS_MESA_CHICA }, (_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i < puestas ? 'bg-tinta' : 'border border-corondel'
                }`}
              />
            ))}
          </span>

          <button
            type="button"
            onClick={onPoner}
            disabled={!hayFichas}
            aria-label={`Poner una ficha en ${frente.label}. Lleva ${puestas} de ${FICHAS_MESA_CHICA}.`}
            className={botonStepper}
          >
            +
          </button>
        </div>
      </div>
    </li>
  );
}

export function FaseResultadoFinal({
  won,
  text,
  match,
  onContinuar,
}: {
  won: boolean;
  text: string;
  match: BigMatch;
  onContinuar: () => void;
}) {
  return (
    <Recuadro>
      <div className="flex items-start justify-between gap-4">
        <Volanta>{match.label}</Volanta>
        <Ladillo tono={won ? 'favorable' : 'alerta'} animado className="shrink-0">
          {won ? 'Campeón' : 'Perdida'}
        </Ladillo>
      </div>

      <div className="mt-5">
        <Titular>{won ? 'Se dio' : 'No se dio'}</Titular>
        <p className="mt-3 font-cuerpo text-[16px] leading-relaxed text-tinta">{text}</p>
      </div>

      <Continuar onClick={onContinuar}>Ver la temporada</Continuar>
    </Recuadro>
  );
}
