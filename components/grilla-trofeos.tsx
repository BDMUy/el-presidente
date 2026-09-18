import { TITLES, type TitleId } from '@/lib/engine/types';
import { IconoCopa } from './iconos';

export function GrillaTrofeos({ titulos }: { titulos: Map<TitleId, number> }) {
  return (
    <ul className="mt-2 grid grid-cols-2 gap-2">
      {[...titulos].map(([id, veces]) => (
        <li
          key={id}
          className="tarjeta-plana flex flex-col items-center gap-1 px-3 py-3 text-center"
        >
          <span className="flex items-baseline gap-1 text-acento">
            <IconoCopa />
            {veces > 1 && (
              <span className="font-titular text-[1rem] leading-none tabular-nums">×{veces}</span>
            )}
          </span>
          <span className="font-titular text-[0.875rem] leading-tight text-balance text-tinta">
            {TITLES[id].label}
          </span>
          <span className="font-tabla text-[0.6875rem] tracking-[0.06em] text-tinta-2 uppercase tabular-nums">
            {TITLES[id].points * veces} puntos
          </span>
        </li>
      ))}
    </ul>
  );
}
