alter table presidencias
  add column if not exists origen_hash text;

delete from presidencias where id in (
  select id from (
    select id, row_number() over (
      partition by dispositivo, seed, club_id
      order by puntaje desc, creada_en asc, id asc
    ) as puesto
    from presidencias
  ) ordenadas
  where puesto > 1
);

create unique index if not exists presidencias_una_por_partida
  on presidencias (dispositivo, seed, club_id);

create index if not exists presidencias_origen_reciente
  on presidencias (origen_hash, creada_en desc)
  where origen_hash is not null;

comment on column presidencias.origen_hash is
  'Hash con sal del IP de origen. Sirve para limitar la frecuencia de envío y para nada más; el IP en crudo no se guarda.';
