'use client';

import { elegirTexto, useTextoActual, type Texto } from '@/lib/preferencias';
import { BarraSuperior, ToggleTema } from './barra-superior';
import { Volanta } from './ui';

const TAMANOS: { id: Texto; label: string }[] = [
  { id: 'chico', label: 'Chico' },
  { id: 'normal', label: 'Normal' },
  { id: 'grande', label: 'Grande' },
];

export function Ajustes({ onVolver, onAyuda }: { onVolver: () => void; onAyuda: () => void }) {
  const texto = useTextoActual();
  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-10 pl-[max(1rem,var(--sae-left))] pr-[max(1rem,var(--sae-right))]">
      <div className="pt-3">
        <BarraSuperior onVolver={onVolver} volverLabel="← Volver" />
      </div>

      <header className="pt-8">
        <p className="border-b border-corondel pb-1.5 font-tabla text-[11px] tracking-[0.14em] text-tinta-2 uppercase">
          Ajustes
        </p>
        <h1
          className="mt-4 font-titular text-[clamp(2rem,8vw,3rem)] leading-[0.9] font-black tracking-[-0.02em] text-tinta uppercase"
          style={{ fontStretch: '80%' }}
        >
          Ajustes
        </h1>
      </header>

      <section className="mt-8">
        <Volanta as="h2">Edición</Volanta>
        <div className="mt-2">
          <ToggleTema />
        </div>
      </section>

      <section className="mt-8">
        <Volanta as="h2">Tamaño de texto</Volanta>
        <div role="group" aria-label="Tamaño de texto" className="mt-3 flex gap-2">
          {TAMANOS.map((opcion) => {
            const activo = texto === opcion.id;
            return (
              <button
                key={opcion.id}
                type="button"
                aria-pressed={activo}
                onClick={() => elegirTexto(opcion.id)}
                className={`min-h-11 flex-1 border px-3 font-tabla text-[11px] tracking-[0.1em] uppercase transition-colors ${
                  activo
                    ? 'border-tinta bg-tinta text-fondo'
                    : 'border-corondel text-tinta-2 hover:border-tinta hover:text-tinta'
                }`}
              >
                {opcion.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 font-cuerpo text-[0.875rem] leading-snug text-tinta-2">
          Cambia el cuerpo de lectura y las etiquetas de las opciones.
        </p>
      </section>

      <section className="mt-8 border-t border-corondel pt-6">
        <button
          type="button"
          onClick={onAyuda}
          className="min-h-11 font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase underline underline-offset-4 transition-colors hover:text-tinta"
        >
          Cómo se juega y cómo se gana →
        </button>
      </section>
    </div>
  );
}
