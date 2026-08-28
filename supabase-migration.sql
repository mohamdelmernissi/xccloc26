-- Migration: Add display_order column to existing tables
-- Run ONLY the statements below in Supabase SQL Editor

alter table public.motorcycles add column if not exists display_order integer not null default 0;
alter table public.cars add column if not exists display_order integer not null default 0;
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
