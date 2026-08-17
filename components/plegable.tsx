'use client';

/**
 * Sección que se pliega, pero solo en celular.
 *
 * El inicio apila cuatro bloques —la del día, la tabla, la vitrina y el
 * padrón— y en un teléfono eso es una tira larguísima donde el padrón, que es
 * lo que uno vino a hacer, queda tres pantallas abajo. En escritorio no pasa:
 * hay dos columnas y todo entra.
 *
 * Por eso el plegado es solo de celular. En `lg` el `lg:block` le gana al
 * `hidden` y el encabezado desaparece: la sección queda como antes, sin
 * ningún control de más que no resolvía ningún problema.
 *
 * No usa `<details>` a propósito: para que en escritorio estuviera siempre
 * abierto habría que pelearle a la hoja de estilos del navegador con un
 * `display` forzado sobre los hijos que el elemento oculta solo. Dos clases de
 * Tailwind dicen lo mismo sin pelearse con nadie.
 */

import { useId, useState } from 'react';

export function Plegable({
  titulo,
  resumen,
  abiertoPorDefecto = false,
  children,
}: {
  titulo: string;
  /** Una línea con lo esencial, para no tener que abrirla para saber si vale. */
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
        {/* Un signo y no un chevron dibujado: el juego no tiene ni un ícono, y
            meter uno solo acá lo delataría como pegado de otro lado. */}
        <span
          aria-hidden
          className="shrink-0 font-display text-[18px] leading-none font-black text-bronce-claro"
        >
          {abierto ? '−' : '+'}
        </span>
      </button>

      {/* En escritorio el título va igual, pero como rótulo y no como control.
          El plegable es dueño del título en las dos anchuras: cuando cada
          sección traía además el suyo, "Presidencia del día" aparecía dos
          veces seguidas, una en el encabezado y otra adentro. */}
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
