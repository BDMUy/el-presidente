'use client';

/**
 * La pantalla de espera.
 *
 * Aparece en dos momentos distintos y por razones distintas: al abrir el juego,
 * mientras se reconstruye la partida guardada, y en la tabla de posiciones,
 * mientras vuelve la consulta desde São Paulo. El primero dura milisegundos y
 * el segundo puede durar bastante más, así que el mismo componente sirve en
 * tamaño grande y chico.
 *
 * El orbe es `thinking-orbs`: dibuja a canvas, es monocromo y con `theme="dark"`
 * pinta tinta clara sobre transparente, que es lo que necesita el paño verde.
 * `searching` es el estado que corresponde: en el juego nadie está calculando
 * nada, están buscando un papel en un archivo.
 *
 * Es cliente puro porque el canvas no existe en el servidor.
 */

import { ThinkingOrb } from 'thinking-orbs';

export function Cargando({
  children,
  chico = false,
}: {
  children: React.ReactNode;
  /** Versión en línea, para dentro de una caja que ya tiene su propio marco. */
  chico?: boolean;
}) {
  if (chico) {
    return (
      <p className="flex items-center gap-2 font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
        <ThinkingOrb state="searching" size={20} theme="dark" aria-hidden />
        {children}
      </p>
    );
  }

  return (
    // `role="status"` y no un div mudo: quien usa lector de pantalla tiene que
    // enterarse de que la aplicación está haciendo algo, no de que hay un
    // canvas. El orbe queda oculto para ese lector y habla el texto.
    <div
      role="status"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6"
    >
      <ThinkingOrb state="searching" size={64} theme="dark" aria-hidden />
      <p className="text-center font-acta text-[11px] tracking-[0.2em] text-papel-2 uppercase">
        {children}
      </p>
    </div>
  );
}
