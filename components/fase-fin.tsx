'use client';

/**
 * El epílogo: la hoja que te llevás.
 *
 * Hace tres cosas además de mostrar el resumen: suma la presidencia a la
 * vitrina, celebra lo que se desbloqueó por primera vez, y arma el link para
 * compartirla.
 *
 * Las novedades se muestran aparte del total a propósito. Ganar tu primera
 * Libertadores tiene que verse distinto de ganar la cuarta, y eso solo se
 * puede saber comparando contra lo que ya había en la vitrina.
 */

import { useCallback, useEffect, useState } from 'react';

import { LOGROS_POR_ID } from '@/content/logros';
import { TITLES, type Club, type Ending, type GameState } from '@/lib/engine/types';
import { encodeRun, shareUrl } from '@/lib/share';
import { registrarPartida, type Novedades } from '@/lib/vitrina';
import { Continuar, Membrete, Papel, Sello } from './ui';
import { ResumenPresidencia } from './resumen-presidencia';

export function FaseFin({
  state,
  club,
  ending,
  onReiniciar,
}: {
  state: GameState;
  club: Club;
  ending: Ending;
  onReiniciar: () => void;
}) {
  const [novedades, setNovedades] = useState<Novedades | null>(null);
  const [copiado, setCopiado] = useState(false);

  // La vitrina vive en localStorage, así que solo se puede tocar en el cliente.
  // `registrarPartida` es idempotente por presidencia, así que volver a montar
  // este componente —o recargar la página sobre el epílogo— no vuelve a sumarla.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- la vitrina solo existe en el cliente
    setNovedades(registrarPartida(state));
  }, [state]);

  const compartir = useCallback(async () => {
    const url = shareUrl(
      encodeRun({ seed: state.seed, clubId: state.clubId, choices: state.choices }),
      window.location.origin,
    );
    const texto = `${ending.title} · ${club.name}`;

    // En el celular el menú nativo es lo que la gente espera; en escritorio
    // no existe y copiar al portapapeles es el equivalente honesto.
    if (navigator.share) {
      try {
        await navigator.share({ title: 'El Presidente', text: texto, url });
        return;
      } catch {
        // Canceló el menú de compartir: no es un error, no se avisa nada.
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

/** Lo que esta presidencia sumó a la vitrina, si sumó algo. */
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
