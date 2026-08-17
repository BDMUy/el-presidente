/**
 * Reemplazo de `server-only` para los tests.
 *
 * El paquete real tira una excepción al importarse fuera de un componente de
 * servidor, que es exactamente lo que uno quiere en el build de Next y
 * exactamente lo que impide probar esos módulos en Vitest. Se sustituye por
 * la vía del alias en vitest.config.mts.
 *
 * No se toca `lib/db.ts` ni ningún otro módulo marcado: la frontera de verdad,
 * la que hace fallar el build si la credencial se acerca al navegador, queda
 * igual de puesta.
 */
export {};
