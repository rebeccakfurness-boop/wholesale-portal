# Sweet Disorder Wholesale Portal

Wholesale/stockist ordering portal for Sweet Disorder. Stockists log in, view
their store's order history, and reorder past orders in one click. Multi-branch
companies can switch between locations, each with its own order history and
delivery address.

## Status: Step 2 — Postgres schema added (app still runs on mock data)

The UI (`src/app/(portal)/`) still runs on in-memory mock data
(`src/lib/mock/data.ts`) — no real Shopify or Xero calls yet, and the app
isn't wired to the database yet either. This step adds the schema/migrations
layer (`src/lib/db/`) so it's ready to receive the CSV import in step 3.

Mock login accounts (password `wholesale2026` for all):

| Email | Company | Branches |
| --- | --- | --- |
| `priya@acquisitions.example` | Acquisitions Ltd | Auckland CBD, Wellington, Christchurch, Hamilton |
| `sam@cornerdairy.example` | Corner Dairy & Gifts | Ponsonby (single branch, no switcher shown) |
| `jo@papermoongifts.example` | Paper Moon Gift Co | Nelson (single branch) |

## Database

Schema lives in `src/lib/db/schema.ts` (Drizzle ORM), migrations in `drizzle/`.

1. Provision a Postgres database — either [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (Storage tab in your Vercel project) or [Supabase](https://supabase.com/dashboard) both work; the schema is plain Postgres with no vendor-specific features.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to the connection string.
3. Run `npm run db:migrate` to apply the schema.

Tables:
- **companies** — one row per wholesale account.
- **branches** — one row per delivery location; carries `delivery_address`, plus the `shopify_customer_id` / `shopify_customer_email` and `xero_contact_id` mapping columns used by later steps. A company with one location just has one branch row.
- **users** — login scoped to a company (not a branch) — a user can see every branch under their company, matching the branch-switcher UX from step 1.

`npm run db:generate` creates a new migration after schema changes; `npm run db:studio` opens Drizzle's local data browser against whatever `DATABASE_URL` points to.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/lib/mock/` — mock companies, branches, users, products, orders (what the UI actually reads from today)
- `src/lib/db/` — Drizzle schema + client for the real Postgres database (not yet wired into the UI)
- `src/lib/session.ts` — cookie-based session (current user + selected branch)
- `src/lib/actions.ts` — server actions: login, logout, switch branch, reorder
- `src/proxy.ts` — route protection (Next.js 16 "Proxy" convention, formerly middleware)
- `src/app/login/` — sign-in page
- `src/app/(portal)/` — authenticated area: dashboard, order history, order detail, cart/checkout handoff

## Roadmap

1. ✅ Next.js app scaffold with mock data
2. ✅ Postgres schema (companies, branches, users, Shopify/Xero ID mappings) — this build
3. CSV bulk import for ~50 existing wholesale accounts
4. Shopify Admin API — real order history + draft order creation for reorders
5. Xero OAuth2 — per-branch contacts and draft invoice creation
6. Deploy to Vercel + `wholesale.sweetdisorder.co.nz` DNS
