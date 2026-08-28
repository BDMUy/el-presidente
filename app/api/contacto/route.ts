import { NextResponse } from 'next/server';

import { limpiarContacto } from '@/lib/contacto';
import { enviarContacto, getMailer } from '@/lib/correo';
import { hashDeOrigen } from '@/lib/origen';

const MAX_POR_HORA = 5;
const VENTANA_MS = 60 * 60 * 1000;

const envios = new Map<string, number[]>();

function permitido(origen: string): boolean {
  const ahora = Date.now();
  const previos = (envios.get(origen) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (previos.length >= MAX_POR_HORA) {
    envios.set(origen, previos);
    return false;
  }
  previos.push(ahora);
  envios.set(origen, previos);
  return true;
}

function malaPeticion(motivo: string) {
  return NextResponse.json({ ok: false, error: motivo }, { status: 400 });
}

export async function GET() {
  const disponible = getMailer() !== null;
  return NextResponse.json({ ok: disponible }, { status: disponible ? 200 : 503 });
}

export async function POST(request: Request) {
  if (!getMailer()) {
    return NextResponse.json(
      { ok: false, error: 'El formulario de contacto todavía no está disponible.' },
      { status: 503 },
    );
  }

  const tipo = request.headers.get('content-type') ?? '';
  if (!tipo.toLowerCase().includes('application/json')) {
    return malaPeticion('Se espera application/json.');
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return malaPeticion('Cuerpo ilegible.');
  }

  const contacto = limpiarContacto(cuerpo as Record<string, unknown>);
  if (!contacto) return malaPeticion('Faltan datos o no tienen el formato esperado.');

  const origen = hashDeOrigen(request) ?? 'sin-origen';
  if (!permitido(origen)) {
    return NextResponse.json(
      { ok: false, error: 'Demasiados envíos por ahora. Probá más tarde.' },
      { status: 429 },
    );
  }

  try {
    await enviarContacto(contacto);
  } catch {
    return NextResponse.json({ ok: false, error: 'No se pudo enviar.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
