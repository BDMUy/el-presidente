export function IconoAjustes() {
  return (
    <svg className="icono-ajustes" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M4 7h16M4 17h16" />
      <g className="ajuste-uno"><rect x="7" y="4" width="4" height="6" rx="1" fill="var(--fondo-2)" /></g>
      <g className="ajuste-dos"><rect x="14" y="14" width="4" height="6" rx="1" fill="var(--fondo-2)" /></g>
    </svg>
  );
}

export function IconoDado() {
  return (
    <svg className="icono-dado" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <g fill="currentColor" stroke="none">
        <circle cx="8" cy="8" r="1.5" /><circle cx="16" cy="8" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="8" cy="16" r="1.5" /><circle cx="16" cy="16" r="1.5" />
      </g>
    </svg>
  );
}

export function IconoCopa() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
      <path d="M12 14v3M9 20h6M10 17h4l1 3H9l1-3Z" />
    </svg>
  );
}
