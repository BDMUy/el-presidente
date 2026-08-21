'use client';

import { useCallback, useEffect, useState } from 'react';

import { LOGROS_POR_ID } from '@/content/logros';
import { TITLES, type Club, type Ending, type GameState } from '@/lib/engine/types';
import { encodeRun, shareUrl } from '@/lib/share';
import { registrarPartida, type Novedades } from '@/lib/vitrina';
import { EnvioAlRanking } from './envio-ranking';
import { Continuar, Membrete, Papel, Sello } from './ui';
import { ResumenPresidencia } from './resumen-presidencia';

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
  const [novedades, setNovedades] = useState<Novedades | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setNovedades(registrarPartida(state));
  }, [state]);

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
      setTimeout(() => setCopiado(false), 2400);
    } catch {
      window.prompt('Copiá el link de tu presidencia:', url);
    }
  }, [state, club, ending]);

  return (
    <Papel torcido={0}>
      <ResumenPresidencia state={state} club={club} ending={ending} />

      {novedades && <Novedad novedades={novedades} />}

      <EnvioAlRanking state={state} diaria={diaria} />

      <button
        type="button"
        onClick={compartir}
        className="mt-6 w-full border-2 border-tinta py-3.5 font-display text-[14px] font-black tracking-[0.12em] text-tinta uppercase transition-colors hover:bg-tinta hover:text-hoja active:scale-[0.99]"
      >
        {copiado ? 'Link copiado' : 'Compartir esta presidencia'}
      </button>

      <Continuar onClick={onReiniciar}>Otra presidencia</Continuar>
    </Papel>
  );
}

function Novedad({ novedades }: { novedades: Novedades }) {
  const { titulosNuevos, logrosNuevos, esRecord, vitrina } = novedades;
  if (titulosNuevos.length === 0 && logrosNuevos.length === 0 && !esRecord) return null;

  return (
    <div className="mt-7 border-t border-hoja-linea pt-4">
      <Membrete>Primera vez</Membrete>

      {esRecord && (
        <p className="mt-2 font-body text-[15px] leading-relaxed text-tinta">
          Tu mejor presidencia hasta ahora, con{' '}
          <span className="font-semibold">{vitrina.mejorPuntaje.toLocaleString('es-AR')}</span>{' '}
          puntos en {vitrina.partidas === 1 ? 'tu primera partida' : `${vitrina.partidas} partidas`}.
        </p>
      )}

      {titulosNuevos.length > 0 && (
        <div className="mt-3">
          <p className="font-body text-[14px] text-tinta-2">Entran a tu vitrina:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {titulosNuevos.map((id) => (
              <li key={id}>
                <Sello tono="verde">{TITLES[id].label}</Sello>
              </li>
            ))}
          </ul>
        </div>
      )}

      {logrosNuevos.length > 0 && (
        <div className="mt-3">
          <p className="font-body text-[14px] text-tinta-2">
            {logrosNuevos.length === 1 ? 'Logro desbloqueado:' : 'Logros desbloqueados:'}
          </p>
          <ul className="mt-1.5 space-y-1">
            {logrosNuevos.map((id) => (
              <li key={id} className="font-display text-[15px] font-bold text-tinta">
                {LOGROS_POR_ID[id]?.label ?? id}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
