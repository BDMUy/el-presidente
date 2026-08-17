import { join } from 'node:path';

import { defineConfig } from 'vitest/config';

/**
 * El motor no toca el DOM, así que corre en Node puro: los tests son rápidos
 * y no hace falta montar ningún componente para probar el juego entero.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': import.meta.dirname,
      // `server-only` existe para que el build falle si un componente de
      // cliente importa un módulo del servidor. Fuera de Next no hay tal
      // frontera, y sin esto los módulos marcados así no se pueden probar:
      // la protección terminaría dejando sin tests justo al código que la
      // tiene porque maneja credenciales o límites.
      'server-only': join(import.meta.dirname, 'test/server-only-vacio.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'app/**/*.test.ts'],
  },
});
