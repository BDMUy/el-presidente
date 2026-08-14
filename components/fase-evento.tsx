'use client';

/**
 * El acta: la carta de decisión.
 *
 * Cada evento llega como un documento que entra a la mesa. El tipo de evento
 * va sellado en diagonal —GOLPE DURO, DECISIÓN DIFÍCIL, PASAN COSAS— y las
 * opciones se firman sobre renglones punteados. Al elegir, la consecuencia
 * vuelve estampada sobre la misma hoja.
 */

import type { Effects, GameEvent } from '@/lib/engine/types';
import { EVENT_KIND_LABEL } from '@/lib/engine/types';
import { plataConSigno } from '@/lib/format';
import { Continuar, Membrete, Papel, Renglon, Sello, Titulo } from './ui';

export function FaseEvento({
  event,
  available,
  season,
  acta,
  onElegir,
}: {
  event: GameEvent;
  available: number[];
  season: number;
  acta: number;
  onElegir: (choice: number) => void;
}) {
  const tono = event.kind === 'golpe' ? 'rojo' : event.kind === 'dilema' ? 'bronce' : 'verde';

  return (
    <Papel torcido={1}>
      <div className="flex items-start justify-between gap-4">
        <Membrete>
          Acta n° {String(acta).padStart(4, '0')} · Temporada {season}
        </Membrete>
        <Sello tono={tono} className="shrink-0">
          {EVENT_KIND_LABEL[event.kind]}
        </Sello>
      </div>

      <div className="mt-4">
        <Titulo>{event.title}</Titulo>
        <p className="mt-3 font-body text-[15px] leading-relaxed text-tinta/85">{event.text}</p>
      </div>

      <div className="mt-6">
        <Membrete>Resuelve la presidencia</Membrete>
        <div className="mt-1">
          {available.map((optionIndex, displayIndex) => {
            const option = event.options[optionIndex];
            return (
              <Renglon
                key={optionIndex}
                label={option.label}
                hint={option.hint}
                azaroso={Boolean(option.random)}
                onClick={() => onElegir(displayIndex)}
              />
            );
          })}
        </div>
      </div>
    </Papel>
  );
}

/** La consecuencia, estampada sobre la hoja que acabás de firmar. */
export function FaseResultadoEvento({
  text,
  effects,
  onContinuar,
}: {
  text: string;
  effects: Effects;
  onContinuar: () => void;
}) {
  const cambios = listarCambios(effects);
  const diferidos = effects.deferred ?? [];

  return (
    <Papel torcido={2}>
      <div className="flex justify-end">
        <Sello tono="rojo" animado>
          Resuelto
        </Sello>
      </div>

      <p className="mt-2 font-body text-[17px] leading-relaxed text-tinta">{text}</p>

      {cambios.length > 0 && (
        <ul className="mt-6 border-t border-papel-linea pt-3">
          {cambios.map((cambio) => (
            <li
              key={cambio.label}
              className="renglon flex items-baseline py-1 font-acta text-[12px] uppercase"
            >
              <span className="text-tinta-suave">{cambio.label}</span>
              <span className={cambio.positivo ? 'text-emerald-700' : 'text-sello'}>
                {cambio.valor}
              </span>
            </li>
          ))}
        </ul>
      )}

      {diferidos.length > 0 && (
        // No se dice qué va a pasar ni cuándo: solo que quedó algo pendiente.
        // La consecuencia diferida tiene que sorprender cuando llega.
        <p className="mt-4 border-l-2 border-bronce pl-3 font-acta text-[11px] leading-relaxed tracking-wide text-tinta-suave uppercase">
          Queda asentado en el libro de actas. Esto vuelve.
        </p>
      )}

      <Continuar onClick={onContinuar} />
    </Papel>
  );
}

interface Cambio {
  label: string;
  valor: string;
  positivo: boolean;
}

/** Traduce los efectos a renglones de balance legibles. */
function listarCambios(effects: Effects): Cambio[] {
  const cambios: Cambio[] = [];

  if (effects.caja) {
    cambios.push({ label: 'Caja', valor: plataConSigno(effects.caja), positivo: effects.caja > 0 });
  }
  for (const [campo, label] of [
    ['hinchada', 'Hinchada'],
    ['socios', 'Socios'],
    ['plantel', 'Plantel'],
    ['rosca', 'Rosca'],
  ] as const) {
    const valor = effects[campo];
    if (valor) {
      cambios.push({
        label,
        valor: `${valor > 0 ? '+' : '−'}${Math.abs(Math.round(valor * 10) / 10)}`,
        positivo: valor > 0,
      });
    }
  }

  return cambios;
}
