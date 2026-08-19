import type { Metadata, Viewport } from 'next';
import { Archivo, Chivo, Courier_Prime } from 'next/font/google';
import './globals.css';

/**
 * Chivo y Archivo son de Omnibus-Type, fundición de Buenos Aires: el juego es
 * argentino hasta en la tipografía. Courier Prime hace de máquina de escribir
 * y es lo que convierte las pantallas en documentos.
 */
const chivo = Chivo({
  variable: '--font-chivo',
  subsets: ['latin'],
  weight: ['700', '900'],
});

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const courier = Courier_Prime({
  variable: '--font-courier',
  subsets: ['latin'],
  weight: ['400', '700'],
});

/**
 * De dónde cuelgan las URLs absolutas de los metadatos.
 *
 * Importa por una sola cosa, pero es la que hace que compartir sirva: la
 * imagen de vista previa de `/p/[code]` la genera Next desde un archivo, y
 * para ponerla en la etiqueta `og:image` necesita una URL absoluta. Sin
 * `metadataBase`, Next la arma contra `VERCEL_URL` y, si no está —Netlify no
 * la define—, contra `http://localhost:3000`. El link se pega en WhatsApp, el
 * servidor de WhatsApp va a buscar la imagen a su propio localhost, no
 * encuentra nada, y la vista previa sale sin imagen. No falla en ningún lado:
 * simplemente no aparece.
 *
 * `SITE_URL` se configura a mano y manda siempre. Si no está, se usa `URL`,
 * que Netlify define solo con la dirección del sitio. Y si tampoco, localhost,
 * que es lo correcto en desarrollo.
 */
function baseDelSitio(): URL {
  const configurada = process.env.SITE_URL ?? process.env.URL;
  try {
    return new URL(configurada ?? 'http://localhost:3000');
  } catch {
    return new URL('http://localhost:3000');
  }
}

export const metadata: Metadata = {
  metadataBase: baseDelSitio(),
  title: 'El Presidente — dirigí tu club',
  description:
    'Ganás la elección y tenés cuatro mandatos para no ser echado. Manejá la caja, la hinchada y la influencia de un club argentino. Vos armás el plantel; el plantel juega.',
};

export const viewport: Viewport = {
  themeColor: '#14342a',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es-AR"
      className={`${chivo.variable} ${archivo.variable} ${courier.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
