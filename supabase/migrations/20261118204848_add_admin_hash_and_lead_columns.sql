/*
# Add admin password hash to promotion settings and lead capture columns to assessments

1. Plain-English summary
Extends the promotion settings table with a hashed admin password so the website
owner can update promotion pricing and dates from the admin dashboard through a
secure server function, without exposing the password in the browser or letting
the public change pricing. Also adds lead-capture columns to the assessments
table for the free-audit promotion (organization type, state, primary challenge,
and optional newsletter consent).

2. Modified Tables
- `promotion_settings`
  - Adds `admin_password_hash` (text, nullable): SHA-256 hex hash of the admin
    password used by the update-promotion-settings edge function. When null,
    the function bootstraps it from the default password on first use.
    This column is NOT readable by anon/authenticated (column-level grants).
- `assessments`
  - Adds `lead_details` (jsonb, nullable): organization type, state, and primary
    grant readiness challenge collected during lead capture.
  - Adds `marketing_consent` (boolean, default false): optional, unchecked
    newsletter consent. Not required to receive the free audit.

3. Security changes
- Replaces the table-wide SELECT grant on `promotion_settings` with a
  column-restricted grant so the public can read pricing settings but never the
  password hash. service_role retains full access.
- New columns on `assessments` are covered by the table's existing RLS policies
  and grants (jsonb/boolean columns inherit table-level privileges).

4. Important notes
- No existing data is modified or removed.
- The default admin password bootstrap keeps parity with the existing admin
  dashboard password; the owner can change it from the admin dashboard after
  first sign-in.
*/

ALTER TABLE promotion_settings ADD COLUMN IF NOT EXISTS admin_password_hash text;

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS lead_details jsonb,
  ADD COLUMN IF NOT EXISTS marketing_consent boolean NOT NULL DEFAULT false;

REVOKE SELECT ON promotion_settings FROM anon, authenticated;
GRANT SELECT (
  id, promo_enabled, promo_price_cents, regular_price_cents,
  promo_starts_at, promo_ends_at, promo_name, updated_at
) ON promotion_settings TO anon, authenticated;
