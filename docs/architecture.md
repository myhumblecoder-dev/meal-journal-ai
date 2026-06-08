# Architecture — meal-journal-ai

*Source of file paths for every story. All `**Files to create/modify:**` paths in `docs/epics/` are drawn from §3 — stories never invent paths.*

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, `src/`, TypeScript) | React 19; RSC by default |
| UI | **Tailwind CSS v4** + **shadcn/ui** (Radix primitives) | utilities + shadcn only; no bespoke CSS files |
| Data | **Prisma ORM** + **PostgreSQL** (Neon serverless) | single connection via singleton |
| Mutations/reads | **Server Actions** (`src/app/actions.ts`) | no REST route handlers |
| Validation | **Zod** (`src/lib/validation.ts`) | validate before any DB write |
| Tests | **Vitest** + **React Testing Library**, co-located `*.test.tsx` | already scaffolded (`vitest.config.ts`) |
| CI/CD | **GitHub Actions** (lint + build + test on PR) → **Vercel** | already scaffolded (`.github/workflows/`) |
| Auth | **None** — single-user app | explicit Brief decision; no session/user model |

---

## 2. Data model — `prisma/schema.prisma`

Single entity. Source of truth for all persistence.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Entry {
  id        String   @id @default(cuid())
  text      String
  createdAt DateTime @default(now())

  @@index([createdAt])
}
```

No `User` / relations — single-user MVP. Free-text `text`; timestamp is server-assigned. The `@@index([createdAt])` supports reverse-chron history and date-range filtering.

---

## 3. File & folder inventory

**The canonical path universe. Every story's `**Files to create/modify:**` paths are drawn from this table — stories never invent paths.**

| Path | Kind | Purpose |
|---|---|---|
| `prisma/schema.prisma` | data | `Entry` model (§2) |
| `src/lib/db.ts` | lib | Prisma client singleton (`globalThis` guard) |
| `src/lib/validation.ts` | lib | Zod schemas (`entryTextSchema`) |
| `src/app/actions.ts` | server | `createEntry`, `listEntries`, `searchEntries` server actions |
| `src/app/layout.tsx` | route | root layout (scaffold file; modify for shell/nav) |
| `src/app/page.tsx` | route | home — log form + recent entries (scaffold file; rewrite) |
| `src/app/history/page.tsx` | route | history & search page |
| `src/components/EntryForm.tsx` | client | text input → `createEntry` |
| `src/components/EntryForm.test.tsx` | test | co-located tests for `EntryForm` |
| `src/components/EntryList.tsx` | server | reverse-chron list renderer |
| `src/components/EntryList.test.tsx` | test | co-located tests for `EntryList` |
| `src/components/SearchBar.tsx` | client | keyword + date filter |
| `src/components/SearchBar.test.tsx` | test | co-located tests for `SearchBar` |
| `src/components/ui/button.tsx` | ui | shadcn Button primitive |
| `src/components/ui/textarea.tsx` | ui | shadcn Textarea primitive |
| `src/components/ui/input.tsx` | ui | shadcn Input primitive |
| `src/components/ui/card.tsx` | ui | shadcn Card primitive |

---

## 4. Conventions (the coder's house rules — applied every story)

- **Data access:** all reads/writes go through **Server Actions** in `src/app/actions.ts`. No `app/api/*` route handlers. Actions `import { db } from "@/lib/db"`.
- **Prisma client:** exactly one, via `src/lib/db.ts` using the `globalThis` singleton pattern (prevents dev hot-reload connection exhaustion).
- **Validation:** every action validates input with a Zod schema from `src/lib/validation.ts` and returns a typed result object `{ ok: boolean; error?: string }`. Never trust raw form input.
- **Components:** Server Components by default; add `"use client"` only for interactivity (`EntryForm`, `SearchBar`). Lists that only render data stay server components (`EntryList`).
- **Styling:** shadcn/ui primitives from `src/components/ui/`, Tailwind utilities for layout. No standalone `.css` files beyond the scaffold's `src/globals.css`.
- **Tests:** co-located `Foo.test.tsx` beside `Foo.tsx`; Vitest + RTL; component tests mock server actions and db, never hit Postgres directly.
- **Imports:** `@/*` alias (configured by scaffold's `tsconfig.json`) for everything under `src/`.
- **shadcn primitives:** install via `pnpm dlx shadcn@latest add <component>` — do not hand-write Radix wrappers.

---

## 5. Data flow (per request)

```
EntryForm ("use client")  ──createEntry(text)──▶  actions.ts ──Zod validate──▶ db (Prisma) ──▶ Entry row
home page (server)  ──listEntries()──▶ actions.ts ──▶ db ──▶ EntryList (server) renders reverse-chron
history page (server) + SearchBar ──searchEntries({q,date})──▶ actions.ts ──▶ db (ILIKE / createdAt range)
```

---

## 6. Epic decomposition (orientation for stories)

The inventory + conventions make story file-lists mechanical:

- **Epic 1 — Core logging (Stories 1–3):**
  - Story 1: Prisma schema + db singleton → `prisma/schema.prisma`, `src/lib/db.ts`
  - Story 2: Validation + `createEntry` + `EntryForm` → `src/lib/validation.ts`, `src/app/actions.ts`, `src/components/EntryForm.tsx`
  - Story 3: `EntryList` on home page → `src/components/EntryList.tsx`, modify `src/app/page.tsx`
- **Epic 2 — History & search (Stories 4–5):**
  - Story 4: History page + `listEntries` → `src/app/history/page.tsx`, modify `src/app/actions.ts`
  - Story 5: `searchEntries` + `SearchBar` → `src/components/SearchBar.tsx`, modify `src/app/history/page.tsx`, modify `src/app/actions.ts`

Each story's `**Files to …**` list is a slice of §3 — which is exactly why DAG nodes stay path-consistent.
