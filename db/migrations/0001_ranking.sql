create table if not exists presidencias (
  id uuid primary key default gen_random_uuid(),

  dispositivo uuid not null,
  nombre text not null check (char_length(nombre) between 1 and 24),

  seed bigint not null,
  club_id text not null,
  decisiones smallint[] not null check (array_length(decisiones, 1) between 1 and 400),

  puntaje integer not null check (puntaje >= 0),
  temporadas smallint not null,
  titulos smallint not null,
  final text not null,

  fecha_diaria date,

  creada_en timestamptz not null default now()
);

create unique index if not exists presidencias_una_por_dia
  on presidencias (dispositivo, fecha_diaria)
  where fecha_diaria is not null;

create index if not exists presidencias_ranking_diario
  on presidencias (fecha_diaria, puntaje desc)
  where fecha_diaria is not null;

create index if not exists presidencias_ranking_global
  on presidencias (puntaje desc)
  where fecha_diaria is null;

comment on table presidencias is
  'Presidencias enviadas al ranking. El puntaje lo recalcula el servidor reproduciendo la partida; nunca se acepta del cliente.';
