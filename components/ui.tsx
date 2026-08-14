/**
 * Primitivas visuales compartidas.
 *
 * Todo en el juego es un objeto sobre la mesa: una hoja, un sello, una ficha.
 * Estos componentes son esos objetos; las pantallas solo los acomodan.
 */

import type { ReactNode } from 'react';

export function Papel({
  children,
  torcido = 1,
  className = '',
}: {
  children: ReactNode;
  torcido?: 0 | 1 | 2;
  className?: string;
}) {
  const angulo = torcido === 0 ? '' : torcido === 1 ? 'papel-torcido-1' : 'papel-torcido-2';
  return (
    <div className={`papel deslizar ${angulo} ${className}`}>
      <div className="p-5 sm:p-7">{children}</div>
    </div>
  );
}

/** El sello de goma: el elemento firma del juego. */
export function Sello({
  children,
  tono = 'rojo',
  animado = false,
  className = '',
}: {
  children: ReactNode;
  tono?: 'rojo' | 'verde' | 'bronce';
  animado?: boolean;
  className?: string;
}) {
  const tonoClase = tono === 'verde' ? 'sello-verde' : tono === 'bronce' ? 'sello-bronce' : '';
  return (
    <span
      className={`sello inline-block text-[10px] uppercase ${tonoClase} ${
        animado ? 'sello-anim' : ''
      } ${className}`}
    >
      {children}
    </span>
  );
}

/** Metadatos del documento: número de acta, temporada, fecha. */
export function Membrete({ children }: { children: ReactNode }) {
  return (
    <p className="font-acta text-[10px] uppercase tracking-[0.18em] text-tinta-suave">
      {children}
    </p>
  );
}

/** Título del documento. */
export function Titulo({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-2xl leading-[0.98] font-black tracking-tight text-tinta uppercase sm:text-3xl">
      {children}
    </h1>
  );
}

/**
 * Una opción firmable: la etiqueta a la izquierda, la consecuencia al pie.
 * Se lee como un renglón de formulario, no como un botón de app.
 */
export function Renglon({
  label,
  hint,
  azaroso = false,
  onClick,
  disabled = false,
}: {
  label: string;
  hint: string;
  azaroso?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group w-full border-t border-papel-linea py-3 text-left transition-colors last:border-b hover:bg-tinta/5 active:bg-tinta/10 disabled:opacity-40"
    >
      <span className="renglon flex items-baseline font-display text-[15px] font-bold tracking-tight text-tinta uppercase">
        {label}
        {azaroso && <span className="font-acta text-xs text-sello">al azar</span>}
      </span>
      <span className="mt-1 block font-body text-[13px] leading-snug text-tinta-suave">
        {hint}
      </span>
    </button>
  );
}

/** El botón que cierra una pantalla y pasa a la siguiente. */
export function Continuar({
  children = 'Continuar',
  onClick,
}: {
  children?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 w-full bg-tinta py-3.5 font-display text-sm font-black tracking-[0.14em] text-papel uppercase transition-transform active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

/** Cifra con su etiqueta, como una línea de balance. */
export function Cifra({
  label,
  valor,
  delta,
  destacado = false,
}: {
  label: string;
  valor: string;
  delta?: number;
  destacado?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="font-acta text-[9px] leading-none tracking-[0.12em] text-papel/45 uppercase">
        {label}
      </p>
      <p
        className={`mt-1 truncate font-display text-base leading-none font-black tabular-nums ${
          destacado ? 'text-sello' : 'text-papel'
        }`}
      >
        {valor}
        {delta !== undefined && delta !== 0 && (
          <span
            className={`ml-1 font-acta text-[10px] font-bold ${
              delta > 0 ? 'text-emerald-300' : 'text-red-300'
            }`}
          >
            {delta > 0 ? '▲' : '▼'}
          </span>
        )}
      </p>
    </div>
  );
}
