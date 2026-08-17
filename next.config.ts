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
const enProduccion = process.env.NODE_ENV === 'production';

const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' y 'unsafe-eval': lo primero es el bootstrap de hidratación
  // de Next, lo segundo lo necesita el refresh rápido y solo en desarrollo.
  `script-src 'self' 'unsafe-inline'${enProduccion ? '' : " 'unsafe-eval'"}`,
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
  // Solo en producción, y no por prolijidad: en desarrollo esta directiva
  // reescribe a https TODOS los subrecursos, incluidos los del propio origen.
  // Abriendo el juego desde el celular contra http://192.168.0.x:3000, el
  // navegador pedía el CSS, el JS y las fuentes por https contra un servidor
  // que solo habla http, fallaba con ERR_SSL_PROTOCOL_ERROR y quedaba una
  // página en blanco con la tipografía por defecto, clavada en "Abriendo el
  // expediente…" porque el JS nunca llegaba a correr. Probar en un teléfono
  // real es justo lo que hay que poder hacer.
  ...(enProduccion ? ['upgrade-insecure-requests'] : []),
].join('; ');

const CABECERAS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Con `frame-ancestors 'none'` ya alcanza en navegadores modernos; esto es
  // para los que todavía no leen esa directiva.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Dos años y subdominios, solo en producción. Por http el navegador la
  // ignora, pero mandarla en desarrollo no tiene ningún sentido y de paso
  // evita que quede pegada en un navegador que después visite otra cosa en
  // localhost.
  ...(enProduccion
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
    : []),
];

const nextConfig: NextConfig = {
  /**
   * Orígenes de la red local que pueden pedirle al servidor de desarrollo.
   *
   * Next bloquea por defecto los pedidos de desarrollo que no vienen de
   * localhost, así que abrir el juego desde el celular contra la IP de la
   * notebook devolvía 403 en todos los recursos. Es un juego pensado para el
   * teléfono: poder abrirlo en uno de verdad no es un lujo.
   *
   * Solo afecta a `next dev`; en producción esta opción no existe.
   */
  allowedDevOrigins: ['192.168.0.*', '192.168.1.*', '10.0.0.*'],

  async headers() {
    return [{ source: '/:path*', headers: CABECERAS }];
  },
};

export default nextConfig;
