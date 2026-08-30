import type { ReactNode } from 'react';

import type { Impacto } from '@/lib/impacto';

export function Recuadro({
  children,
  acento = 'tinta',
  className = '',
}: {
  children: ReactNode;
  acento?: 'tinta' | 'club';
  className?: string;
}) {
  const borde = acento === 'club' ? 'border-[var(--club)]' : 'border-tinta';
  return (
    <div className={`entrar-nota border-t-4 bg-fondo-2 ${borde} ${className}`}>
      <div className="p-5 sm:p-7">{children}</div>
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
  tono?: 'tinta' | 'alerta' | 'favorable' | 'club';
  animado?: boolean;
  className?: string;
}) {
  const fondo =
    tono === 'club'
      ? 'bg-[var(--club)]'
      : tono === 'alerta'
        ? 'bg-alerta'
        : tono === 'favorable'
          ? 'bg-favorable'
          : 'bg-tinta';
  return (
    <span
      className={`inline-block px-2 py-0.5 font-tabla text-[11px] tracking-[0.1em] text-fondo uppercase ${fondo} ${
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
    <Tag
      className="border-b border-corondel pb-1 font-titular text-[12px] font-bold tracking-[0.14em] text-tinta-2 uppercase"
      style={{ fontStretch: '75%' }}
    >
      {children}
    </Tag>
  );
}

export function Titular({ children }: { children: ReactNode }) {
  return (
    <h1
      className="font-titular text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.92] font-extrabold tracking-tight text-tinta uppercase"
      style={{ fontStretch: '66%' }}
    >
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
    <p className={`max-w-[46ch] font-cuerpo text-[19px] leading-snug text-tinta-2 italic ${className}`}>
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
    <p className={`max-w-[66ch] font-cuerpo text-[17px] leading-relaxed text-tinta ${className}`}>
      {children}
    </p>
  );
}

function signoRepetido(token: Impacto): string {
  return token.signo === 'neutro' ? '' : token.signo.repeat(token.grado);
}

function TokenImpacto({ token, seleccionado }: { token: Impacto; seleccionado: boolean }) {
  const color = seleccionado
    ? 'text-fondo/70'
    : token.signo === '+'
      ? 'text-favorable'
      : token.signo === '−'
        ? 'text-alerta'
        : 'text-tinta-2';

  return (
    <span className={`font-tabla text-[10px] font-bold tracking-[0.06em] uppercase ${color}`}>
      {token.label}
      {token.signo !== 'neutro' && <span className="ml-0.5">{signoRepetido(token)}</span>}
    </span>
  );
}

export function Renglon({
  label,
  hint,
  impacto,
  azaroso = false,
  seleccionado = false,
  onClick,
  disabled = false,
  retraso = 0,
}: {
  label: string;
  hint: string;
  impacto?: Impacto[] | null;
  azaroso?: boolean;
  seleccionado?: boolean;
  onClick: () => void;
  disabled?: boolean;
  retraso?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={seleccionado}
      style={{ animationDelay: `${retraso}ms` }}
      className={`entrar-nota w-full border-b border-corondel px-3 py-3 text-left transition-colors disabled:opacity-40 ${
        seleccionado ? 'bg-tinta' : 'hover:bg-fondo/60'
      }`}
    >
      <span
        className={`flex items-baseline gap-2 font-titular text-[16px] leading-tight font-bold ${
          seleccionado ? 'text-fondo' : 'text-tinta'
        }`}
      >
        <span className="min-w-0">{label}</span>
        {azaroso && (
          <span
            className={`ml-auto shrink-0 border px-1.5 py-0.5 font-tabla text-[10px] font-bold tracking-wider uppercase ${
              seleccionado ? 'border-fondo text-fondo' : 'border-tinta-2 text-tinta-2'
            }`}
          >
            al azar
          </span>
        )}
      </span>
      <span
        className={`mt-1 block font-cuerpo text-[14px] leading-snug ${
          seleccionado ? 'text-fondo/80' : 'text-tinta-2'
        }`}
      >
        {hint}
      </span>
      {impacto && impacto.length > 0 && (
        <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {impacto.map((token) => (
            <TokenImpacto key={token.id} token={token} seleccionado={seleccionado} />
          ))}
        </span>
      )}
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
    <div className="sticky bottom-0 -mx-4 mt-5 border-t-4 border-tinta bg-fondo-2/97 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-titular text-[15px] leading-tight font-bold text-tinta">
            {resumen}
          </p>
          {detalle && (
            <p className="mt-0.5 truncate font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
              {detalle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onConfirmar}
          disabled={!habilitada}
          className={`shrink-0 px-5 py-3.5 font-titular text-[13px] font-black tracking-[0.1em] uppercase transition-colors ${
            habilitada
              ? 'bg-tinta text-fondo active:bg-tinta-2'
              : 'cursor-not-allowed border border-corondel text-tinta-3'
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
      className="mt-6 w-full bg-tinta py-4 font-titular text-[14px] font-black tracking-[0.12em] text-fondo uppercase transition-colors active:bg-tinta-2"
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
}: {
  label: string;
  valor: string;
  alerta?: boolean;
  abierta?: boolean;
  onToggle?: () => void;
  retraso?: number;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={abierta}
      style={{ animationDelay: `${retraso}ms` }}
      className={`entrar-nota min-h-11 min-w-0 border-b-2 px-0.5 pt-0.5 pb-1 text-left transition-colors ${
        abierta ? 'border-tinta' : 'border-dotted border-corondel-fuerte hover:border-tinta-2'
      }`}
    >
      <span className="block truncate font-tabla text-[11px] leading-none text-tinta-2 uppercase">
        {label}
      </span>
      <span
        className={`mt-1.5 block truncate font-titular text-[17px] leading-none font-black tabular-nums ${
          alerta ? 'text-alerta' : 'text-tinta'
        }`}
      >
        {valor}
      </span>
    </button>
  );
}
