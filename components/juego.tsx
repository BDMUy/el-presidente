'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getClub } from '@/content/clubs';
import { presidenciaDelDia } from '@/lib/daily';
import type { Modo } from '@/lib/engine/types';
import { borrar, leer } from '@/lib/storage';
import { Ajustes } from './ajustes';
import { Arranque } from './arranque';
import { Ayuda } from './ayuda';
import { Cargando } from './cargando';
import type { Inicio, Resumen } from './juego-en-curso';

const JuegoEnCurso = dynamic(
  () => import('./juego-en-curso').then((mod) => mod.JuegoEnCurso),
  { ssr: false },
);

type Pantalla = 'arranque' | 'juego' | 'ajustes' | 'ayuda';

function alTope(): void {
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function Juego() {
  const [inicio, setInicio] = useState<Inicio | null>(null);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [cargando, setCargando] = useState(true);
  const [pila, setPila] = useState<Pantalla[]>(['arranque']);

  const cima = pila[pila.length - 1];
  const enJuego = cima === 'juego';

  const principalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (cima === 'juego') return;
    const main = principalRef.current;
    if (!main) return;
    const volver = main.querySelector<HTMLElement>('[data-volver]');
    if (volver) {
      volver.focus({ preventScroll: true });
      return;
    }
    const heading = main.querySelector('h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.style.outline = 'none';
    }
    (heading ?? main).focus({ preventScroll: true });
  }, [cima]);

  useEffect(() => {
    if (leer()) setInicio({ tipo: 'guardada' });
    setCargando(false);
  }, []);

  useEffect(() => {
    const alPop = () => setPila((s) => (s.length > 1 ? s.slice(0, -1) : s));
    window.addEventListener('popstate', alPop);
    return () => window.removeEventListener('popstate', alPop);
  }, []);

  const apilar = useCallback((pantalla: Pantalla) => {
    window.history.pushState(null, '', window.location.href);
    setPila((s) => [...s, pantalla]);
  }, []);

  const volver = useCallback(() => {
    window.history.back();
  }, []);

  const empezar = useCallback(
    (clubId: string, modo: Modo) => {
      const seed = Math.floor(Math.random() * 0xffffffff);
      setInicio({ tipo: 'nueva', seed, clubId, modo, diaria: null });
      setResumen(null);
      apilar('juego');
      alTope();
    },
    [apilar],
  );

  const empezarDiaria = useCallback(() => {
    const { seed, clubId, fecha } = presidenciaDelDia();
    setInicio({ tipo: 'nueva', seed, clubId, modo: 'normal', diaria: fecha });
    setResumen(null);
    apilar('juego');
    alTope();
  }, [apilar]);

  const continuar = useCallback(() => {
    apilar('juego');
    alTope();
  }, [apilar]);

  const reiniciar = useCallback(() => {
    borrar();
    setInicio(null);
    setResumen(null);
    window.history.back();
  }, []);

  const abandonar = useCallback(() => {
    borrar();
    setInicio(null);
    setResumen(null);
  }, []);

  const abrirAjustes = useCallback(() => apilar('ajustes'), [apilar]);
  const abrirAyuda = useCallback(() => apilar('ayuda'), [apilar]);

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

      {cima === 'arranque' && (
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
          onAbandonar={abandonar}
          onAjustes={abrirAjustes}
        />
      )}

      {cima === 'ajustes' && <Ajustes onVolver={volver} onAyuda={abrirAyuda} />}
      {cima === 'ayuda' && <Ayuda onVolver={volver} />}

      {inicio && (
        <JuegoEnCurso
          inicio={inicio}
          activo={enJuego}
          onResumen={setResumen}
          onVolver={volver}
          onReiniciar={reiniciar}
          onAjustes={abrirAjustes}
        />
      )}
    </main>
  );
}
