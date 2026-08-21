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
      <span className="block font-acta text-[11px] font-bold tracking-[0.1em] text-papel-2 uppercase">
        {etiqueta}
      </span>

      <span className="relative mt-1.5 block">
        <select
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="min-h-11 w-full appearance-none border border-linea bg-pano-alto py-2.5 pr-9 pl-3 font-display text-[15px] font-bold text-papel focus:border-bronce-claro focus:outline-none disabled:opacity-45"
        >
          {children}
        </select>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-display text-[10px] text-bronce-claro"
        >
          ▼
        </span>
      </span>
    </label>
  );
}
