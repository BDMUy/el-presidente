export type RGB = [number, number, number];

export const FONDO_OSCURO = '#23242a';
export const FONDO_CLARO = '#f1efe9';

export function fondoDelTema(tema: 'oscuro' | 'claro'): string {
  return tema === 'claro' ? FONDO_CLARO : FONDO_OSCURO;
}

export function hex(color: string): RGB {
  const h = color.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function aHex([r, g, b]: RGB): string {
  return `#${[r, g, b].map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('')}`;
}

export function mezclar(frente: RGB, fondo: RGB, alfa: number): RGB {
  return frente.map((c, i) => c * alfa + fondo[i] * (1 - alfa)) as RGB;
}

export function luminancia([r, g, b]: RGB): number {
  const canal = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function ratio(a: RGB, b: RGB): number {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function resolver(desde: RGB, hacia: RGB, fondo: RGB, objetivo: number): { color: RGB; r: number } {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const candidato = mezclar(hacia, desde, mid);
    if (ratio(candidato, fondo) >= objetivo) hi = mid;
    else lo = mid;
  }
  const color = mezclar(hacia, desde, hi);
  return { color, r: ratio(color, fondo) };
}

interface Oklch {
  L: number;
  C: number;
  H: number;
}

function canalALineal(v: number): number {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function canalDeLineal(v: number): number {
  const s = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return s * 255;
}

function rgbAOklch([r, g, b]: RGB): Oklch {
  const [lr, lg, lb] = [canalALineal(r), canalALineal(g), canalALineal(b)];

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + bLab * bLab);
  const H = (Math.atan2(bLab, a) * 180) / Math.PI;

  return { L, C, H: H < 0 ? H + 360 : H };
}

function oklchARgbSinRecortar({ L, C, H }: Oklch): RGB {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const bLab = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * bLab;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bLab;
  const s_ = L - 0.0894841775 * a - 1.291485548 * bLab;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [canalDeLineal(lr), canalDeLineal(lg), canalDeLineal(lb)];
}

function dentroDeGama([r, g, b]: RGB, tolerancia = 0.4): boolean {
  return [r, g, b].every((c) => c >= -tolerancia && c <= 255 + tolerancia);
}

function oklchARgb(color: Oklch): RGB {
  let lo = 0;
  let hi = color.C;
  if (dentroDeGama(oklchARgbSinRecortar({ ...color, C: hi }))) {
    return oklchARgbSinRecortar({ ...color, C: hi }).map((c) => Math.min(255, Math.max(0, c))) as RGB;
  }
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (dentroDeGama(oklchARgbSinRecortar({ ...color, C: mid }))) lo = mid;
    else hi = mid;
  }
  return oklchARgbSinRecortar({ ...color, C: lo }).map((c) => Math.min(255, Math.max(0, c))) as RGB;
}

export function tintaDeClub(colorClub: string, fondo: string, objetivo = 4.5): string {
  const rgbFondo = hex(fondo);
  const rgbClub = hex(colorClub);
  const base = rgbAOklch(rgbClub);
  const fondoOscuro = luminancia(rgbFondo) < 0.5;
  const buscado = objetivo + 0.05;

  let lo = fondoOscuro ? base.L : 0;
  let hi = fondoOscuro ? 1 : base.L;

  const rgbEn = (L: number) => oklchARgb({ ...base, L });
  const rEn = (L: number) => ratio(rgbEn(L), rgbFondo);

  if (rEn(fondoOscuro ? hi : lo) < buscado) {
    const extremo = fondoOscuro ? [255, 255, 255] : [0, 0, 0];
    return aHex(resolver(rgbClub, extremo as RGB, rgbFondo, buscado).color);
  }

  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (rEn(mid) >= buscado) {
      if (fondoOscuro) hi = mid;
      else lo = mid;
    } else if (fondoOscuro) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return aHex(rgbEn(fondoOscuro ? hi : lo));
}
