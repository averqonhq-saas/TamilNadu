# Build Tamil Nadu

**What should we build for Tamil Nadu?**

A citizen-driven technology initiative that collects ideas from people across Tamil Nadu, lets Tamil Nadu vote on the best ideas, and builds the winning solution.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account and project
- (Optional) A [Resend](https://resend.com) account for emails

### 1. Clone and install

```bash
git clone https://github.com/your-org/build-tamilnadu
cd build-tamilnadu
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — from your Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` — from your Supabase project settings (keep secret)
- `NEXT_PUBLIC_SITE_URL` — your production domain (e.g., `https://buildtamilnadu.in`)

### 3. Set up the database

Go to your Supabase project → SQL Editor and run the migration:

```bash
# Copy the content of supabase/migrations/001_initial_schema.sql and paste into the SQL editor
```

This will create all tables, triggers, indexes, and seed the category data.

### 4. Create an admin user

1. In Supabase → Auth → Users, invite your admin email.
2. In Supabase → SQL Editor, run:

```sql
INSERT INTO admin_users (email, role) 
VALUES ('your@email.com', 'ADMIN');
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── (public pages)     # Landing, submit, ideas, how-it-works, about
│   ├── admin/             # Auth-protected admin dashboard
│   ├── api/               # API routes (ideas, stats, admin)
│   └── success/[id]/      # Post-submission success page
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── home/              # Landing page sections
│   ├── submit/            # 5-step submission flow + voice input
│   ├── ideas/             # Public idea board
│   ├── admin/             # Admin components
│   └── partner/           # Partner contact form
├── lib/
│   ├── supabase/          # Supabase client (browser + server)
│   ├── constants/         # Districts, categories, campaign status
│   ├── validations/       # Zod schemas
│   └── utils.ts           # Utility functions
├── types/
│   └── database.ts        # TypeScript types for Supabase schema
└── supabase/
    └── migrations/        # SQL migrations
```

---

## Campaign Phases

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | **Active** | Idea collection |
| Phase 2 | Upcoming | Admin review & moderation |
| Phase 3 | Future | Public voting |
| Phase 4 | Future | Build the winning idea |

The campaign status is controlled from the Admin → Campaign Settings page.

---

## Admin Dashboard

Access at `/admin/login`. Authentication uses Supabase Magic Link (email only — no passwords).

Admin roles:
- **ADMIN** — Full control over all settings
- **REVIEWER** — Can moderate ideas but cannot change campaign settings
- **EDITOR** — Can manage public content

---

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + custom CSS design tokens
- **Database**: Supabase (PostgreSQL with Row-Level Security)
- **Auth**: Supabase Auth (Magic Link)
- **Voice Input**: Web Speech API (browser-native)
- **Deployment**: Vercel

---

## Disclaimer

Build Tamil Nadu is an **independent technology initiative** by WeDigi. It is not an official government platform and does not represent or speak on behalf of any political party or government department.

---

## License

All rights reserved. WeDigi © 2026.
