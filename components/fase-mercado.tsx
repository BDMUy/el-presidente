'use client';

import { useState } from 'react';

import type { PlayerOffer } from '@/lib/engine/types';
import { plata, plataCorta } from '@/lib/format';
import { BarraDecision, Membrete, Papel, Puntos, Sello, Titulo } from './ui';

const ETIQUETA: Record<PlayerOffer['kind'], string> = {
  compra: 'Compra',
  libre: 'Libre',
  venta: 'Venta',
};

export function FaseMercado({
  offers,
  inhibido,
  season,
  caja,
  onElegir,
}: {
  offers: PlayerOffer[];
  inhibido: boolean;
  season: number;
  caja: number;
  onElegir: (choice: number) => void;
}) {
  const [elegida, setElegida] = useState<number | null>(null);
  const oferta = elegida !== null && elegida < offers.length ? offers[elegida] : null;

  return (
    <>
      <Papel torcido={1}>
        <div className="flex items-start justify-between gap-4">
          <Membrete>Ventana de pases · Temporada {season}</Membrete>
          {inhibido && (
            <Sello tono="rojo" className="shrink-0">
              Inhibido
            </Sello>
          )}
        </div>

        <div className="mt-4">
          <Titulo>Mercado</Titulo>
          <p className="mt-3 font-body text-[16px] leading-relaxed text-tinta">
            {inhibido
              ? 'El club está inhibido por deuda: no podés incorporar a nadie hasta sanear las cuentas. Lo único que se puede firmar es una salida.'
              : 'Lo que llegó a la mesa esta ventana. Se firma una operación, o ninguna.'}
          </p>
        </div>

        <div className="mt-6">
          <Membrete>Operaciones</Membrete>
          <div className="mt-2 space-y-2">
            {offers.map((offer, index) => (
              <FilaOferta
                key={`${offer.name}-${index}`}
                offer={offer}
                caja={caja}
                seleccionada={elegida === index}
                onClick={() => setElegida(index)}
              />
            ))}

            <button
              type="button"
              onClick={() => setElegida(offers.length)}
              aria-pressed={elegida === offers.length}
              className={`w-full border px-3 py-3 text-left transition-colors ${
                elegida === offers.length
                  ? 'border-tinta bg-tinta/10'
                  : 'border-hoja-linea hover:bg-tinta/6 active:bg-tinta/12'
              }`}
            >
              <span className="block font-display text-[16px] leading-tight font-bold text-tinta">
                No mover nada
              </span>
              <span className="mt-1 block font-body text-[14px] leading-snug text-tinta-2">
                El plantel se queda como está. Y se desgasta como está.
              </span>
            </button>
          </div>
        </div>
      </Papel>

      <BarraDecision
        resumen={
          elegida === null
            ? 'Elegí una operación'
            : oferta
              ? oferta.name
              :
                'No mover nada'
        }
        detalle={
          oferta
            ? `${ETIQUETA[oferta.kind]} · te deja en ${plata(Math.round((caja - oferta.cost) * 10) / 10)}`
            : undefined
        }
        accion={elegida === null ? 'Firmar' : oferta ? 'Firmar' : 'Cerrar la ventana'}
        habilitada={elegida !== null}
        onConfirmar={() => elegida !== null && onElegir(elegida)}
      />
    </>
  );
}

function FilaOferta({
  offer,
  caja,
  seleccionada,
  onClick,
}: {
  offer: PlayerOffer;
  caja: number;
  seleccionada: boolean;
  onClick: () => void;
}) {
  const esVenta = offer.kind === 'venta';
  const cajaDespues = Math.round((caja - offer.cost) * 10) / 10;
  const quedaEnRojo = cajaDespues < 0;

  const marco = seleccionada
    ? 'border-tinta bg-tinta/10'
    : esVenta
      ? 'border-sello/40 bg-sello/6 hover:bg-tinta/6 active:bg-tinta/12'
      : 'border-hoja-linea hover:bg-tinta/6 active:bg-tinta/12';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={seleccionada}
      className={`w-full border px-3 py-3 text-left transition-colors ${marco}`}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="min-w-0 truncate font-display text-[16px] leading-tight font-bold text-tinta">
          {offer.name}
        </span>
        <span
          className={`shrink-0 font-acta text-[11px] tracking-[0.08em] uppercase ${
            esVenta ? 'text-sello' : 'text-tinta-2'
          }`}
        >
          {ETIQUETA[offer.kind]}
        </span>
      </span>

      <span className="mt-1 block font-body text-[14px] leading-snug text-tinta-2">
        {offer.archetype}, {offer.age} años. {offer.note}
      </span>

      <span className="mt-2.5 grid grid-cols-3 gap-2 border-t border-hoja-linea pt-2">
        <Dato
          etiqueta={offer.cost >= 0 ? 'Cuesta' : 'Entra'}
          valor={offer.cost === 0 ? 'nada' : plataCorta(Math.abs(offer.cost))}
          tono={offer.cost > 0 ? 'gasto' : 'ingreso'}
        />
        <Dato
          etiqueta="Plantel"
          valor={conSigno(offer.plantelDelta)}
          tono={offer.plantelDelta >= 0 ? 'ingreso' : 'gasto'}
        />
        <Dato
          etiqueta="Hinchada"
          valor={offer.hinchadaDelta === 0 ? '—' : conSigno(offer.hinchadaDelta)}
          tono={
            offer.hinchadaDelta === 0 ? 'neutro' : offer.hinchadaDelta > 0 ? 'ingreso' : 'gasto'
          }
        />
      </span>

      <span className="mt-1.5 flex items-baseline font-acta text-[11px] tracking-[0.04em] uppercase">
        <span className="text-tinta-2">Te deja en</span>
        <Puntos />
        <span className={quedaEnRojo ? 'text-sello' : 'text-tinta'}>{plata(cajaDespues)}</span>
      </span>
    </button>
  );
}

function Dato({
  etiqueta,
  valor,
  tono,
}: {
  etiqueta: string;
  valor: string;
  tono: 'gasto' | 'ingreso' | 'neutro';
}) {
  const color =
    tono === 'gasto' ? 'text-sello' : tono === 'ingreso' ? 'text-emerald-800' : 'text-tinta-2';

  return (
    <span className="block">
      <span className="block font-acta text-[10px] leading-none tracking-[0.04em] text-tinta-2 uppercase">
        {etiqueta}
      </span>
      <span
        className={`mt-1 block font-display text-[15px] leading-none font-black tabular-nums ${color}`}
      >
        {valor}
      </span>
    </span>
  );
}

function conSigno(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}
