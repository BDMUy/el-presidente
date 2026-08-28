import type { Metadata } from 'next';
import Link from 'next/link';

import { FormularioContacto } from '@/components/formulario-contacto';
import { Cuerpo, Volanta } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Privacidad — El Presidente',
};

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <Volanta as="h2">{titulo}</Volanta>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export default function Privacidad() {
  return (
    <main id="principal" tabIndex={-1} className="mx-auto w-full max-w-xl px-4 py-10 focus:outline-none">
      <Link
        href="/"
        className="-mx-2 inline-block min-h-11 px-2 py-2 font-tabla text-[11px] tracking-[0.1em] text-tinta-2 uppercase transition-colors hover:text-tinta"
      >
        ← Volver al inicio
      </Link>

      <h1
        className="mt-4 border-t-4 border-b-2 border-tinta py-3 font-titular text-[clamp(2rem,8vw,3rem)] leading-[0.9] font-black tracking-[-0.02em] text-tinta uppercase"
        style={{ fontStretch: '80%' }}
      >
        Privacidad
      </h1>

      <Cuerpo className="mt-4">
        El Presidente lo hace Bruno Martínez, sin equipo ni empresa detrás. Esta página dice, en
        criollo, qué se guarda cuando jugás y qué no.
      </Cuerpo>

      <Seccion titulo="Este sitio no usa cookies">
        <Cuerpo>
          Ni propias ni de terceros, ni de analítica ni de publicidad. No hay Google Analytics,
          no hay píxeles, no se te sigue de un sitio a otro.
        </Cuerpo>
      </Seccion>

      <Seccion titulo="Lo que se guarda en tu navegador">
        <Cuerpo>
          El juego usa el almacenamiento local del navegador (<em>localStorage</em>) para cuatro
          cosas: el tema claro u oscuro que elegiste, la partida en curso para que puedas
          continuarla, un identificador al azar para que el ranking pueda distinguir tus envíos, y
          el nombre que elegís para firmar. Nada de esto sale de tu dispositivo a menos que decidas
          mandar tu puntaje al ranking.
        </Cuerpo>
      </Seccion>

      <Seccion titulo="Lo que se manda si enviás tu puntaje al ranking">
        <Cuerpo>
          Mandar el puntaje es opcional: el juego entero funciona igual sin hacerlo. Si lo hacés,
          viajan al servidor el nombre que elegiste, el identificador de tu navegador, y la semilla,
          el club, la duración y las decisiones de tu partida —eso último es lo que permite que el
          servidor verifique tu puntaje reproduciendo la partida entera, en vez de confiar en lo que
          manda el navegador. También se guarda un hash con sal de tu IP, solo para limitar cuántos
          envíos se aceptan por hora desde un mismo lugar; la IP en crudo nunca se guarda.
        </Cuerpo>
        <Cuerpo>
          Todo eso se usa para una sola cosa: mostrar la tabla de posiciones. Nunca se usa para
          publicidad, no se arma un perfil con eso, y no se vende ni se comparte con nadie.
        </Cuerpo>
      </Seccion>

      <Seccion titulo="Dónde vive el dato">
        <Cuerpo>
          En una base Postgres (según quién aloje esta instancia, por ejemplo Neon), en un hosting
          que sirve el sitio (por ejemplo Netlify). Son proveedores de infraestructura: guardan lo
          que el servidor les manda a guardar, no tienen acceso comercial a esos datos.
        </Cuerpo>
      </Seccion>

      <Seccion titulo="Tus derechos">
        <Cuerpo>
          Podés pedir acceso a los datos que hay guardados con tu nombre, corregirlos o pedir que se
          borren. Usá el formulario de acá abajo.
        </Cuerpo>
        <FormularioContacto />
      </Seccion>

      <Seccion titulo="Cambios">
        <Cuerpo>Si algo de esto cambia, se actualiza en esta misma página.</Cuerpo>
      </Seccion>
    </main>
  );
}
