'use client';

import type { ReactNode } from 'react';

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
  return (
    <label className="block min-w-0">
      <span className="block font-tabla text-[11px] font-bold tracking-[0.1em] text-tinta-2 uppercase">
        {etiqueta}
      </span>

      <span className="relative mt-1.5 block">
        <select
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="min-h-11 w-full appearance-none border border-corondel bg-fondo-2 py-2.5 pr-9 pl-3 font-titular text-[15px] font-bold text-tinta focus:border-tinta focus:outline-none disabled:opacity-45"
        >
          {children}
        </select>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-titular text-[10px] text-tinta-2"
        >
          ▼
        </span>
      </span>
    </label>
  );
}
