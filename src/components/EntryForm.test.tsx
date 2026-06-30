import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EntryForm } from './EntryForm'
import { useRouter } from 'next/navigation'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('EntryForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('EntryForm calls router.refresh after a successful create — mock `next/navigation` so `useRouter` returns `{ refresh: vi.fn() }`, render, type valid text, submit, await, assert `refresh` was called once', async () => {
    const refresh = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ refresh } as any)
    const createEntry = vi.fn().mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    
    render(<EntryForm createEntry={createEntry} />)
    
    const textarea = screen.getByPlaceholderText('Write your entry...')
    await user.type(textarea, 'New Entry')
    await user.click(screen.getByRole('button', { name: 'Submit Entry' }))
    
    await vi.waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
  })

  it('EntryForm does not call router.refresh on a failed create — `createEntry` returns `{ ok: false, error: nope }`; submit; assert `refresh` was NOT called and the error text renders', async () => {
    const refresh = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ refresh } as any)
    const createEntry = vi.fn().mockResolvedValue({ ok: false, error: 'nope' })
    const user = userEvent.setup()
    
    render(<EntryForm createEntry={createEntry} />)
    
    const textarea = screen.getByPlaceholderText('Write your entry...')
    await user.type(textarea, 'Fail me')
    await user.click(screen.getByRole('button', { name: 'Submit Entry' }))
    
    expect(await screen.findByRole('alert')).toHaveTextContent('nope')
    expect(refresh).not.toHaveBeenCalled()
  })

  it('EntryForm clears the textarea after a successful create', async () => {
    const createEntry = vi.fn().mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    
    render(<EntryForm createEntry={createEntry} />)
    
    const textarea = screen.getByPlaceholderText('Write your entry...')
    await user.type(textarea, 'Clear me')
    await user.click(screen.getByRole('button', { name: 'Submit Entry' }))
    
    await vi.waitFor(() => expect(textarea.value).toBe(''))
  })
})
