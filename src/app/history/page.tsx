import { db } from '@/lib/db'
import { EntryList } from '@/components/EntryList'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function listAllEntries() {
  return await db.entry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function HistoryPage() {
  const entries = await listAllEntries()

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          &larr; Back to Home
        </Link>
      </header>

      <main>
        <EntryList entries={entries} />
      </main>
    </div>
  )
}
