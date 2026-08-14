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

export const metadata: Metadata = {
  title: 'El Presidente — dirigí tu club',
  description:
    'Ganás la elección y tenés cuatro mandatos para no ser echado. Manejá la caja, la hinchada y la rosca de un club argentino. Vos armás el plantel; el plantel juega.',
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
