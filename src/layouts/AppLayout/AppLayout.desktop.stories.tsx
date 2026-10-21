import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router'
import { expect, userEvent, within } from 'storybook/test'
import { ComingSoon } from '@/components/ComingSoon'
import { LanguageRoute } from '@/routes/LanguageRoute'
import { AppLayout } from './AppLayout'

// Page content only — the title is in the header (AppLayout)
function Page() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <ComingSoon />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            style={{
              height: 112,
              borderRadius: 24,
              background: 'var(--bg-surface)',
            }}
          />
        ))}
      </div>
      <div
        style={{
          height: 640,
          borderRadius: 24,
          background: 'var(--bg-surface)',
        }}
      />
    </div>
  )
}

function Shell({ path }: { path: string }) {
  return (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path='/:lng/' element={<LanguageRoute />}>
          <Route element={<AppLayout />}>
            <Route path='orders' element={<Page />} />
            <Route path='map' element={<Page />} />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

const setCollapsed = (collapsed: boolean) => () => {
  localStorage.setItem('sidebar-collapsed', String(collapsed))
}

/** Desktop layout — shown from 768px. Resize the canvas below 768px to see the mobile layout. */
const meta = {
  title: 'Layouts/AppLayout/Desktop',
  component: Shell,
  args: { path: '/en/orders' },
  parameters: { layout: 'fullscreen' },
  beforeEach: setCollapsed(false),
} satisfies Meta<typeof Shell>

export default meta
type Story = StoryObj<typeof meta>

export const Expanded: Story = {}

export const Collapsed: Story = { beforeEach: setCollapsed(true) }

export const MapSection: Story = { args: { path: '/en/map' } }

export const Ukrainian: Story = { args: { path: '/uk/orders' } }

/** Clicks the toggle: the sidebar collapses to icons, and back. */
export const ToggleSidebar: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse sidebar' }),
    )
    await expect(canvas.getByRole('complementary')).toHaveAttribute(
      'data-collapsed',
    )

    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand sidebar' }),
    )
    await expect(canvas.getByRole('complementary')).not.toHaveAttribute(
      'data-collapsed',
    )
  },
}
