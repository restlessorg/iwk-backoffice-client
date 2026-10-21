import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { MapPage } from '@/pages/map/MapPage'
import { OrderPage } from '@/pages/order/OrderPage'
import { OrdersPage } from '@/pages/orders/OrdersPage'
import { LanguageRoute } from '@/routes/LanguageRoute'
import { setMatchMedia } from '@/test/matchMedia'
import { AppLayout } from '@/layouts/AppLayout'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path='/:lng/' element={<LanguageRoute />}>
          <Route element={<AppLayout />}>
            <Route path='orders' element={<OrdersPage />} />
            <Route path='orders/:id' element={<OrderPage />} />
            <Route path='map' element={<MapPage />} />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

const nav = () => screen.getByRole('navigation', { name: 'Main navigation' })
const toggle = () =>
  screen.getByRole('button', { name: /Collapse sidebar|Expand sidebar/ })
const headerTitle = () =>
  within(screen.getByRole('banner')).getByRole('heading', { level: 1 })

describe('AppLayout (desktop)', () => {
  beforeEach(() => {
    localStorage.clear()
    setMatchMedia(true)
  })
  afterEach(() => setMatchMedia(false))

  it('renders the sidebar, the header with the page title and the page — and no tab bar', () => {
    renderAt('/en/orders')

    const sidebar = screen.getByRole('complementary')
    expect(within(sidebar).getByText('Orders Hub')).toBeInTheDocument()
    expect(within(sidebar).getByText('Demo workspace')).toBeInTheDocument()

    expect(headerTitle()).toHaveTextContent('Orders')
    expect(
      within(screen.getByRole('banner')).getByRole('combobox', {
        name: 'Language',
      }),
    ).toHaveTextContent('English')

    expect(screen.getByRole('main')).toHaveTextContent('Coming soon…')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('navigation')).toHaveLength(1)
  })

  it('marks the current section and shows the page title', () => {
    renderAt('/en/map')

    expect(within(nav()).getByRole('link', { name: 'Map' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(headerTitle()).toHaveTextContent('Map')
  })

  it('shows the order number for an order page', () => {
    renderAt('/en/orders/11223')

    expect(headerTitle()).toHaveTextContent('Order 11223')
    expect(within(nav()).getByRole('link', { name: 'Orders' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('collapses and expands, and remembers the choice', async () => {
    const { unmount } = renderAt('/en/orders')
    const user = userEvent.setup()

    expect(toggle()).toHaveAccessibleName('Collapse sidebar')
    expect(toggle()).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle())

    expect(toggle()).toHaveAccessibleName('Expand sidebar')
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('complementary')).toHaveAttribute('data-collapsed')
    expect(screen.queryByText('Demo workspace')).not.toBeInTheDocument()
    expect(localStorage.getItem('sidebar-collapsed')).toBe('true')

    unmount()
    renderAt('/en/orders')
    expect(toggle()).toHaveAccessibleName('Expand sidebar')

    await user.click(toggle())
    expect(toggle()).toHaveAccessibleName('Collapse sidebar')
    expect(localStorage.getItem('sidebar-collapsed')).toBe('false')
  })

  it('keeps link names when collapsed and shows them in a tooltip', async () => {
    localStorage.setItem('sidebar-collapsed', 'true')
    renderAt('/en/orders')
    const user = userEvent.setup()

    const map = within(nav()).getByRole('link', { name: 'Map' })
    expect(map).toHaveAttribute('href', '/en/map')
    expect(map).not.toHaveTextContent('Map')

    await user.hover(map)

    expect(await screen.findByText('Map', {}, { timeout: 2000 })).toBeVisible()
  })

  it('switches to the mobile layout when the window gets narrow', () => {
    renderAt('/en/orders')
    expect(screen.getByRole('complementary')).toBeInTheDocument()

    act(() => setMatchMedia(false))

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(within(nav()).getAllByRole('link')).toHaveLength(2)
    expect(headerTitle()).toHaveTextContent('Orders')
  })
})
