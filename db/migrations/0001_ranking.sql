-- El Presidente · rankings
--
-- Una tabla y dos índices. Todo lo que hace falta para verificar un puntaje ya
-- viaja en la fila: con la semilla, el club y el log de decisiones se reproduce
-- la partida entera con el mismo motor determinista que corre en el navegador.
-- El cliente nunca manda un puntaje; manda decisiones.
--
-- No hay tabla de semillas del día a propósito: la partida del día se deriva de
-- la fecha con una función pura, así que guardarla sería una segunda fuente de
-- verdad que puede desincronizarse.
--
-- SEGURIDAD: la frontera es que solo el servidor tiene DATABASE_URL. No hay
-- capa REST automática sobre esta base, y lib/db.ts está marcado `server-only`
-- para que la credencial no pueda llegar al navegador ni por accidente. Si
-- algún día esta base se expone detrás de una API pública (PostgREST y
-- similares), hay que activar RLS antes de hacerlo.

create table if not exists presidencias (
  id uuid primary key default gen_random_uuid(),

  -- Identificador anónimo del dispositivo. No hay cuentas: es un uuid que el
  -- navegador genera una vez y guarda. Sirve para "una por día" y para que
  -- alguien pueda reconocerse en la tabla, no para identificar a una persona.
  dispositivo uuid not null,
  nombre text not null check (char_length(nombre) between 1 and 24),

  -- La partida, en crudo. Es la prueba: cualquiera puede reproducirla.
  seed bigint not null,
  club_id text not null,
  decisiones smallint[] not null check (array_length(decisiones, 1) between 1 and 400),

  -- Recalculado por el servidor, nunca aceptado del cliente.
  puntaje integer not null check (puntaje >= 0),
  temporadas smallint not null,
  titulos smallint not null,
  final text not null,

  -- Fecha de la Presidencia del Día si esta partida es la del día; null si es
  -- una partida libre. Es lo que separa los dos rankings.
  fecha_diaria date,

  creada_en timestamptz not null default now()
);

-- Una sola entrada por dispositivo y por día en el ranking diario. Las partidas
-- libres no tienen tope: el ranking global es el de la mejor de todas.
create unique index if not exists presidencias_una_por_dia
  on presidencias (dispositivo, fecha_diaria)
  where fecha_diaria is not null;

-- Las dos únicas consultas que existen: top del día y top histórico.
create index if not exists presidencias_ranking_diario
  on presidencias (fecha_diaria, puntaje desc)
  where fecha_diaria is not null;

create index if not exists presidencias_ranking_global
  on presidencias (puntaje desc)
  where fecha_diaria is null;

comment on table presidencias is
  'Presidencias enviadas al ranking. El puntaje lo recalcula el servidor reproduciendo la partida; nunca se acepta del cliente.';
