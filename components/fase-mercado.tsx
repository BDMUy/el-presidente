'use client';

import { useState, type KeyboardEvent } from 'react';
import Image from 'next/image';

import { MOVIMIENTOS_POR_VENTANA, type PlayerOffer } from '@/lib/engine/types';
import { plata, plataConSigno, plataCorta } from '@/lib/format';
import { cajaTras, motivoBloqueo } from '@/lib/mercado-seleccion';
import { BarraDecision, Cupos, Ladillo, Recuadro, Titular, Volanta } from './ui';

// Color: entra (neutro), entra gratis (favorable), sale (alerta).
// Borde punteado: la operación es temporal y el jugador vuelve.
const TIPO: Record<PlayerOffer['kind'], { label: string; chip: string }> = {
  compra: { label: 'Compra', chip: 'border-corondel text-tinta-2' },
  libre: { label: 'Libre', chip: 'border-favorable/50 text-favorable' },
  venta: { label: 'Venta', chip: 'border-alerta/50 text-alerta' },
  prestamo: { label: 'Préstamo', chip: 'border-dashed border-corondel text-tinta-2' },
  cesion: { label: 'Cesión', chip: 'border-dashed border-alerta/50 text-alerta' },
};

export function FaseMercado({
  offers,
  inhibido,
  restantes,
  season,
  caja,
  onElegir,
  onFirmar,
}: {
  offers: PlayerOffer[];
  inhibido: boolean;
  restantes: number;
  season: number;
  caja: number;
  onElegir: (choice: number) => void;
  onFirmar: (elegidas: PlayerOffer[]) => void;
}) {
  const [elegidas, setElegidas] = useState<PlayerOffer[]>([]);
  const [cerrar, setCerrar] = useState(false);
  const primerMovimiento = restantes >= MOVIMIENTOS_POR_VENTANA;

  const plantelTras = (seleccion: PlayerOffer[]) =>
    seleccion.reduce((total, o) => total + o.plantelDelta, 0);

  const hinchadaTras = (seleccion: PlayerOffer[]) =>
    seleccion.reduce((total, o) => total + o.hinchadaDelta, 0);

  const alternar = (offer: PlayerOffer) => {
    setCerrar(false);
    setElegidas((actuales) =>
      actuales.includes(offer) ? actuales.filter((o) => o !== offer) : [...actuales, offer],
    );
  };

  const elegirCerrar = () => {
    setElegidas([]);
    setCerrar(true);
  };

  const confirmar = () => {
    if (cerrar) {
      onElegir(offers.length);
      return;
    }
    if (elegidas.length > 0) onFirmar([...elegidas].sort((a, b) => a.cost - b.cost));
  };

  const alTeclado = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (evento.key !== 'Enter') return;
    evento.preventDefault();
    confirmar();
  };

  const unica = elegidas.length === 1 ? elegidas[0] : null;
  const conRiesgo = elegidas.filter((offer) => offer.risk > 0);
  const salidas = elegidas.filter((offer) => offer.kind === 'venta' || offer.kind === 'cesion');

  return (
    <>
      <Recuadro denso>
        <div className="flex items-start justify-between gap-4">
          <Volanta>Temporada {season}</Volanta>
          <span className="flex shrink-0 items-center gap-2">
            <Cupos
              total={MOVIMIENTOS_POR_VENTANA}
              llenos={restantes - elegidas.length}
              etiqueta={`${restantes - elegidas.length} de ${MOVIMIENTOS_POR_VENTANA} firmas disponibles`}
            />
            {inhibido && <Ladillo tono="alerta">Inhibido</Ladillo>}
          </span>
        </div>

        <div className="mt-4">
          <Image src="/ilustraciones/mercado-pases.png" alt="" width={1024} height={1024} sizes="64px" className="float-right ml-3 h-16 w-16 object-contain" />
          <Titular>Mercado</Titular>
          <p className="mt-2 font-cuerpo text-[0.9375rem] leading-snug text-tinta-2">
            {inhibido
              ? 'Por la deuda, solo podés vender o ceder jugadores.'
              : `Marcá hasta ${restantes} ${restantes === 1 ? 'pase' : 'pases'} y firmalos juntos.`}
          </p>
        </div>

        <div className="mt-4">
          <div
            role="group"
            aria-label="Operaciones"
            onKeyDown={alTeclado}
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {offers.map((offer, index) => (
              <FilaOferta
                key={`${offer.name}-${index}`}
                offer={offer}
                seleccionada={elegidas.includes(offer)}
                motivo={motivoBloqueo(offer, elegidas, caja, restantes)}
                onClick={() => alternar(offer)}
              />
            ))}

            <button
              type="button"
              onClick={elegirCerrar}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter') evento.preventDefault();
              }}
              role="checkbox"
              aria-checked={cerrar}
              className={`col-span-full min-h-11 w-full rounded-[var(--radio-sm)] border px-3 py-2.5 text-left transition-colors ${
                cerrar ? 'border-tinta bg-tinta/10' : 'border-corondel hover:bg-tinta/6 active:bg-tinta/12'
              }`}
            >
              <span className="block font-titular text-[1rem] leading-tight font-bold text-tinta">
                Cerrar la ventana
              </span>
              <span className="mt-1 block font-cuerpo text-[0.8125rem] leading-snug text-tinta-2">
                {primerMovimiento ? 'Seguir con este plantel.' : 'Seguir con los pases que ya firmaste.'}
              </span>
            </button>
          </div>
        </div>
      </Recuadro>

      <BarraDecision
        resumen={
          cerrar
            ? 'Cerrar la ventana'
            : elegidas.length === 0
              ? 'Elegí una operación'
              : unica
                ? unica.name
                : `${elegidas.length} operaciones`
        }
        detalle={
          elegidas.length > 0
            ? `Te deja en ${plata(cajaTras(caja, elegidas))} · plantel ${conSigno(plantelTras(elegidas))} · hinchada ${conSigno(hinchadaTras(elegidas))}`
            : undefined
        }
        accion={cerrar ? 'Cerrar la ventana' : elegidas.length > 1 ? 'Firmar todo' : 'Firmar'}
        cifra={elegidas.length > 0 ? plataConSigno(cajaTras(caja, elegidas) - caja) : undefined}
        nota={
          cerrar
            ? 'La ventana se cierra hasta la próxima temporada.'
            : salidas.length > 0
              ? `${salidas.length === 1 ? 'Sale' : 'Salen'} del plantel al firmar.`
              : undefined
        }
        urgente={cerrar || salidas.length > 0}
        tono={cerrar ? 'neutra' : 'firma'}
        habilitada={cerrar || elegidas.length > 0}
        onConfirmar={confirmar}
      >
        {conRiesgo.length > 0 && (
          <div id="detalle-pase" className="barra-decision-detalle mx-auto mb-3 max-w-[40rem] border-b border-corondel pb-3" aria-live="polite">
            {conRiesgo.map((offer, index) => (
              <div key={`${offer.name}-${index}`} className={index > 0 ? 'mt-2.5 border-t border-corondel pt-2.5' : ''}>
                {!unica && (
                  <p className="font-titular text-[0.8125rem] leading-tight text-tinta">{offer.name}</p>
                )}
                <p className="mt-0.5 font-tabla text-[0.75rem] text-alerta">
                  Riesgo de lesión: {Math.round(offer.risk * 100)}%. Si se lesiona, suma{' '}
                  {Math.round(offer.plantelDelta * 0.35)} al plantel en vez de {offer.plantelDelta}.
                </p>
              </div>
            ))}
          </div>
        )}
      </BarraDecision>
    </>
  );
}

function FilaOferta({
  offer,
  seleccionada,
  motivo,
  onClick,
}: {
  offer: PlayerOffer;
  seleccionada: boolean;
  motivo: string | null;
  onClick: () => void;
}) {
  const esSalida = offer.kind === 'venta' || offer.kind === 'cesion';
  const bloqueada = motivo !== null;

  const marco = seleccionada
    ? 'border-acento bg-acento/10 ring-1 ring-acento'
    : bloqueada
      ? 'border-corondel opacity-45'
      : esSalida
        ? 'border-alerta/40 bg-alerta/6 hover:bg-tinta/6 active:bg-tinta/12'
        : 'border-corondel hover:bg-tinta/6 active:bg-tinta/12';

  return (
    <button
      type="button"
      onClick={() => {
        if (!bloqueada) onClick();
      }}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter') evento.preventDefault();
      }}
      role="checkbox"
      aria-checked={seleccionada}
      aria-disabled={bloqueada}
      aria-describedby={seleccionada && offer.risk > 0 ? 'detalle-pase' : undefined}
      className={`oferta-mercado flex min-h-11 min-w-0 flex-col rounded-[var(--radio-sm)] border p-2.5 text-left transition-colors ${marco}`}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span
          className={`shrink-0 rounded border px-1.5 py-0.5 font-tabla text-[0.6875rem] tracking-[0.08em] uppercase ${TIPO[offer.kind].chip}`}
        >
          {TIPO[offer.kind].label}
        </span>
        <span aria-hidden className="oferta-marca font-tabla text-[0.75rem]">✓</span>
      </span>
      <span className="mt-1.5 block font-titular text-[0.9375rem] leading-tight font-bold break-words text-tinta">
        {offer.name}
      </span>
      <span className="mt-0.5 block font-cuerpo text-[0.8125rem] leading-snug text-tinta-3">
        {offer.age} años · {offer.archetype}
      </span>
      <span className="mt-1 block font-cuerpo text-[0.875rem] leading-snug text-tinta-2 italic">
        {offer.note}
      </span>
      {bloqueada && (
        <span className="mt-1 block font-tabla text-[0.75rem] leading-snug text-alerta">{motivo}</span>
      )}
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
