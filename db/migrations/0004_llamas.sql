alter table presidencias
  drop constraint if exists presidencias_modo_valido;

alter table presidencias
  add constraint presidencias_modo_valido
  check (modo in ('corta', 'normal', 'larga', 'llamas'));

comment on column presidencias.modo is
  'Cómo fue la partida. Tres duraciones —corta (8), normal (16), larga (32)— y una dificultad, llamas (16, con el club fundido). Separa los rankings globales: el puntaje crece con las temporadas jugadas, y en llamas se juega otro juego. La Presidencia del Día es siempre normal.';
