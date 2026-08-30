-- ============================================================
-- SEED DATA — Generated from data.js defaults
-- Run this in Supabase SQL Editor after running supabase-migration.sql
-- ============================================================

-- ============================================================
-- 1. MOTORCYCLES
-- ============================================================
INSERT INTO public.motorcycles (id, name, type, price_per_day, image_url, engine, power, seat_height, weight) VALUES
  ('KTM390AdventureR',          'KTM 390 Adventure R',           'Adventure', 79,  '/images/logo/motocycles/ktm.webp',                        '399 cc',  '45 ch',    '870 mm', '176 kg'),
  ('CFMOTO450MT',               'CF MOTO 450 MT',                'Adventure', 75,  '/images/logo/motocycles/CF MOTO 450 MT.webp',             '449 cc',  '43.5 ch',  '820 mm', '190 kg'),
  ('Royal-Enfield-Himalayan-450','Royal Enfield Himalayan 450',  'Adventure', 75,  '/images/logo/motocycles/himalayan.webp',                  '452 cc',  '40 ch',    '825 mm', '199 kg'),
  ('CFMOTO800MT',               'CF MOTO 800 MT Explorer',       'Adventure', 99,  '/images/logo/motocycles/CF MOTO 800 MT Explorer.webp',    '799 cc',  '95 ch',    '825 mm', '220 kg'),
  ('cf-moto-mtx-800',           'CF MOTO 800 MTX',               'Adventure', 109, '/images/logo/motocycles/mtx.webp',                        '799 cc',  '94 ch',    '870 mm', '196 kg'),
  ('voge800Rally',              'Voge 800 Rally',                 'Adventure', 99,  '/images/logo/motocycles/Voge 800 Rally.webp',             '799 cc',  '95 ch',    '915 mm', '213 kg'),
  ('Kove-450-Rally',            'Kove 450 Rally',                 'Adventure', 179, '/images/logo/motocycles/kove.webp',                       '449 cc',  '42 ch',    '960 mm', '150 kg'),
  ('Kove-800-Rally',            'Kove 800 Rally',                 'Adventure', 129, '/images/logo/motocycles/kove800.webp',                    '799 cc',  '95 ch',    '895 mm', '176 kg'),
  ('yamaha-tenere-700',         'Yamaha Ténéré 700',             'Adventure', 129, '/images/logo/motocycles/Yamaha Ténéré 700.webp',          '689 cc',  '72 ch',    '875 mm', '204 kg'),
  ('kawasaki-z-900',            'Kawasaki Z 900',                 'Sport',     129, '/images/logo/motocycles/z900.webp',                       '948 cc',  '120 ch',   '~820 mm','210 kg'),
  ('Hondaxadv750',              'Honda X-ADV 750',                'Scooter',   119, '/images/logo/motocycles/Honda X-ADV 750.webp',            '745 cc',  '58.6 ch',  '820 mm', '226 kg'),
  ('vespa-primavera-50',        'Vespa Primavera 50',             'Scooter',   19,  '/images/logo/motocycles/Vespa Primavera 50.webp',         '49 cc',   '3.2 ch',   '790 mm', '130 kg'),
  ('cfmoto-zforce-z10',         'CFMoto ZForce Z10',              'Buggy',     499, '/images/logo/motocycles/zf.webp',                         '998 cc',  '143 ch',   '-',      '955 kg')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 2. CARS
-- ============================================================
INSERT INTO public.cars (id, name, type, price_per_day, image_url, engine, drive, seats, fuel) VALUES
  ('dacia-logan',       'Dacia Logan',               'Sedan',   39,  '/images/car/lg.webp',     '1.0L', 'FWD', '5', 'Diesel'),
  ('peugeot-208',       'Peugeot 208',               'Hatchback',39, '/images/car/208.webp',    '1.2L', 'FWD', '5', 'Diesel'),
  ('dacia-duster',      'Dacia Duster',               'SUV',     49,  '/images/car/dca.webp',    '1.5L', '4x4', '5', 'Diesel'),
  ('dacia-duster-2',    'Dacia Duster + Mecanic',     'SUV',     179, '/images/car/asdc.png',    '1.5L', '4x4', '5', 'Diesel'),
  ('peugeot-landtrek',  'Peugeot Landtrek + Mecanic', 'Pickup',  229, '/images/car/aspgt.png',   '1.9L', '4x4', '5', 'Diesel'),
  ('nissan-navara',     'Nissan Navarra + Mecanic',   'Pickup',  229, '/images/car/asnis.png',   '2.3L', '4x4', '5', 'Diesel')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 3. RENTAL OPTIONS
-- ============================================================
INSERT INTO public.rental_options (id, name, price_per_day, type, description) VALUES
  ('helmet',     'Helmet Rental',   0,  'free',        'High-quality helmet'),
  ('gloves',     'Gloves Rental',   0,  'free',        'High-quality gloves'),
  ('gps',        'GPS Navigation',  15, 'per_rental',  'Portable GPS with preloaded Morocco maps'),
  ('side-cases', 'Side Cases',      20, 'per_rental',  'Waterproof luggage cases for your belongings'),
  ('insurance',  'Extra Insurance', 25, 'per_day',     'Comprehensive coverage with zero deductible')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 4. TRIPS
-- ============================================================
INSERT INTO public.trips (id, title, description, image_url, distance, recommended_bike, state) VALUES
  ('atlas-mountains',  'High Atlas Mountains Expedition',  'A breathtaking journey through the winding roads and stunning vistas of the Atlas Mountains. Perfect for adventure bikes.',                        '/images/trip/atlas-mountains.jpg',  'Approx. 350km loop',     'Voge 800 Rally',       'Coming Soon'),
  ('essaouira-coast',  'Coastal Ride to Essaouira',        'Enjoy the ocean breeze on this scenic route to the historic and vibrant coastal city of Essaouira.',                                              '/images/trip/essaouira-coast.jpg',  'Approx. 190km one-way', 'Any adventure bike',   'Coming Soon'),
  ('ourika-valley',    'Ourika Valley Day Trip',            'A short but spectacular ride from Marrakech, leading you to the lush green landscapes and waterfalls of the Ourika Valley.',                     '/images/trip/ourika-valley.jpg',    'Approx. 60km one-way',  'Any bike or scooter',  '180 €'),
  ('zagora-desert',    'Gateway to the Desert: Zagora',    'An epic adventure for seasoned riders, crossing mountain passes to reach the desert town of Zagora.',                                            '/images/trip/zagora-desert.jpg',    'Approx. 350km one-way', 'Yamaha Ténéré 700',   'Coming Soon')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 5. TESTIMONIALS
-- ============================================================
INSERT INTO public.testimonials (id, author, content, image_url, rating) VALUES
  ('1', 'Alex Johnson',  'Renting the GS1250 was our Morocco trip. The bike was in perfect condition and the service from RideMarrakech was top-notch. The Atlas Mountains route they recommended was unforgettable!', 'https://picsum.photos/seed/alex/100/100',  5),
  ('2', 'Maria Garcia',  'My partner and I rented a Vespa to explore Marrakech. It was so much fun and super easy to get around the city. The staff were friendly and gave us great tips. Highly recommended!',         'https://picsum.photos/seed/maria/100/100', 5),
  ('3', 'Sam Chen',      'The whole experience was seamless, from booking online to returning the bike. The Honda Africa Twin handled everything we threw at it. Will definitely be back for another adventure.',         'https://picsum.photos/seed/sam/100/100',  5)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 6. PROMO CODES
-- ============================================================
INSERT INTO public.promo_codes (code, discount, discount_type, description) VALUES
  ('XCCLOC20', 20, 'percentage', '20% discount'),
  ('XCCLOC10', 10, 'percentage', '10% discount'),
  ('SAAD7',    7,  'percentage', '7% discount')
ON CONFLICT (code) DO NOTHING;


-- ============================================================
-- 7. PRICING RULES
-- (No default rules — managed via admin panel)
-- ============================================================
