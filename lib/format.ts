export function plata(millones: number): string {
  const signo = millones < 0 ? '−' : '';
  const abs = Math.abs(millones);
  return `${signo}US$ ${abs.toFixed(1).replace('.', ',')}M`;
}

export function plataCorta(millones: number): string {
  const signo = millones < 0 ? '−' : '';
  const abs = Math.abs(millones);
  if (abs >= 100) return `${signo}${Math.round(abs)}M`;
  return `${signo}${abs.toFixed(1).replace('.', ',')}M`;
}

export function plataConSigno(millones: number): string {
  if (millones === 0) return 'US$ 0';
  return `${millones > 0 ? '+' : '−'}US$ ${Math.abs(millones).toFixed(1).replace('.', ',')}M`;
}

export function socios(miles: number): string {
  return `${Math.round(miles)}k`;
}

export function entero(valor: number): string {
  return String(Math.round(valor));
}

export function ordinal(posicion: number): string {
  return `${posicion}°`;
}

export function plural(n: number, singular: string, plural_: string): string {
  return `${n} ${n === 1 ? singular : plural_}`;
}
