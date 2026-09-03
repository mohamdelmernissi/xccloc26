-- Migration: Add display_order column to existing tables
-- Run ONLY the statements below in Supabase SQL Editor

alter table public.motorcycles add column if not exists display_order integer not null default 0;
alter table public.motorcycles add column if not exists state text not null default 'Available';
alter table public.cars add column if not exists display_order integer not null default 0;
alter table public.cars add column if not exists state text not null default 'Available';
alter table public.trips add column if not exists display_order integer not null default 0;

WITH numbered_motorcycles AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM public.motorcycles
  WHERE display_order = 0
)
UPDATE public.motorcycles
SET display_order = numbered_motorcycles.rn
FROM numbered_motorcycles
WHERE public.motorcycles.id = numbered_motorcycles.id;

WITH numbered_cars AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM public.cars
  WHERE display_order = 0
)
UPDATE public.cars
SET display_order = numbered_cars.rn
FROM numbered_cars
WHERE public.cars.id = numbered_cars.id;

WITH numbered_trips AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM public.trips
  WHERE display_order = 0
)
UPDATE public.trips
SET display_order = numbered_trips.rn
FROM numbered_trips
WHERE public.trips.id = numbered_trips.id;

-- ============================================================
-- 6. PROMO CODES TABLE
-- ============================================================
create table if not exists public.promo_codes (
  code text primary key,
  discount integer not null,
  discount_type text not null default 'percentage',
  description text
);

alter table public.slides add column if not exists display_order integer not null default 0;

WITH numbered_slides AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM public.slides
  WHERE display_order = 0
)
UPDATE public.slides
SET display_order = numbered_slides.rn
FROM numbered_slides
WHERE public.slides.id = numbered_slides.id;

NOTIFY pgrst, 'reload schema';

-- ============================================================
-- 7. PRICING RULES TABLE
-- ============================================================
create table if not exists public.pricing_rules (
  id text primary key,
  name text not null,
  type text not null,
  impact_type text not null,
  value numeric not null,
  start_date text,
  end_date text,
  vehicle_ids text[] default '{}'
);

alter table if exists public.pricing_rules
  add column if not exists vehicle_ids text[] default '{}';

alter table if exists public.invoices
  add column if not exists booking_id text;

NOTIFY pgrst, 'reload schema';
