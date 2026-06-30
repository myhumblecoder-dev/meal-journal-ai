import { db } from "@/lib/db";
import { EntryForm } from "@/components/EntryForm";
import { EntryList } from "@/components/EntryList";
import Link from "next/link";
import { createEntry } from "@/app/actions";

export const dynamic = 'force-dynamic';

async function listEntries() {
  return await db.entry.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export default async function Page() {
  const entries = await listEntries();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 font-sans">
      <nav className="mb-8">
        <Link 
          href="/history" 
          className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          View History
        </Link>
      </nav>

      <main className="mx-auto max-w-2xl space-y-12">
        <section>
          <EntryForm createEntry={createEntry} />
        </section>

        <section>
          <EntryList entries={entries} />
        </section>
      </main>
    </div>
  );
}