import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { createEntry } from './actions'

vi.mock('@/lib/db', () => ({
  db: {
    entry: {
      create: vi.fn(),
      createMany: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
    },
  },
}))

describe('actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createEntry with valid text returns { ok: true } and calls db.entry.create exactly once', async () => {
    const validText = 'Hello World'
    vi.mocked(db.entry.create).mockResolvedValue({
      id: '1',
      text: validText,
      createdAt: new Date(Date.UTC(2023, 0, 1)),
    } as import('@prisma/client').Entry)

    const result = await createEntry(validText)

    expect(result).toEqual({ ok: true })
    expect(db.entry.create).toHaveBeenCalledTimes(1)
    expect(db.entry.create).toHaveBeenCalledWith({
      data: { text: validText },
    })
  })

  it('createEntry with whitespace-only text returns { ok: false } and never calls db.entry.create', async () => {
    const whitespaceText = '   '
    const result = await createEntry(whitespaceText)

    expect(result.ok).toBe(false)
    expect(db.entry.create).not.toHaveBeenCalled()
  })
})
