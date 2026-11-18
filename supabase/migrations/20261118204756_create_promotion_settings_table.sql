/*
# Create promotion settings table

1. Plain-English summary
Adds a single-row settings table that controls the Grant Readiness Audit pricing
promotion. The website owner can change promotion dates, promotional price, and
regular price from the admin dashboard without editing code. The checkout edge
function reads this table to decide the actual charged price, so pricing is
enforced on the server and cannot be bypassed in the browser.

2. New Tables
- `promotion_settings`
  - `id` (integer, primary key) - always 1; enforces a single settings row.
  - `promo_enabled` (boolean) - master switch for the promotion.
  - `promo_price_cents` (integer) - promotional price in cents (0 = free).
  - `regular_price_cents` (integer) - regular price in cents ($97 = 9700).
  - `promo_starts_at` (timestamptz) - promotion start (Nov 18, 2026, 12:00 am ET).
  - `promo_ends_at` (timestamptz) - promotion end (Jan 31, 2027, 11:59 pm ET).
  - `promo_name` (text) - display name of the promotion.
  - `updated_at` (timestamptz) - last update time.

3. Security
- RLS enabled.
- Policy: anon and authenticated may SELECT the settings row (the site needs to
  show the current price/promo status; the row contains no secrets).
- No INSERT/UPDATE/DELETE for anon or authenticated: only the service_role
  (used by the admin settings update path and edge functions) can modify it.
- GRANT: SELECT to anon, authenticated; full privileges to service_role.

4. Important notes
- Times are stored in UTC and correspond to America/New_York:
  promo start = 2026-11-18 00:00 EST (UTC-5) = 2026-11-18T05:00:00Z
  promo end   = 2027-01-31 23:59:59 EST (UTC-5) = 2027-02-01T04:59:59Z
- The single seeded row uses a fixed id of 1 so it is stable across rebuilds.
*/

CREATE TABLE IF NOT EXISTS promotion_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  promo_enabled boolean NOT NULL DEFAULT true,
  promo_price_cents integer NOT NULL DEFAULT 0,
  regular_price_cents integer NOT NULL DEFAULT 9700,
  promo_starts_at timestamptz NOT NULL DEFAULT '2026-11-18T05:00:00Z',
  promo_ends_at timestamptz NOT NULL DEFAULT '2027-02-01T04:59:59Z',
  promo_name text NOT NULL DEFAULT 'Get Grant Ready for 2027 — FREE!',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO promotion_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE promotion_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON promotion_settings TO anon, authenticated;
GRANT ALL ON promotion_settings TO service_role;

DROP POLICY IF EXISTS "Public can read promotion settings" ON promotion_settings;
CREATE POLICY "Public can read promotion settings"
ON promotion_settings FOR SELECT
TO anon, authenticated
USING (true);
