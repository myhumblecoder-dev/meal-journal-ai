import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EntryForm } from './EntryForm'

describe('EntryForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('EntryForm renders', async () => {
    const createEntry = vi.fn()
    render(<EntryForm createEntry={createEntry} />)
    expect(screen.getByPlaceholderText('Write your entry...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit Entry' })).toBeInTheDocument()
  })

  it('submitting non-empty text calls createEntry with that text', async () => {
    const createEntry = vi.fn().mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    render(<EntryForm createEntry={createEntry} />)
    const textarea = screen.getByPlaceholderText('Write your entry...')
    await user.type(textarea, 'Hello World')
    await user.click(screen.getByRole('button', { name: 'Submit Entry' }))
    expect(createEntry).toHaveBeenCalledWith('Hello World')
  })

  it('clears textarea field after successful submit', async () => {
    const createEntry = vi.fn().mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    render(<EntryForm createEntry={createEntry} />)
    const textarea = screen.getByPlaceholderText('Write your entry...')
    await user.type(textarea, 'Clear me')
    await user.click(screen.getByRole('button', { name: 'Submit Entry' }))
    await screen.findByPlaceholderText('Write your entry...')
    expect(textarea.value).toBe('')
  })

  it('does not call createEntry for whitespace-only input', async () => {
    const createEntry = vi.fn().mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    render(<EntryForm createEntry={createEntry} />)
    const textarea = screen.getByPlaceholderText('Write your entry...')
    await user.type(textarea, '   ')
    const button = screen.getByRole('button', { name: 'Submit Entry' })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(createEntry).not.toHaveBeenCalled()
  })

  it('displays returned error string when createEntry returns { ok: false }', async () => {
    const errorMsg = 'Error occurred'
    const createEntry = vi.fn().mockResolvedValue({ ok: false, error: errorMsg })
    const user = userEvent.setup()
    render(<EntryForm createEntry={createEntry} />)
    const textarea = screen.getByPlaceholderText('Write your entry...')
    await user.type(textarea, 'Trigger error')
    await user.click(screen.getByRole('button', { name: 'Submit Entry' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(errorMsg)
  })
})
