import { useEffect, useState } from 'react';

export type Texto = 'chico' | 'normal' | 'grande';

const KEY = 'el-presidente:texto';
const EVENTO_CAMBIO = 'el-presidente:texto-cambio';

function esTexto(valor: unknown): valor is Texto {
  return valor === 'chico' || valor === 'normal' || valor === 'grande';
}

export function leerTexto(): Texto {
  if (typeof window === 'undefined') return 'normal';
  try {
    const guardado = window.localStorage.getItem(KEY);
    return esTexto(guardado) ? guardado : 'normal';
  } catch {
    return 'normal';
  }
}

export function guardarTexto(texto: Texto): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, texto);
  } catch {
  }
}

export function aplicarTexto(texto: Texto): void {
  if (typeof document === 'undefined') return;
  if (texto === 'normal') document.documentElement.removeAttribute('data-texto');
  else document.documentElement.setAttribute('data-texto', texto);
  window.dispatchEvent(new CustomEvent<Texto>(EVENTO_CAMBIO, { detail: texto }));
}

export function elegirTexto(texto: Texto): void {
  guardarTexto(texto);
  aplicarTexto(texto);
}

function textoActivo(): Texto {
  if (typeof document === 'undefined') return 'normal';
  const valor = document.documentElement.getAttribute('data-texto');
  return esTexto(valor) ? valor : 'normal';
}

export function useTextoActual(): Texto {
  const [texto, setTexto] = useState<Texto>(textoActivo);

  useEffect(() => {
    setTexto(textoActivo());
    const alCambiar = (evento: Event) => setTexto((evento as CustomEvent<Texto>).detail);
    window.addEventListener(EVENTO_CAMBIO, alCambiar);
    return () => window.removeEventListener(EVENTO_CAMBIO, alCambiar);
  }, []);

  return texto;
}
