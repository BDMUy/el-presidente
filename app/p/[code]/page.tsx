/**
 * La página pública de una presidencia compartida.
 *
 * No hay base de datos detrás: el link lleva la partida entera y el servidor
 * la reconstruye con `replayRun`. Es el mismo motor determinista que corre en
 * el navegador, así que quien abre el link ve exactamente la partida que jugó
 * el que lo mandó.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getClub } from '@/content/clubs';
import { computeScore } from '@/lib/engine/election';
import { replayRun } from '@/lib/engine/engine';
import type { GameState } from '@/lib/engine/types';
import { decodeRun } from '@/lib/share';
import { ResumenPresidencia } from '@/components/resumen-presidencia';
import { Membrete, Papel } from '@/components/ui';

/**
 * Reconstruye la partida del link. Devuelve null ante cualquier problema:
 * un link viejo, truncado o inventado no debe tirar abajo la página.
 */
function reconstruir(code: string): GameState | null {
  const datos = decodeRun(decodeURIComponent(code));
  if (!datos) return null;
  try {
    const state = replayRun(datos.seed, datos.clubId, datos.choices, datos.modo);
    return state.status === 'terminado' && state.ending ? state : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const state = reconstruir(code);
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
  const state = reconstruir(code);
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
