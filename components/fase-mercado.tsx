'use client';

/**
 * La planilla de pases.
 *
 * Tres operaciones sobre la mesa y la opción de no firmar ninguna. Cada
 * renglón muestra lo que cuesta y lo que mueve, porque el dilema del mercado
 * solo existe si el precio está a la vista antes de decidir.
 */

import type { PlayerOffer } from '@/lib/engine/types';
import { plata } from '@/lib/format';
import { Membrete, Papel, Sello, Titulo } from './ui';

const ETIQUETA: Record<PlayerOffer['kind'], string> = {
  compra: 'Compra',
  libre: 'Libre',
  venta: 'Venta',
};

/** La consecuencia de la operación, en el mismo formato que el resto del juego. */
function resumenOferta(offer: PlayerOffer): string {
  const dinero =
    offer.cost > 0 ? `−${plata(offer.cost)}` : offer.cost < 0 ? `+${plata(-offer.cost)}` : 'Gratis';
  const plantel = offer.plantelDelta >= 0 ? `+${offer.plantelDelta}` : `${offer.plantelDelta}`;
  const gente =
    offer.hinchadaDelta > 0
      ? ', la gente lo festeja'
      : offer.hinchadaDelta < 0
        ? ', la gente te lo va a cobrar'
        : '';
  return `${dinero} · plantel ${plantel}${gente}`;
}

export function FaseMercado({
  offers,
  inhibido,
  season,
  onElegir,
}: {
  offers: PlayerOffer[];
  inhibido: boolean;
  season: number;
  onElegir: (choice: number) => void;
}) {
  return (
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
        <p className="mt-3 font-body text-[15px] leading-relaxed text-tinta/85">
          {inhibido
            ? 'El club está inhibido por deuda: no podés incorporar a nadie hasta sanear las cuentas. Lo único que se puede firmar es una salida.'
            : 'Lo que llegó a la mesa esta ventana. Se firma una operación, o ninguna.'}
        </p>
      </div>

      <div className="mt-6">
        <Membrete>Operaciones</Membrete>
        <div className="mt-1">
          {offers.map((offer, index) => (
            <FilaOferta key={`${offer.name}-${index}`} offer={offer} onClick={() => onElegir(index)} />
          ))}

          <button
            type="button"
            onClick={() => onElegir(offers.length)}
            className="w-full border-t border-b border-papel-linea py-3 text-left transition-colors hover:bg-tinta/5 active:bg-tinta/10"
          >
            <span className="block font-display text-[15px] font-bold tracking-tight text-tinta uppercase">
              No mover nada
            </span>
            <span className="mt-1 block font-body text-[13px] leading-snug text-tinta-suave">
              El plantel se queda como está. Y se desgasta como está.
            </span>
          </button>
        </div>
      </div>
    </Papel>
  );
}

function FilaOferta({ offer, onClick }: { offer: PlayerOffer; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-t border-papel-linea py-3 text-left transition-colors hover:bg-tinta/5 active:bg-tinta/10"
    >
      <span className="flex items-baseline gap-2">
        <span className="font-display text-[15px] font-bold tracking-tight text-tinta uppercase">
          {offer.name}
        </span>
        <span
          className={`font-acta text-[10px] tracking-[0.1em] uppercase ${
            offer.kind === 'venta' ? 'text-sello' : 'text-tinta-suave'
          }`}
        >
          {ETIQUETA[offer.kind]}
        </span>
      </span>

      <span className="mt-0.5 block font-body text-[13px] text-tinta-suave">
        {offer.archetype}, {offer.age} años. {offer.note}
      </span>

      <span className="mt-1.5 block font-acta text-[11px] tracking-[0.06em] text-tinta uppercase">
        {resumenOferta(offer)}
      </span>
    </button>
  );
}
