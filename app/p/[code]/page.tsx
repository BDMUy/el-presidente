import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getClub } from '@/content/clubs';
import { computeScore } from '@/lib/engine/election';
import { reconstruirPresidencia } from '@/lib/share';
import { BarraSuperior } from '@/components/barra-superior';
import { ResumenPresidencia } from '@/components/resumen-presidencia';
import { Bajada, Recuadro } from '@/components/ui';

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
    <main
      id="principal"
      tabIndex={-1}
      className="mx-auto w-full max-w-xl px-4 pb-10 pl-[max(1rem,var(--sae-left))] pr-[max(1rem,var(--sae-right))] focus:outline-none"
    >
      <div className="pt-3">
        <BarraSuperior volverHref="/" />
      </div>

      <div className="pt-8">
        <p
          className="border-t-4 border-b-2 border-tinta py-3 font-titular text-[clamp(2.75rem,11vw,4.5rem)] leading-[0.86] font-black tracking-[-0.03em] text-tinta uppercase"
          style={{ fontStretch: '80%' }}
        >
          El Presidente
        </p>
        <Bajada className="mt-4">
          Dirigí un club argentino cuatro mandatos. Después, la gente vota.
        </Bajada>
      </div>

      <Recuadro className="mt-8">
        <ResumenPresidencia state={state} club={club} ending={state.ending} />
      </Recuadro>

      <div className="mt-8 text-center">
        <p className="font-cuerpo text-[15px] text-tinta-2">
          ¿Te animás a hacerlo mejor con tu club?
        </p>
        <Link
          href="/"
          className="mt-3 inline-block bg-tinta px-8 py-3.5 font-titular text-[14px] font-black tracking-[0.12em] text-fondo uppercase transition-[color,background-color,transform] active:scale-[0.97] active:bg-tinta-2"
        >
          Jugar El Presidente
        </Link>
      </div>
    </main>
  );
}
