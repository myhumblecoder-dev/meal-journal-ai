# PRD — meal-journal-ai

*Scope anchor only. Keeps stories inside the MVP. Single-user food diary: type what you ate, it's timestamped.*

---

## 1. Problem

Keeping track of what you ate throughout the day is tedious with existing apps. The user wants a minimal personal food diary: type a free-text entry, it gets auto-timestamped, and they can browse or search history.

---

## 2. Functional requirements

| ID | Requirement |
|---|---|
| FR-1 | User can submit a free-text entry; the app persists it with a server-assigned timestamp. |
| FR-2 | Home page displays the most recent entries in reverse-chronological order. |
| FR-3 | History page lists all entries reverse-chronologically with a keyword and/or date filter. |

---

## 3. Non-functional requirements

- **Stack:** Next.js 16 / App Router / TypeScript / Prisma + PostgreSQL / Server Actions / Tailwind + shadcn/ui / Vitest.
- **Single-user:** no multi-tenancy, no auth, no session management.
- **Performance:** pages render server-side; no client-side data fetching beyond form submission.
- **Test coverage:** every component with user-facing behaviour has a co-located `*.test.tsx`; CI must pass lint + build + test before merge.

---

## 4. MVP scope (in)

- Free-text entry creation with auto timestamp.
- Home page: entry form + recent entries list.
- History page: full reverse-chron list + keyword/date filter.
- Prisma + PostgreSQL persistence.
- Zod validation on all server actions.

---

## 5. Out of scope

- Calorie / macro tracking or nutritional analysis.
- Photo or voice logging.
- Multi-user accounts or authentication.
- Reminders or notifications.
- Mobile-native app (web only).
- AI-powered features (v1 is pure logging).
