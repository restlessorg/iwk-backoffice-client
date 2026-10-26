import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowUpDown, Calendar, Globe, List, MapPin } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { Select } from './Select'
import type {
  SelectItem,
  SelectRoundness,
  SelectSize,
  SelectVariant,
} from './Select.types'

const sortItems: SelectItem<string>[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'total-desc', label: 'Highest total' },
  { value: 'total-asc', label: 'Lowest total' },
  { value: 'rate-desc', label: 'Highest tax rate' },
]

const perPageItems: SelectItem<number>[] = [10, 25, 50, 100].map((n) => ({
  value: n,
  label: `${n} per page`,
}))

const areaItems: SelectItem<string>[] = [
  { value: 'nyc', label: 'New York City', meta: 'City', icon: <MapPin /> },
  { value: 'erie', label: 'Erie County', meta: 'County', icon: <MapPin /> },
  { value: 'monroe', label: 'Monroe County', meta: 'County', icon: <MapPin /> },
  {
    value: 'onondaga',
    label: 'Onondaga County',
    meta: 'County',
    icon: <MapPin />,
  },
  {
    value: 'westchester',
    label: 'Westchester County',
    meta: 'County',
    icon: <MapPin />,
    disabled: true,
  },
]

const languageItems: SelectItem<string>[] = [
  { value: 'en', label: 'English', meta: 'EN' },
  { value: 'uk', label: 'Українська', meta: 'UA' },
]

const meta = {
  title: 'Components/Select',
  component: Select<string>,
  args: {
    items: sortItems,
    placeholder: 'Sort',
    'aria-label': 'Sort orders',
    size: 'md',
    variant: 'outline',
    roundness: 'pill',
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'inline-radio',
      options: ['outline', 'filled', 'ghost'],
    },
    roundness: { control: 'inline-radio', options: ['pill', 'rounded'] },
    icon: { control: false },
    meta: { control: 'text' },
    items: { control: false },
  },
} satisfies Meta<typeof Select<string>>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { icon: <ArrowUpDown /> },
}

const VARIANTS: SelectVariant[] = ['outline', 'filled', 'ghost']
const SHAPES: SelectRoundness[] = ['pill', 'rounded']
const SIZES: SelectSize[] = ['md', 'sm', 'lg']
const SIZE_PX: Record<SelectSize, number> = { sm: 32, md: 40, lg: 44 }

const tableStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '150px repeat(5, max-content)',
  gap: '16px 24px',
  alignItems: 'center',
}
const headStyle: CSSProperties = { color: 'var(--color-text-secondary)' }

function Cell({ children }: { children: ReactNode }) {
  return <div style={{ minWidth: 170 }}>{children}</div>
}

/** Rows — variant × roundness, columns — state. Hover and Open are interactive: point at or click a select. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 40 }}>
      {SIZES.map((size) => (
        <section key={size}>
          <h3 className='text-md-semibold' style={{ margin: '0 0 16px' }}>
            {size.toUpperCase()} · {SIZE_PX[size]} px
          </h3>
          <div style={tableStyle}>
            <span />
            {['Placeholder', 'Value', 'Active', 'Disabled', 'Error'].map(
              (h) => (
                <span key={h} className='text-xs-semibold' style={headStyle}>
                  {h.toUpperCase()}
                </span>
              ),
            )}
            {VARIANTS.flatMap((variant) =>
              SHAPES.flatMap((roundness) => {
                const common = {
                  ...args,
                  size,
                  variant,
                  roundness,
                  icon: <ArrowUpDown />,
                }
                const row = `${variant}-${roundness}`
                return [
                  <span
                    key={row}
                    className='text-base-medium'
                    style={headStyle}
                  >
                    {variant} · {roundness}
                  </span>,
                  <Cell key={`${row}-placeholder`}>
                    <Select {...common} />
                  </Cell>,
                  <Cell key={`${row}-value`}>
                    <Select {...common} defaultValue='newest' />
                  </Cell>,
                  <Cell key={`${row}-active`}>
                    <Select {...common} defaultValue='newest' clearable />
                  </Cell>,
                  <Cell key={`${row}-disabled`}>
                    <Select {...common} defaultValue='newest' disabled />
                  </Cell>,
                  <Cell key={`${row}-error`}>
                    <Select {...common} invalid />
                  </Cell>,
                ]
              }),
            )}
          </div>
        </section>
      ))}
    </div>
  ),
}

/** Table toolbar: rows per page, sort and an applied filter. */
export const TableToolbar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Select
        items={perPageItems}
        defaultValue={10}
        icon={<List />}
        aria-label='Rows per page'
      />
      <Select
        items={sortItems}
        defaultValue='newest'
        icon={<ArrowUpDown />}
        aria-label='Sort orders'
        menuLabel='Sort by'
      />
      <Select
        items={areaItems}
        placeholder='Area'
        icon={<MapPin />}
        aria-label='Area'
        clearable
      />
      <Select
        items={areaItems}
        defaultValue='nyc'
        icon={<MapPin />}
        aria-label='Area'
        clearable
      />
    </div>
  ),
}

/** Map toolbar and the mobile "Newest first" label use the ghost variant. */
export const Inline: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        width: 'max-content',
        padding: 6,
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-surface)',
      }}
    >
      <Select
        items={sortItems}
        placeholder='Date range'
        icon={<Calendar />}
        aria-label='Date range'
        variant='ghost'
        size='sm'
      />
      <Select
        items={sortItems}
        defaultValue='newest'
        aria-label='Sort orders'
        variant='ghost'
        size='sm'
        roundness='rounded'
      />
    </div>
  ),
}

/** Sidebar language picker: rounded, full width, globe icon and the language code. */
export const LanguagePicker: Story = {
  render: () => (
    <div style={{ width: 216 }}>
      <Select
        items={languageItems}
        defaultValue='en'
        icon={<Globe />}
        meta='EN'
        roundness='rounded'
        aria-label='Language'
        menuLabel='Language'
        fullWidth
      />
    </div>
  ),
}

/** Collapsed sidebar: only the code in a 44px slot — no icon, no chevron. */
export const LanguagePickerCompact: Story = {
  render: () => (
    <div style={{ width: 44 }}>
      <Select
        items={languageItems}
        defaultValue='en'
        renderValue={(item) => item.meta}
        hideChevron
        roundness='rounded'
        aria-label='Language'
        menuLabel='Language'
        fullWidth
      />
    </div>
  ),
}

/** Form field: visible label, helper text and the error state. */
export const FormField: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, width: 320 }}>
      <Select
        items={areaItems}
        label='Jurisdiction'
        placeholder='Choose a county or city'
        description='Used to look up the local tax rate'
        size='lg'
        roundness='rounded'
        fullWidth
      />
      <Select
        items={areaItems}
        label='Jurisdiction'
        placeholder='Choose a county or city'
        error='Choose a jurisdiction to calculate tax'
        size='lg'
        roundness='rounded'
        fullWidth
        required
      />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Select
          key={size}
          {...args}
          size={size}
          icon={<ArrowUpDown />}
          defaultValue='newest'
        />
      ))}
    </div>
  ),
}

/** Opens the menu, picks an option and clears it — runs in the Interactions panel. */
export const PickAndClear: Story = {
  args: {
    items: areaItems,
    icon: <MapPin />,
    placeholder: 'Area',
    'aria-label': 'Area',
    clearable: true,
    menuLabel: 'Area',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox', { name: 'Area' })

    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole('option', { name: /Erie County/ }),
    )
    await expect(args.onValueChange).toHaveBeenCalledWith('erie')
    await waitFor(() => expect(trigger).toHaveTextContent('Erie County'))

    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear selection' }),
    )
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null)
    await expect(trigger).toHaveTextContent('Area')
  },
}
