/**
 * La imagen que aparece al pegar el link de una presidencia.
 *
 * Se genera desde la misma partida reconstruida que la página, así que nunca
 * puede contradecirla. Reproduce la identidad del juego —paño verde, hoja de
 * papel, banda con los colores del club— con los medios que da Satori: no hay
 * tipografías propias acá, así que el peso visual lo cargan el color y la
 * jerarquía de tamaños.
 */

import { ImageResponse } from 'next/og';

import { getClub } from '@/content/clubs';
import { computeScore } from '@/lib/engine/election';
import { TITLES } from '@/lib/engine/types';
import { reconstruirPresidencia } from '@/lib/share';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Una presidencia de El Presidente';

const PANO = '#14342a';
const HOJA = '#e8e2d4';
const TINTA = '#1a1815';
const TINTA_2 = '#4e483e';
const BRONCE = '#7a5f24';

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const state = reconstruirPresidencia(code);

  // Sin partida válida la imagen no puede mentir: muestra la portada del juego.
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
            backgroundColor: PANO,
            color: HOJA,
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: -3 }}>EL PRESIDENTE</div>
          <div style={{ fontSize: 30, marginTop: 16, opacity: 0.75 }}>
            Dirigí tu club. Cuatro mandatos para que no te echen.
          </div>
        </div>
      ),
      size,
    );
  }

  const club = getClub(state.clubId);
  const puntaje = computeScore(state);
  const titulos = [...new Set(state.titles.map((t) => t.id))].slice(0, 4);

  const dato = (label: string, valor: string) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 20, color: TINTA_2, letterSpacing: 2 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 44, fontWeight: 900, color: TINTA, marginTop: 4 }}>{valor}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: 48,
          backgroundColor: PANO,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: HOJA,
            padding: 0,
          }}
        >
          {/* La banda del club: lo único suyo que no es su nombre. */}
          <div style={{ display: 'flex', height: 14 }}>
            <div style={{ flex: 1, backgroundColor: club.colors[0] }} />
            <div style={{ flex: 1, backgroundColor: club.colors[1] }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', padding: '40px 56px', flex: 1 }}>
            {/* Una sola cadena, no interpolaciones sueltas: Satori cuenta cada
                expresión como un hijo y exige display:flex explícito en
                cualquier div con más de uno. */}
            <div style={{ fontSize: 24, color: TINTA_2, letterSpacing: 3 }}>
              {`${club.name.toUpperCase()} · ${state.history[0]?.year ?? state.year}–${state.year}`}
            </div>

            <div
              style={{
                fontSize: state.ending.title.length > 22 ? 62 : 76,
                fontWeight: 900,
                color: TINTA,
                letterSpacing: -2,
                marginTop: 14,
                lineHeight: 1.02,
              }}
            >
              {state.ending.title}
            </div>

            <div style={{ display: 'flex', gap: 56, marginTop: 'auto' }}>
              {dato('Temporadas', String(state.season))}
              {dato('Títulos', String(state.titles.length))}
              {dato('Hinchada', String(Math.round(state.resources.hinchada)))}
              {dato('Puntaje', puntaje.toLocaleString('es-AR'))}
            </div>

            {titulos.length > 0 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                {titulos.map((id) => (
                  <div
                    key={id}
                    style={{
                      fontSize: 20,
                      color: BRONCE,
                      border: `2px solid ${BRONCE}`,
                      padding: '6px 14px',
                      letterSpacing: 2,
                    }}
                  >
                    {TITLES[id].label.toUpperCase()}
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                marginTop: 28,
                paddingTop: 18,
                borderTop: `3px solid ${TINTA}`,
                fontSize: 22,
                color: TINTA_2,
                letterSpacing: 3,
              }}
            >
              EL PRESIDENTE
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
