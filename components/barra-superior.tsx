'use client';

import Link from 'next/link';
import { useId } from 'react';

import { elegirTema, leerTema, temaDelSistema, useTemaActual, type Tema } from '@/lib/tema';
import { IconoAjustes, IconoVolver } from './iconos';

export function BarraSuperior({
  onVolver,
  volverHref,
  volverLabel = 'Volver al inicio',
  onAjustes,
}: {
  onVolver?: () => void;
  volverHref?: string;
  volverLabel?: string;
  onAjustes?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-corondel py-2">
      {onVolver ? (
        <button
          type="button"
          onClick={onVolver}
          data-volver
          className="-mx-2 inline-flex min-h-11 items-center gap-1.5 px-2 font-tabla text-[0.75rem] tracking-[0.1em] text-tinta-2 uppercase transition-colors hover:text-tinta"
        >
          <IconoVolver />
          {volverLabel}
        </button>
      ) : volverHref ? (
        <Link
          href={volverHref}
          data-volver
          className="-mx-2 inline-flex min-h-11 items-center gap-1.5 px-2 font-tabla text-[0.75rem] tracking-[0.1em] text-tinta-2 uppercase transition-colors hover:text-tinta"
        >
          <IconoVolver />
          {volverLabel}
        </Link>
      ) : (
        <span aria-hidden />
      )}

      <div className="flex items-center gap-2">
        {onAjustes && (
          <button
            type="button"
            onClick={onAjustes}
            className="control-edicion min-h-11 px-2 font-tabla text-[0.75rem] tracking-[0.06em] uppercase"
          >
            <IconoAjustes />
            Ajustes
          </button>
        )}
        <ToggleTema />
      </div>
    </div>
  );
}

export function ToggleTema() {
  const tema = useTemaActual();

  const cambiarTema = () => {
    const actual = leerTema() ?? temaDelSistema();
    const siguiente: Tema = actual === 'claro' ? 'oscuro' : 'claro';

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido || typeof document.startViewTransition !== 'function') {
      elegirTema(siguiente);
      return;
    }

    const transicion = document.startViewTransition(() => elegirTema(siguiente));
    const ignorar = () => {};
    transicion.finished.catch(ignorar);
    transicion.updateCallbackDone.catch(ignorar);
    transicion.ready
      .then(() => {
        document.documentElement.animate(
          { opacity: [0, 1] },
          { duration: 240, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(ignorar);
  };

  return (
    <button
      type="button"
      onClick={cambiarTema}
      aria-label={tema === 'claro' ? 'Cambiar a edición nocturna' : 'Cambiar a edición de día'}
      title={tema === 'claro' ? 'Cambiar a edición nocturna' : 'Cambiar a edición de día'}
      className="control-edicion control-tema min-h-11 px-2 font-tabla text-[0.75rem] tracking-[0.06em] uppercase"
    >
      <IconoTema />
      {tema === 'claro' ? 'Día' : 'Noche'}
    </button>
  );
}

function IconoTema() {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className="icono-tema shrink-0" aria-hidden focusable="false">
      <g className="rayos" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line x1="12" y1="1.5" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22.5" />
        <line x1="1.5" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22.5" y2="12" />
        <line x1="4.4" y1="4.4" x2="6.2" y2="6.2" />
        <line x1="17.8" y1="17.8" x2="19.6" y2="19.6" />
        <line x1="4.4" y1="19.6" x2="6.2" y2="17.8" />
        <line x1="17.8" y1="6.2" x2="19.6" y2="4.4" />
      </g>
      <mask id={id}>
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <circle className="sombra" r="5.2" fill="black" />
      </mask>
      <circle cx="12" cy="12" r="5" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}
