import type { Metadata, Viewport } from 'next';
import { Archivo, Chivo, Courier_Prime } from 'next/font/google';
import './globals.css';

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
