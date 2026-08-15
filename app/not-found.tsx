/**
 * La página que aparece cuando un link no lleva a ningún lado.
 *
 * No es una pantalla rara: es lo que ve alguien cuando le comparten una
 * presidencia y el link llegó cortado, o cuando abre uno viejo. Es decir, es
 * una de las primeras cosas que alguien puede ver del juego, y dejarla en el
 * 404 negro y en inglés de Next era perder a esa persona en la puerta.
 *
 * Por eso no se disculpa ni explica el error: dice qué pasó en una línea y
 * ofrece lo único que importa, que es jugar.
 */

import Link from 'next/link';

import { Membrete, Papel, Sello, Titulo } from '@/components/ui';

export default function NoEncontrado() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-4 py-10">
      <Papel torcido={1}>
        <div className="flex items-start justify-between gap-4">
          <Membrete>Mesa de entradas</Membrete>
          <Sello tono="rojo" className="shrink-0">
            No consta
          </Sello>
        </div>

        <div className="mt-5">
          <Titulo>Este expediente no existe</Titulo>
          <p className="mt-3 font-body text-[16px] leading-relaxed text-tinta">
            Si llegaste hasta acá por el link de una presidencia, es probable que se haya cortado
            en el camino. Pediselo de nuevo a quien te lo mandó, entero.
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 block w-full bg-tinta py-4 text-center font-display text-[14px] font-black tracking-[0.12em] text-hoja uppercase transition-transform active:scale-[0.99]"
        >
          Dirigí tu club
        </Link>
      </Papel>
    </main>
  );
}
