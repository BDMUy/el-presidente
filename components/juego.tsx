'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getClub } from '@/content/clubs';
import { presidenciaDelDia } from '@/lib/daily';
import type { Modo } from '@/lib/engine/types';
import { borrar, leer } from '@/lib/storage';
import { Arranque } from './arranque';
import { Cargando } from './cargando';
import type { Inicio, Resumen } from './juego-en-curso';

const JuegoEnCurso = dynamic(
  () => import('./juego-en-curso').then((mod) => mod.JuegoEnCurso),
  { ssr: false },
);

function alTope(): void {
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function Juego() {
  const [inicio, setInicio] = useState<Inicio | null>(null);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [cargando, setCargando] = useState(true);
  const [enJuego, setEnJuego] = useState(false);

  const principalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const main = principalRef.current;
    if (!main) return;
    const heading = main.querySelector('h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.style.outline = 'none';
    }
    (heading ?? main).focus({ preventScroll: true });
  }, [enJuego, resumen?.acta, resumen?.choices]);

  useEffect(() => {
    if (leer()) setInicio({ tipo: 'guardada' });
    setCargando(false);
  }, []);

  const empezar = useCallback((clubId: string, modo: Modo) => {
    const seed = Math.floor(Math.random() * 0xffffffff);
    setInicio({ tipo: 'nueva', seed, clubId, modo, diaria: null });
    setResumen(null);
    setEnJuego(true);
    alTope();
  }, []);

  const empezarDiaria = useCallback(() => {
    const { seed, clubId, fecha } = presidenciaDelDia();
    setInicio({ tipo: 'nueva', seed, clubId, modo: 'normal', diaria: fecha });
    setResumen(null);
    setEnJuego(true);
    alTope();
  }, []);

  const continuar = useCallback(() => {
    setEnJuego(true);
    alTope();
  }, []);

  const volverAlInicio = useCallback(() => {
    setEnJuego(false);
    alTope();
  }, []);

  const reiniciar = useCallback(() => {
    borrar();
    setInicio(null);
    setResumen(null);
    setEnJuego(false);
    alTope();
  }, []);

  if (cargando) {
    return (
      <main>
        <Cargando>Abriendo el expediente…</Cargando>
      </main>
    );
  }

  return (
    <main
      ref={principalRef}
      id="principal"
      tabIndex={-1}
      className={enJuego ? 'flex min-h-dvh flex-col focus:outline-none' : 'focus:outline-none'}
    >
      {enJuego && !resumen && <Cargando>Abriendo el expediente…</Cargando>}

      {!enJuego && (
        <Arranque
          onEmpezar={empezar}
          onEmpezarDiaria={empezarDiaria}
          enCurso={
            resumen
              ? {
                  club: getClub(resumen.clubId),
                  season: resumen.season,
                  year: resumen.year,
                  diaria: resumen.diaria,
                  terminada: resumen.terminada,
                }
              : null
          }
          onContinuar={continuar}
          onAbandonar={reiniciar}
        />
      )}

      {inicio && (
        <JuegoEnCurso
          inicio={inicio}
          activo={enJuego}
          onResumen={setResumen}
          onVolver={volverAlInicio}
          onReiniciar={reiniciar}
        />
      )}
    </main>
  );
}
