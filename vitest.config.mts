import { defineConfig } from 'vitest/config';

/**
 * El motor no toca el DOM, así que corre en Node puro: los tests son rápidos
 * y no hace falta montar ningún componente para probar el juego entero.
 */
export default defineConfig({
  resolve: {
    alias: { '@': import.meta.dirname },
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'app/**/*.test.ts'],
  },
});
