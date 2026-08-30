'use client';

import Link from 'next/link';
import { useId, type MouseEvent } from 'react';

import { elegirTema, leerTema, temaDelSistema, useTemaActual, type Tema } from '@/lib/tema';

export function BarraSuperior({
  onVolver,
  volverHref,
}: {
  onVolver?: () => void;
  volverHref?: string;
}) {
  const tema = useTemaActual();

  const cambiarTema = (evento: MouseEvent<HTMLButtonElement>) => {
    const actual = leerTema() ?? temaDelSistema();
    const siguiente: Tema = actual === 'claro' ? 'oscuro' : 'claro';

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido || typeof document.startViewTransition !== 'function') {
      elegirTema(siguiente);
      return;
    }

    const x = evento.clientX;
    const y = evento.clientY;
    const radio = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transicion = document.startViewTransition(() => elegirTema(siguiente));
    const ignorar = () => {};
    transicion.finished.catch(ignorar);
    transicion.updateCallbackDone.catch(ignorar);
    transicion.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
          { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(ignorar);
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-corondel py-2">
      {onVolver ? (
        <button
          type="button"
          onClick={onVolver}
          className="-mx-2 min-h-11 px-2 font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase transition-colors hover:text-tinta"
        >
          ← Volver al inicio
        </button>
      ) : volverHref ? (
        <Link
          href={volverHref}
          className="-mx-2 inline-flex min-h-11 items-center px-2 font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase transition-colors hover:text-tinta"
        >
          ← Volver al inicio
        </Link>
      ) : (
        <span aria-hidden />
      )}
      <button
        type="button"
        onClick={cambiarTema}
        className="-mx-2 flex min-h-11 items-center gap-1.5 px-2 font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase transition-colors hover:text-tinta"
      >
        <IconoTema />
        {tema === 'claro' ? 'Edición nocturna' : 'Edición de día'}
      </button>
    </div>
  );
}

function IconoTema() {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" className="icono-tema shrink-0" aria-hidden focusable="false">
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
