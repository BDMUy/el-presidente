'use client';

import { useId, type ReactNode } from 'react';

export function CampoSelect({
  etiqueta,
  valor,
  onChange,
  disabled = false,
  children,
}: {
  etiqueta: string;
  valor: string;
  onChange: (valor: string) => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="block min-w-0">
      <label htmlFor={id} className="block font-tabla text-[0.75rem] font-bold tracking-[0.1em] text-tinta-2 uppercase">
        {etiqueta}
      </label>

      <span className="relative mt-1.5 block">
        <select
          id={id}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="min-h-11 w-full appearance-none border border-corondel bg-fondo-2 py-2.5 pr-9 pl-3 font-titular text-[0.9375rem] font-bold text-tinta focus:border-tinta focus:outline-none disabled:opacity-45"
        >
          {children}
        </select>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-titular text-[0.75rem] text-tinta-2"
        >
          ▼
        </span>
      </span>
    </div>
  );
}
