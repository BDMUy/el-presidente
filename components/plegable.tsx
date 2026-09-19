'use client';

import { useId, useState } from 'react';

import { Volanta } from './ui';

export function Plegable({
  titulo,
  resumen,
  abiertoPorDefecto = false,
  ancla,
  children,
}: {
  titulo: string;
  resumen?: string;
  abiertoPorDefecto?: boolean;
  ancla?: string;
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(abiertoPorDefecto);
  const id = useId();

  return (
    <section data-recorrido={ancla} className="mt-6">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-controls={id}
        className="fila-abrir flex min-h-11 w-full items-center gap-3 px-3 py-2.5 text-left lg:hidden"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-tabla text-[0.75rem] font-bold tracking-[0.1em] text-tinta-2 uppercase">
            {titulo}
          </span>
          {resumen && !abierto && (
            <span className="mt-0.5 block truncate font-cuerpo text-[0.8125rem] text-tinta-2">
              {resumen}
            </span>
          )}
        </span>
      </button>

      <div className="hidden lg:block">
        <Volanta>{titulo}</Volanta>
      </div>

      <div
        id={id}
        className={`pb-3 lg:pb-0 ${abierto ? 'entrar-nota block' : 'hidden'} lg:block`}
      >
        {children}
      </div>
    </section>
  );
}
