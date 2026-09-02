import type { Metadata, Viewport } from 'next';
import { Archivo, Newsreader } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
});

const SCRIPT_TEMA = `try{var t=localStorage.getItem('el-presidente:tema');if(!t){t=matchMedia('(prefers-color-scheme: light)').matches?'claro':'oscuro'}if(t==='claro'){document.documentElement.setAttribute('data-tema','claro')}}catch(e){}`;

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
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#23242a' },
    { media: '(prefers-color-scheme: light)', color: '#f1efe9' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es-AR"
      className={`${archivo.variable} ${newsreader.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-tinta focus:bg-fondo focus:px-4 focus:py-2 focus:font-tabla focus:text-[11px] focus:font-bold focus:tracking-[0.1em] focus:text-tinta focus:uppercase"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
