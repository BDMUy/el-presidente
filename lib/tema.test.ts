import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTemaActual } from './tema';

function TemaEnPantalla() {
  return createElement('span', null, useTemaActual());
}

afterEach(() => vi.unstubAllGlobals());

describe('tema durante la hidratación', () => {
  it.each(['claro', 'oscuro'])('conserva el snapshot inicial del servidor con edición %s', (tema) => {
    vi.stubGlobal('document', {
      documentElement: { getAttribute: () => tema },
    });
    expect(renderToString(createElement(TemaEnPantalla))).toBe('<span>oscuro</span>');
  });
});
