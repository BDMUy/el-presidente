'use client';

import { useEffect, useState } from 'react';

import { alReasignarNombre, guardarNombre, leerNombre, nombreAsignado } from '@/lib/dispositivo';
import { LARGO_MAXIMO_NOMBRE, limpiarNombre } from '@/lib/nombre';

export function CampoNombre() {
  const [nombre, setNombre] = useState('');
  const [asignado, setAsignado] = useState('');
  const [guardado, setGuardado] = useState(false);

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

  return (
    <div className="mt-5">
      <label className="block">
        <span className="font-tabla text-[12px] font-bold tracking-[0.1em] text-tinta-2 uppercase">
          Tu nombre
        </span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => cambiar(e.target.value)}
          onBlur={confirmar}
          maxLength={LARGO_MAXIMO_NOMBRE}
          placeholder={asignado}
          autoComplete="name"
          autoCorrect="off"
          spellCheck={false}
          className="mt-1.5 w-full border border-corondel bg-fondo-2 px-3 py-2.5 font-cuerpo text-[15px] text-tinta placeholder:text-tinta-2 focus:border-tinta focus:outline-none"
        />
      </label>
      <p className="mt-1.5 font-cuerpo text-[13px] leading-snug text-tinta-2">
        {guardado
          ? 'Con ese nombre vas a figurar en la tabla de posiciones.'
          : nombre.trim().length > 0
            ? 'Va en el acta de asunción y en la tabla de posiciones. Podés cambiarlo cuando quieras.'
            : `Si lo dejás vacío firmás como ${asignado}.`}
      </p>
    </div>
  );
}
