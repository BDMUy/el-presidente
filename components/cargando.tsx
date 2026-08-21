'use client';

import { ThinkingOrb } from 'thinking-orbs';

export function Cargando({
  children,
  chico = false,
}: {
  children: React.ReactNode;
  chico?: boolean;
}) {
  if (chico) {
    return (
      <p className="flex items-center gap-2 font-acta text-[11px] tracking-[0.06em] text-papel-2 uppercase">
        <ThinkingOrb state="searching" size={20} theme="dark" aria-hidden />
        {children}
      </p>
    );
  }

  return (
    <div
      role="status"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6"
    >
      <ThinkingOrb state="searching" size={64} theme="dark" aria-hidden />
      <p className="text-center font-acta text-[11px] tracking-[0.2em] text-papel-2 uppercase">
        {children}
      </p>
    </div>
  );
}
