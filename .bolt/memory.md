# Project memory

## Product intent & audience

- Lead generation/contact application with an admin dashboard for managing submitted leads
- Collects lead details: organization type, state, primary challenge (free text), marketing consent
- Admin-facing side includes a dashboard table and CSV/spreadsheet export of all leads
- Likely aimed at organizations or service providers who need to qualify and follow up with inbound leads

## Brand personality & voice

- Professional, service-oriented tone focused on lead qualification and outreach readiness
- Emphasis on clarity and compliance (marketing consent framed as "Opted in" badge)

## Visual design & UX direction

- Admin dashboard uses a table layout for lead listing
- Badges used for boolean/consent fields (e.g. "Opted in" badge for marketing consent)
- CSV export mirrors table columns; free-text fields are safely formatted for spreadsheet use
- Stack: Vite + React, Tailwind CSS, lucide-react icons (no additional UI theme/icon packages)
- JSX + Tailwind utility classes; React hooks for state
- Production-quality, non-cookie-cutter designs expected

## Decisions, constraints & rationale

- Organization type, state, primary challenge, and marketing consent added to both admin table and CSV export for a complete lead picture
- Marketing consent displayed as a badge to distinguish outreach-eligible leads from result-only contacts
- CSV export includes the same columns as the admin table for consistency
- No existing data structures altered when adding new fields; changes are additive
- No extra packages installed; uses only provided stack (Tailwind, lucide-react, React hooks)

## Open questions & assumptions

- Assumes a backend or data source persists leads (storage mechanism not yet detailed)
- Form/page that collects leads from end-users not yet described in detail
- Auth/admin access control for the dashboard not yet established
- Exact routing structure (admin vs. public lead form) unspecified