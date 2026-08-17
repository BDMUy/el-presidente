'use client';

/**
 * Un campo de formulario con lista desplegable.
 *
 * Usa un `<select>` de verdad y no una lista dibujada a mano. En un celular
 * eso significa la rueda del sistema operativo: se abre encima de la página,
 * no la alarga, y ya sabe hacer todo lo que una lista hecha a mano hace mal
 * —arrastre con inercia, teclado físico, lector de pantalla, volver atrás con
 * el gesto del sistema—. En escritorio, además, escribir las primeras letras
 * salta a la opción, que era para lo que estaba el buscador.
 *
 * Lo único que se le saca al navegador es la flecha, porque la suya es gris de
 * sistema y acá todo es tinta sobre paño.
 */

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
          // pr-9 le deja lugar a la flecha; sin eso el nombre largo de un club
          // se le mete debajo.
          className="min-h-11 w-full appearance-none border border-linea bg-pano-alto py-2.5 pr-9 pl-3 font-display text-[15px] font-bold text-papel focus:border-bronce-claro focus:outline-none disabled:opacity-45"
        >
          {children}
        </select>

        {/* Un triángulo de texto y no un ícono: el juego no tiene ni uno solo,
            y meter el primero acá lo delataría como traído de otro lado. */}
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
