import 'server-only';

import { createHash } from 'node:crypto';

let avisado = false;
let avisadoSinOrigen = false;

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

function proxiesDeConfianza(): number {
  const crudo = Number(process.env.TRUSTED_PROXIES);
  return Number.isInteger(crudo) && crudo > 0 ? crudo : 1;
}

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

  const indice = Math.max(0, saltos.length - proxiesDeConfianza());
  const salto = saltos[indice];
  return salto ? normalizar(salto) : null;
}

function normalizar(ip: string): string {
  const mapeada = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip);
  return (mapeada ? mapeada[1] : ip).toLowerCase();
}

export function hashDeOrigen(request: Request): string | null {
  const ip = ipDe(request);
  if (!ip) {
    if (process.env.NODE_ENV === 'production' && !avisadoSinOrigen) {
      avisadoSinOrigen = true;
      console.warn(
        '[ranking] No llega el IP del cliente: no hay proxy delante o no manda ' +
          'x-forwarded-for. El límite por origen no se puede aplicar.',
      );
    }
    return null;
  }
  return createHash('sha256').update(`${sal()}:${ip}`).digest('hex').slice(0, 32);
}
