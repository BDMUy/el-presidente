import type { CSSProperties } from 'react';

export function Festejo({ titulo, detalle }: { titulo: string; detalle: string }) {
  return (
    <div className="festejo my-4">
      <div className="festejo-papelitos" aria-hidden="true">
        {Array.from({ length: 15 }, (_, i) => (
          <i key={i} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      <p className="festejo-sello">{titulo}</p>
      <p className="relative mt-3 font-titular text-[0.9375rem] font-bold text-tinta">{detalle}</p>
    </div>
  );
}
