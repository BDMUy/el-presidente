-- El Presidente · rankings
--
-- Dos tablas y nada más. Todo lo que el servidor necesita para verificar un
-- puntaje ya viaja en la fila: con la semilla, el club y el log de decisiones
-- se reproduce la partida entera con el mismo motor determinista que corre en
-- el navegador. El cliente nunca manda un puntaje; manda decisiones.
--
-- No hay tabla de semillas del día a propósito: la partida del día se deriva
-- de la fecha con una función pura, así que guardarla sería una segunda
-- fuente de verdad que puede desincronizarse.

-- ─────────────────────────────────────────────────────────────
-- Presidencias enviadas al ranking
-- ─────────────────────────────────────────────────────────────
create table if not exists public.presidencias (
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

-- Una sola entrada por dispositivo y por día en el ranking diario. Las
-- partidas libres no tienen tope: el ranking global es de la mejor de todas.
create unique index if not exists presidencias_una_por_dia
  on public.presidencias (dispositivo, fecha_diaria)
  where fecha_diaria is not null;

-- Las dos consultas que existen: top del día y top histórico.
create index if not exists presidencias_ranking_diario
  on public.presidencias (fecha_diaria, puntaje desc)
  where fecha_diaria is not null;

create index if not exists presidencias_ranking_global
  on public.presidencias (puntaje desc);

-- ─────────────────────────────────────────────────────────────
-- Seguridad
-- ─────────────────────────────────────────────────────────────
-- RLS activo y sin políticas: nadie llega a esta tabla con la clave pública.
-- Todo pasa por las rutas del servidor, que son las únicas que verifican el
-- puntaje reproduciendo la partida. Si el cliente pudiera escribir directo,
-- la verificación no serviría de nada.
alter table public.presidencias enable row level security;

-- Vista de solo lectura para los rankings: expone lo que se muestra y nada
-- más. El log de decisiones no se publica junto al ranking porque invita a
-- copiar la partida del primero en vez de jugarla.
create or replace view public.ranking_diario
with (security_invoker = on) as
  select
    nombre,
    club_id,
    puntaje,
    temporadas,
    titulos,
    final,
    fecha_diaria,
    creada_en
  from public.presidencias
  where fecha_diaria is not null;

comment on table public.presidencias is
  'Presidencias enviadas al ranking. El puntaje lo recalcula el servidor reproduciendo la partida; nunca se acepta del cliente.';
