"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface EntryFormProps {
  createEntry: (text: string) => Promise<{ ok: boolean; error?: string }>
}

export function EntryForm({ createEntry }: EntryFormProps) {
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedText = text.trim()

    if (!trimmedText) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createEntry(trimmedText)
      if (result.ok) {
        setText("")
      } else {
        setError(result.error || "An error occurred")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Write your entry..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px]"
          disabled={isSubmitting}
        />
        {error && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting || !text.trim()}>
        {isSubmitting ? "Submitting..." : "Submit Entry"}
      </Button>
    </form>
  )
}