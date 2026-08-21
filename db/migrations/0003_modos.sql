alter table presidencias
  add column if not exists modo text not null default 'normal';

alter table presidencias
  drop constraint if exists presidencias_modo_valido;

alter table presidencias
  add constraint presidencias_modo_valido
  check (modo in ('corta', 'normal', 'larga'));

drop index if exists presidencias_ranking_global;

create index if not exists presidencias_ranking_global_modo
  on presidencias (modo, puntaje desc)
  where fecha_diaria is null;

drop index if exists presidencias_una_por_partida;

create unique index if not exists presidencias_una_por_partida
  on presidencias (dispositivo, seed, club_id, modo);

comment on column presidencias.modo is
  'Duración de la partida: corta, normal o larga. Separa los rankings globales, porque el puntaje crece con las temporadas jugadas. La Presidencia del Día es siempre normal.';
