# Sweet Disorder Wholesale Portal

Wholesale/stockist ordering portal for Sweet Disorder. Stockists log in, view
their store's order history, and reorder past orders in one click. Multi-branch
companies can switch between locations, each with its own order history and
delivery address.

## Status: Step 3 — CSV import + admin account management

Customer login is now backed by the real database — the step-1 mock accounts
no longer work. Order history intentionally shows an empty state for every
real account until the Shopify Admin API is wired in (step 4); the account
and branch-switching itself is fully real.

Admin tools live at `/admin`, gated by a single shared password (`ADMIN_PASSWORD`
env var — there's no separate staff-accounts concept, just you):

- **`/admin/import`** — bulk CSV import. Columns: company name, branch name,
  contact email, delivery address, shopify customer email (optional). One row
  per branch — repeat the company name for each of that company's branches to
  share one login across them, or vary the contact email per row if a branch
  should have its own login (it'll still see every branch in its company —
  see "Access model" below). Safe to re-run: matching companies/branches are
  updated in place, existing logins are left untouched, and newly-created
  logins show a one-time temporary password to relay to the contact.
- **`/admin/companies`** — list/add companies; each company page lets you
  rename it, add/edit branches, add a login, and reset a login's password.

## Access model

A login is scoped to a **company**, not a single branch — anyone who can sign
in sees and can switch between every branch under their company. This was a
deliberate choice (confirmed, not a default) for accounts where one buyer
orders across multiple stores. If you later need a login restricted to just
one branch, that needs a schema change (a user↔branch mapping table) and
isn't built yet.

## Database

Schema lives in `src/lib/db/schema.ts` (Drizzle ORM), migrations in `drizzle/`.

1. Provision a Postgres database — either [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (Storage tab in your Vercel project) or [Supabase](https://supabase.com/dashboard) both work; the schema is plain Postgres with no vendor-specific features.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` (and `ADMIN_PASSWORD`, for the admin tools).
3. Run `npm run db:migrate` to apply the schema.

Tables:
- **companies** — one row per wholesale account.
- **branches** — one row per delivery location; carries `delivery_address`, plus the `shopify_customer_id` / `shopify_customer_email` and `xero_contact_id` mapping columns used by later steps. A company with one location just has one branch row.
- **users** — login scoped to a company (see "Access model" above); passwords are bcrypt-hashed, never stored in plain text.

`npm run db:generate` creates a new migration after schema changes; `npm run db:studio` opens Drizzle's local data browser against whatever `DATABASE_URL` points to.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and ADMIN_PASSWORD
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the customer portal,
[http://localhost:3000/admin](http://localhost:3000/admin) for account setup.
There's no seed data — use `/admin/companies` or `/admin/import` to create your
first account.

## Structure

- `src/lib/db/` — Drizzle schema, client, and query helpers for Postgres
- `src/lib/orders.ts` — order history types + accessors; returns an empty placeholder pending the Shopify integration (step 4)
- `src/lib/auth/password.ts` — bcrypt hashing + temp password generation
- `src/lib/session.ts` — customer cookie-based session (current user + selected branch)
- `src/lib/actions.ts` — customer server actions: login, logout, switch branch, reorder
- `src/lib/admin/` — admin session/auth (separate cookie realm from customers), company/branch/user management actions
- `src/lib/import/csv.ts` — CSV parsing + idempotent upsert logic for bulk account import
- `src/proxy.ts` — route protection for both the customer and admin realms (Next.js 16 "Proxy" convention, formerly middleware)
- `src/app/login/`, `src/app/(portal)/` — customer-facing app
- `src/app/admin/` — admin tools (`/admin/login`, `/admin/companies`, `/admin/import`)

## Roadmap

1. ✅ Next.js app scaffold with mock data
2. ✅ Postgres schema (companies, branches, users, Shopify/Xero ID mappings)
3. ✅ CSV bulk import + admin account management — this build
4. Shopify Admin API — real order history + draft order creation for reorders
5. Xero OAuth2 — per-branch contacts and draft invoice creation
6. Deploy to Vercel + `wholesale.sweetdisorder.co.nz` DNS
