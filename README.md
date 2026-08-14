# ByMean — Digital Wedding Invitation Platform

A modern, performant Next.js platform for creating and managing digital wedding invitations with RSVP tracking, guest management, analytics, and payment integration.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Status

**Current Phase:** 4 of 6 — ✅ Complete

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 0 | Scaffold, DB schema, Vault | ✅ Done |
| 1 | Template registry + builder | ✅ Done |
| 2 | Public invitation pages | ✅ Done |
| 3 | RSVP + guest manager | ✅ Done |
| 4 | Payments + analytics + QR check-in | ✅ Done |
| 5 | Admin panel + email | 🔄 Next |

## Features

### Phase 4 (Current)
- **Payment Flow** (manual MVP + Tripay scaffold)
  - Publish gating: free tier publishes immediately; paid/premium requires payment
  - Manual bank transfer payment with proof upload
  - Admin approval endpoint for payment verification
  - Tripay API scaffold (active when keys configured)

- **Enhanced Analytics Dashboard**
  - Real-time stat cards: Tamu, Pengunjung, RSVP, Ucapan
  - Trend indicators (up/down/neutral) with color coding
  - Visitor tracking chart (placeholder — awaits views table)
  - Source, device, city analytics (placeholders)

- **QR Check-in System**
  - Per-guest QR code generation (client-side via `qrcode` package)
  - Public check-in endpoint: guest scans → marks checked_in
  - QR modal in guest manager with download & copy link
  - Check-in landing page with success confirmation

### Earlier Phases (Completed)
- 3 starter templates (Classic Islami, Modern Minimal, Floral Sunda)
- Live template preview with builder
- Public invitation page (all sections: cover, countdown, story, events, gallery, streaming, gifts, RSVP, guestbook)
- Guest RSVP & message management
- Gift account tracking (bank, e-wallet, QRIS)
- WhatsApp RSVP links per guest

## Architecture

### Tech Stack
- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API routes, Supabase (PostgreSQL + Auth)
- **Database:** Supabase (RLS policies, real-time)
- **QR Codes:** `qrcode@1.5.4`
- **Payment:** Tripay (scaffolded), manual bank transfer (MVP)

### Key Directories
```
app/
  (auth)/          # Login, register, password reset
  (dashboard)/     # Protected routes: guests, analytics, publish, settings
  (invitation)/    # Public guest pages (subdomain-based)
  api/             # API routes (auth, payments, webhooks, CRUD)
  checkin/         # Public QR check-in landing

components/
  dashboard/       # Dashboard UI (clients + modals)
  invitation/      # Guest-facing invitation sections
  auth/            # Auth UI

lib/
  supabase/        # Supabase client + admin utils
  utils.ts         # Shared helpers (formatIDR, links, etc)

types/
  index.ts         # TypeScript definitions, tier prices, feature flags
```

### Database Schema
- `users` (Supabase auth)
- `profiles` (user metadata, role)
- `weddings` (couple's wedding config)
- `guests` (RSVP guests, link tokens)
- `rsvps` (RSVP responses)
- `messages` (guestbook entries)
- `gift_accounts` (bank, e-wallet, QRIS)
- `payments` (payment records, Tripay refs)
- `invitations` (template assignments)

See `supabase/migrations/0001_initial_schema.sql` for full schema.

## API Routes (Phase 4)

| Route | Method | Purpose |
|-------|--------|---------|
| `POST /api/weddings/[id]/publish` | POST | Publish gating (free→published; paid→pending_payment) |
| `POST /api/payments` | POST | Create manual payment (proof upload) |
| `POST /api/payments/[id]/approve` | POST | Admin verify → mark paid → publish |
| `POST /api/payments/create` | POST | Tripay transaction create (scaffold, inactive without keys) |
| `POST /api/webhook/tripay` | POST | Tripay callback (HMAC verify, inactive without keys) |
| `POST /api/checkin` | POST | Public: mark guest checked_in via token |

Full API documented in `/ProjectWedding/docs/ARCHITECTURE.md` §API Routes.

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional: Tripay (payment gateway)
TRIPAY_API_KEY=...
TRIPAY_PRIVATE_KEY=...
TRIPAY_MERCHANT_CODE=...

# Optional: Email notifications (Phase 5+)
RESEND_API_KEY=...

# Base URL for QR check-in links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Development

### Compile & Build
```bash
npx tsc --noEmit        # Type check
npx next build          # Production build
npm run dev             # Dev server (port 3000)
```

### Testing
- Manual smoke test: visit `/publish` (free tier instant publish), `/guests` (QR modal), `/analytics` (real counts)
- QR check-in: generate QR in guest manager, scan to test `/checkin/[token]`
- Payment flow: click "Terbitkan Undangan" on draft wedding → free publishes; paid/premium shows checkout

### Linting
```bash
npx eslint . --fix
npx prettier --write .
```

## Known Limitations

- **Tripay:** Scaffolded but inactive (no merchant account registration). Routes return 501 "not configured" without env keys.
- **Email Notifications:** Not implemented. Admin approval doesn't send confirmation (Phase 5).
- **Visitor Tracking:** Analytics "Pengunjung" shows placeholder (requires `views` table, blocked by DB constraints).
- **File Upload:** Proof upload uses file input; storage bucket not yet connected (manual entry MVP).
- **Multi-language:** Not implemented (Phase 6).

## Deployment

Designed to deploy on Vercel (recommended) or any Node.js host:

1. Set environment variables in hosting platform
2. `npm run build && npm start`
3. Configure custom domain with Supabase subdomain routing (Phase 5+)

See `ARCHITECTURE.md` §Deployment for details.

## Documentation

- **`/ProjectWedding/docs/ARCHITECTURE.md`** — Technical design, payment flow, RLS policies, API routes
- **`/ProjectWedding/docs/DECISIONS.md`** — Design decisions (tier pricing, template system, etc)
- **`/ProjectWedding/docs/FEATURES.md`** — Feature matrix per tier
- **`/ProjectWedding/docs/ROADMAP.md`** — Phase timeline
- **`/ProjectWedding/docs/Phase 4 Payments + Analytics + QR Check-in.md`** — Phase 4 completion notes

## License

Proprietary. Built for ByMean.
