/**
 * Primitivas visuales compartidas.
 *
 * Todo en el juego es un objeto sobre la mesa: una hoja, un sello, una ficha.
 * Estos componentes son esos objetos; las pantallas solo los acomodan.
 *
 * Escala tipográfica: la prosa de las cartas va a 16px porque el juego se lee
 * en un celular y por debajo de eso se abandona. Las mayúsculas se reservan
 * para sellos y membretes, que son etiquetas cortas; las opciones van en caja
 * baja porque son frases y en mayúsculas se leen mucho más lento.
 */

import type { ReactNode } from 'react';

export function Papel({
  children,
  torcido = 1,
  className = '',
}: {
  children: ReactNode;
  torcido?: 0 | 1 | 2;
  className?: string;
}) {
  const angulo = torcido === 0 ? '' : torcido === 1 ? 'papel-torcido-1' : 'papel-torcido-2';
  return (
    <div className={`papel deslizar ${angulo} ${className}`}>
      <div className="p-5 sm:p-7">{children}</div>
    </div>
  );
}

/**
 * El sello de goma. `sobrePano` cambia al tono claro: el rojo que da 5:1 sobre
 * papel da 1,6:1 sobre el paño verde, así que el mismo color no sirve.
 */
export function Sello({
  children,
  tono = 'rojo',
  animado = false,
  sobrePano = false,
  className = '',
}: {
  children: ReactNode;
  tono?: 'rojo' | 'verde' | 'bronce';
  animado?: boolean;
  sobrePano?: boolean;
  className?: string;
}) {
  const tonoClase = tono === 'verde' ? 'sello-verde' : tono === 'bronce' ? 'sello-bronce' : '';
  return (
    <span
      className={`sello inline-block text-[11px] uppercase ${tonoClase} ${
        sobrePano ? 'sello-sobre-pano' : ''
      } ${animado ? 'sello-anim' : ''} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Metadatos del documento: número de acta, temporada, fecha.
 *
 * `sobrePano` no es un detalle estético: la tinta del papel sobre el paño
 * verde da 1,5:1 y desaparece. Todo elemento que puede vivir en las dos
 * superficies tiene que saber en cuál está.
 */
export function Membrete({
  children,
  sobrePano = false,
}: {
  children: ReactNode;
  sobrePano?: boolean;
}) {
  return (
    <p
      className={`font-acta text-[12px] font-bold tracking-[0.1em] uppercase ${
        sobrePano ? 'text-papel-2' : 'text-tinta-2'
      }`}
    >
      {children}
    </p>
  );
}

/** Título del documento. */
export function Titulo({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[26px] leading-[1] font-black tracking-tight text-tinta uppercase sm:text-[32px]">
      {children}
    </h1>
  );
}

/**
 * Una opción firmable: la etiqueta y, debajo, la consecuencia.
 * Se lee como un renglón de formulario, no como un botón de app.
 */
export function Renglon({
  label,
  hint,
  azaroso = false,
  onClick,
  disabled = false,
}: {
  label: string;
  hint: string;
  azaroso?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group w-full border-t border-hoja-linea py-3.5 text-left transition-colors last:border-b hover:bg-tinta/6 active:bg-tinta/12 disabled:opacity-40"
    >
      {/* Sin renglón punteado: la línea de puntos promete un valor a la
          derecha, y acá la consecuencia va abajo. Se reserva para el balance,
          donde sí hay etiqueta a un lado y cifra al otro. */}
      <span className="flex items-baseline gap-2 font-display text-[16px] leading-tight font-bold text-tinta">
        <span className="min-w-0">{label}</span>
        {azaroso && (
          <span className="ml-auto shrink-0 font-acta text-[11px] font-bold tracking-wider text-sello uppercase">
            al azar
          </span>
        )}
      </span>
      <span className="mt-1 block font-body text-[14px] leading-snug text-tinta-2">{hint}</span>
    </button>
  );
}

/**
 * El puente punteado entre una etiqueta y su cifra, como en un formulario.
 *
 * Va como elemento propio y no como `::after`: un pseudo-elemento se agrega
 * al final del flex, así que los puntos terminaban a la derecha del valor en
 * vez de entre los dos.
 */
export function Puntos() {
  return (
    <span
      className="mx-2 min-w-4 flex-1 self-center border-b border-dotted border-hoja-linea"
      aria-hidden
    />
  );
}

/** El botón que cierra una pantalla y pasa a la siguiente. */
export function Continuar({
  children = 'Continuar',
  onClick,
}: {
  children?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 w-full bg-tinta py-4 font-display text-[14px] font-black tracking-[0.12em] text-hoja uppercase transition-transform active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

/**
 * Cifra con su etiqueta, como una línea de balance.
 *
 * Es un botón: tocarla despliega qué significa el recurso. En un juego que se
 * juega en el celular, un tooltip de hover no existiría para la mayoría.
 */
export function Cifra({
  label,
  valor,
  delta,
  alerta = false,
  abierta = false,
  onToggle,
}: {
  label: string;
  valor: string;
  delta?: number;
  alerta?: boolean;
  abierta?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={abierta}
      // El borde inferior en bronce ata visualmente la celda con el panel que
      // se abre debajo: sin eso, la explicación parece venir de la nada.
      className={`min-w-0 rounded-sm border-b-2 px-1 pt-0.5 pb-1 text-left transition-colors ${
        abierta ? 'border-bronce-claro bg-papel/12' : 'border-transparent hover:bg-papel/6'
      }`}
    >
      {/* Sin letter-spacing: Courier ya es monoespaciada y separa de sobra. El
          espaciado extra empujaba "INFLUENCIA" fuera de su columna. */}
      <span className="block truncate font-acta text-[11px] leading-none font-bold text-papel-2 uppercase">
        {label}
      </span>
      <span
        className={`mt-1.5 flex items-baseline gap-0.5 font-display text-[17px] leading-none font-black tabular-nums ${
          alerta ? 'text-sello-claro' : 'text-papel'
        }`}
      >
        {/* La flecha no se encoge: si algo tiene que ceder es el número, y por
            eso el número nunca puede quedar sin lugar. */}
        <span className="min-w-0 truncate">{valor}</span>
        {delta !== undefined && delta !== 0 && (
          <span
            className={`shrink-0 font-acta text-[10px] font-bold ${
              delta > 0 ? 'text-emerald-300' : 'text-sello-claro'
            }`}
            aria-label={delta > 0 ? 'subió' : 'bajó'}
          >
            {delta > 0 ? '▲' : '▼'}
          </span>
        )}
      </span>
    </button>
  );
}
