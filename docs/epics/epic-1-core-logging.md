# Epic 1 — Core Logging

*Delivers the minimum viable food diary: Prisma schema, db singleton, validation, create-entry server action, entry form, and the home page with a live entry list.*

---

## Story 1 — Prisma schema + db singleton

Set up the persistence layer: define the `Entry` model and wire up the Prisma client singleton.

**Depends on:** (none)

**Files to create:**
- `prisma/schema.prisma`
- `src/lib/db.ts`

**Acceptance Criteria:**
- `prisma/schema.prisma` defines the `Entry` model exactly as specified in `docs/architecture.md §2` (id, text, createdAt, @@index).
- `src/lib/db.ts` exports a `db` singleton using the `globalThis` guard pattern; importing it twice in the same process returns the same client instance.
- Running `pnpm prisma generate` succeeds with no errors.
- `DATABASE_URL` is read from environment; no connection string is hard-coded.

---

## Story 2 — Validation + createEntry action + EntryForm component

Add Zod validation, the `createEntry` server action, and the client-side entry form component.

**Depends on:** Story 1

**Files to create:**
- `src/lib/validation.ts`
- `src/app/actions.ts`
- `src/components/EntryForm.tsx`
- `src/components/EntryForm.test.tsx`

**Acceptance Criteria:**
- `src/lib/validation.ts` exports `entryTextSchema` (Zod string, min 1 after trim).
- `createEntry(text: string)` in `src/app/actions.ts` validates with `entryTextSchema`, persists via `db`, and returns `{ ok: true }` or `{ ok: false; error: string }`.
- Whitespace-only input is rejected before any DB call; `createEntry("   ")` returns `{ ok: false }`.
- `EntryForm` renders a `<textarea>` and submit button; on successful submit it calls `createEntry` and clears the field.
- `EntryForm.test.tsx` covers: renders the form, submits non-empty text (mocks `createEntry`), blocks empty/whitespace submit, clears field after success.

---

## Story 3 — EntryList component + home page wired up

Render recent entries on the home page using a server-component list.

**Depends on:** Story 2

**Files to create:**
- `src/components/EntryList.tsx`
- `src/components/EntryList.test.tsx`

**Files to modify:**
- `src/app/actions.ts`
- `src/app/page.tsx`

**Acceptance Criteria:**
- `listEntries()` server action added to `src/app/actions.ts`; returns entries ordered by `createdAt DESC`, limit 20.
- `EntryList` is a Server Component; it accepts an `entries` prop and renders each entry's `text` and formatted `createdAt`.
- `src/app/page.tsx` calls `listEntries()` server-side and renders `<EntryForm />` above `<EntryList entries={...} />`.
- `EntryList.test.tsx` covers: renders an empty-state message when passed `[]`, renders entries in the provided order, formats timestamps.
