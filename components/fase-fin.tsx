'use client';

import Image from 'next/image';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

import { LOGROS_POR_ID } from '@/content/logros';
import { TITLES, type Club, type Ending, type GameState } from '@/lib/engine/types';
import { encodeRun, shareUrl } from '@/lib/share';
import { useTintaClub } from '@/lib/tema';
import { calcularNovedades, guardarVitrina, type Novedades } from '@/lib/vitrina';
import { EnvioAlRanking } from './envio-ranking';
import { Continuar, Ladillo, Recuadro, Volanta } from './ui';
import { ResumenPresidencia } from './resumen-presidencia';
import { Festejo } from './festejo';

export function FaseFin({
  state,
  club,
  ending,
  diaria,
  onReiniciar,
}: {
  state: GameState;
  club: Club;
  ending: Ending;
  diaria: string | null;
  onReiniciar: () => void;
}) {
  const [novedades] = useState<Novedades>(() => calcularNovedades(state));
  const [copiado, setCopiado] = useState(false);
  const [linkManual, setLinkManual] = useState<string | null>(null);
  const copiadoTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const linkManualRef = useRef<HTMLInputElement>(null);
  const tintaClub = useTintaClub(club);

  useEffect(() => {
    guardarVitrina(novedades.vitrina);
  }, [novedades]);

  useEffect(() => () => clearTimeout(copiadoTimer.current), []);

  useEffect(() => {
    if (linkManual) linkManualRef.current?.select();
  }, [linkManual]);

  const compartir = useCallback(async () => {
    const url = shareUrl(
      encodeRun({
        seed: state.seed,
        clubId: state.clubId,
        modo: state.modo,
        choices: state.choices,
      }),
      window.location.origin,
    );
    const texto = `${ending.title} · ${club.name}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'El Presidente', text: texto, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      clearTimeout(copiadoTimer.current);
      copiadoTimer.current = setTimeout(() => setCopiado(false), 2400);
    } catch {
      setLinkManual(url);
    }
  }, [state, club, ending]);

  return (
    <div style={{ '--club': tintaClub } as CSSProperties}>
      <Recuadro acento="club">
        {ending.id === 'estatua' && <Festejo titulo="Sos leyenda" detalle="Tu nombre queda en la tribuna." />}
        <ResumenPresidencia state={state} club={club} ending={ending} />
        <figure className="relative overflow-hidden rounded-[var(--radio-sm)]">
          <Image src="/ilustraciones/fin-presidencia.webp" alt="" width={1180} height={787} sizes="(max-width: 600px) 85vw, 500px" className="mt-4 h-24 w-full object-cover sm:h-28" />
          <figcaption className="absolute bottom-0 left-0 rounded-tr-[var(--radio-sm)] bg-fondo/85 px-2 py-1 font-tabla text-[0.6875rem] tracking-[0.08em] text-tinta uppercase">
            El despacho, la última tarde
          </figcaption>
        </figure>

        <Novedad novedades={novedades} />

        <button
          type="button"
          onClick={compartir}
          className="mt-6 w-full overflow-hidden rounded-[var(--radio-sm)] border-2 border-tinta py-3.5 font-titular text-[0.875rem] tracking-[0.12em] text-tinta uppercase transition-colors hover:bg-tinta hover:text-fondo"
        >
          <span key={copiado ? 'copiado' : 'compartir'} className="entrar-nota inline-block">
            {copiado ? 'Link copiado' : 'Compartir esta presidencia'}
          </span>
        </button>

        {linkManual && (
          <div className="entrar-nota tarjeta-plana mt-3 p-3">
            <p className="font-tabla text-[0.75rem] font-bold tracking-[0.1em] text-tinta-2 uppercase">
              Copiá el link a mano
            </p>
            <input
              ref={linkManualRef}
              type="text"
              readOnly
              value={linkManual}
              onFocus={(e) => e.currentTarget.select()}
              className="mt-1.5 min-h-11 w-full rounded-[var(--radio-sm)] border border-corondel bg-fondo px-2.5 font-cuerpo text-[0.875rem] text-tinta focus:border-acento focus:outline-none"
            />
          </div>
        )}

        <Continuar onClick={onReiniciar}>Otra presidencia</Continuar>

        <EnvioAlRanking state={state} diaria={diaria} />
      </Recuadro>
    </div>
  );
}

function Novedad({ novedades }: { novedades: Novedades }) {
  const { titulosNuevos, logrosNuevos, esRecord, vitrina } = novedades;
  if (titulosNuevos.length === 0 && logrosNuevos.length === 0 && !esRecord) return null;

  return (
    <div className="mt-7 border-t border-corondel pt-4">
      {esRecord
        ? <Festejo titulo="Nuevo récord" detalle={`${vitrina.mejorPuntaje.toLocaleString('es-AR')} puntos · tu mejor presidencia`} />
        : <Volanta>Tu vitrina crece</Volanta>}

      {titulosNuevos.length > 0 && (
        <div className="mt-3">
          <p className="font-cuerpo text-[0.875rem] text-tinta-2">Entran a tu vitrina:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {titulosNuevos.map((id) => (
              <li key={id}>
                <Ladillo tono="acento">{TITLES[id].label}</Ladillo>
              </li>
            ))}
          </ul>
        </div>
      )}

      {logrosNuevos.length > 0 && (
        <div className="mt-3">
          <p className="font-cuerpo text-[0.875rem] text-tinta-2">
            {logrosNuevos.length === 1 ? 'Logro desbloqueado:' : 'Logros desbloqueados:'}
          </p>
          <ul className="mt-1.5 space-y-1">
            {logrosNuevos.map((id) => (
              <li key={id} className="font-titular text-[0.9375rem] font-bold text-tinta">
                {LOGROS_POR_ID[id]?.label ?? id}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
