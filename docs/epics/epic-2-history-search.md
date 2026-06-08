# Epic 2 — History & Search

*Delivers the history page: full reverse-chron list of entries with keyword and date filtering via a client-side SearchBar.*

---

## Story 4 — History page + listEntries action

Create the `/history` route and expose `listEntries` (unbounded) as a server action.

**Depends on:** Story 3

**Files to create:**
- `src/app/history/page.tsx`

**Files to modify:**
- `src/app/actions.ts`

**Acceptance Criteria:**
- `listEntries()` in `src/app/actions.ts` is updated (or a distinct `listAllEntries()` added) to return all entries ordered by `createdAt DESC` without a limit.
- `src/app/history/page.tsx` is a Server Component that calls the action and renders a full reverse-chron list using `EntryList`.
- A nav link from the home page to `/history` (and back) is visible.
- Build passes (`pnpm build`) with no type errors.

---

## Story 5 — searchEntries action + SearchBar component

Add keyword and date filtering to the history page.

**Depends on:** Story 4

**Files to create:**
- `src/components/SearchBar.tsx`
- `src/components/SearchBar.test.tsx`

**Files to modify:**
- `src/app/actions.ts`
- `src/app/history/page.tsx`

**Acceptance Criteria:**
- `searchEntries({ q?: string; date?: string })` server action added to `src/app/actions.ts`; filters by `text ILIKE %q%` when `q` is non-empty, and by `createdAt` date range when `date` (ISO date string `YYYY-MM-DD`) is provided; returns results ordered `createdAt DESC`.
- `SearchBar` is a `"use client"` component; it renders a text input and a date input; on change it calls `searchEntries` via a server action and updates displayed results.
- `src/app/history/page.tsx` integrates `SearchBar` above the entry list; initial render shows all entries (no filter).
- `SearchBar.test.tsx` covers: renders both inputs, triggers search on text input change (mocks `searchEntries`), triggers search on date input change, displays results.
