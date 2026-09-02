'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { expectedPosition } from '@/lib/engine/season';
import { LEAGUES, type Club } from '@/lib/engine/types';

const MEMORIA_TECLEO = 700;

const ALTO_MINIMO = 160;

const MARGEN = 12;

interface Sitio {
  haciaArriba: boolean;
  alto: number;
}

function calcularSitio(elemento: HTMLElement | null): Sitio {
  if (!elemento) return { haciaArriba: false, alto: 352 };

  const caja = elemento.getBoundingClientRect();
  const abajo = window.innerHeight - caja.bottom - MARGEN;
  const arriba = caja.top - MARGEN;

  const haciaArriba = abajo < ALTO_MINIMO && arriba > abajo;
  const disponible = haciaArriba ? arriba : abajo;

  return { haciaArriba, alto: Math.max(ALTO_MINIMO, Math.min(352, disponible)) };
}

export function SelectorClub({
  clubes,
  elegido,
  onElegir,
}: {
  clubes: Club[];
  elegido: Club | null;
  onElegir: (clubId: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const [sitio, setSitio] = useState<Sitio>({ haciaArriba: false, alto: 352 });
  const id = useId();

  const contenedor = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const tecleado = useRef({ texto: '', cuando: 0 });

  const indiceElegido = useMemo(
    () => (elegido ? clubes.findIndex((c) => c.id === elegido.id) : -1),
    [clubes, elegido],
  );

  const abrir = useCallback(() => {
    setActivo(indiceElegido >= 0 ? indiceElegido : 0);
    setSitio(calcularSitio(contenedor.current));
    setAbierto(true);
  }, [indiceElegido]);

  const cerrar = useCallback(() => setAbierto(false), []);

  const confirmar = useCallback(
    (indice: number) => {
      const club = clubes[indice];
      if (club) onElegir(club.id);
      cerrar();
    },
    [clubes, onElegir, cerrar],
  );

  useEffect(() => {
    if (!abierto) return;
    const afuera = (e: PointerEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) cerrar();
    };
    const reubicar = () => setSitio(calcularSitio(contenedor.current));
    document.addEventListener('pointerdown', afuera);
    window.addEventListener('resize', reubicar);
    window.addEventListener('scroll', reubicar, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', afuera);
      window.removeEventListener('resize', reubicar);
      window.removeEventListener('scroll', reubicar);
    };
  }, [abierto, cerrar]);

  useEffect(() => {
    if (!abierto) return;
    lista.current?.children[activo]?.scrollIntoView({ block: 'nearest' });
  }, [abierto, activo]);

  const saltarA = useCallback(
    (letra: string) => {
      const ahora = Date.now();
      const memoria = tecleado.current;
      memoria.texto = ahora - memoria.cuando > MEMORIA_TECLEO ? letra : memoria.texto + letra;
      memoria.cuando = ahora;

      const buscado = normalizar(memoria.texto);
      const encontrado = clubes.findIndex((c) => normalizar(c.name).startsWith(buscado));
      if (encontrado >= 0) {
        setActivo(encontrado);
        if (!abierto) onElegir(clubes[encontrado].id);
      }
    },
    [clubes, abierto, onElegir],
  );

  const enTecla = (e: React.KeyboardEvent) => {
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && /\S/.test(e.key)) {
      e.preventDefault();
      if (!abierto) abrir();
      saltarA(e.key);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (!abierto) {
          abrir();
          return;
        }
        const paso = e.key === 'ArrowDown' ? 1 : -1;
        setActivo((i) => Math.min(clubes.length - 1, Math.max(0, i + paso)));
        return;
      }
      case 'Home':
        if (abierto) {
          e.preventDefault();
          setActivo(0);
        }
        return;
      case 'End':
        if (abierto) {
          e.preventDefault();
          setActivo(clubes.length - 1);
        }
        return;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (abierto) confirmar(activo);
        else abrir();
        return;
      case 'Escape':
        if (abierto) {
          e.preventDefault();
          cerrar();
        }
        return;
      case 'Tab':
        cerrar();
    }
  };

  return (
    <div className="min-w-0" ref={contenedor}>
      <span
        id={`${id}-etiqueta`}
        className="block font-tabla text-[11px] font-bold tracking-[0.1em] text-tinta-2 uppercase"
      >
        Club
      </span>

      <div className="relative mt-1.5">
        <button
          type="button"
          onClick={() => (abierto ? cerrar() : abrir())}
          onKeyDown={enTecla}
          role="combobox"
          aria-expanded={abierto}
          aria-controls={`${id}-lista`}
          aria-labelledby={`${id}-etiqueta`}
          aria-activedescendant={abierto ? `${id}-op-${activo}` : undefined}
          className="flex min-h-11 w-full items-center gap-2.5 border border-corondel bg-fondo-2 py-2 pr-3 pl-3 text-left transition-colors focus:border-tinta focus:outline-none"
        >
          {elegido ? (
            <>
              <Banda club={elegido} />
              <span className="min-w-0 flex-1 truncate font-titular text-[15px] font-bold text-tinta">
                {elegido.name}
              </span>
            </>
          ) : (
            <span className="min-w-0 flex-1 truncate font-titular text-[15px] font-bold text-tinta-2">
              Elegí tu club…
            </span>
          )}
          <span aria-hidden className="shrink-0 font-titular text-[10px] text-tinta-2">
            ▼
          </span>
        </button>

        {abierto && (
          <ul
            ref={lista}
            id={`${id}-lista`}
            role="listbox"
            aria-labelledby={`${id}-etiqueta`}
            style={{ maxHeight: sitio.alto }}
            className={`absolute inset-x-0 z-40 overflow-y-auto overscroll-contain border-2 border-tinta bg-fondo-2 ${
              sitio.haciaArriba ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
          >
            {clubes.map((c, i) => {
              const esElegido = c.id === elegido?.id;
              return (
                <li
                  key={c.id}
                  id={`${id}-op-${i}`}
                  role="option"
                  aria-selected={esElegido}
                  onClick={() => confirmar(i)}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setActivo(i);
                  }}
                  className={`flex min-h-11 cursor-pointer items-center gap-2.5 px-3 py-2 ${
                    i === activo ? 'bg-tinta/12' : ''
                  } ${esElegido ? 'border-l-2 border-tinta' : 'border-l-2 border-transparent'}`}
                >
                  <Banda club={c} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-titular text-[15px] leading-tight font-bold text-tinta">
                      {c.name}
                    </span>
                    {c.nickname && (
                      <span className="block truncate font-cuerpo text-[12px] text-tinta-2">
                        {c.nickname}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-tabla text-[11px] text-tinta-2 tabular-nums">
                    {expectedPosition(c, c.league)}° de {LEAGUES[c.league].teams}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Banda({ club }: { club: Club }) {
  return (
    <span
      className="flex h-7 w-1.5 shrink-0 flex-col overflow-hidden rounded-full"
      aria-hidden
    >
      <span className="flex-1" style={{ backgroundColor: club.colors[0] }} />
      <span className="flex-1" style={{ backgroundColor: club.colors[1] }} />
    </span>
  );
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}
