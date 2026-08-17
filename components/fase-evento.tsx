'use client';

/**
 * El acta: la carta de decisión.
 *
 * Cada evento llega como un documento que entra a la mesa. El tipo de evento
 * va sellado en diagonal —GOLPE DURO, DECISIÓN DIFÍCIL, PASAN COSAS— y al
 * elegir, la consecuencia vuelve estampada sobre la misma hoja.
 *
 * Es la pantalla más repetida del juego: cuarenta y ocho veces por presidencia,
 * contra dieciséis del mercado. Por eso es deliberadamente calma —el sello y el
 * título son lo único que levanta la voz— y por eso las opciones comparten la
 * caja con el mercado: las dos pantallas de decisión hablan el mismo idioma.
 */

import { useState } from 'react';

import type { Effects, GameEvent } from '@/lib/engine/types';
import { EVENT_KIND_LABEL } from '@/lib/engine/types';
import { plataConSigno } from '@/lib/format';
import { BarraDecision, Continuar, Membrete, Papel, Puntos, Renglon, Sello, Titulo } from './ui';

export function FaseEvento({
  event,
  available,
  enLaTemporada,
  porTemporada,
  onElegir,
}: {
  event: GameEvent;
  available: number[];
  /** Cuántas decisiones van en esta temporada, contando esta. */
  enLaTemporada: number;
  porTemporada: number;
  onElegir: (choice: number) => void;
}) {
  const tono = event.kind === 'golpe' ? 'rojo' : event.kind === 'dilema' ? 'bronce' : 'verde';

  // Elegida pero sin firmar. El estado arranca limpio en cada acta porque
  // `Pantalla` lleva una key por decisión tomada.
  const [elegida, setElegida] = useState<number | null>(null);
  const opcion = elegida === null ? null : event.options[available[elegida]];

  return (
    <>
      <Papel torcido={1}>
        <div className="flex items-start justify-between gap-4">
          {/* Solo la posición en la temporada. El número de expediente y la
              temporada estaban de más: la temporada ya está en el carnet a diez
              píxeles, y el número de acta era sabor que no le decía nada al
              jugador. Entre los tres hacían que el membrete partiera en dos
              líneas contra el sello, y el único dato con función es este. */}
          <Membrete>
            Acta {enLaTemporada} de {porTemporada}
          </Membrete>
          <Sello tono={tono} className="shrink-0">
            {EVENT_KIND_LABEL[event.kind]}
          </Sello>
        </div>

        <div className="mt-4">
          <Titulo>{event.title}</Titulo>
          <p className="mt-3 font-body text-[16px] leading-relaxed text-tinta">{event.text}</p>
        </div>

        <div className="mt-6">
          <Membrete>Resuelve la presidencia</Membrete>
          <div className="mt-2 space-y-2">
            {available.map((optionIndex, displayIndex) => {
              const option = event.options[optionIndex];
              return (
                <Renglon
                  key={optionIndex}
                  label={option.label}
                  hint={option.hint}
                  azaroso={Boolean(option.random)}
                  seleccionado={elegida === displayIndex}
                  onClick={() => setElegida(displayIndex)}
                />
              );
            })}
          </div>
        </div>
      </Papel>

      <BarraDecision
        resumen={opcion ? opcion.label : 'Elegí cómo resolverlo'}
        detalle={opcion?.random ? 'El resultado se sortea' : undefined}
        accion="Firmar"
        habilitada={elegida !== null}
        onConfirmar={() => elegida !== null && onElegir(elegida)}
      />
    </>
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
        <ul className="mt-6 border-t border-hoja-linea pt-3">
          {cambios.map((cambio) => (
            <li
              key={cambio.label}
              className="flex items-baseline py-1.5 font-acta text-[13px] uppercase"
            >
              <span className="text-tinta-2">{cambio.label}</span>
              <Puntos />
              <span className={cambio.positivo ? 'text-emerald-800' : 'text-sello'}>
                {cambio.valor}
              </span>
            </li>
          ))}
        </ul>
      )}

      {diferidos.length > 0 && (
        // No se dice qué va a pasar ni cuándo: solo que quedó algo pendiente.
        // La consecuencia diferida tiene que sorprender cuando llega.
        <p className="mt-4 border-l-2 border-bronce pl-3 font-acta text-[12px] leading-relaxed tracking-wide text-tinta-2 uppercase">
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
