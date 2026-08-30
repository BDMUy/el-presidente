'use client';

import { useState, type CSSProperties } from 'react';

import type { Club, Effects, EventKind, GameEvent } from '@/lib/engine/types';
import { EVENT_KIND_LABEL } from '@/lib/engine/types';
import { plataConSigno } from '@/lib/format';
import { impactoDeOpcion } from '@/lib/impacto';
import { useTintaClub } from '@/lib/tema';
import {
  BarraDecision,
  Continuar,
  Cuerpo,
  Ladillo,
  Puntos,
  Recuadro,
  Renglon,
  Titular,
  Volanta,
} from './ui';

const TONO_EVENTO: Record<EventKind, 'alerta' | 'tinta' | 'favorable'> = {
  golpe: 'alerta',
  dilema: 'tinta',
  color: 'favorable',
};

export function FaseEvento({
  club,
  event,
  available,
  enLaTemporada,
  porTemporada,
  onElegir,
}: {
  club: Club;
  event: GameEvent;
  available: number[];
  enLaTemporada: number;
  porTemporada: number;
  onElegir: (choice: number) => void;
}) {
  const tintaClub = useTintaClub(club);
  const [elegida, setElegida] = useState<number | null>(null);
  const opcion = elegida === null ? null : event.options[available[elegida]];

  return (
    <div style={{ '--club': tintaClub } as CSSProperties}>
      <Recuadro acento="club">
        <div className="flex items-start justify-between gap-4">
          <Volanta>
            Sección · {enLaTemporada} de {porTemporada}
          </Volanta>
          <Ladillo tono={TONO_EVENTO[event.kind]} className="shrink-0">
            {EVENT_KIND_LABEL[event.kind]}
          </Ladillo>
        </div>

        <div className="mt-4">
          <Titular>{event.title}</Titular>
          <Cuerpo className="mt-3">{event.text}</Cuerpo>
        </div>

        <div className="mt-6">
          <div className="filete-animado flex h-1" aria-hidden>
            <div className="flex-1" style={{ backgroundColor: club.colors[0] }} />
            <div className="flex-1" style={{ backgroundColor: club.colors[1] }} />
          </div>
          <div className="pt-4">
            <Volanta>La decisión</Volanta>
            <div className="mt-2 border-t border-corondel">
              {available.map((optionIndex, displayIndex) => {
                const option = event.options[optionIndex];
                return (
                  <Renglon
                    key={optionIndex}
                    label={option.label}
                    hint={option.hint}
                    impacto={impactoDeOpcion(option)}
                    azaroso={Boolean(option.random)}
                    seleccionado={elegida === displayIndex}
                    onClick={() => setElegida(displayIndex)}
                    retraso={displayIndex * 40}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Recuadro>

      <BarraDecision
        resumen={opcion ? opcion.label : 'Elegí cómo resolverlo'}
        detalle={opcion?.random ? 'El resultado se sortea' : undefined}
        accion="Firmar"
        habilitada={elegida !== null}
        onConfirmar={() => elegida !== null && onElegir(elegida)}
      />
    </div>
  );
}

export function FaseResultadoEvento({
  club,
  text,
  effects,
  onContinuar,
}: {
  club: Club;
  text: string;
  effects: Effects;
  onContinuar: () => void;
}) {
  const tintaClub = useTintaClub(club);
  const cambios = listarCambios(effects);
  const diferidos = effects.deferred ?? [];

  return (
    <div style={{ '--club': tintaClub } as CSSProperties}>
      <Recuadro acento="club">
        <div className="flex items-start justify-between gap-4">
          <Volanta>Edición siguiente</Volanta>
          <Ladillo tono="club" animado className="shrink-0">
            Resuelto
          </Ladillo>
        </div>

        <Cuerpo className="mt-3">{text}</Cuerpo>

        {cambios.length > 0 && (
          <ul className="mt-6 border-t border-corondel pt-3">
            {cambios.map((cambio, indice) => (
              <li
                key={cambio.label}
                style={{ animationDelay: `${indice * 60}ms` }}
                className="entrar-nota flex items-baseline py-1.5 font-tabla text-[13px] uppercase"
              >
                <span className="text-tinta-2">{cambio.label}</span>
                <Puntos />
                <span className={cambio.positivo ? 'text-favorable' : 'text-alerta'}>
                  {cambio.valor}
                </span>
              </li>
            ))}
          </ul>
        )}

        {diferidos.length > 0 && (
          <p className="mt-4 border-l-2 border-[var(--club)] pl-3 font-tabla text-[12px] leading-relaxed tracking-wide text-tinta-2 uppercase">
            Queda asentado en el libro de actas. Esto vuelve.
          </p>
        )}

        <Continuar onClick={onContinuar} />
      </Recuadro>
    </div>
  );
}

interface Cambio {
  label: string;
  valor: string;
  positivo: boolean;
}

function listarCambios(effects: Effects): Cambio[] {
  const cambios: Cambio[] = [];

  if (effects.caja) {
    cambios.push({ label: 'Caja', valor: plataConSigno(effects.caja), positivo: effects.caja > 0 });
  }
  for (const [campo, label] of [
    ['hinchada', 'Hinchada'],
    ['socios', 'Socios'],
    ['plantel', 'Plantel'],
    ['influencia', 'Influencia'],
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
