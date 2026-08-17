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
    expect(
      ipDe(pedido({ 'x-vercel-forwarded-for': '203.0.113.9', 'x-forwarded-for': '10.0.0.1' })),
    ).toBe('203.0.113.9');
    expect(ipDe(pedido({ 'x-real-ip': '203.0.113.9', 'x-forwarded-for': '10.0.0.1' }))).toBe(
      '203.0.113.9',
    );
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
