import { ImageResponse } from 'next/og';

import { getClub } from '@/content/clubs';
import { computeScore } from '@/lib/engine/election';
import { FONDO_OSCURO, tintaDeClub } from '@/lib/color';
import { TITLES } from '@/lib/engine/types';
import { reconstruirPresidencia } from '@/lib/share';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Una presidencia de El Presidente';

const FONDO = FONDO_OSCURO;
const TINTA = '#e6e3db';
const TINTA_2 = '#a3a09a';
const CORONDEL = '#45474e';

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const state = reconstruirPresidencia(code);

  if (!state?.ending) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: FONDO,
            color: TINTA,
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: -3 }}>EL PRESIDENTE</div>
          <div style={{ fontSize: 30, marginTop: 16, color: TINTA_2 }}>
            Dirigí tu club. Cuatro mandatos para que no te echen.
          </div>
        </div>
      ),
      size,
    );
  }

  const club = getClub(state.clubId);
  const tintaClub = tintaDeClub(club.colors[0], FONDO);
  const puntaje = computeScore(state);
  const titulos = [...new Set(state.titles.map((t) => t.id))].slice(0, 4);

  const dato = (label: string, valor: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', paddingRight: 44 }}>
      <div style={{ fontSize: 18, color: TINTA_2, letterSpacing: 2 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 42, fontWeight: 900, color: TINTA, marginTop: 6 }}>{valor}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: FONDO,
          padding: '52px 64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            borderBottom: `4px solid ${tintaClub}`,
            paddingBottom: 16,
            fontSize: 22,
            color: TINTA_2,
            letterSpacing: 4,
            fontWeight: 700,
          }}
        >
          EL PRESIDENTE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 28 }}>
          <div style={{ fontSize: 22, color: tintaClub, letterSpacing: 3, fontWeight: 700 }}>
            {`${club.name.toUpperCase()} · ${state.history[0]?.year ?? state.year}–${state.year}`}
          </div>

          <div
            style={{
              fontSize: state.ending.title.length > 22 ? 66 : 82,
              fontWeight: 900,
              color: TINTA,
              letterSpacing: -2,
              marginTop: 14,
              lineHeight: 1.02,
            }}
          >
            {state.ending.title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 'auto',
            borderTop: `1px solid ${CORONDEL}`,
            paddingTop: 28,
          }}
        >
          {dato('Temporadas', String(state.season))}
          {dato('Títulos', String(state.titles.length))}
          {dato('Hinchada', String(Math.round(state.resources.hinchada)))}
          {dato('Puntaje', puntaje.toLocaleString('es-AR'))}
        </div>

        {titulos.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {titulos.map((id) => (
              <div
                key={id}
                style={{
                  display: 'flex',
                  fontSize: 18,
                  fontWeight: 700,
                  color: FONDO,
                  backgroundColor: tintaClub,
                  padding: '6px 14px',
                  letterSpacing: 2,
                }}
              >
                {TITLES[id].label.toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    size,
  );
}
