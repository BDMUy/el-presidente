import { useEffect, useState } from 'react';

export type RecorridoId = 'inicio' | 'juego';

const KEYS: Record<RecorridoId, string> = {
  inicio: 'el-presidente:recorrido-inicio',
  juego: 'el-presidente:recorrido-juego',
};

export function recorridoVisto(id: RecorridoId): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(KEYS[id]) === 'visto';
  } catch {
    return true;
  }
}

export function marcarRecorridoVisto(id: RecorridoId): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEYS[id], 'visto');
  } catch {
  }
}

export function useRecorridoPendiente(id: RecorridoId): boolean {
  const [pendiente, setPendiente] = useState(false);

  useEffect(() => {
    setPendiente(!recorridoVisto(id));
  }, [id]);

  return pendiente;
}
