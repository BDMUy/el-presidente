-- El Presidente · duración de la partida
--
-- Se agregan tres modos: corta (8 temporadas), normal (16) y larga (32). El
-- puntaje incluye `temporadas × 18`, así que una partida larga siempre le gana
-- a una corta y una sola tabla mezclaría tres juegos distintos. El ranking
-- global pasa a estar separado por modo.
--
-- El diario NO se separa: la Presidencia del Día es siempre normal, así que
-- el ranking que de verdad es social sigue siendo uno solo para todos. Su
-- índice queda como estaba.

alter table presidencias
  add column if not exists modo text not null default 'normal';

-- Las tres duraciones que existen, y nada más. Sin esto, un modo mal escrito
-- crea una tabla fantasma que nadie ve pero que ocupa lugar.
alter table presidencias
  drop constraint if exists presidencias_modo_valido;

alter table presidencias
  add constraint presidencias_modo_valido
  check (modo in ('corta', 'normal', 'larga'));

-- El ranking global ahora se lee por modo. El índice viejo, sin la columna,
-- obligaba a recorrer las tres tablas para servir una.
drop index if exists presidencias_ranking_global;

create index if not exists presidencias_ranking_global_modo
  on presidencias (modo, puntaje desc)
  where fecha_diaria is null;

-- El índice que impide reenviar la misma presidencia tiene que incluir el modo.
-- Sin esto, jugar la misma semilla con el mismo club en corta y en larga
-- —dos partidas distintas, con otro final y otro puntaje— choca contra el
-- índice y la segunda se rechaza como si fuera un reenvío.
drop index if exists presidencias_una_por_partida;

create unique index if not exists presidencias_una_por_partida
  on presidencias (dispositivo, seed, club_id, modo);

comment on column presidencias.modo is
  'Duración de la partida: corta, normal o larga. Separa los rankings globales, porque el puntaje crece con las temporadas jugadas. La Presidencia del Día es siempre normal.';
