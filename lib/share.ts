/**
 * Codificación de una partida en la URL.
 *
 * Una presidencia ya está descrita por `{seed, clubId, choices}`, así que el
 * link no necesita servidor: lleva la partida entera y el destinatario la
 * reconstruye con `replayRun`. Una partida completa entra en unos setenta
 * caracteres.
 *
 * El alfabeto es base64url para que sobreviva a cualquier lugar donde se
 * pegue un link: sin `+`, sin `/`, sin `=`.
 *
 * Formato: [seed × 6][índice de club × 2][una decisión por carácter]
 */

import { CLUBS } from '@/content/clubs';
import { replayRun } from '@/lib/engine/engine';
import type { GameState, Modo } from '@/lib/engine/types';

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const BASE = ALFABETO.length; // 64

const LARGO_SEED = 6; // 6 × 6 bits = 36, alcanza para 32 bits
const LARGO_CLUB = 2; // hasta 4096 valores; ahí entran el club y el modo

/**
 * El modo viaja empaquetado en el mismo campo que el club, sin agrandar el
 * formato: `valor = modo × BLOQUE_MODO + índice de club`.
 *
 * De ahí sale la propiedad que importa: **los links que ya circulan siguen
 * funcionando**. Con `normal` en la posición 0 del catálogo de modos, un link
 * viejo tiene un valor menor que 64 —hay 64 clubes— así que la división da
 * modo 0 y el resto da el mismo club de siempre.
 *
 * El bloque es 1024 y no 64 para que sumar clubes al catálogo no empiece a
 * pisar el modo: entran mil clubes antes de que haya que tocar nada.
 */
const BLOQUE_MODO = 1024;

/**
 * El orden de los modos **en el link**, que no es el orden en que se muestran.
 *
 * `normal` va primero porque tiene que valer 0: así un link escrito antes de
 * que los modos existieran —donde el campo es solo el índice del club— cae en
 * normal, que es lo que esas partidas eran.
 *
 * Son dos listas separadas a propósito. El primer intento usó `MODOS`, que
 * está en orden de presentación —corta, normal, larga—, y los links viejos
 * empezaron a decodificar como partidas cortas: la misma semilla, el mismo
 * club y otro juego. Reordenar la lista de la interfaz no puede cambiar lo que
 * significan los links que ya circulan.
 *
 * **Agregar un modo va al final de este array. Nunca en el medio.**
 *
 * Con cuatro modos el campo quedó lleno: dos caracteres en base 64 son 4096
 * valores y cuatro bloques de 1024 los usan todos. Un quinto modo no entra sin
 * tocar el formato, y `encodeRun` tira error antes que escribir un link que se
 * decodifique como otra cosa. Si algún día hace falta, la salida es agrandar
 * `LARGO_CLUB` a tres caracteres —que agranda todos los links en uno— o bajar
 * el bloque a 128, que deja lugar para treinta y dos modos y sesenta y cuatro
 * clubes más de los que hay.
 */
const MODOS_EN_LINK: readonly Modo[] = ['normal', 'corta', 'larga', 'llamas'];

export interface RunCodificada {
  seed: number;
  clubId: string;
  modo: Modo;
  choices: number[];
}

/**
 * Lo que hace falta para escribir un link.
 *
 * El modo es opcional al codificar y obligatorio al decodificar, y esa
 * asimetría es la compatibilidad hacia atrás escrita en el tipo: omitirlo
 * significa `normal`, que es exactamente lo que significan los links de antes
 * de que los modos existieran.
 */
export type RunParaCodificar = Omit<RunCodificada, 'modo'> & { modo?: Modo };

function aBase(valor: number, largo: number): string {
  let out = '';
  let n = valor;
  for (let i = 0; i < largo; i++) {
    out = ALFABETO[n % BASE] + out;
    n = Math.floor(n / BASE);
  }
  return out;
}

function deBase(texto: string): number | null {
  let n = 0;
  for (const ch of texto) {
    const d = ALFABETO.indexOf(ch);
    if (d < 0) return null;
    n = n * BASE + d;
  }
  return n;
}

/**
 * Codifica una partida. Falla fuerte si algo no entra: un link silenciosamente
 * truncado reconstruye otra partida, que es peor que no poder compartir.
 */
export function encodeRun({ seed, clubId, modo = 'normal', choices }: RunParaCodificar): string {
  const clubIndex = CLUBS.findIndex((c) => c.id === clubId);
  if (clubIndex < 0) throw new Error(`Club desconocido: ${clubId}`);
  if (clubIndex >= BLOQUE_MODO) throw new Error('Demasiados clubes para el formato del link');

  const modoIndex = MODOS_EN_LINK.indexOf(modo);
  if (modoIndex < 0) throw new Error(`Modo desconocido: ${modo}`);

  const empaquetado = modoIndex * BLOQUE_MODO + clubIndex;
  if (empaquetado >= BASE ** LARGO_CLUB) throw new Error('Club y modo no entran en el link');

  const semilla = seed >>> 0;
  if (semilla >= BASE ** LARGO_SEED) throw new Error('Semilla fuera de rango');

  let out = aBase(semilla, LARGO_SEED) + aBase(empaquetado, LARGO_CLUB);
  for (const choice of choices) {
    if (!Number.isInteger(choice) || choice < 0 || choice >= BASE) {
      throw new Error(`Decisión fuera de rango para el link: ${choice}`);
    }
    out += ALFABETO[choice];
  }
  return out;
}

/**
 * Tope de decisiones que se acepta de un link.
 *
 * Una presidencia completa ronda las 150 y el endpoint del ranking corta en
 * 400, así que el mismo número acá. El servidor de Node ya rechaza una URL
 * enorme con un 431 antes de que llegue el pedido, pero apoyarse en el límite
 * de cabeceras de quien te hostea no es un límite propio.
 */
const MAX_DECISIONES = 400;

/** El codificador nunca produce semillas de más de 32 bits. */
const MAX_SEED = 0xffffffff;

/** Decodifica un link. Devuelve null ante cualquier basura, sin excepciones. */
export function decodeRun(code: string): RunCodificada | null {
  if (typeof code !== 'string') return null;
  const limpio = code.trim();
  if (limpio.length < LARGO_SEED + LARGO_CLUB) return null;
  if (limpio.length > LARGO_SEED + LARGO_CLUB + MAX_DECISIONES) return null;

  const seed = deBase(limpio.slice(0, LARGO_SEED));
  const empaquetado = deBase(limpio.slice(LARGO_SEED, LARGO_SEED + LARGO_CLUB));
  if (seed === null || empaquetado === null) return null;

  // Seis caracteres en base 64 llegan hasta 68.719.476.735, muy por encima de
  // los 32 bits que usa el generador. Sin este corte, el decodificador acepta
  // semillas que el codificador no puede haber escrito, y que el endpoint del
  // ranking rechaza: dos puertas de la misma casa con distinta cerradura.
  if (seed > MAX_SEED) return null;

  // Se desempaqueta el modo del mismo campo que el club. Un link viejo trae un
  // valor menor que la cantidad de clubes, así que cae en modo 0 —normal— y en
  // el club de siempre, que es toda la compatibilidad hacia atrás.
  const modo = MODOS_EN_LINK[Math.floor(empaquetado / BLOQUE_MODO)];
  const club = CLUBS[empaquetado % BLOQUE_MODO];
  if (!modo || !club) return null;

  const choices: number[] = [];
  for (const ch of limpio.slice(LARGO_SEED + LARGO_CLUB)) {
    const d = ALFABETO.indexOf(ch);
    if (d < 0) return null;
    choices.push(d);
  }

  return { seed, clubId: club.id, modo, choices };
}

/** La URL completa para compartir. */
export function shareUrl(code: string, origin: string): string {
  return `${origin.replace(/\/$/, '')}/p/${code}`;
}

/**
 * Decodifica un link y reconstruye la presidencia que lleva adentro.
 *
 * Vive acá y no en cada página porque la reconstrucción tiene una parte
 * silenciosa: además del seed y el club, el link lleva el **modo**, y
 * `replayRun` lo toma por defecto como `normal` si no se lo pasan. Una partida
 * corta reconstruida sin su modo no falla —devuelve un estado perfectamente
 * válido— pero es *otra* partida.
 *
 * Eso ya pasó: la página del link pasaba el modo y la imagen de vista previa
 * no, así que al pegar el link de una presidencia corta o larga la miniatura
 * mostraba un resultado distinto al de la página que abría abajo. Con un solo
 * lugar donde se reconstruye, el error no se puede repetir en el próximo lugar
 * que necesite leer un link.
 *
 * Devuelve null ante cualquier problema: un link viejo, truncado o inventado
 * no debe tirar abajo la página ni la imagen. El `decodeURIComponent` va
 * adentro del try a propósito: ante un porcentaje suelto —/p/%%%— lanza
 * `URIError`, y afuera del try eso era un 500 donde correspondía un 404.
 */
export function reconstruirPresidencia(code: string): GameState | null {
  try {
    const datos = decodeRun(decodeURIComponent(code));
    if (!datos) return null;
    const state = replayRun(datos.seed, datos.clubId, datos.choices, datos.modo);
    return state.status === 'terminado' && state.ending ? state : null;
  } catch {
    return null;
  }
}
