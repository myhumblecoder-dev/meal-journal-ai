"use server"

import { db } from "@/lib/db"
import { entryTextSchema } from '@/lib/validation'
import { Prisma } from '@prisma/client'
import type { Entry } from '@prisma/client'

export type ActionResponse = Promise<{ ok: boolean; error?: string }>

export async function createEntry(text: string): ActionResponse {
  // Check for whitespace-only before validation/DB call
  if (!text || text.trim().length === 0) {
    return { ok: false, error: "Text cannot be empty or whitespace-only" }
  }

  const validationResult = entryTextSchema.safeParse(text)

  if (!validationResult.success) {
    // ZodError.issues contains the array of error objects
    const errorMsg = validationResult.error.issues[0]?.message || "Invalid text"
    return { ok: false, error: errorMsg }
  }

  try {
    await db.entry.create({
      data: {
        text: validationResult.data,
      },
    })

    return { ok: true }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create entry"
    return { ok: false, error: errorMsg }
  }
}

export async function listEntries(): Promise<Entry[]> {
  return await db.entry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })
}

export async function listAllEntries(): Promise<Entry[]> {
  return await db.entry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function searchEntries({ q, date }: { q?: string; date?: string }): Promise<Entry[]> {
  const where: Prisma.EntryWhereInput = {}

  if (q && q.trim().length > 0) {
    where.text = {
      contains: q,
      mode: 'insensitive',
    }
  }

  if (date) {
    // Assumption: The date string (YYYY-MM-DD) represents the start of the day in UTC.
    // We filter for entries where createdAt falls within the 24-hour window of that date.
    const startOfDay = new Date(date)
    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)

    where.createdAt = {
      gte: startOfDay,
      lte: endOfDay,
    }
  }

  return await db.entry.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  })
}