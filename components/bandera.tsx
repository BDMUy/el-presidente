import AR from 'country-flag-icons/react/3x2/AR';
import BO from 'country-flag-icons/react/3x2/BO';
import BR from 'country-flag-icons/react/3x2/BR';
import CL from 'country-flag-icons/react/3x2/CL';
import CO from 'country-flag-icons/react/3x2/CO';
import EC from 'country-flag-icons/react/3x2/EC';
import PE from 'country-flag-icons/react/3x2/PE';
import PY from 'country-flag-icons/react/3x2/PY';
import UY from 'country-flag-icons/react/3x2/UY';
import VE from 'country-flag-icons/react/3x2/VE';

import type { Country } from '@/lib/engine/types';

const BANDERAS: Record<Country, typeof AR> = {
  argentina: AR,
  bolivia: BO,
  brasil: BR,
  chile: CL,
  colombia: CO,
  ecuador: EC,
  paraguay: PY,
  peru: PE,
  uruguay: UY,
  venezuela: VE,
};

export function Bandera({ pais }: { pais: Country }) {
  const Flag = BANDERAS[pais];
  return <Flag aria-hidden className="w-5 shrink-0 border border-corondel" />;
}
