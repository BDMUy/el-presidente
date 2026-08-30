import Link from 'next/link';

import { BarraSuperior } from '@/components/barra-superior';
import { Ladillo, Recuadro, Titular, Volanta } from '@/components/ui';

export default function NoEncontrado() {
  return (
    <main
      id="principal"
      tabIndex={-1}
      className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-10 focus:outline-none"
    >
      <BarraSuperior volverHref="/" />

      <div className="flex flex-1 flex-col justify-center">
        <Recuadro>
          <div className="flex items-start justify-between gap-4">
            <Volanta>Mesa de entradas</Volanta>
            <Ladillo tono="alerta" className="shrink-0">
              No consta
            </Ladillo>
          </div>

          <div className="mt-5">
            <Titular>Este expediente no existe</Titular>
            <p className="mt-3 font-cuerpo text-[16px] leading-relaxed text-tinta">
              Si llegaste hasta acá por el link de una presidencia, es probable que se haya cortado
              en el camino. Pediselo de nuevo a quien te lo mandó, entero.
            </p>
          </div>

          <Link
            href="/"
            className="mt-6 block w-full bg-tinta py-4 text-center font-titular text-[14px] font-black tracking-[0.12em] text-fondo uppercase transition-[color,background-color,transform] active:scale-[0.97] active:bg-tinta-2"
          >
            Dirigí tu club
          </Link>
        </Recuadro>
      </div>
    </main>
  );
}
