'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { marcarRecorridoVisto, type RecorridoId } from '@/lib/recorrido';

export interface PasoRecorrido {
  sel: string;
  titulo: string;
  cuerpo: string;
}

interface Caja {
  top: number;
  left: number;
  width: number;
  height: number;
}

const MARGEN = 6;

function recorte(hueco: Caja): string {
  const x1 = Math.round(hueco.left);
  const y1 = Math.round(hueco.top);
  const x2 = Math.round(hueco.left + hueco.width);
  const y2 = Math.round(hueco.top + hueco.height);
  return `polygon(0 0, 0 100%, ${x1}px 100%, ${x1}px ${y1}px, ${x2}px ${y1}px, ${x2}px ${y2}px, ${x1}px ${y2}px, ${x1}px 100%, 100% 100%, 100% 0)`;
}

export function Recorrido({
  id,
  pasos,
  onCerrar,
}: {
  id: RecorridoId;
  pasos: PasoRecorrido[];
  onCerrar: () => void;
}) {
  const [montado, setMontado] = useState(false);
  const [visibles, setVisibles] = useState<PasoRecorrido[]>([]);
  const [indice, setIndice] = useState(0);
  const [caja, setCaja] = useState<Caja | null>(null);
  const cajaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMontado(true);
    const conAncla = pasos.filter((p) => document.querySelector(p.sel));
    setVisibles(conAncla);
    if (conAncla.length === 0) onCerrar();
  }, [pasos, onCerrar]);

  const cerrar = useCallback(() => {
    marcarRecorridoVisto(id);
    onCerrar();
  }, [id, onCerrar]);

  const paso = visibles[indice] ?? null;
  const ultimo = indice + 1 >= visibles.length;

  const siguiente = useCallback(() => {
    if (ultimo) cerrar();
    else setIndice((n) => n + 1);
  }, [ultimo, cerrar]);

  const anterior = useCallback(() => setIndice((n) => Math.max(0, n - 1)), []);

  useEffect(() => {
    if (!paso) return;
    const el = document.querySelector(paso.sel);
    if (!el) return;

    const medir = () => setCaja(recuadroDe(el));

    const r0 = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const grande = r0.height > vh * 0.62;
    const objetivo = Math.max(
      0,
      Math.round(
        grande
          ? window.scrollY + r0.top - 76
          : window.scrollY + r0.top + r0.height / 2 - vh / 2,
      ),
    );
    window.scrollTo({ top: objetivo, behavior: 'auto' });
    medir();

    let frame = 0;
    const programar = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          medir();
        });
    };
    const tick = setInterval(programar, 120);
    const parar = setTimeout(() => clearInterval(tick), 720);
    window.addEventListener('scroll', programar, true);
    window.addEventListener('resize', programar);

    return () => {
      clearInterval(tick);
      clearTimeout(parar);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', programar, true);
      window.removeEventListener('resize', programar);
    };
  }, [paso]);

  useEffect(() => {
    let raf = 0;
    const enfocar = () => {
      const b = cajaRef.current?.querySelector<HTMLElement>('[data-primario]');
      if (b) b.focus();
      else raf = requestAnimationFrame(enfocar);
    };
    raf = requestAnimationFrame(enfocar);
    return () => cancelAnimationFrame(raf);
  }, [indice]);

  useEffect(() => {
    const alTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cerrar();
      } else if (e.key === 'ArrowRight') {
        siguiente();
      } else if (e.key === 'ArrowLeft') {
        anterior();
      } else if (e.key === 'Tab') {
        const focos = cajaRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focos || focos.length === 0) return;
        const primero = focos[0];
        const fin = focos[focos.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          fin.focus();
        } else if (!e.shiftKey && document.activeElement === fin) {
          e.preventDefault();
          primero.focus();
        }
      }
    };
    window.addEventListener('keydown', alTecla);
    return () => window.removeEventListener('keydown', alTecla);
  }, [cerrar, siguiente, anterior]);

  if (!montado || !paso || !caja) return null;

  const hueco: Caja = {
    top: caja.top - MARGEN,
    left: caja.left - MARGEN,
    width: caja.width + MARGEN * 2,
    height: caja.height + MARGEN * 2,
  };

  const vh = window.innerHeight;
  const grande = caja.height > vh * 0.62;
  const cajaAbajo = grande ? true : caja.top + caja.height / 2 < vh * 0.55;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recorrido guiado"
      className="fixed inset-0 z-50"
    >
      <div
        className="pointer-events-auto fixed inset-0 bg-fondo/80"
        style={{ clipPath: recorte(hueco) }}
      />

      <div
        aria-hidden
        className="pointer-events-auto fixed border-2 border-tinta"
        style={{ top: hueco.top, left: hueco.left, width: hueco.width, height: hueco.height }}
      />

      <div
        ref={cajaRef}
        className="entrar-nota pointer-events-auto fixed right-3 left-3 mx-auto max-w-[22rem] border-t-4 border-tinta bg-fondo-2 p-4"
        style={
          cajaAbajo
            ? { bottom: 'calc(1rem + var(--sae-bottom))' }
            : { top: 'calc(1rem + var(--sae-top))' }
        }
      >
        <p className="font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase tabular-nums">
          Paso {indice + 1} de {visibles.length}
        </p>
        <p
          className="mt-2 font-titular text-[18px] leading-tight font-black text-tinta uppercase"
          style={{ fontStretch: '75%' }}
        >
          {paso.titulo}
        </p>
        <p className="mt-1.5 font-cuerpo text-[14px] leading-snug text-tinta-2">{paso.cuerpo}</p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={cerrar}
            className="min-h-11 font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase underline underline-offset-4 transition-colors hover:text-tinta"
          >
            Saltear
          </button>
          <div className="ml-auto flex gap-2">
            {indice > 0 && (
              <button
                type="button"
                onClick={anterior}
                className="min-h-11 border border-corondel px-3 font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase transition-colors hover:border-tinta hover:text-tinta"
              >
                Anterior
              </button>
            )}
            <button
              type="button"
              data-primario
              onClick={siguiente}
              className="min-h-11 bg-tinta px-4 font-titular text-[12px] font-black tracking-[0.1em] text-fondo uppercase transition-colors active:bg-tinta-2"
            >
              {ultimo ? 'Listo' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function recuadroDe(el: Element): Caja {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}
