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
import { IconoDado } from './iconos';

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
    <div className="mt-3" data-recorrido="nombre">
      <label
        htmlFor={id}
        className="block font-tabla text-[0.75rem] font-bold tracking-[0.1em] text-tinta-2 uppercase"
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
          className="min-h-11 min-w-0 flex-1 border border-corondel bg-fondo-2 px-3 py-2.5 font-cuerpo text-[1rem] text-tinta placeholder:text-tinta-2 focus:border-tinta focus:outline-none"
        />
        <button
          type="button"
          onClick={sortear}
          aria-label="Sortear un nombre"
          className="control-edicion min-h-11 w-11 shrink-0"
        >
          <span key={giros} className={giros ? 'girar-dado inline-flex' : 'inline-flex'}>
            <IconoDado />
          </span>
        </button>
      </div>
      <p className="mt-1.5 font-cuerpo text-[0.8125rem] leading-snug text-tinta-2">
        {guardado
          ? 'Tu firma está lista.'
          : nombre.trim().length > 0
            ? 'Así vas a firmar tu presidencia.'
            : 'Podés usar el nombre que te tocó.'}
      </p>
    </div>
  );
}
