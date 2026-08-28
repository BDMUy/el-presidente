import { useEffect, useMemo, useState } from 'react';

import { fondoDelTema, tintaDeClub } from './color';
import type { Club } from './engine/types';

export type Tema = 'oscuro' | 'claro';

const KEY = 'el-presidente:tema';
const EVENTO_CAMBIO = 'el-presidente:tema-cambio';

export function leerTema(): Tema | null {
  if (typeof window === 'undefined') return null;
  try {
    const guardado = window.localStorage.getItem(KEY);
    return guardado === 'claro' || guardado === 'oscuro' ? guardado : null;
  } catch {
    return null;
  }
}

export function guardarTema(tema: Tema): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, tema);
  } catch {
  }
}

export function temaDelSistema(): Tema {
  if (typeof window === 'undefined') return 'oscuro';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'oscuro';
}

export function aplicarTema(tema: Tema): void {
  if (typeof document === 'undefined') return;
  if (tema === 'claro') document.documentElement.setAttribute('data-tema', 'claro');
  else document.documentElement.removeAttribute('data-tema');
  window.dispatchEvent(new CustomEvent<Tema>(EVENTO_CAMBIO, { detail: tema }));
}

export function elegirTema(tema: Tema): void {
  guardarTema(tema);
  aplicarTema(tema);
}

function temaActivo(): Tema {
  if (typeof document === 'undefined') return 'oscuro';
  return document.documentElement.getAttribute('data-tema') === 'claro' ? 'claro' : 'oscuro';
}

export function useTemaActual(): Tema {
  const [tema, setTema] = useState<Tema>(temaActivo);

  useEffect(() => {
    setTema(temaActivo());
    const alCambiar = (evento: Event) => setTema((evento as CustomEvent<Tema>).detail);
    window.addEventListener(EVENTO_CAMBIO, alCambiar);
    return () => window.removeEventListener(EVENTO_CAMBIO, alCambiar);
  }, []);

  return tema;
}

export function useTintaClub(club: Club | null): string | null {
  const tema = useTemaActual();
  return useMemo(
    () => (club ? tintaDeClub(club.colors[0], fondoDelTema(tema)) : null),
    [club, tema],
  );
}
