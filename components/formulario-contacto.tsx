'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { TipoContacto } from '@/lib/contacto';
import { CampoSelect } from './campo-select';

type Estado =
  | { fase: 'cargando' }
  | { fase: 'no-disponible' }
  | { fase: 'listo' }
  | { fase: 'enviando' }
  | { fase: 'enviado' }
  | { fase: 'error'; mensaje: string };

const ETIQUETA_TIPO: Record<TipoContacto, string> = {
  acceso: 'Quiero saber qué datos míos tienen',
  borrado: 'Quiero que borren mis datos',
  otra: 'Otra consulta',
};

export function FormularioContacto() {
  const [estado, setEstado] = useState<Estado>({ fase: 'cargando' });
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState<TipoContacto>('borrado');
  const [mensaje, setMensaje] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);
  const mensajeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let vivo = true;
    fetch('/api/contacto')
      .then((r) => vivo && setEstado(r.status === 503 ? { fase: 'no-disponible' } : { fase: 'listo' }))
      .catch(() => vivo && setEstado({ fase: 'no-disponible' }));
    return () => {
      vivo = false;
    };
  }, []);

  const enviar = useCallback(async () => {
    if (email.trim().length === 0 || mensaje.trim().length === 0) {
      setEstado({ fase: 'error', mensaje: 'Completá tu email y el mensaje.' });
      (email.trim().length === 0 ? emailRef : mensajeRef).current?.focus();
      return;
    }

    setEstado({ fase: 'enviando' });

    try {
      const r = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim() || undefined,
          email: email.trim(),
          tipo,
          mensaje: mensaje.trim(),
        }),
      });
      const datos = (await r.json()) as { ok: boolean; error?: string };

      if (!r.ok) {
        setEstado({ fase: 'error', mensaje: datos.error ?? 'No se pudo enviar.' });
        return;
      }

      setEstado({ fase: 'enviado' });
    } catch {
      setEstado({ fase: 'error', mensaje: 'No hay conexión. Probá de nuevo.' });
    }
  }, [nombre, email, tipo, mensaje]);

  if (estado.fase === 'cargando') return null;

  if (estado.fase === 'no-disponible') {
    return (
      <p className="mt-3 font-cuerpo text-[14px] leading-snug text-tinta-2">
        El formulario todavía no está disponible. Volvé a intentar más tarde.
      </p>
    );
  }

  if (estado.fase === 'enviado') {
    return (
      <p className="mt-3 font-cuerpo text-[15px] leading-relaxed text-tinta">
        Recibimos tu mensaje. Te respondemos al email que dejaste.
      </p>
    );
  }

  const faltaEmail = estado.fase === 'error' && email.trim().length === 0;
  const faltaMensaje = estado.fase === 'error' && mensaje.trim().length === 0;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        enviar();
      }}
      className="mt-3 space-y-3"
    >
      <label className="block">
        <span className="font-tabla text-[11px] font-bold tracking-[0.1em] text-tinta-2 uppercase">
          Tu nombre (opcional)
        </span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={24}
          autoComplete="name"
          className="mt-1.5 w-full border border-corondel bg-fondo-2 px-3 py-2.5 font-cuerpo text-[15px] text-tinta focus:border-tinta focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="font-tabla text-[11px] font-bold tracking-[0.1em] text-tinta-2 uppercase">
          Tu email
        </span>
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
          required
          aria-required
          aria-invalid={faltaEmail}
          aria-describedby={estado.fase === 'error' ? 'contacto-error' : undefined}
          autoComplete="email"
          placeholder="para poder responderte"
          className="mt-1.5 w-full border border-corondel bg-fondo-2 px-3 py-2.5 font-cuerpo text-[15px] text-tinta placeholder:text-tinta-2 focus:border-tinta focus:outline-none"
        />
      </label>

      <CampoSelect etiqueta="Qué necesitás" valor={tipo} onChange={(v) => setTipo(v as TipoContacto)}>
        {(Object.keys(ETIQUETA_TIPO) as TipoContacto[]).map((t) => (
          <option key={t} value={t}>
            {ETIQUETA_TIPO[t]}
          </option>
        ))}
      </CampoSelect>

      <label className="block">
        <span className="font-tabla text-[11px] font-bold tracking-[0.1em] text-tinta-2 uppercase">
          Mensaje
        </span>
        <textarea
          ref={mensajeRef}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          maxLength={2000}
          rows={4}
          required
          aria-required
          aria-invalid={faltaMensaje}
          aria-describedby={estado.fase === 'error' ? 'contacto-error' : undefined}
          className="mt-1.5 w-full border border-corondel bg-fondo-2 px-3 py-2.5 font-cuerpo text-[15px] text-tinta focus:border-tinta focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={estado.fase === 'enviando'}
        className="min-h-11 w-full bg-tinta py-2.5 font-titular text-[13px] font-black tracking-[0.1em] text-fondo uppercase transition-colors active:bg-tinta-2 disabled:opacity-50"
      >
        {estado.fase === 'enviando' ? 'Enviando' : 'Enviar'}
      </button>

      {estado.fase === 'error' && (
        <p id="contacto-error" role="alert" className="font-cuerpo text-[14px] text-alerta">
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}
