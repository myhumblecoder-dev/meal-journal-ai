# Meal Journal Ai

## Problem Statement

Keeping a food diary is tedious — most apps demand calorie counts, barcodes, and rigid fields. People just want to jot down what they ate and find it again later.

## Solution Statement

meal-journal-ai is a friction-free meal journal: log each meal as a quick text entry, see your entries newest-first, browse a dedicated history page, and search past meals by keyword or date. Built with Next.js (App Router), Prisma + PostgreSQL, Zod, and shadcn/ui.

Built with Next.js (App Router, TypeScript), Tailwind, Prisma + PostgreSQL, and Zod.

## Getting Started

### Prerequisites

- Node.js + [pnpm](https://pnpm.io)
- [Docker](https://www.docker.com) (for the local Postgres)

### Run it locally

```bash
cp .env.example .env     # DATABASE_URL points at the compose Postgres
docker compose up -d     # start Postgres on localhost:5432
pnpm install
pnpm prisma db push      # apply the Prisma schema
pnpm dev                 # http://localhost:3000
```

Tear down the database with `docker compose down` (add `-v` to wipe its data).
