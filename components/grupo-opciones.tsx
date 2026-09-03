'use client';

import { useRef, type KeyboardEvent, type ReactNode } from 'react';

export function GrupoOpciones({
  etiqueta,
  onConfirmar,
  className = '',
  children,
}: {
  etiqueta: string;
  onConfirmar?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const alTeclado = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      onConfirmar?.();
      return;
    }

    const paso =
      evento.key === 'ArrowDown' || evento.key === 'ArrowRight'
        ? 1
        : evento.key === 'ArrowUp' || evento.key === 'ArrowLeft'
          ? -1
          : 0;
    if (paso === 0 || !ref.current) return;

    const radios = Array.from(
      ref.current.querySelectorAll<HTMLElement>('[role="radio"]:not([disabled])'),
    );
    if (radios.length === 0) return;

    evento.preventDefault();
    const actual = radios.indexOf(document.activeElement as HTMLElement);
    const proximo = radios[(Math.max(0, actual) + paso + radios.length) % radios.length];
    proximo.focus();
    proximo.click();
  };

  return (
    <div ref={ref} role="radiogroup" aria-label={etiqueta} onKeyDown={alTeclado} className={className}>
      {children}
    </div>
  );
}
