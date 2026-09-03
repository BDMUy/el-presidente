'use client';

import { BarraSuperior } from './barra-superior';
import { Cuerpo, Recuadro, Titular, Volanta } from './ui';

export function Ayuda({ onVolver }: { onVolver: () => void }) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-10 pl-[max(1rem,var(--sae-left))] pr-[max(1rem,var(--sae-right))]">
      <div className="pt-3">
        <BarraSuperior onVolver={onVolver} volverLabel="← Volver" />
      </div>

      <div className="pt-8">
        <Recuadro>
          <Volanta>Cómo se juega</Volanta>
          <div className="mt-4">
            <Titular>El cargo</Titular>
            <Cuerpo className="mt-3">
              Ganás una elección y te toca dirigir. Los partidos no los jugás vos: armás el
              plantel y el plantel responde en la cancha. Tu trabajo es la caja, la hinchada, los
              socios, el nivel del plantel y la influencia. Cada decisión mueve algunos de esos
              números y casi ninguna los mueve todos para el mismo lado.
            </Cuerpo>
            <Cuerpo className="mt-3">
              Cada cuatro temporadas los socios votan. Si la hinchada quedó por debajo de 45,
              perdés la elección y entregás el cargo. Si la caja se hunde en rojo, el club se
              funde antes de llegar a la urna. Una asamblea también te puede voltear si la gente
              se te da vuelta del todo.
            </Cuerpo>
          </div>

          <div className="mt-6">
            <Volanta>Cómo se gana</Volanta>
            <Cuerpo className="mt-3">
              Ganar es terminar todos los mandatos con el club de pie. El mejor final es el que te
              pone el nombre en una tribuna: para eso hacen falta títulos, la hinchada bien arriba
              y ningún descenso en toda la gestión. Lo más común es cumplir sin gloria y sin
              catástrofe. También se puede terminar antes, y peor.
            </Cuerpo>
          </div>
        </Recuadro>
      </div>
    </div>
  );
}
