import { ImageResponse } from 'next/og';

import { getClub } from '@/content/clubs';
import { computeScore } from '@/lib/engine/election';
import { FONDO_OSCURO, tintaDeClub } from '@/lib/color';
import { TITLES } from '@/lib/engine/types';
import { reconstruirPresidencia } from '@/lib/share';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const state = reconstruirPresidencia(code);
  const alt = state?.ending
    ? `${state.ending.title} · ${getClub(state.clubId).name} — una presidencia de El Presidente`
    : 'El Presidente — dirigí tu club';
  return [{ id: 'default', alt, size, contentType }];
}

const FONDO = FONDO_OSCURO;
const TINTA = '#e6e3db';
const TINTA_2 = '#a3a09a';
const CORONDEL = '#45474e';

const UA_ESTATICA =
  'Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20110814 Firefox/6.0';

const CSS_ARCHIVO_900 = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75,900';
const CSS_ARCHIVO_700 = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75,700';
const CSS_NEWSREADER = 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400';

type FuenteOG = { name: string; data: ArrayBuffer; weight: 400 | 700 | 900; style: 'normal' };

async function bajarFuente(css2: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(css2, {
      headers: { 'User-Agent': UA_ESTATICA },
      cache: 'force-cache',
    }).then((r) => (r.ok ? r.text() : ''));
    const url = css.match(/url\(([^)]+)\)/)?.[1];
    if (!url) return null;
    const bin = await fetch(url, { cache: 'force-cache' });
    return bin.ok ? await bin.arrayBuffer() : null;
  } catch {
    return null;
  }
}

let fuentesPromesa: Promise<FuenteOG[]> | null = null;

function cargarFuentes(): Promise<FuenteOG[]> {
  fuentesPromesa ??= (async () => {
    const [titular, agate, cuerpo] = await Promise.all([
      bajarFuente(CSS_ARCHIVO_900),
      bajarFuente(CSS_ARCHIVO_700),
      bajarFuente(CSS_NEWSREADER),
    ]);
    const fuentes: FuenteOG[] = [];
    if (titular) fuentes.push({ name: 'Archivo', data: titular, weight: 900, style: 'normal' });
    if (agate) fuentes.push({ name: 'Archivo', data: agate, weight: 700, style: 'normal' });
    if (cuerpo) fuentes.push({ name: 'Newsreader', data: cuerpo, weight: 400, style: 'normal' });
    return fuentes;
  })();
  return fuentesPromesa;
}

function primeraFrase(texto: string): string {
  const frase = texto.split('. ')[0].trim();
  if (frase.length <= 128) return frase;
  const corte = frase.slice(0, 128);
  return `${corte.slice(0, corte.lastIndexOf(' ')).trimEnd()}…`;
}

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const state = reconstruirPresidencia(code);
  const fonts = await cargarFuentes();

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
            fontFamily: 'Archivo',
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: -3 }}>EL PRESIDENTE</div>
          <div style={{ fontSize: 30, marginTop: 16, color: TINTA_2, fontWeight: 700 }}>
            Dirigí tu club. Cuatro mandatos para que no te echen.
          </div>
        </div>
      ),
      { ...size, fonts },
    );
  }

  const club = getClub(state.clubId);
  const tintaClub = tintaDeClub(club.colors[0], FONDO);
  const puntaje = computeScore(state);
  const titulos = [...new Set(state.titles.map((t) => t.id))].slice(0, 4);

  const dato = (label: string, valor: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', paddingRight: 44 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: TINTA_2, letterSpacing: 2 }}>
        {label.toUpperCase()}
      </div>
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
          fontFamily: 'Archivo',
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
              lineHeight: 0.9,
            }}
          >
            {state.ending.title}
          </div>

          <div
            style={{
              marginTop: 20,
              borderLeft: `2px solid ${tintaClub}`,
              paddingLeft: 18,
              maxWidth: 880,
              fontFamily: 'Newsreader',
              fontWeight: 400,
              fontSize: 27,
              lineHeight: 1.32,
              color: TINTA_2,
            }}
          >
            {primeraFrase(state.ending.text)}
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
    { ...size, fonts },
  );
}
