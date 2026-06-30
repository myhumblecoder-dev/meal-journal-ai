import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EntryList } from './EntryList'

describe('EntryList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('EntryList renders the text No entries yet. when passed an empty array', async () => {
    render(<EntryList entries={[]} />)
    expect(screen.getByText('No entries yet.')).toBeInTheDocument()
  })

  it('EntryList renders each entry\'s text when passed a populated array', async () => {
    const entries = [
      { id: '1', text: 'First entry', createdAt: new Date('2026-01-01T00:00:00Z') },
      { id: '2', text: 'Second entry', createdAt: new Date('2026-01-02T00:00:00Z') },
    ]
    render(<EntryList entries={entries} />)
    expect(screen.getByText('First entry')).toBeInTheDocument()
    expect(screen.getByText('Second entry')).toBeInTheDocument()
  })

  it('EntryList renders entries in the provided order', async () => {
    const entries = [
      { id: '1', text: 'A', createdAt: new Date('2026-01-01T00:00:00Z') },
      { id: '2', text: 'B', createdAt: new Date('2026-01-02T00:00:00Z') },
      { id: '3', text: 'C', createdAt: new Date('2026-01-03T00:00:00Z') },
    ]
    render(<EntryList entries={entries} />)
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[0]).toHaveTextContent('A')
    expect(listItems[1]).toHaveTextContent('B')
    expect(listItems[2]).toHaveTextContent('C')
  })

  it('EntryList formats createdAt via toLocaleDateString (rendered date has no T from an ISO string)', async () => {
    const date = new Date('2026-06-08T15:30:00Z')
    const expectedDate = date.toLocaleDateString()
    const entries = [
      { id: '1', text: 'Formatted date test', createdAt: date },
    ]
    render(<EntryList entries={entries} />)
    // Check that the date string exists and does not contain the ISO 'T' separator
    expect(screen.getByText(expectedDate)).toBeInTheDocument()
    expect(screen.queryByText(/T/)).toBeNull()
  })
}) 