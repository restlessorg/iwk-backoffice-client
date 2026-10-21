import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
import { ComingSoon } from '@/components/ComingSoon'
import { LanguageRoute } from '@/routes/LanguageRoute'
import { AppLayout } from './AppLayout'

// Page content only — the title is in the header (AppLayout)
function Page() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ComingSoon />
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          style={{
            height: 72,
            borderRadius: 16,
            background: 'var(--bg-surface)',
          }}
        />
      ))}
    </div>
  )
}

/** Renders the layout at a route; `safeArea` simulates a notch / home indicator. */
function Shell({ path, safeArea }: { path: string; safeArea?: boolean }) {
  const style = safeArea
    ? ({
        '--safe-area-top': '47px',
        '--safe-area-bottom': '34px',
      } as CSSProperties)
    : undefined
  return (
    <div style={style}>
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
    </div>
  )
}

const meta = {
  title: 'Layouts/AppLayout/Mobile',
  component: Shell,
  args: { path: '/en/orders', safeArea: false },
  parameters: {
    layout: 'fullscreen',
    viewport: { options: INITIAL_VIEWPORTS },
  },
  globals: { viewport: { value: 'iphone12', isRotated: false } },
} satisfies Meta<typeof Shell>

export default meta
type Story = StoryObj<typeof meta>

export const Orders: Story = {}

export const Map: Story = { args: { path: '/en/map' } }

/** iPhone with a notch: the header moves below the status bar, the tab bar above the home indicator. */
export const WithSafeArea: Story = { args: { safeArea: true } }

export const Ukrainian: Story = { args: { path: '/uk/orders' } }
