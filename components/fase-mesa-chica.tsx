'use client';

/**
 * La Mesa Chica: el clímax de la temporada.
 *
 * Es la única pantalla sin papel. Acá no hay acta que firmar: estás sentado a
 * la mesa con tres fichas y cinco frentes, y lo único que podés hacer es
 * repartirlas. Después mirás.
 *
 * Tres decisiones sostienen el diseño:
 *
 * 1. Cada frente muestra sus tres casilleros vacíos y la ficha se ve caer
 *    adentro. La primera versión tenía las fichas flotando arriba, sin relación
 *    visual con su destino, y el gesto de repartir no existía en ningún lado.
 * 2. La barra separa lo que traías de lo que compraste. Ver crecer el tramo de
 *    bronce es la recompensa de gastar; un número solo no la da.
 * 3. Los frentes se ordenan de más a menos potente, para que el dilema quede a
 *    la vista: el que más suma es el que puede volver como escándalo.
 */

import { useMemo, useState } from 'react';

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
import { Continuar, Membrete, Papel, Sello, Titulo } from './ui';

const VACIO: MesaChicaAssignment = { plantel: 0, dt: 0, hinchada: 0, prensa: 0, gestion: 0 };

/**
 * Orden de presentación, de más a menos potente.
 *
 * Es una copia ordenada a propósito: el orden de FRENTES define los índices que
 * viajan en el log de la partida y en los links compartidos, así que ese array
 * no se toca nunca.
 */
const EN_PANTALLA: readonly FrenteDef[] = [...FRENTES].sort((a, b) => b.winPerFicha - a.winPerFicha);

/**
 * Qué cuesta una ficha en este frente, derivado del motor y no escrito a mano,
 * para que no pueda contradecir lo que el juego cobra de verdad.
 */
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
      {/* ── El partido ───────────────────────────────────────── */}
      <div className="text-center">
        <Membrete sobrePano>La mesa chica</Membrete>
        <h1 className="mt-2 text-balance font-display text-[clamp(1.5rem,7vw,2rem)] leading-[1.05] font-black tracking-tight text-papel uppercase">
          {match.label}
        </h1>
        <p className="mt-1.5 font-body text-[15px] text-papel-2">contra {match.rival}</p>
      </div>

      {/* ── La apuesta ───────────────────────────────────────── */}
      <div className="mt-6">
        <div className="flex items-end justify-center gap-2">
          <p className="font-display text-[3.75rem] leading-[0.85] font-black tabular-nums text-papel">
            {Math.round(probabilidad * 100)}
            <span className="text-2xl">%</span>
          </p>
          {ganado > 0 && (
            <p className="pb-2 font-display text-[20px] leading-none font-black tabular-nums text-bronce-claro">
              +{Math.round(ganado * 100)}
            </p>
          )}
        </div>

        {/* La barra separa lo que traías de lo que compraste con las fichas. */}
        <div className="mt-3 flex h-2.5 w-full overflow-hidden border border-linea" aria-hidden>
          <div
            className="bg-papel-2 transition-[width] duration-300 ease-out"
            style={{ width: `${base * 100}%` }}
          />
          <div
            className="bg-bronce-claro transition-[width] duration-300 ease-out"
            style={{ width: `${ganado * 100}%` }}
          />
        </div>
        <p className="mt-1.5 text-center font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
          {usadas === 0
            ? 'de ganarla si no movés un dedo'
            : `de ganarla · ${Math.round(base * 100)}% ya eran tuyos`}
        </p>
      </div>

      {/* ── Las fichas en la mano ────────────────────────────── */}
      <div className="mt-6 flex items-center justify-center gap-2.5" aria-live="polite">
        {Array.from({ length: FICHAS_MESA_CHICA }, (_, i) => (
          <span
            key={i}
            className={`h-8 w-8 rounded-full border-2 transition-all duration-200 ${
              i < disponibles
                ? 'border-bronce-claro bg-bronce-claro/30'
                : 'scale-90 border-dashed border-linea'
            }`}
            aria-hidden
          />
        ))}
        <span className="ml-1 font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
          {disponibles === 0
            ? 'todo repartido'
            : `${disponibles} ${disponibles === 1 ? 'ficha' : 'fichas'} por repartir`}
        </span>
      </div>

      {/* ── Los frentes ──────────────────────────────────────── */}
      <ul className="mt-5 space-y-2">
        {EN_PANTALLA.map((frente) => (
          <FilaFrente
            key={frente.id}
            frente={frente}
            puestas={reparto[frente.id]}
            hayFichas={disponibles > 0}
            onPoner={() => poner(frente.id)}
            onSacar={() => sacar(frente.id)}
          />
        ))}
      </ul>

      {/* ── Definir ──────────────────────────────────────────────
          Fija abajo: con cinco frentes el botón caía 175px debajo del
          pliegue, y en el momento más tenso de la temporada había que
          scrollear para poder decidir. La barra lleva además la
          probabilidad, para que el número siga a la vista mientras
          repartís las fichas más abajo. */}
      <div className="sticky bottom-0 -mx-4 mt-5 border-t border-pano-borde bg-pano-alto/97 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="flex items-baseline gap-1.5 font-display leading-none font-black tabular-nums">
              <span className="text-[26px] text-papel">{Math.round(probabilidad * 100)}%</span>
              {ganado > 0 && (
                <span className="text-[15px] text-bronce-claro">
                  +{Math.round(ganado * 100)}
                </span>
              )}
            </p>
            {/* Sin `truncate`: en la barra el costo es justo lo que hace falta
                saber antes de confirmar, y cortarlo con puntos suspensivos
                esconde el dato en el momento de decidir. Si no entra, envuelve. */}
            <p className="mt-1 font-acta text-[11px] leading-tight tracking-[0.02em] text-papel-2 uppercase">
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
            className={`shrink-0 px-5 py-3.5 font-display text-[13px] font-black tracking-[0.1em] uppercase transition-transform active:scale-[0.98] ${
              usadas > 0 ? 'bg-papel text-tinta' : 'border-2 border-papel-2 text-papel'
            }`}
          >
            {usadas === 0 ? 'No mover nada' : 'Que se juegue'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Un frente con sus tres casilleros.
 *
 * La fila entera agrega una ficha; cada ficha puesta se toca para sacarla. No
 * hay botón de quitar aparte: la ficha es el control.
 */
function FilaFrente({
  frente,
  puestas,
  hayFichas,
  onPoner,
  onSacar,
}: {
  frente: FrenteDef;
  puestas: number;
  hayFichas: boolean;
  onPoner: () => void;
  onSacar: () => void;
}) {
  const activo = puestas > 0;

  return (
    <li
      className={`flex items-center gap-3 border px-3 py-2.5 transition-colors ${
        activo ? 'border-bronce-claro/70 bg-bronce-claro/12' : 'border-linea bg-pano-alto/40'
      }`}
    >
      <button
        type="button"
        onClick={onPoner}
        disabled={!hayFichas}
        className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
        aria-label={`Poner una ficha en ${frente.label}`}
      >
        <span className="flex items-baseline gap-2">
          {/* En caja baja: son frases, y en mayúsculas se leen más lento. */}
          <span className="font-display text-[15px] leading-tight font-bold tracking-tight text-papel">
            {frente.label}
          </span>
          <span className="shrink-0 font-display text-[13px] leading-none font-black tabular-nums text-bronce-claro">
            +{Math.round(frente.winPerFicha * 100)}%
          </span>
        </span>

        <span className="mt-0.5 block font-body text-[13.5px] leading-snug text-papel-2">
          {frente.desc}
        </span>

        <span className="mt-1 flex flex-wrap items-baseline gap-x-2 font-acta text-[11px] tracking-[0.04em] uppercase">
          <span className="text-papel-2">{etiquetaDeCosto(frente.id)}</span>
          {frente.riesgo && <span className="text-sello-claro">· {frente.riesgo}</span>}
        </span>
      </button>

      {/* Los tres casilleros: se ve dónde fue cada ficha sin leer nada. */}
      <div className="flex shrink-0 gap-1">
        {Array.from({ length: FICHAS_MESA_CHICA }, (_, i) =>
          i < puestas ? (
            <button
              key={i}
              type="button"
              onClick={onSacar}
              aria-label={`Sacar una ficha de ${frente.label}`}
              className="h-6 w-6 rounded-full bg-bronce-claro transition-transform hover:scale-110 active:scale-95"
            />
          ) : (
            <span
              key={i}
              className="h-6 w-6 rounded-full border border-dashed border-linea"
              aria-hidden
            />
          ),
        )}
      </div>
    </li>
  );
}

/** El resultado del partido, ya sobre papel: pasó a ser historia. */
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
    <Papel torcido={2}>
      <div className="flex items-start justify-between gap-4">
        <Membrete>{match.label}</Membrete>
        <Sello tono={won ? 'verde' : 'rojo'} animado className="shrink-0">
          {won ? 'Campeón' : 'Perdida'}
        </Sello>
      </div>

      <div className="mt-5">
        <Titulo>{won ? 'Se dio' : 'No se dio'}</Titulo>
        <p className="mt-3 font-body text-[16px] leading-relaxed text-tinta">{text}</p>
      </div>

      <Continuar onClick={onContinuar}>Ver la temporada</Continuar>
    </Papel>
  );
}
