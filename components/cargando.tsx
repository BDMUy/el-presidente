'use client';

import { ThinkingOrb } from 'thinking-orbs';

import { useTemaActual } from '@/lib/tema';

export function Cargando({
  children,
  chico = false,
}: {
  children: React.ReactNode;
  chico?: boolean;
}) {
  const orbTheme = useTemaActual() === 'claro' ? 'light' : 'dark';

  if (chico) {
    return (
      <p className="flex items-center gap-2 font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
        <ThinkingOrb state="searching" size={20} theme={orbTheme} aria-hidden />
        {children}
      </p>
    );
  }

  return (
    <div
      role="status"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6"
    >
      <ThinkingOrb state="searching" size={64} theme={orbTheme} aria-hidden />
      <p className="text-center font-tabla text-[11px] tracking-[0.2em] text-tinta-2 uppercase">
        {children}
      </p>
    </div>
  );
}
