/**
 * `/cartas` — la galería de actas. Solo en desarrollo.
 *
 * No es una pantalla del juego: es la herramienta con la que se lee el
 * contenido en el ancho en que se juega de verdad, y muestra cosas que un
 * jugador no tiene por qué ver —el id de cada carta, sus condiciones, los
 * desenlaces de las opciones de dado con su probabilidad—.
 *
 * Lo que NO es esta guarda es un secreto: el catálogo entero ya viaja al
 * navegador con o sin esta página, porque el motor corre del lado del cliente.
 * Está verificado: sacando esta ruta del build, el texto de las cartas sigue
 * apareciendo en los chunks. Ocultar la galería esconde la hoja de taller, no
 * el contenido.
 *
 * `notFound()` contra `NODE_ENV` y no una variable de entorno: así no hay
 * ninguna combinación de configuración que la deje abierta por error.
 */

import { notFound } from 'next/navigation';

import { GaleriaCartas } from '@/components/galeria-cartas';

export const metadata = { robots: { index: false, follow: false } };

export default function CartasPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <GaleriaCartas />;
}
