import type { Entry } from '@prisma/client';

interface EntryListProps {
  entries: Entry[];
}

export function EntryList({ entries }: EntryListProps) {
  if (entries.length === 0) {
    return <div>No entries yet.</div>;
  }

  return (
    <ul className="space-y-4">
      {entries.map((entry) => (
        <li key={entry.id} className="border-b pb-2">
          <p className="text-sm font-medium">{entry.text}</p>
          <p className="text-xs text-muted-foreground">
            {entry.createdAt.toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}