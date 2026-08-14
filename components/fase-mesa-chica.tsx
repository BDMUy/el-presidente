'use client';

/**
 * La Mesa Chica: el clímax de la temporada.
 *
 * Es la única pantalla sin papel. Acá no hay acta que firmar: estás sentado a
 * la mesa con tres fichas y cinco frentes, y lo único que podés hacer es
 * repartirlas. Después mirás.
 *
 * La probabilidad se muestra en vivo a propósito. El dilema no es adivinar
 * cuánto suma cada ficha: es ver que la gestión política es la que más suma
 * y decidir igual si la usás.
 */

import { useMemo, useState } from 'react';

import { assignmentCost, assignmentIndex, winProbability } from '@/lib/engine/mesa-chica';
import { FICHAS_MESA_CHICA, FRENTES, type BigMatch, type Frente, type MesaChicaAssignment } from '@/lib/engine/types';
import { plata } from '@/lib/format';
import { Continuar, Membrete, Papel, Sello, Titulo } from './ui';

const VACIO: MesaChicaAssignment = { plantel: 0, dt: 0, hinchada: 0, prensa: 0, gestion: 0 };

export function FaseMesaChica({
  match,
  onDefinir,
}: {
  match: BigMatch;
  onDefinir: (choice: number) => void;
}) {
  const [reparto, setReparto] = useState<MesaChicaAssignment>(VACIO);

  const usadas = useMemo(
    () => Object.values(reparto).reduce((sum, n) => sum + n, 0),
    [reparto],
  );
  const disponibles = FICHAS_MESA_CHICA - usadas;

  const probabilidad = winProbability(match, reparto);
  const base = winProbability(match, VACIO);
  const costo = assignmentCost(reparto);

  const poner = (frente: Frente) => {
    if (disponibles === 0) return;
    setReparto((prev) => ({ ...prev, [frente]: prev[frente] + 1 }));
  };

  const sacar = (frente: Frente) => {
    setReparto((prev) => ({ ...prev, [frente]: Math.max(0, prev[frente] - 1) }));
  };

  return (
    <div className="px-1">
      <div className="text-center">
        <Membrete sobrePano>La mesa chica</Membrete>
        <h1 className="mt-2 font-display text-2xl leading-tight font-black tracking-tight text-papel uppercase">
          {match.label}
        </h1>
        <p className="mt-1 font-body text-[15px] text-papel-2">contra {match.rival}</p>
      </div>

      {/* El marcador de la apuesta: probabilidad en vivo. */}
      <div className="mt-6 flex items-end justify-center gap-3">
        <p className="font-display text-[3.5rem] leading-none font-black tabular-nums text-papel">
          {Math.round(probabilidad * 100)}
          <span className="text-2xl">%</span>
        </p>
        <p className="pb-2 font-acta text-[11px] leading-tight tracking-[0.1em] text-papel-2 uppercase">
          de ganarla
          <br />
          sin mover: {Math.round(base * 100)}%
        </p>
      </div>

      {/* Las fichas en la mano. */}
      <div className="mt-5 flex items-center justify-center gap-2" aria-live="polite">
        {Array.from({ length: FICHAS_MESA_CHICA }, (_, i) => (
          <span
            key={i}
            className={`h-7 w-7 rounded-full border-2 transition-all ${
              i < disponibles
                ? 'border-bronce-claro bg-bronce-claro/25'
                : 'border-linea bg-transparent'
            }`}
            aria-hidden
          />
        ))}
        <span className="ml-2 font-acta text-[11px] tracking-[0.1em] text-papel-2 uppercase">
          {disponibles === 0 ? 'sin fichas' : `${disponibles} por repartir`}
        </span>
      </div>

      {/* Los cinco frentes. */}
      <ul className="mt-6 space-y-2">
        {FRENTES.map((frente) => (
          <li key={frente.id}>
            <div
              className={`flex items-center gap-3 border px-3 py-2.5 transition-colors ${
                reparto[frente.id] > 0
                  ? 'border-bronce-claro/70 bg-bronce-claro/10'
                  : 'border-linea bg-pano-alto/40'
              }`}
            >
              <button
                type="button"
                onClick={() => poner(frente.id)}
                disabled={disponibles === 0}
                className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
                aria-label={`Poner una ficha en ${frente.label}`}
              >
                <span className="flex items-baseline gap-2">
                  {/* En caja baja: son frases, y en mayúsculas se leen más lento. */}
                  <span className="font-display text-[15px] leading-tight font-bold tracking-tight text-papel">
                    {frente.label}
                  </span>
                  <span className="font-acta text-[11px] text-papel-2 tabular-nums">
                    +{Math.round(frente.winPerFicha * 100)}%
                  </span>
                </span>
                <span className="mt-0.5 block font-body text-[14px] leading-snug text-papel-2">
                  {frente.desc}
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-1">
                {Array.from({ length: reparto[frente.id] }, (_, i) => (
                  <span key={i} className="h-4 w-4 rounded-full bg-bronce-claro" aria-hidden />
                ))}
                {reparto[frente.id] > 0 && (
                  <button
                    type="button"
                    onClick={() => sacar(frente.id)}
                    className="ml-1 flex h-9 w-9 items-center justify-center font-acta text-lg leading-none text-papel-2 hover:text-papel"
                    aria-label={`Sacar una ficha de ${frente.label}`}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Lo que cuesta el reparto, antes de saber si sirvió. */}
      <p className="mt-4 text-center font-acta text-[11px] tracking-[0.08em] text-papel-2 uppercase">
        Cuesta {plata(Math.abs(costo.caja ?? 0))}
        {costo.influencia ? ` y ${Math.abs(costo.influencia)} de influencia` : ''}
      </p>

      <button
        type="button"
        onClick={() => onDefinir(assignmentIndex(reparto))}
        className="mt-3 w-full bg-papel py-4 font-display text-[14px] font-black tracking-[0.12em] text-tinta uppercase transition-transform active:scale-[0.99]"
      >
        {usadas === 0 ? 'No mover un dedo' : 'Que se juegue'}
      </button>
    </div>
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
