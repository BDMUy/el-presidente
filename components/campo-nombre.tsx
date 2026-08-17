'use client';

/**
 * El nombre del presidente.
 *
 * Antes se pedía recién en el epílogo, como un trámite para entrar al ranking.
 * Pedirlo al principio cambia de qué se trata: el club es de alguien, el acta
 * de asunción lleva un nombre, y la fila de la tabla dice quién fue.
 *
 * Se guarda en el dispositivo y no se vuelve a pedir. El envío al ranking lo
 * lee de ahí, así que quien ya lo puso acá no lo escribe dos veces.
 *
 * Filtra mientras se escribe con la MISMA función que corre en el servidor. No
 * es solo comodidad: si el campo aceptara algo que el servidor después limpia,
 * el nombre que ves mientras jugás no sería el que termina en la tabla.
 */

import { useEffect, useState } from 'react';

import { guardarNombre, leerNombre } from '@/lib/dispositivo';
import { LARGO_MAXIMO_NOMBRE, limpiarNombre } from '@/lib/nombre';

export function CampoNombre() {
  const [nombre, setNombre] = useState('');
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el nombre guardado solo existe en el cliente
    setNombre(leerNombre());
  }, []);

  const cambiar = (crudo: string) => {
    // Se limpia en cada tecla, pero sin exigir que quede algo: mientras se
    // escribe el campo puede estar vacío o a mitad de una palabra.
    const limpio = limpiarNombre(crudo) ?? '';
    // Un espacio final es legítimo mientras escribís: sin esto no se puede
    // teclear "Doña Rosa" porque el espacio desaparece apenas se pulsa.
    const conEspacio = crudo.endsWith(' ') && limpio.length > 0 ? `${limpio} ` : limpio;
    const valor = conEspacio.slice(0, LARGO_MAXIMO_NOMBRE);

    setNombre(valor);
    // Se guarda en cada tecla y no solo al salir del campo. Confiar en el blur
    // dejaba el nombre sin guardar cada vez que alguien lo escribía y tocaba
    // directo un club: en un celular ese es el camino normal, no el raro.
    guardarNombre(limpiarNombre(valor) ?? '');
    setGuardado(false);
  };

  /** Al salir del campo se fija la forma final: sin el espacio en el aire. */
  const confirmar = () => {
    const limpio = limpiarNombre(nombre);
    setNombre(limpio ?? '');
    guardarNombre(limpio ?? '');
    setGuardado(limpio !== null);
  };

  return (
    <div className="mt-5">
      <label className="block">
        <span className="font-acta text-[12px] font-bold tracking-[0.1em] text-papel-2 uppercase">
          Tu nombre
        </span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => cambiar(e.target.value)}
          onBlur={confirmar}
          maxLength={LARGO_MAXIMO_NOMBRE}
          placeholder="¿Quién firma las actas?"
          autoComplete="name"
          // Sin corrección automática: el teclado del celular le cambia el
          // apodo a cualquiera que no esté en su diccionario.
          autoCorrect="off"
          spellCheck={false}
          className="mt-1.5 w-full border border-linea bg-pano-alto px-3 py-2.5 font-body text-[15px] text-papel placeholder:text-papel-2 focus:border-bronce-claro focus:outline-none"
        />
      </label>
      <p className="mt-1.5 font-body text-[13px] leading-snug text-papel-2">
        {guardado
          ? 'Con ese nombre vas a figurar en la tabla de posiciones.'
          : 'Va en el acta de asunción y en la tabla de posiciones. Podés cambiarlo cuando quieras.'}
      </p>
    </div>
  );
}
