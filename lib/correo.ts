import 'server-only';

import nodemailer, { type Transporter } from 'nodemailer';

let cliente: Transporter | null | undefined;

export function getMailer(): Transporter | null {
  if (cliente !== undefined) return cliente;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const destino = process.env.CONTACT_EMAIL_TO;

  if (!host || !user || !pass || !destino) {
    cliente = null;
    return null;
  }

  const puerto = Number(process.env.SMTP_PORT ?? 587);

  cliente = nodemailer.createTransport({
    host,
    port: Number.isInteger(puerto) ? puerto : 587,
    secure: puerto === 465,
    auth: { user, pass },
  });
  return cliente;
}

export interface Contacto {
  nombre: string | null;
  email: string;
  tipo: string;
  mensaje: string;
}

export async function enviarContacto(contacto: Contacto): Promise<void> {
  const mailer = getMailer();
  if (!mailer) throw new Error('SMTP no configurado.');

  const destino = process.env.CONTACT_EMAIL_TO as string;
  const remitente = process.env.SMTP_FROM || process.env.SMTP_USER;

  await mailer.sendMail({
    from: remitente,
    to: destino,
    replyTo: contacto.email,
    subject: `[El Presidente] ${contacto.tipo} — ${contacto.nombre ?? 'sin nombre'}`,
    text: `Tipo: ${contacto.tipo}\nNombre: ${contacto.nombre ?? '(no dio nombre)'}\nEmail: ${contacto.email}\n\n${contacto.mensaje}`,
  });
}
