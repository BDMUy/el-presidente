'use client';

/**
 * El campo para elegir club, con los colores de cada uno.
 *
 * Está hecho a mano y no con un `<select>`, que era lo que había. La razón es
 * concreta: la banda bicolor no se puede expresar en un `<option>`. No es solo
 * que el color de fondo se vea mal —es que son dos colores, y un `option`
 * tiene uno—; encima, en el celular la lista abierta la dibuja el sistema
 * operativo, así que cualquier estilo se pierde justo donde más importa.
 *
 * Lo que se pierde al dejar el select nativo se repone a mano:
 *
 *   - La lista tiene alto máximo y scroll propio. Sin eso volveríamos a la
 *     grilla de 64 celdas que estiraba la página, que es de lo que veníamos.
 *   - Teclado completo: flechas, inicio y fin, enter, escape.
 *   - Escribir salta al club, como en un select. Era la única razón por la que
 *     se había podido sacar el buscador, así que tenía que quedarse.
 */

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { expectedPosition } from '@/lib/engine/season';
import { CATEGORY_RULES, type Club } from '@/lib/engine/types';

/** Cuánto dura la memoria de lo que se viene tecleando, en milisegundos. */
const MEMORIA_TECLEO = 700;

/** Alto mínimo que hace que valga la pena abrir para un lado: tres opciones. */
const ALTO_MINIMO = 160;

/** Aire entre la lista y el borde de la pantalla. */
const MARGEN = 12;

interface Sitio {
  haciaArriba: boolean;
  alto: number;
}

/**
 * Para qué lado abrir la lista y con cuánto alto.
 *
 * Sin esto la lista abría siempre hacia abajo, y como el padrón cae a media
 * página, en un celular de 812px la lista arrancaba en y=758: se abría casi
 * entera debajo del pliegue y no se veía nada. Se mide el hueco real de cada
 * lado y se abre para donde entre.
 */
function calcularSitio(elemento: HTMLElement | null): Sitio {
  if (!elemento) return { haciaArriba: false, alto: 352 };

  const caja = elemento.getBoundingClientRect();
  const abajo = window.innerHeight - caja.bottom - MARGEN;
  const arriba = caja.top - MARGEN;

  // Se prefiere abajo, que es lo esperable, salvo que no entre y arriba haya
  // francamente más lugar.
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
    // Se abre parado sobre el elegido, no sobre el primero: si ya elegiste
    // Platense, reabrir la lista arriba de todo te hace buscarlo de nuevo.
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

  // Cerrar al tocar afuera. `pointerdown` y no `click`: en un celular el click
  // llega después del scroll y la lista se quedaba abierta al arrastrar.
  useEffect(() => {
    if (!abierto) return;
    const afuera = (e: PointerEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) cerrar();
    };
    document.addEventListener('pointerdown', afuera);
    return () => document.removeEventListener('pointerdown', afuera);
  }, [abierto, cerrar]);

  // Mantener a la vista la opción activa mientras se navega con el teclado.
  useEffect(() => {
    if (!abierto) return;
    lista.current?.children[activo]?.scrollIntoView({ block: 'nearest' });
  }, [abierto, activo]);

  /** Salta al primer club que empieza con lo que se viene tecleando. */
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
    // Una letra sola: type-ahead. Con modificadores no, que serían atajos.
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
        className="block font-acta text-[11px] font-bold tracking-[0.1em] text-papel-2 uppercase"
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
          className="flex min-h-11 w-full items-center gap-2.5 border border-linea bg-pano-alto py-2 pr-3 pl-3 text-left transition-colors focus:border-bronce-claro focus:outline-none"
        >
          {elegido ? (
            <>
              <Banda club={elegido} />
              <span className="min-w-0 flex-1 truncate font-display text-[15px] font-bold text-papel">
                {elegido.name}
              </span>
            </>
          ) : (
            <span className="min-w-0 flex-1 truncate font-display text-[15px] font-bold text-papel-2">
              Elegí tu club…
            </span>
          )}
          <span aria-hidden className="shrink-0 font-display text-[10px] text-bronce-claro">
            ▼
          </span>
        </button>

        {abierto && (
          // Absoluta: la lista flota sobre la página en vez de estirarla. Es
          // lo que permite tener los clubes a mano sin volver a las cinco
          // pantallas de scroll del padrón viejo.
          <ul
            ref={lista}
            id={`${id}-lista`}
            role="listbox"
            aria-labelledby={`${id}-etiqueta`}
            style={{ maxHeight: sitio.alto }}
            className={`absolute inset-x-0 z-40 overflow-y-auto overscroll-contain border border-bronce-claro bg-pano-alto shadow-2xl ${
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
                  // Con `click` y no con `pointerdown`. Elegir al apoyar el
                  // dedo hacía que cualquier toque seleccionara, y el
                  // `preventDefault()` que lo acompañaba cancelaba el scroll
                  // táctil del navegador: la lista no se podía recorrer con el
                  // pulgar. Se había puesto así creyendo que el listener de
                  // "tocar afuera" —que sí corre en pointerdown— se comía la
                  // elección, pero las opciones están adentro del contenedor,
                  // así que ese listener nunca las mira.
                  onClick={() => confirmar(i)}
                  // Seguir el puntero solo con mouse. En una pantalla táctil,
                  // pointerenter dispara al apoyar el dedo y el resaltado
                  // saltaba de opción mientras se arrastraba para scrollear.
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setActivo(i);
                  }}
                  className={`flex min-h-11 cursor-pointer items-center gap-2.5 px-3 py-2 ${
                    i === activo ? 'bg-papel/12' : ''
                  } ${esElegido ? 'border-l-2 border-bronce-claro' : 'border-l-2 border-transparent'}`}
                >
                  <Banda club={c} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[15px] leading-tight font-bold text-papel">
                      {c.name}
                    </span>
                    {c.nickname && (
                      <span className="block truncate font-body text-[12px] text-papel-2">
                        {c.nickname}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-acta text-[11px] text-papel-2 tabular-nums">
                    {expectedPosition(c, c.category)}° de {CATEGORY_RULES[c.category].teams}
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

/** La banda con los colores del club: lo único suyo que no es su nombre. */
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

/** Quita acentos y mayúsculas: teclear "velez" tiene que llevar a "Vélez". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}
