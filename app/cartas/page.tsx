import { notFound } from 'next/navigation';

import { GaleriaCartas } from '@/components/galeria-cartas';

export const metadata = { robots: { index: false, follow: false } };

export default function CartasPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <GaleriaCartas />;
}
