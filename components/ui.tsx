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

export function Titulo({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[26px] leading-[1] font-black tracking-tight text-tinta uppercase sm:text-[32px]">
      {children}
    </h1>
  );
}

export function Renglon({
  label,
  hint,
  azaroso = false,
  seleccionado = false,
  onClick,
  disabled = false,
}: {
  label: string;
  hint: string;
  azaroso?: boolean;
  seleccionado?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={seleccionado}
      className={`w-full border px-3 py-3 text-left transition-colors disabled:opacity-40 ${
        seleccionado
          ? 'border-tinta bg-tinta/10'
          : 'border-hoja-linea hover:border-tinta hover:bg-tinta/6 active:bg-tinta/12'
      }`}
    >
      <span className="flex items-baseline gap-2 font-display text-[16px] leading-tight font-bold text-tinta">
        <span className="min-w-0">{label}</span>
        {azaroso && (
          <span className="ml-auto shrink-0 border border-sello px-1.5 py-0.5 font-acta text-[10px] font-bold tracking-wider text-sello uppercase">
            al azar
          </span>
        )}
      </span>
      <span className="mt-1 block font-body text-[14px] leading-snug text-tinta-2">{hint}</span>
    </button>
  );
}

export function BarraDecision({
  resumen,
  detalle,
  accion,
  onConfirmar,
  habilitada = true,
}: {
  resumen: string;
  detalle?: string;
  accion: string;
  onConfirmar: () => void;
  habilitada?: boolean;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-5 border-t border-pano-borde bg-pano-alto/97 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-display text-[15px] leading-tight font-bold text-papel">
            {resumen}
          </p>
          {detalle && (
            <p className="mt-0.5 truncate font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
              {detalle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onConfirmar}
          disabled={!habilitada}
          className={`shrink-0 px-5 py-3.5 font-display text-[13px] font-black tracking-[0.1em] uppercase transition-transform active:scale-[0.98] ${
            habilitada
              ? 'bg-papel text-tinta'
              : 'cursor-not-allowed border border-linea text-papel-2'
          }`}
        >
          {accion}
        </button>
      </div>
    </div>
  );
}

export function Puntos() {
  return (
    <span
      className="mx-2 min-w-4 flex-1 self-center border-b border-dotted border-hoja-linea"
      aria-hidden
    />
  );
}

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

export function Cifra({
  label,
  valor,
  alerta = false,
  abierta = false,
  onToggle,
}: {
  label: string;
  valor: string;
  alerta?: boolean;
  abierta?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={abierta}
      className={`min-w-0 rounded-sm border-b-2 px-1 pt-0.5 pb-1 text-left transition-colors ${
        abierta ? 'border-bronce-claro bg-papel/12' : 'border-transparent hover:bg-papel/6'
      }`}
    >
      <span className="block truncate font-acta text-[11px] leading-none font-bold text-papel-2 uppercase">
        {label}
      </span>
      <span
        className={`mt-1.5 block truncate font-display text-[17px] leading-none font-black tabular-nums ${
          alerta ? 'text-sello-claro' : 'text-papel'
        }`}
      >
        {valor}
      </span>
    </button>
  );
}
