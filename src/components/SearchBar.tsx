"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EntryList } from "@/components/EntryList"

export type Entry = {
  id: string
  text: string
  createdAt: Date
}

type SearchParams = {
  q?: string
  date?: string
}

interface SearchBarProps {
  initialEntries: Entry[]
  searchEntries: (params: SearchParams) => Promise<Entry[]>
}

export function SearchBar({ initialEntries, searchEntries }: SearchBarProps) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [query, setQuery] = useState("")
  const [date, setDate] = useState("")

  const handleSearch = async (params: SearchParams) => {
    try {
      const results = await searchEntries(params)
      setEntries(results)
    } catch (err) {
      console.error("Failed to search entries:", err)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    handleSearch({ q: value, date: date || undefined })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDate(value)
    handleSearch({ q: query || undefined, date: value || undefined })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-string-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search-text">Search entries</Label>
          <Input
            id="search-text"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleTextChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="search-date">Filter by date</Label>
          <Input
            id="search-date"
            type="date"
            value={date}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="mt-4">
        <EntryList entries={entries} />
      </div>
    </div>
  )
}
