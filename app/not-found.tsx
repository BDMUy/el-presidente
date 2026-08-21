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
