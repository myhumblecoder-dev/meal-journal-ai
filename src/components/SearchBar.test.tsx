import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SearchBar, type Entry } from './SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('SearchBar renders', async () => {
    const mockSearchEntries = vi.fn().mockResolvedValue([])
    const initialEntries: Entry[] = [{ id: '1', text: 'Test', createdAt: new Date() }]
    const user = userEvent.setup()

    render(<SearchBar initialEntries={initialEntries} searchEntries={mockSearchEntries} />)

    expect(screen.getByLabelText('Search entries')).toBeInTheDocument()
    expect(screen.getByLabelText('Filter by date')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()

    const textInput = screen.getByLabelText('Search entries')
    await user.clear(textInput)
    await user.type(textInput, 'new')
    
    await vi.waitFor(() => {
      expect(mockSearchEntries).toHaveBeenLastCalledWith({ q: 'new', date: undefined })
    })

    const dateInput = screen.getByLabelText('Filter by date')
    await user.type(dateInput, '2024-01-01')

    await vi.waitFor(() => {
      expect(mockSearchEntries).toHaveBeenLastCalledWith({ q: 'new', date: '2024-01-01' })
    })
  })
})