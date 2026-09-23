-- 7YA Global Content Spine
-- Provider-neutral PostgreSQL / Supabase-compatible portability schema.
-- IMPORTANT: AppDeploy canonical corpus remains runtime source of truth until an explicit migration/reconciliation release.

create table if not exists content_records (
  canonical_id text primary key,
  canonical_date text not null,
  canonical_type text not null,
  primary_world text not null check (primary_world in ('LIFE','SERVICE','CIVIC','BUILD','IMPACT','CULTURE','RECORD')),
  secondary_worlds text[] not null default '{}',
  verification_state text not null,
  visibility text not null check (visibility in ('public','restricted','private')),
  title jsonb not null,
  summary jsonb not null,
  surfaces text[] not null default '{}',
  tags text[] not null default '{}',
  audiences text[] not null default '{}',
  locales text[] not null default array['he','en','ru']::text[],
  distribution_targets text[] not null default '{}',
  cta text not null,
  canonical_api_url text not null,
  source_event jsonb not null,
  source_schema_version integer not null default 2,
  operating_map_schema_version integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists content_sources (
  source_id text primary key,
  canonical_id text not null references content_records(canonical_id) on delete cascade,
  label text not null,
  source_kind text not null,
  platform text,
  canonical_url text not null,
  published_at text,
  is_public boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists content_sources_canonical_id_idx on content_sources(canonical_id);
create index if not exists content_sources_platform_idx on content_sources(platform);

create table if not exists content_metrics (
  id bigserial primary key,
  canonical_id text not null references content_records(canonical_id) on delete cascade,
  metric_type text not null,
  metric_value text not null,
  unit text not null,
  snapshot_date text not null,
  platform text,
  source_url text not null,
  verification_state text not null,
  created_at timestamptz not null default now(),
  unique (canonical_id, metric_type, snapshot_date, source_url, metric_value, unit)
);

create index if not exists content_metrics_canonical_id_idx on content_metrics(canonical_id);

create table if not exists content_distribution (
  id bigserial primary key,
  canonical_id text not null references content_records(canonical_id) on delete cascade,
  platform text not null,
  locale text not null,
  derivative_type text not null,
  external_url text,
  state text not null default 'planned' check (state in ('planned','draft','approved','published','archived','failed')),
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_distribution_canonical_id_idx on content_distribution(canonical_id);
create index if not exists content_distribution_platform_state_idx on content_distribution(platform,state);

create or replace view public_content_operating_map as
select
  canonical_id,
  canonical_date,
  canonical_type,
  primary_world,
  secondary_worlds,
  verification_state,
  title,
  summary,
  audiences,
  locales,
  distribution_targets,
  cta,
  canonical_api_url,
  updated_at
from content_records
where visibility = 'public';

comment on table content_records is 'Portable mirror target for source-bound 7YA canonical events. Not authoritative until migration is explicitly promoted.';
comment on table content_distribution is 'Tracks derivatives and publication state; it must not be treated as permission to auto-publish externally.';
