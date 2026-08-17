import 'server-only';

/**
 * Identificación del origen de un envío, para limitar la frecuencia.
 *
 * El `dispositivo` que manda el cliente es un uuid que el propio cliente
 * genera: sirve para que alguien se reconozca en la tabla y no vale nada como
 * límite, porque rotarlo es una línea. Lo único que el cliente no elige es de
 * dónde sale la conexión.
 *
 * Nunca se guarda el IP. Se guarda un hash con sal, y la sal importa: el
 * espacio de IPv4 entero son cuatro mil millones de valores, así que un
 * sha256 sin sal se revierte con una tabla en un rato y guardarlo sería
 * guardar el IP con pasos de más.
 */

import { createHash } from 'node:crypto';

let avisado = false;
let avisadoSinOrigen = false;

/**
 * Sal del hash de origen.
 *
 * Si falta, el hash sigue siendo estable —el límite funciona igual— pero deja
 * de proteger el IP frente a alguien que ya tenga la base. Por eso se avisa
 * una vez en producción en vez de fallar: quedarse sin ranking es peor que
 * quedarse sin esta protección, pero enterarse tarde es peor que las dos.
 */
function sal(): string {
  const configurada = process.env.RANKING_SALT;
  if (configurada) return configurada;

  if (process.env.NODE_ENV === 'production' && !avisado) {
    avisado = true;
    console.warn(
      '[ranking] RANKING_SALT no está configurada: el hash de origen no protege el IP.',
    );
  }
  return 'el-presidente:sal-por-defecto';
}

/**
 * Cuántos proxies de confianza hay delante de la aplicación.
 *
 * Uno por defecto, que es el caso de Vercel y el de cualquier reverse proxy
 * normal. Si el juego se sirve detrás de un CDN *además* del hosting, hay que
 * poner 2, y así.
 */
function proxiesDeConfianza(): number {
  const crudo = Number(process.env.TRUSTED_PROXIES);
  return Number.isInteger(crudo) && crudo > 0 ? crudo : 1;
}

/**
 * Saca el IP del cliente de las cabeceras del proxy.
 *
 * **Se cuenta desde el final de la cadena, no desde el principio.** Un proxy
 * agrega el IP de quien se le conectó al final de `x-forwarded-for`, así que
 * todo lo que está antes lo escribió alguien río arriba, y el primero de la
 * lista lo puede haber puesto el propio atacante.
 *
 * Esto no es teórico: con la versión anterior, que tomaba el primer valor,
 * mandar `x-forwarded-for: 10.0.0.N, <ip real>` con una N distinta cada vez
 * pasaba doce de doce envíos por encima del límite. Contando desde el final,
 * los doce caen en el mismo cubo.
 *
 * Las cabeceras de un solo valor van primero porque las escribe el hosting y
 * el cliente no las puede plantar. Una por proveedor, en orden de confianza:
 *
 *   x-nf-client-connection-ip   Netlify
 *   x-vercel-forwarded-for      Vercel
 *   x-real-ip                   nginx y la mayoría de los reverse proxy
 *
 * Que estén las tres no es indecisión: cada hosting escribe la suya y ninguno
 * escribe las ajenas, así que la lista es exhaustiva sin ser ambigua.
 */
export function ipDe(request: Request): string | null {
  const directas = ['x-nf-client-connection-ip', 'x-vercel-forwarded-for', 'x-real-ip'];
  for (const nombre of directas) {
    const valor = request.headers.get(nombre)?.trim();
    if (valor) return normalizar(valor);
  }

  const cadena = request.headers.get('x-forwarded-for');
  if (!cadena) return null;

  const saltos = cadena
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (saltos.length === 0) return null;

  // Con un proxy de confianza, el último salto es el que ese proxy vio de
  // verdad. Si la cadena es más corta de lo esperado, se toma el primero que
  // hay, que es lo más lejos que se puede ir sin inventar.
  const indice = Math.max(0, saltos.length - proxiesDeConfianza());
  const salto = saltos[indice];
  return salto ? normalizar(salto) : null;
}

/**
 * Deja el mismo cliente siempre en el mismo cubo.
 *
 * Netlify sirve sobre IPv4 y sobre IPv6 a la vez, y el mismo visitante puede
 * llegar como `1.2.3.4` o como `::ffff:1.2.3.4`. Sin esto son dos orígenes
 * distintos y el límite se afloja a la mitad sin que nadie lo pida.
 */
function normalizar(ip: string): string {
  const mapeada = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip);
  return (mapeada ? mapeada[1] : ip).toLowerCase();
}

/**
 * El hash que se guarda, o null si no se pudo determinar el origen.
 *
 * Null significa que la aplicación no está detrás de un proxy que informe el
 * IP del cliente. Quien llama tiene que tener un plan para ese caso: sin
 * origen no hay ventana por IP, y medido en local, sin cabecera de proxy,
 * pasaban doce de doce envíos sin ningún tope.
 */
export function hashDeOrigen(request: Request): string | null {
  const ip = ipDe(request);
  if (!ip) {
    if (process.env.NODE_ENV === 'production' && !avisadoSinOrigen) {
      avisadoSinOrigen = true;
      // Se avisa en vez de rechazar porque rechazar dejaría el ranking muerto
      // en un despliegue que por lo demás funciona. Pero el operador tiene que
      // enterarse: el respaldo por dispositivo no frena a alguien que rote el
      // uuid, y sin IP no queda ningún otro handle sobre el cliente.
      console.warn(
        '[ranking] No llega el IP del cliente: no hay proxy delante o no manda ' +
          'x-forwarded-for. El límite por origen no se puede aplicar.',
      );
    }
    return null;
  }
  return createHash('sha256').update(`${sal()}:${ip}`).digest('hex').slice(0, 32);
}
