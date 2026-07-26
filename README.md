# Sweet Disorder Wholesale Portal

Wholesale/stockist ordering portal for Sweet Disorder. Stockists log in, view
their store's order history, and reorder past orders in one click. Multi-branch
companies can switch between locations, each with its own order history and
delivery address.

## Status: Step 1 — UI prototype on mock data

This build uses in-memory mock data (`src/lib/mock/data.ts`) — no real Shopify
or Xero calls yet. It's for reviewing the end-to-end flow: login → dashboard →
branch switcher → order history → reorder → cart/checkout handoff.

Mock login accounts (password `wholesale2026` for all):

| Email | Company | Branches |
| --- | --- | --- |
| `priya@acquisitions.example` | Acquisitions Ltd | Auckland CBD, Wellington, Christchurch, Hamilton |
| `sam@cornerdairy.example` | Corner Dairy & Gifts | Ponsonby (single branch, no switcher shown) |
| `jo@papermoongifts.example` | Paper Moon Gift Co | Nelson (single branch) |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/lib/mock/` — mock companies, branches, users, products, orders (stand-in for Postgres)
- `src/lib/session.ts` — cookie-based session (current user + selected branch)
- `src/lib/actions.ts` — server actions: login, logout, switch branch, reorder
- `src/proxy.ts` — route protection (Next.js 16 "Proxy" convention, formerly middleware)
- `src/app/login/` — sign-in page
- `src/app/(portal)/` — authenticated area: dashboard, order history, order detail, cart/checkout handoff

## Roadmap

1. ✅ Next.js app scaffold with mock data (this build)
2. Postgres schema (companies, branches, users, Shopify/Xero ID mappings)
3. CSV bulk import for ~50 existing wholesale accounts
4. Shopify Admin API — real order history + draft order creation for reorders
5. Xero OAuth2 — per-branch contacts and draft invoice creation
6. Deploy to Vercel + `wholesale.sweetdisorder.co.nz` DNS
