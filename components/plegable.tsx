'use client';

import { useId, useState } from 'react';

export function Plegable({
  titulo,
  resumen,
  abiertoPorDefecto = false,
  children,
}: {
  titulo: string;
  resumen?: string;
  abiertoPorDefecto?: boolean;
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(abiertoPorDefecto);
  const id = useId();

  return (
    <section className="mt-6 border border-linea lg:border-0">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-controls={id}
        className="flex min-h-11 w-full items-center gap-3 px-3 text-left lg:hidden"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-acta text-[12px] font-bold tracking-[0.1em] text-papel-2 uppercase">
            {titulo}
          </span>
          {resumen && !abierto && (
            <span className="mt-0.5 block truncate font-body text-[13px] text-papel-2">
              {resumen}
            </span>
          )}
        </span>
        <span
          aria-hidden
          className="shrink-0 font-display text-[18px] leading-none font-black text-bronce-claro"
        >
          {abierto ? '−' : '+'}
        </span>
      </button>

      <p className="hidden font-acta text-[12px] font-bold tracking-[0.1em] text-papel-2 uppercase lg:block">
        {titulo}
      </p>

      <div
        id={id}
        className={`px-3 pb-3 lg:px-0 lg:pb-0 ${abierto ? 'block' : 'hidden'} lg:block`}
      >
        {children}
      </div>
    </section>
  );
}
