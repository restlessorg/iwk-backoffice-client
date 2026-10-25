import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArrowUpDown } from 'lucide-react'
import { Select } from './Select'
import type { SelectItem } from './Select.types'

const sortItems: SelectItem<string>[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'total-desc', label: 'Highest total' },
  { value: 'rate-desc', label: 'Highest tax rate', disabled: true },
]

const trigger = () => screen.getByRole('combobox')

async function open() {
  const user = userEvent.setup()
  await user.click(trigger())
  await screen.findByRole('listbox')
  return user
}

describe('Select', () => {
  it('shows the placeholder and is labelled by the visible label', () => {
    render(
      <Select items={sortItems} label='Sort by' placeholder='Choose order' />,
    )

    expect(trigger()).toHaveAccessibleName('Sort by')
    expect(trigger()).toHaveTextContent('Choose order')
  })

  it('uses aria-label when there is no visible label', () => {
    render(<Select items={sortItems} aria-label='Sort orders' />)

    expect(trigger()).toHaveAccessibleName('Sort orders')
  })

  it('shows the label of the selected value', () => {
    render(<Select items={sortItems} defaultValue='oldest' aria-label='Sort' />)

    expect(trigger()).toHaveTextContent('Oldest first')
  })

  it('opens the menu and selects an option with the mouse', async () => {
    const onValueChange = vi.fn()
    render(
      <Select
        items={sortItems}
        aria-label='Sort'
        onValueChange={onValueChange}
      />,
    )

    const user = await open()
    expect(screen.getAllByRole('option')).toHaveLength(sortItems.length)

    await user.click(screen.getByRole('option', { name: 'Highest total' }))

    expect(onValueChange).toHaveBeenCalledWith('total-desc')
    await waitFor(() => expect(trigger()).toHaveTextContent('Highest total'))
  })

  it('can be used with the keyboard', async () => {
    const onValueChange = vi.fn()
    render(
      <Select
        items={sortItems}
        defaultValue='newest'
        aria-label='Sort'
        onValueChange={onValueChange}
      />,
    )
    const user = userEvent.setup()

    trigger().focus()
    await user.keyboard('{Enter}')
    await screen.findByRole('listbox')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(onValueChange).toHaveBeenCalledWith('oldest')
  })

  it('does not select a disabled option', async () => {
    const onValueChange = vi.fn()
    render(
      <Select
        items={sortItems}
        aria-label='Sort'
        onValueChange={onValueChange}
      />,
    )

    const user = await open()
    const disabled = screen.getByRole('option', { name: 'Highest tax rate' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')

    await user.click(disabled)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('marks the selected option', async () => {
    render(<Select items={sortItems} defaultValue='oldest' aria-label='Sort' />)

    await open()

    expect(
      screen.getByRole('option', { name: 'Oldest first' }),
    ).toHaveAttribute('aria-selected', 'true')
    expect(
      screen.getByRole('option', { name: 'Newest first' }),
    ).toHaveAttribute('aria-selected', 'false')
  })

  it('follows the controlled value', () => {
    const { rerender } = render(
      <Select items={sortItems} value='newest' aria-label='Sort' />,
    )
    expect(trigger()).toHaveTextContent('Newest first')

    rerender(<Select items={sortItems} value='oldest' aria-label='Sort' />)
    expect(trigger()).toHaveTextContent('Oldest first')
  })

  it('shows the menu heading', async () => {
    render(<Select items={sortItems} aria-label='Sort' menuLabel='Sort by' />)

    await open()

    expect(screen.getByRole('group', { name: 'Sort by' })).toBeInTheDocument()
  })

  describe('clearable', () => {
    it('shows ✕ only while a value is set and clears it', async () => {
      const onValueChange = vi.fn()
      render(
        <Select
          items={sortItems}
          defaultValue='newest'
          aria-label='Sort'
          placeholder='Sort'
          clearable
          onValueChange={onValueChange}
        />,
      )
      const user = userEvent.setup()

      const clear = screen.getByRole('button', { name: 'Clear selection' })
      expect(trigger().closest('[data-slot="select-control"]')).toHaveAttribute(
        'data-active',
      )

      await user.click(clear)

      expect(onValueChange).toHaveBeenCalledWith(null)
      expect(trigger()).toHaveTextContent('Sort')
      expect(
        screen.queryByRole('button', { name: 'Clear selection' }),
      ).not.toBeInTheDocument()
      expect(
        trigger().closest('[data-slot="select-control"]'),
      ).not.toHaveAttribute('data-active')
      expect(trigger()).toHaveFocus()
    })

    it('uses a custom label for ✕', () => {
      render(
        <Select
          items={sortItems}
          defaultValue='newest'
          aria-label='Sort'
          clearable
          clearLabel='Remove sort'
        />,
      )

      expect(
        screen.getByRole('button', { name: 'Remove sort' }),
      ).toBeInTheDocument()
    })
  })

  it('cannot be opened when disabled', async () => {
    render(<Select items={sortItems} aria-label='Sort' disabled />)
    const user = userEvent.setup()

    expect(trigger()).toHaveAttribute('data-disabled')
    await user.click(trigger())

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows the description, or the error instead of it', () => {
    const { rerender } = render(
      <Select
        items={sortItems}
        label='Sort by'
        description='Applies to the table'
      />,
    )
    expect(trigger()).toHaveAccessibleDescription('Applies to the table')

    rerender(
      <Select
        items={sortItems}
        label='Sort by'
        description='Applies to the table'
        error='Choose how to sort'
      />,
    )
    expect(screen.getByText('Choose how to sort')).toBeInTheDocument()
    expect(screen.queryByText('Applies to the table')).not.toBeInTheDocument()
    expect(trigger().closest('[data-slot="select-control"]')).toHaveAttribute(
      'data-invalid',
    )
  })

  it('passes size, variant and roundness to the styling hooks', () => {
    render(
      <Select
        items={sortItems}
        aria-label='Sort'
        size='sm'
        variant='ghost'
        roundness='rounded'
        icon={<ArrowUpDown />}
        meta='EN'
      />,
    )
    const control = trigger().closest('[data-slot="select-control"]')

    expect(control).toHaveAttribute('data-size', 'sm')
    expect(control).toHaveAttribute('data-variant', 'ghost')
    expect(control).toHaveAttribute('data-roundness', 'rounded')
    expect(trigger()).toHaveTextContent('EN')
    expect(trigger().querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('uses outline, md and pill by default', () => {
    render(<Select items={sortItems} aria-label='Sort' />)
    const control = trigger().closest('[data-slot="select-control"]')

    expect(control).toHaveAttribute('data-size', 'md')
    expect(control).toHaveAttribute('data-variant', 'outline')
    expect(control).toHaveAttribute('data-roundness', 'pill')
  })

  it('formats the selected value with renderValue but keeps labels in the menu', async () => {
    render(
      <Select
        items={sortItems}
        defaultValue='newest'
        aria-label='Sort'
        placeholder='Sort'
        renderValue={(item) => item.label.toUpperCase()}
      />,
    )

    expect(trigger()).toHaveTextContent('NEWEST FIRST')
    await open()
    expect(
      screen.getByRole('option', { name: 'Newest first' }),
    ).toBeInTheDocument()
  })

  describe('hideChevron', () => {
    it('shows only the value when there is no icon', async () => {
      render(
        <Select
          items={sortItems}
          defaultValue='newest'
          aria-label='Sort'
          hideChevron
        />,
      )
      const control = trigger().closest('[data-slot="select-control"]')

      expect(trigger()).toHaveTextContent('Newest first')
      expect(trigger().querySelector('svg')).toBeNull()
      expect(control).toHaveAttribute('data-bare')
      await open()
    })

    it('keeps the icon and the usual padding when an icon is given', () => {
      render(
        <Select
          items={sortItems}
          aria-label='Sort'
          icon={<ArrowUpDown />}
          hideChevron
        />,
      )
      const control = trigger().closest('[data-slot="select-control"]')

      expect(trigger().querySelectorAll('svg')).toHaveLength(1)
      expect(control).not.toHaveAttribute('data-bare')
    })
  })
})
