-- El Presidente · límites de envío
--
-- La versión anterior aceptaba envíos sin ningún tope. Medido: veinticinco
-- veces la misma presidencia idéntica, desde el mismo dispositivo, aceptadas
-- las veinticinco en 2,1 segundos. Con eso cualquiera se queda con el top 50
-- entero y llena el almacenamiento del plan gratuito desde una notebook.
--
-- Se agregan las dos mitades de la defensa:
--
--   1. Identidad de la partida. Un dispositivo no puede mandar dos veces la
--      misma presidencia. Es la que corta el bucle trivial de reenvío.
--
--      No se pone sobre (seed, club_id, decisiones) a secas: en la Presidencia
--      del Día todos juegan la misma semilla y dos personas pueden llegar
--      legítimamente al mismo log, sobre todo en partidas cortas. Rechazar a
--      la segunda sería castigar a un jugador honesto.
--
--   2. Ventana por origen. Es la que sobrevive a que el atacante rote el uuid
--      de dispositivo, que es un dato que manda el cliente y no vale nada.
--
-- Se guarda un hash con sal del IP, nunca el IP. El espacio de IPv4 es chico:
-- un hash sin sal se revierte con una tabla en un rato, así que sin sal esto
-- sería guardar el IP con pasos de más.

alter table presidencias
  add column if not exists origen_hash text;

-- Si la tabla ya venía con envíos repetidos, el índice único de abajo no se
-- puede crear y la migración entera falla. Se resuelven primero, dejando de
-- cada grupo la de mayor puntaje —y ante empate la más vieja, que es la que
-- realmente entró primero a la tabla.
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

-- Una presidencia por dispositivo. Reenviar la misma choca acá.
create unique index if not exists presidencias_una_por_partida
  on presidencias (dispositivo, seed, club_id);

-- La consulta de la ventana: cuántas entraron desde este origen últimamente.
create index if not exists presidencias_origen_reciente
  on presidencias (origen_hash, creada_en desc)
  where origen_hash is not null;

comment on column presidencias.origen_hash is
  'Hash con sal del IP de origen. Sirve para limitar la frecuencia de envío y para nada más; el IP en crudo no se guarda.';
