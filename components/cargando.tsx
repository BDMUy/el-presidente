export function Cargando({
  children,
  chico = false,
}: {
  children: React.ReactNode;
  chico?: boolean;
}) {
  const linea = (
    <>
      {children}
      <span
        aria-hidden
        className="cursor-parpadeo ml-1 inline-block h-[0.85em] w-[0.45em] bg-current align-[-0.1em]"
      />
    </>
  );

  if (chico) {
    return (
      <p className="font-tabla text-[11px] tracking-[0.06em] text-tinta-2 uppercase">{linea}</p>
    );
  }

  return (
    <div role="status" className="flex min-h-dvh flex-col items-center justify-center px-6">
      <p className="text-center font-tabla text-[11px] tracking-[0.2em] text-tinta-2 uppercase">
        {linea}
      </p>
    </div>
  );
}
