import type { ReactNode } from 'react';

export function Recuadro({
  children,
  acento = 'tinta',
  denso = false,
  className = '',
}: {
  children: ReactNode;
  acento?: 'tinta' | 'club';
  denso?: boolean;
  className?: string;
}) {
  return (
    <div
      data-acento={acento}
      className={`tarjeta entrar-nota ${denso ? 'p-3 sm:p-4' : 'p-4 sm:p-5'} ${className}`}
    >
      {children}
    </div>
  );
}

export function Ladillo({
  children,
  tono = 'tinta',
  animado = false,
  className = '',
}: {
  children: ReactNode;
  tono?: 'tinta' | 'alerta' | 'favorable' | 'club' | 'acento';
  animado?: boolean;
  className?: string;
}) {
  const paleta =
    tono === 'club'
      ? 'bg-[var(--club)] text-fondo'
      : tono === 'alerta'
        ? 'bg-alerta text-fondo'
        : tono === 'favorable'
          ? 'bg-favorable text-fondo'
          : tono === 'acento'
            ? 'bg-acento text-sobre-acento'
            : 'bg-tinta text-fondo';
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-tabla text-[0.75rem] tracking-[0.1em] uppercase ${paleta} ${
        animado ? 'entrar-nota' : ''
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function Volanta({
  children,
  as: Tag = 'p',
}: {
  children: ReactNode;
  as?: 'p' | 'h2' | 'h3';
}) {
  return (
    <Tag className="border-b border-corondel pb-1 font-titular text-[0.75rem] tracking-[0.14em] text-tinta-2 uppercase">
      {children}
    </Tag>
  );
}

export function Titular({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-titular text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.92] tracking-tight text-tinta uppercase">
      {children}
    </h1>
  );
}

export function Bajada({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`max-w-[46ch] font-cuerpo text-[1.1875rem] leading-snug text-tinta-2 italic ${className}`}>
      {children}
    </p>
  );
}

export function Cuerpo({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`max-w-[66ch] font-cuerpo text-[1.0625rem] leading-relaxed text-tinta ${className}`}>
      {children}
    </p>
  );
}

export function Renglon({
  label,
  hint,
  azaroso = false,
  seleccionado = false,
  foco = false,
  onClick,
  disabled = false,
  retraso = 0,
}: {
  label: string;
  hint: string;
  azaroso?: boolean;
  seleccionado?: boolean;
  foco?: boolean;
  onClick: () => void;
  disabled?: boolean;
  retraso?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter') evento.preventDefault();
      }}
      disabled={disabled}
      role="radio"
      aria-checked={seleccionado}
      tabIndex={foco ? 0 : -1}
      style={{ animationDelay: `${retraso}ms` }}
      className="fila-opcion entrar-nota flex min-h-11 w-full items-start gap-3 px-3 py-3 text-left transition-colors disabled:opacity-40"
    >
      <span className="marca-radio mt-0.5" aria-hidden>
        {seleccionado && <span className="h-2 w-2 rounded-full bg-sobre-acento" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2 font-titular text-[1rem] leading-tight text-tinta">
          <span className="min-w-0">{label}</span>
          {azaroso && (
            <span className="ml-auto shrink-0 rounded border border-tinta-2 px-1.5 py-0.5 font-tabla text-[0.75rem] font-bold tracking-wider text-tinta-2 uppercase">
              al azar
            </span>
          )}
        </span>
        {seleccionado && (
          <span className="mt-1 block font-cuerpo text-[0.875rem] leading-snug text-tinta-2">
            {hint}
          </span>
        )}
      </span>
    </button>
  );
}

export function BarraDecision({
  resumen,
  detalle,
  accion,
  cifra,
  nota,
  urgente = false,
  onConfirmar,
  habilitada = true,
  tono = 'firma',
  children,
}: {
  resumen: string;
  detalle?: string;
  accion: string;
  cifra?: string;
  nota?: string;
  urgente?: boolean;
  onConfirmar: () => void;
  habilitada?: boolean;
  tono?: 'firma' | 'neutra';
  children?: ReactNode;
}) {
  const estilo = !habilitada
    ? 'cursor-not-allowed rounded-[var(--radio-sm)] border border-corondel text-tinta-3'
    : tono === 'neutra'
      ? 'rounded-[var(--radio-sm)] border border-tinta text-tinta hover:bg-tinta/10'
      : 'boton-jugar';

  return (
    <div
      data-recorrido="decision"
      data-urgente={urgente || undefined}
      className="barra-decision sticky bottom-0 -mx-4 mt-6 px-4 pt-3"
      style={{ paddingBottom: 'calc(0.75rem + var(--sae-bottom))' }}
    >
      {children}
      <div className="barra-decision-fila flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-titular text-[0.9375rem] leading-tight text-tinta break-words">
            {resumen}
          </p>
          {detalle && (
            <p className="mt-0.5 font-tabla text-[0.75rem] tracking-[0.06em] text-tinta-2 uppercase">
              {detalle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onConfirmar}
          disabled={!habilitada}
          className={`min-h-11 shrink-0 px-5 py-3 font-titular text-[0.8125rem] tracking-[0.1em] uppercase transition-colors ${estilo}`}
        >
          <span className="block">{accion}</span>
          {cifra && (
            <span className="mt-0.5 block font-tabla text-[0.75rem] tracking-normal normal-case tabular-nums">
              {cifra}
            </span>
          )}
        </button>
      </div>

      {nota && (
        <p className="mt-2 font-tabla text-[0.75rem] leading-snug tracking-[0.04em] text-tinta-2 uppercase">
          {nota}
        </p>
      )}
    </div>
  );
}

export function Cupos({
  total,
  llenos,
  etiqueta,
}: {
  total: number;
  llenos: number;
  etiqueta: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex items-center gap-1" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-colors duration-200 ${
              i < llenos ? 'bg-acento' : 'border border-corondel'
            }`}
          />
        ))}
      </span>
      <span className="sr-only">{etiqueta}</span>
    </span>
  );
}

export function Puntos() {
  return (
    <span
      className="mx-2 min-w-4 flex-1 self-center border-b border-dotted border-corondel"
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
      data-continuar
      className="mt-6 w-full rounded-[var(--radio-sm)] bg-tinta py-4 font-titular text-[0.875rem] tracking-[0.12em] text-fondo uppercase shadow-[var(--sombra-sm)] transition-colors hover:bg-tinta-2 active:bg-tinta-2"
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
  retraso = 0,
  delta,
  deltaTono = 'favorable',
}: {
  label: string;
  valor: string;
  alerta?: boolean;
  abierta?: boolean;
  onToggle?: () => void;
  retraso?: number;
  delta?: string;
  deltaTono?: 'favorable' | 'alerta';
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={abierta}
      style={{ animationDelay: `${retraso}ms` }}
      className={`entrar-nota min-h-11 min-w-0 rounded-[var(--radio-sm)] border px-1.5 py-1.5 text-left transition-colors ${
        abierta ? 'border-acento bg-[color-mix(in_srgb,var(--acento)_14%,var(--fondo-3))]' : 'border-transparent bg-fondo-3 hover:border-corondel'
      }`}
    >
      <span className="block truncate font-tabla text-[0.6875rem] leading-[1.15] tracking-[0.01em] text-tinta-2 uppercase">
        {label}
      </span>
      <span
        className={`mt-1 flex flex-wrap items-baseline gap-x-1 font-titular text-[1.0625rem] leading-[1.1] tabular-nums ${
          alerta ? 'text-alerta' : 'text-tinta'
        }`}
      >
        <span className="whitespace-nowrap">{valor}</span>
        {delta && (
          <span
            key={delta}
            className={`entrar-nota text-[0.75rem] leading-none font-bold whitespace-nowrap tabular-nums ${
              deltaTono === 'alerta' ? 'text-alerta' : 'text-favorable'
            }`}
          >
            {delta}
          </span>
        )}
      </span>
    </button>
  );
}
