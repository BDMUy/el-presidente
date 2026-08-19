'use client';

/**
 * La galería: todas las cartas del juego, una abajo de la otra.
 *
 * Existe por lo mismo que existe `scripts/cobertura.ts`, pero para el ojo en
 * vez de para los números. El catálogo tiene ciento treinta y una cartas y una
 * presidencia larga muestra noventa y seis: encontrar una carta puntual jugando
 * es cuestión de suerte, así que hasta ahora había prosa escrita, medida y
 * comiteada que nunca había pasado por una pantalla. Cincuenta y dos de golpe,
 * la última vez.
 *
 * Renderiza con `FaseEvento`, el componente de verdad, y no con una copia: una
 * galería que dibuja las cartas a su manera miente justo en lo que se quiere
 * mirar. Por eso también reproduce el contenedor del juego —`max-w-xl px-4`
 * sobre el paño— y por eso muestra TODAS las opciones de cada carta, incluso
 * las que en partida están detrás de una condición.
 *
 * Lo único que no es del juego es el encabezado gris de cada carta, que dice
 * el id y las condiciones. Eso es para quien escribe, no para quien juega.
 */

import { useMemo, useState } from 'react';

import { ASCENSO } from '@/content/events/ascenso';
import { COLOR } from '@/content/events/color';
import { COPAS } from '@/content/events/copas';
import { CORRUPCION } from '@/content/events/corrupcion';
import { CRISIS } from '@/content/events/crisis';
import { DIRIGENCIA } from '@/content/events/dirigencia';
import { ECONOMIA } from '@/content/events/economia';
import { FEMENINO } from '@/content/events/femenino';
import { HINCHADA } from '@/content/events/hinchada';
import { INFERIORES } from '@/content/events/inferiores';
import { LEGADO } from '@/content/events/legado';
import { VESTUARIO } from '@/content/events/vestuario';
import type { Condition, GameEvent } from '@/lib/engine/types';
import { FaseEvento } from './fase-evento';

interface Frente {
  archivo: string;
  cartas: GameEvent[];
}

/**
 * Se listan uno por uno, y no desde `ALL_EVENTS`, porque el frente al que
 * pertenece una carta es justo lo que hay que poder ver de un vistazo: es lo
 * que dice si el catálogo está parejo o si hay un frente que quedó flaco.
 */
const FRENTES: Frente[] = [
  { archivo: 'vestuario', cartas: VESTUARIO },
  { archivo: 'hinchada', cartas: HINCHADA },
  { archivo: 'dirigencia', cartas: DIRIGENCIA },
  { archivo: 'color', cartas: COLOR },
  { archivo: 'economia', cartas: ECONOMIA },
  { archivo: 'inferiores', cartas: INFERIORES },
  { archivo: 'femenino', cartas: FEMENINO },
  { archivo: 'corrupcion', cartas: CORRUPCION },
  { archivo: 'ascenso', cartas: ASCENSO },
  { archivo: 'copas', cartas: COPAS },
  { archivo: 'crisis', cartas: CRISIS },
  { archivo: 'legado', cartas: LEGADO },
];

export function GaleriaCartas() {
  const [frente, setFrente] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [verConsecuencias, setVerConsecuencias] = useState(true);

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return FRENTES.filter((f) => frente === 'todos' || f.archivo === frente)
      .map((f) => ({
        ...f,
        cartas: texto
          ? f.cartas.filter((c) =>
              `${c.id} ${c.title} ${c.text} ${c.options.map((o) => `${o.label} ${o.hint}`).join(' ')}`
                .toLowerCase()
                .includes(texto),
            )
          : f.cartas,
      }))
      .filter((f) => f.cartas.length > 0);
  }, [frente, busqueda]);

  const total = visibles.reduce((n, f) => n + f.cartas.length, 0);

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-20 border-b border-pano-borde bg-pano-alto/97 backdrop-blur">
        <div className="mx-auto w-full max-w-xl px-4 py-3">
          <p className="font-acta text-[11px] tracking-[0.14em] text-papel-2 uppercase">
            Galería de actas · {total} {total === 1 ? 'carta' : 'cartas'}
          </p>

          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en el texto de las cartas"
            className="mt-2 min-h-11 w-full border border-linea bg-pano px-3 font-body text-[15px] text-papel placeholder:text-papel-2"
          />

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip activo={frente === 'todos'} onClick={() => setFrente('todos')}>
              todos
            </Chip>
            {FRENTES.map((f) => (
              <Chip key={f.archivo} activo={frente === f.archivo} onClick={() => setFrente(f.archivo)}>
                {f.archivo}
              </Chip>
            ))}
          </div>

          <label className="mt-2 flex min-h-11 items-center gap-2 font-acta text-[11px] tracking-[0.1em] text-papel-2 uppercase">
            <input
              type="checkbox"
              checked={verConsecuencias}
              onChange={(e) => setVerConsecuencias(e.target.checked)}
              className="size-4 accent-papel"
            />
            Ver las consecuencias
          </label>
        </div>
      </div>

      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        {visibles.map((f) => (
          <section key={f.archivo}>
            <h2 className="mt-8 mb-3 font-display text-[13px] font-black tracking-[0.14em] text-papel uppercase first:mt-0">
              {f.archivo} · {f.cartas.length}
            </h2>

            {f.cartas.map((carta) => (
              <Ficha key={carta.id} carta={carta} verConsecuencias={verConsecuencias} />
            ))}
          </section>
        ))}

        {total === 0 && (
          <p className="font-body text-[15px] text-papel-2">
            Ninguna carta dice eso.
          </p>
        )}
      </div>
    </main>
  );
}

/**
 * Una carta con su encabezado de taller.
 *
 * El `section` no es decorativo: la barra de decisión de `FaseEvento` es
 * `sticky bottom-0`, y sin un contenedor propio por carta todas competirían por
 * el mismo borde inferior de la ventana. Adentro de su sección, cada barra se
 * pega mientras su carta está a la vista y se va con ella, que es como se ve en
 * el juego.
 */
function Ficha({ carta, verConsecuencias }: { carta: GameEvent; verConsecuencias: boolean }) {
  // En partida el motor filtra las opciones que no cumplen su condición. Acá se
  // muestran todas: una opción que solo aparece con mucha influencia también
  // hay que poder leerla.
  const todas = carta.options.map((_, i) => i);

  return (
    <section className="mb-10">
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-acta text-[10px] tracking-[0.08em] text-papel-2 uppercase">
        <span className="text-papel">{carta.id}</span>
        {carta.once && <span>· única</span>}
        {carta.weight !== undefined && <span>· peso {carta.weight}</span>}
        {carta.requires && <span>· {describirCondicion(carta.requires)}</span>}
      </div>

      <FaseEvento
        event={carta}
        available={todas}
        enLaTemporada={1}
        porTemporada={4}
        onElegir={() => {}}
      />

      {verConsecuencias && <Consecuencias carta={carta} />}
    </section>
  );
}

/**
 * Lo que se lee después de firmar.
 *
 * Vale la pena mirarlo junto a la carta porque el texto de resultado de una
 * opción común **es su propia pista**: el motor usa `option.hint` cuando no hay
 * sorteo. O sea que esa línea se lee dos veces —como promesa y como
 * consecuencia— y tiene que funcionar en los dos tiempos. Las opciones de dado
 * sí traen texto propio, uno por desenlace, y son los que nunca ve nadie.
 */
function Consecuencias({ carta }: { carta: GameEvent }) {
  return (
    <div className="mt-3 border-l-2 border-pano-borde pl-3">
      {carta.options.map((option, i) => (
        <div key={i} className="mt-2 first:mt-0">
          <p className="font-acta text-[10px] tracking-[0.08em] text-papel-2 uppercase">
            {option.label}
            {option.requires && ` · ${describirCondicion(option.requires)}`}
          </p>

          {option.random ? (
            <ul>
              {option.random.map((salida, j) => (
                <li key={j} className="mt-1 font-body text-[14px] leading-snug text-papel">
                  {/* El peso es relativo, no un porcentaje: hay cartas que
                      reparten 40/60 y otras 3/1. Se muestra ya convertido
                      porque lo que se quiere saber al leerlo es cuán probable
                      es este desenlace. */}
                  <span className="font-acta text-[11px] text-papel-2">
                    {Math.round((salida.weight / pesoTotal(option.random!)) * 100)}%{' '}
                  </span>
                  {salida.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 font-body text-[14px] leading-snug text-papel">{option.hint}</p>
          )}

          {(option.effects?.deferred ?? []).map((d, j) => (
            <p key={j} className="mt-1 font-body text-[14px] leading-snug text-bronce">
              en {d.inSeasons} {d.inSeasons === 1 ? 'temporada' : 'temporadas'}: {d.text}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

function pesoTotal(salidas: { weight: number }[]): number {
  return salidas.reduce((n, s) => n + s.weight, 0) || 1;
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1.5 font-acta text-[10px] tracking-[0.08em] uppercase ${
        activo ? 'bg-papel text-tinta' : 'border border-linea text-papel-2'
      }`}
    >
      {children}
    </button>
  );
}

/** Las condiciones en una línea, para leerlas al lado de la carta. */
function describirCondicion(c: Condition): string {
  const partes: string[] = [];
  if (c.minSeason) partes.push(`desde la ${c.minSeason}`);
  if (c.maxSeason) partes.push(`hasta la ${c.maxSeason}`);
  if (c.category) partes.push(c.category.join('/'));
  if (c.minCaja !== undefined) partes.push(`caja ≥ ${c.minCaja}`);
  if (c.maxCaja !== undefined) partes.push(`caja ≤ ${c.maxCaja}`);
  if (c.minHinchada !== undefined) partes.push(`hinchada ≥ ${c.minHinchada}`);
  if (c.maxHinchada !== undefined) partes.push(`hinchada ≤ ${c.maxHinchada}`);
  if (c.minInfluencia !== undefined) partes.push(`influencia ≥ ${c.minInfluencia}`);
  if (c.maxInfluencia !== undefined) partes.push(`influencia ≤ ${c.maxInfluencia}`);
  if (c.minPlantel !== undefined) partes.push(`plantel ≥ ${c.minPlantel}`);
  if (c.maxPlantel !== undefined) partes.push(`plantel ≤ ${c.maxPlantel}`);
  if (c.minSize !== undefined) partes.push(`club ≥ ${c.minSize}`);
  if (c.maxSize !== undefined) partes.push(`club ≤ ${c.maxSize}`);
  if (c.flag) partes.push(c.flag);
  if (c.notFlag) partes.push(`sin ${c.notFlag}`);
  for (const [nombre, minimo] of Object.entries(c.minFlag ?? {})) {
    partes.push(`${nombre} ≥ ${minimo}`);
  }
  return partes.join(', ');
}
