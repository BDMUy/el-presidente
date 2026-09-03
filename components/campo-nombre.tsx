'use client';

import { useEffect, useId, useState } from 'react';

import {
  alReasignarNombre,
  guardarNombre,
  leerNombre,
  nombreAsignado,
  reasignarNombre,
} from '@/lib/dispositivo';
import type { Country } from '@/lib/engine/types';
import { LARGO_MAXIMO_NOMBRE, limpiarNombre } from '@/lib/nombre';

export function CampoNombre({ pais }: { pais?: Country }) {
  const id = useId();
  const [nombre, setNombre] = useState('');
  const [asignado, setAsignado] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [giros, setGiros] = useState(0);

  useEffect(() => {
    setNombre(leerNombre());
    setAsignado(nombreAsignado());
    return alReasignarNombre(() => setAsignado(nombreAsignado()));
  }, []);

  const cambiar = (crudo: string) => {
    const limpio = limpiarNombre(crudo) ?? '';
    const conEspacio = crudo.endsWith(' ') && limpio.length > 0 ? `${limpio} ` : limpio;
    const valor = conEspacio.slice(0, LARGO_MAXIMO_NOMBRE);

    setNombre(valor);
    guardarNombre(limpiarNombre(valor) ?? '');
    setGuardado(false);
  };

  const confirmar = () => {
    const limpio = limpiarNombre(nombre);
    setNombre(limpio ?? '');
    guardarNombre(limpio ?? '');
    setGuardado(limpio !== null);
  };

  const sortear = () => {
    const nuevo = reasignarNombre(pais);
    setNombre(nuevo);
    guardarNombre(nuevo);
    setGuardado(true);
    setGiros((g) => g + 1);
  };

  return (
    <div className="mt-5" data-recorrido="nombre">
      <label
        htmlFor={id}
        className="block font-tabla text-[12px] font-bold tracking-[0.1em] text-tinta-2 uppercase"
      >
        Tu nombre
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          id={id}
          type="text"
          value={nombre}
          onChange={(e) => cambiar(e.target.value)}
          onBlur={confirmar}
          maxLength={LARGO_MAXIMO_NOMBRE}
          placeholder={asignado}
          autoComplete="name"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 border border-corondel bg-fondo-2 px-3 py-2.5 font-cuerpo text-[15px] text-tinta placeholder:text-tinta-2 focus:border-tinta focus:outline-none"
        />
        <button
          type="button"
          onClick={sortear}
          aria-label="Sortear un nombre"
          className="flex min-h-11 w-11 shrink-0 items-center justify-center border border-corondel text-tinta-2 transition-colors hover:border-tinta hover:text-tinta"
        >
          <span key={giros} className="girar-dado inline-flex">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
              <rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="8" cy="8" r="1.7" fill="currentColor" />
              <circle cx="16" cy="8" r="1.7" fill="currentColor" />
              <circle cx="12" cy="12" r="1.7" fill="currentColor" />
              <circle cx="8" cy="16" r="1.7" fill="currentColor" />
              <circle cx="16" cy="16" r="1.7" fill="currentColor" />
            </svg>
          </span>
        </button>
      </div>
      <p className="mt-1.5 font-cuerpo text-[13px] leading-snug text-tinta-2">
        {guardado
          ? 'Con ese nombre vas a figurar en la tabla de posiciones.'
          : nombre.trim().length > 0
            ? 'Va en el acta de asunción y en la tabla de posiciones. Podés cambiarlo cuando quieras.'
            : `Si lo dejás vacío firmás como ${asignado}. Tocá el dado para sortear otro.`}
      </p>
    </div>
  );
}
