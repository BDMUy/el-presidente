'use client';

import { useState } from 'react';
import Image from 'next/image';

import { MOVIMIENTOS_POR_VENTANA, type PlayerOffer } from '@/lib/engine/types';
import { plata, plataCorta } from '@/lib/format';
import { GrupoOpciones } from './grupo-opciones';
import { BarraDecision, Ladillo, Recuadro, Titular, Volanta } from './ui';

const ETIQUETA: Record<PlayerOffer['kind'], string> = {
  compra: 'Compra',
  libre: 'Libre',
  venta: 'Venta',
  prestamo: 'Préstamo',
  cesion: 'Cesión',
};

export function FaseMercado({
  offers,
  inhibido,
  restantes,
  season,
  caja,
  onElegir,
}: {
  offers: PlayerOffer[];
  inhibido: boolean;
  restantes: number;
  season: number;
  caja: number;
  onElegir: (choice: number) => void;
}) {
  const [elegida, setElegida] = useState<number | null>(null);
  const oferta = elegida !== null && elegida < offers.length ? offers[elegida] : null;
  const primerMovimiento = restantes >= MOVIMIENTOS_POR_VENTANA;
  const confirmar = () => {
    if (elegida !== null) onElegir(elegida);
  };

  return (
    <>
      <Recuadro denso>
        <div className="flex items-start justify-between gap-4">
          <Volanta>
            Temporada {season} · {restantes} {restantes === 1 ? 'firma disponible' : 'firmas disponibles'}
          </Volanta>
          {inhibido && (
            <Ladillo tono="alerta" className="shrink-0">
              Inhibido
            </Ladillo>
          )}
        </div>

        <div className="mt-4">
          <Image src="/ilustraciones/mercado-pases.png" alt="" width={1024} height={1024} sizes="64px" className="float-right ml-3 h-16 w-16 object-contain" />
          <Titular>Mercado</Titular>
          <p className="mt-2 font-cuerpo text-[0.9375rem] leading-snug text-tinta-2">
            {inhibido
              ? 'Por la deuda, solo podés vender o ceder jugadores.'
              : 'Elegí un pase para ver el detalle y firmarlo.'}
          </p>
        </div>

        <div className="mt-4">
          <GrupoOpciones etiqueta="Operaciones" onConfirmar={confirmar} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {offers.map((offer, index) => (
              <FilaOferta
                key={`${offer.name}-${index}`}
                offer={offer}
                seleccionada={elegida === index}
                foco={elegida === null ? index === 0 : elegida === index}
                onClick={() => setElegida(index)}
              />
            ))}

            <button
              type="button"
              onClick={() => setElegida(offers.length)}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter') evento.preventDefault();
              }}
              role="radio"
              aria-checked={elegida === offers.length}
              tabIndex={
                (elegida === null ? offers.length === 0 : elegida === offers.length) ? 0 : -1
              }
              className={`col-span-full min-h-11 w-full border px-3 py-2.5 text-left transition-colors ${
                elegida === offers.length
                  ? 'border-tinta bg-tinta/10'
                  : 'border-corondel hover:bg-tinta/6 active:bg-tinta/12'
              }`}
            >
              <span className="block font-titular text-[1rem] leading-tight font-bold text-tinta">
                Cerrar la ventana
              </span>
              <span className="mt-1 block font-cuerpo text-[0.8125rem] leading-snug text-tinta-2">
                {primerMovimiento ? 'Seguir con este plantel.' : 'Seguir con los pases que ya firmaste.'}
              </span>
            </button>
          </GrupoOpciones>
        </div>
      </Recuadro>

      <BarraDecision
        resumen={oferta?.name ?? (elegida === null ? 'Elegí una operación' : 'Cerrar la ventana')}
        detalle={
          oferta
            ? `${ETIQUETA[oferta.kind]} · te deja en ${plata(Math.round((caja - oferta.cost) * 10) / 10)}`
            : undefined
        }
        accion={elegida === offers.length ? 'Cerrar la ventana' : 'Firmar'}
        tono={elegida === offers.length ? 'neutra' : 'firma'}
        habilitada={elegida !== null}
        onConfirmar={confirmar}
      >
        {oferta && (
          <div id="detalle-pase" className="barra-decision-detalle mx-auto mb-3 max-w-[40rem] border-b border-corondel pb-3" aria-live="polite">
            <p className="font-cuerpo text-[0.875rem] leading-snug text-tinta">
              {oferta.archetype}, {oferta.age} años. {oferta.note}
            </p>
            {oferta.risk > 0 && (
              <p className="mt-1 font-tabla text-[0.75rem] text-alerta">
                Riesgo de lesión: {Math.round(oferta.risk * 100)}%. Puede rendir menos.
              </p>
            )}
          </div>
        )}
      </BarraDecision>
    </>
  );
}

function FilaOferta({
  offer,
  seleccionada,
  foco,
  onClick,
}: {
  offer: PlayerOffer;
  seleccionada: boolean;
  foco: boolean;
  onClick: () => void;
}) {
  const esSalida = offer.kind === 'venta' || offer.kind === 'cesion';

  const marco = seleccionada
    ? 'border-acento bg-acento/10 ring-1 ring-acento'
    : esSalida
      ? 'border-alerta/40 bg-alerta/6 hover:bg-tinta/6 active:bg-tinta/12'
      : 'border-corondel hover:bg-tinta/6 active:bg-tinta/12';

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter') evento.preventDefault();
      }}
      role="radio"
      aria-checked={seleccionada}
      aria-describedby={seleccionada ? 'detalle-pase' : undefined}
      tabIndex={foco ? 0 : -1}
      className={`oferta-mercado flex min-h-11 min-w-0 flex-col border p-2.5 text-left transition-colors ${marco}`}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span
          className={`shrink-0 font-tabla text-[0.75rem] tracking-[0.08em] uppercase ${
            esSalida ? 'text-alerta' : 'text-tinta-2'
          }`}
        >
          {ETIQUETA[offer.kind]}
        </span>
        <span aria-hidden className="oferta-marca font-tabla text-[0.75rem]">✓</span>
      </span>
      <span className="mt-1.5 block font-titular text-[0.9375rem] leading-tight font-bold break-words text-tinta">
        {offer.name}
      </span>
      <span className="mt-2 grid w-full grid-cols-2 gap-x-2 gap-y-1.5 border-t border-corondel pt-2">
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
        <Dato
          etiqueta="Riesgo"
          valor={offer.risk === 0 ? '—' : `${Math.round(offer.risk * 100)}%`}
          tono={offer.risk === 0 ? 'neutro' : 'gasto'}
        />
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
    tono === 'gasto' ? 'text-alerta' : tono === 'ingreso' ? 'text-favorable' : 'text-tinta-2';

  return (
    <span className="block">
      <span className="block font-tabla text-[0.75rem] leading-none tracking-[0.04em] text-tinta-2 uppercase">
        {etiqueta}
      </span>
      <span
        className={`mt-1 block font-titular text-[0.9375rem] leading-none font-black tabular-nums ${color}`}
      >
        {valor}
      </span>
    </span>
  );
}

function conSigno(n: number): string {
  if (n === 0) return '0';
  return `${n > 0 ? '+' : '−'}${Math.abs(n)}`;
}
