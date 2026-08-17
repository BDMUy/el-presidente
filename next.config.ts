import type { NextConfig } from 'next';

/**
 * Cabeceras de seguridad.
 *
 * Estaban las seis ausentes. Se agregan acá y no en un proxy porque desde el
 * config también alcanzan a los archivos estáticos, y porque el juego no tiene
 * nada que decidir por petición.
 *
 * Sobre la CSP: la receta con nonce que trae la documentación de Next obliga a
 * renderizar cada página de forma dinámica, y este juego es casi todo estático.
 * Ese precio no se paga acá, así que `script-src` admite lo que Next inyecta
 * para hidratar. A cambio se cierra todo lo demás, que es donde este juego
 * puede hacerse daño: no carga scripts de terceros, no tiene formularios que
 * apunten afuera, y la única entrada de texto libre —el nombre del ranking— la
 * escapa React y la limpia lib/nombre.ts.
 */
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' y 'unsafe-eval': lo primero es el bootstrap de hidratación
  // de Next, lo segundo lo necesita el refresh rápido y solo en desarrollo.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // El juego no llama a ningún servicio externo. Si algún día llama a uno, se
  // agrega acá y no antes.
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const CABECERAS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Con `frame-ancestors 'none'` ya alcanza en navegadores modernos; esto es
  // para los que todavía no leen esa directiva.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Dos años y subdominios: el juego se sirve solo por https.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: CABECERAS }];
  },
};

export default nextConfig;
