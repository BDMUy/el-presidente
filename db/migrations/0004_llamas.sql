-- El Presidente · el club en llamas
--
-- Un cuarto modo, que a diferencia de los otros tres no es una duración sino
-- una dificultad: dura dieciséis temporadas igual que la normal, pero el club
-- arranca con veintidós millones de deuda, inhibido, con la hinchada por
-- debajo del corte electoral y un plantel que no se puede pagar. Medido con la
-- política calibrada del simulador, la completa el 15,8% de las partidas
-- contra el 62,7% de la normal.
--
-- Antes esto era una rareza que el motor sorteaba con probabilidad 1/500 y
-- que nadie pedía. Esa es la razón real de esta migración: esas partidas
-- entraban a la tabla `normal` con un 24,5% menos de puntaje que las que
-- arrancaban enteras, o sea que el ranking normal estaba comparando dos juegos
-- distintos sin decirlo. Con su propio modo, cada uno compite contra sus
-- iguales.

alter table presidencias
  drop constraint if exists presidencias_modo_valido;

alter table presidencias
  add constraint presidencias_modo_valido
  check (modo in ('corta', 'normal', 'larga', 'llamas'));

-- El índice del ranking global ya lleva `modo` como primera columna desde la
-- migración anterior, así que sirve la tabla nueva sin tocar nada. Se deja
-- dicho para que nadie lo agregue de nuevo.

comment on column presidencias.modo is
  'Cómo fue la partida. Tres duraciones —corta (8), normal (16), larga (32)— y una dificultad, llamas (16, con el club fundido). Separa los rankings globales: el puntaje crece con las temporadas jugadas, y en llamas se juega otro juego. La Presidencia del Día es siempre normal.';
