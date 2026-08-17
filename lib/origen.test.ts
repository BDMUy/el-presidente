import { describe, expect, it } from 'vitest';

import { ipDe } from './origen';

function pedido(cabeceras: Record<string, string>): Request {
  return new Request('https://ejemplo.test/api/puntaje', { headers: cabeceras });
}

describe('ipDe', () => {
  it('no inventa un origen cuando no hay ninguna cabecera', () => {
    expect(ipDe(pedido({}))).toBeNull();
  });

  it('prefiere las cabeceras de un solo valor que escribe el hosting', () => {
    for (const cabecera of ['x-nf-client-connection-ip', 'x-vercel-forwarded-for', 'x-real-ip']) {
      expect(ipDe(pedido({ [cabecera]: '203.0.113.9', 'x-forwarded-for': '10.0.0.1' }))).toBe(
        '203.0.113.9',
      );
    }
  });

  it('mete al mismo cliente en el mismo cubo llegue por IPv4 o por IPv6', () => {
    // Netlify sirve sobre las dos pilas: el mismo visitante puede aparecer de
    // las dos formas, y si son dos orígenes el límite se afloja a la mitad.
    expect(ipDe(pedido({ 'x-nf-client-connection-ip': '::ffff:203.0.113.9' }))).toBe('203.0.113.9');
    expect(ipDe(pedido({ 'x-forwarded-for': '::FFFF:203.0.113.9' }))).toBe('203.0.113.9');
    // Una IPv6 de verdad no se toca, solo se normaliza la caja.
    expect(ipDe(pedido({ 'x-real-ip': '2001:DB8::1' }))).toBe('2001:db8::1');
  });

  it('toma el último salto de la cadena, no el primero', () => {
    // El proxy agrega al final el IP de quien se le conectó. Todo lo anterior
    // lo pudo haber escrito el propio cliente.
    expect(ipDe(pedido({ 'x-forwarded-for': '203.0.113.9' }))).toBe('203.0.113.9');
    expect(ipDe(pedido({ 'x-forwarded-for': '10.0.0.1, 203.0.113.9' }))).toBe('203.0.113.9');
  });

  it('no se deja mover el cubo por un salto inventado adelante', () => {
    // Este es el ataque medido: doce envíos con una ip falsa distinta al
    // frente pasaban los doce. Ahora los doce caen en el mismo origen.
    const origenes = new Set(
      Array.from({ length: 12 }, (_, i) =>
        ipDe(pedido({ 'x-forwarded-for': `10.0.0.${i}, 203.0.113.9` })),
      ),
    );
    expect([...origenes]).toEqual(['203.0.113.9']);
  });

  it('tolera espacios y valores vacíos en la cadena', () => {
    expect(ipDe(pedido({ 'x-forwarded-for': '  10.0.0.1 ,  , 203.0.113.9  ' }))).toBe(
      '203.0.113.9',
    );
    expect(ipDe(pedido({ 'x-forwarded-for': '   ' }))).toBeNull();
    expect(ipDe(pedido({ 'x-forwarded-for': ',,,' }))).toBeNull();
  });

  it('con la cadena más corta de lo esperado se queda con lo que hay', () => {
    // Un solo salto y dos proxies declarados: el índice no puede irse a -1.
    process.env.TRUSTED_PROXIES = '2';
    try {
      expect(ipDe(pedido({ 'x-forwarded-for': '203.0.113.9' }))).toBe('203.0.113.9');
      expect(ipDe(pedido({ 'x-forwarded-for': '198.51.100.7, 203.0.113.9' }))).toBe('198.51.100.7');
    } finally {
      delete process.env.TRUSTED_PROXIES;
    }
  });
});
