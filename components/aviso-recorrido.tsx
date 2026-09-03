'use client';

import { useCallback, useState } from 'react';

import { marcarRecorridoVisto, useRecorridoPendiente, type RecorridoId } from '@/lib/recorrido';
import { Recorrido, type PasoRecorrido } from './recorrido';

export function AvisoRecorrido({
  id,
  pasos,
  etiqueta,
}: {
  id: RecorridoId;
  pasos: PasoRecorrido[];
  etiqueta: string;
}) {
  const pendiente = useRecorridoPendiente(id);
  const [abierto, setAbierto] = useState(false);
  const [oculto, setOculto] = useState(false);

  const cerrar = useCallback(() => {
    setAbierto(false);
    setOculto(true);
  }, []);

  if (abierto) {
    return <Recorrido id={id} pasos={pasos} onCerrar={cerrar} />;
  }

  if (!pendiente || oculto) return null;

  return (
    <div className="my-4 flex items-center gap-3 border border-corondel px-3 py-2">
      <p className="font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase">{etiqueta}</p>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="min-h-11 font-tabla text-[11px] tracking-[0.1em] text-tinta uppercase underline underline-offset-4 transition-colors hover:text-tinta-2"
      >
        Ver recorrido
      </button>
      <button
        type="button"
        onClick={() => {
          marcarRecorridoVisto(id);
          setOculto(true);
        }}
        aria-label="No mostrar el recorrido"
        className="ml-auto min-h-11 px-2 font-titular text-[15px] leading-none text-tinta-2 transition-colors hover:text-tinta"
      >
        ×
      </button>
    </div>
  );
}
