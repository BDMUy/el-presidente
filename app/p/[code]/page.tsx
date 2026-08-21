import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getClub } from '@/content/clubs';
import { computeScore } from '@/lib/engine/election';
import { reconstruirPresidencia } from '@/lib/share';
import { ResumenPresidencia } from '@/components/resumen-presidencia';
import { Membrete, Papel } from '@/components/ui';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const state = reconstruirPresidencia(code);
  if (!state?.ending) return { title: 'Presidencia no encontrada · El Presidente' };

  const club = getClub(state.clubId);
  const titulos = state.titles.length;
  const descripcion =
    `${state.season} ${state.season === 1 ? 'temporada' : 'temporadas'} al frente de ${club.name}. ` +
    `${titulos === 0 ? 'Sin títulos' : `${titulos} ${titulos === 1 ? 'título' : 'títulos'}`}, ` +
    `${computeScore(state).toLocaleString('es-AR')} puntos.`;

  return {
    title: `${state.ending.title} · ${club.name}`,
    description: descripcion,
    openGraph: { title: `${state.ending.title} · ${club.name}`, description: descripcion },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function PresidenciaCompartida({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const state = reconstruirPresidencia(code);
  if (!state?.ending) notFound();

  const club = getClub(state.clubId);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <div className="mb-5 text-center">
        <Membrete sobrePano>Presidencia compartida</Membrete>
      </div>

      <Papel torcido={0}>
        <ResumenPresidencia state={state} club={club} ending={state.ending} />
      </Papel>

      <div className="mt-8 text-center">
        <p className="font-body text-[15px] text-papel-2">
          ¿Te animás a hacerlo mejor con tu club?
        </p>
        <Link
          href="/"
          className="mt-3 inline-block bg-papel px-8 py-3.5 font-display text-[14px] font-black tracking-[0.12em] text-tinta uppercase transition-transform active:scale-[0.98]"
        >
          Jugar El Presidente
        </Link>
      </div>
    </main>
  );
}
