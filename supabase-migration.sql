-- Drop existing tables if needed (uncomment to reset)
-- DROP TABLE IF EXISTS public.testimonials CASCADE;
-- DROP TABLE IF EXISTS public.trips CASCADE;
-- DROP TABLE IF EXISTS public.rental_options CASCADE;
-- DROP TABLE IF EXISTS public.cars CASCADE;
-- DROP TABLE IF EXISTS public.motorcycles CASCADE;
-- DROP TABLE IF EXISTS public.slides CASCADE;
-- DROP TABLE IF EXISTS public.contact_info CASCADE;
-- DROP TABLE IF EXISTS public.bookings CASCADE;

-- 1️⃣ Motorcycles
create table public.motorcycles (
  id text primary key,
  name text not null,
  type text,
  brand text,
  price_per_day numeric,
  image_url text,
  description text,
  engine text,
  power text,
  seat_height text,
  weight text,
  mileage text,
  last_service text,
  notes text
);

-- 2️⃣ Cars
create table public.cars (
  id text primary key,
  name text not null,
  type text,
  brand text,
  price_per_day numeric,
  image_url text,
  description text,
  engine text,
  drive text,
  seats text,
  fuel text,
  mileage text,
  last_service text,
  notes text
);

-- 3️⃣ Rental options
create table public.rental_options (
  id text primary key,
  name text not null,
  price_per_day numeric,
  type text,
  description text
);

-- 4️⃣ Trips
create table public.trips (
  id text primary key,
  title text not null,
  subtitle text,
  description text,
  image_url text,
  price_per_person numeric,
  distance text,
  recommended_bike text,
  state text
);

-- 5️⃣ Testimonials
create table public.testimonials (
  id text primary key,
  author text not null,
  content text not null,
  image_url text,
  rating integer
);

-- 6️⃣ Slides (home carousel)
create table public.slides (
  id text primary key,
  image_url text not null,
  caption text,
  heading text,
  subtext text,
  button_text text,
  button_link text
);

-- 7️⃣ Company settings
create table public.company_settings (
  id text primary key,
  key text unique not null,
  value text
);

-- 8️⃣ Contact info
create table public.contact_info (
  id text primary key default 'main',
  address text,
  phone1 text,
  phone2 text,
  email1 text,
  email2 text,
  hours1 text,
  hours2 text,
  facebook_url text,
  instagram_url text,
  whatsapp_number text
);

-- 9️⃣ Bookings
create table public.bookings (
  id text primary key,
  created_at timestamptz default now() not null,
  status text default 'pending',
  vehicle_type text,
  vehicle_id text,
  vehicle_name text,
  vehicle_price_per_day numeric,
  vehicle_image_url text,
  pickup_date date,
  return_date date,
  pickup_time text,
  return_time text,
  total_days integer,
  total_cost numeric,
  options jsonb,
  promo_code text,
  discount_percent numeric,
  original_price numeric,
  first_name text,
  last_name text,
  email text,
  phone text,
  country text,
  license_number text,
  agree_terms boolean,
  admin_note text
);

-- 9️⃣ Availability
create table public.availability (
  id text primary key,
  vehicle_id text not null,
  start_date date not null,
  end_date date not null,
  reason text,
  note text
);

-- 🔟 Pricing Rules
create table public.pricing_rules (
  id text primary key,
  name text not null,
  type text not null,
  impact_type text not null,
  value numeric,
  start_date date,
  end_date date
);

-- 🔟 Promo Codes
create table public.promo_codes (
  code text primary key,
  discount integer not null,
  description text
);

-- 🔟 Invoices & Quotes
create table public.invoices (
  id text primary key,
  type text not null default 'invoice',
  number text not null,
  status text default 'draft',
  created_at text,
  due_date text,
  customer jsonb,
  items jsonb,
  totals jsonb,
  payment jsonb,
  notes text
);

-- Enable Row Level Security
alter table public.motorcycles enable row level security;
alter table public.cars enable row level security;
alter table public.rental_options enable row level security;
alter table public.trips enable row level security;
alter table public.testimonials enable row level security;
alter table public.slides enable row level security;
alter table public.company_settings enable row level security;
alter table public.contact_info enable row level security;
alter table public.bookings enable row level security;
alter table public.availability enable row level security;
alter table public.pricing_rules enable row level security;

alter table public.promo_codes enable row level security;

alter table public.invoices enable row level security;

-- Policies
create policy "Allow public read" on public.motorcycles for select using (true);
create policy "Allow public insert" on public.motorcycles for insert with check (true);
create policy "Allow public update" on public.motorcycles for update using (true);
create policy "Allow public delete" on public.motorcycles for delete using (true);

create policy "Allow public read" on public.cars for select using (true);
create policy "Allow public insert" on public.cars for insert with check (true);
create policy "Allow public update" on public.cars for update using (true);
create policy "Allow public delete" on public.cars for delete using (true);

create policy "Allow public read" on public.rental_options for select using (true);
create policy "Allow public insert" on public.rental_options for insert with check (true);
create policy "Allow public update" on public.rental_options for update using (true);
create policy "Allow public delete" on public.rental_options for delete using (true);

create policy "Allow public read" on public.trips for select using (true);
create policy "Allow public insert" on public.trips for insert with check (true);
create policy "Allow public update" on public.trips for update using (true);
create policy "Allow public delete" on public.trips for delete using (true);

create policy "Allow public read" on public.testimonials for select using (true);
create policy "Allow public insert" on public.testimonials for insert with check (true);
create policy "Allow public update" on public.testimonials for update using (true);
create policy "Allow public delete" on public.testimonials for delete using (true);

create policy "Allow public read" on public.slides for select using (true);
create policy "Allow public insert" on public.slides for insert with check (true);
create policy "Allow public update" on public.slides for update using (true);
create policy "Allow public delete" on public.slides for delete using (true);

create policy "Allow public read" on public.company_settings for select using (true);
create policy "Allow public insert" on public.company_settings for insert with check (true);
create policy "Allow public update" on public.company_settings for update using (true);
create policy "Allow public delete" on public.company_settings for delete using (true);

create policy "Allow public read" on public.contact_info for select using (true);
create policy "Allow public insert" on public.contact_info for insert with check (true);
create policy "Allow public update" on public.contact_info for update using (true);
create policy "Allow public delete" on public.contact_info for delete using (true);

create policy "Allow public read" on public.bookings for select using (true);
create policy "Allow public insert" on public.bookings for insert with check (true);
create policy "Allow public update" on public.bookings for update using (true);
create policy "Allow public delete" on public.bookings for delete using (true);

create policy "Allow public read" on public.availability for select using (true);
create policy "Allow public insert" on public.availability for insert with check (true);
create policy "Allow public update" on public.availability for update using (true);
create policy "Allow public delete" on public.availability for delete using (true);

create policy "Allow public read" on public.pricing_rules for select using (true);
create policy "Allow public insert" on public.pricing_rules for insert with check (true);
create policy "Allow public update" on public.pricing_rules for update using (true);
create policy "Allow public delete" on public.pricing_rules for delete using (true);

create policy "Allow public read" on public.promo_codes for select using (true);
create policy "Allow public insert" on public.promo_codes for insert with check (true);
create policy "Allow public update" on public.promo_codes for update using (true);
create policy "Allow public delete" on public.promo_codes for delete using (true);

create policy "Allow public read" on public.invoices for select using (true);
create policy "Allow public insert" on public.invoices for insert with check (true);
create policy "Allow public update" on public.invoices for update using (true);
create policy "Allow public delete" on public.invoices for delete using (true);
