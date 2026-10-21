import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import i18n from '@/locales/i18n'
import { MapPage } from '@/pages/map/MapPage'
import { OrderPage } from '@/pages/order/OrderPage'
import { OrdersPage } from '@/pages/orders/OrdersPage'
import { LanguageRoute } from '@/routes/LanguageRoute'
import { AppLayout } from '@/layouts/AppLayout'

function Location() {
  const { pathname, search } = useLocation()
  return <output data-testid='location'>{pathname + search}</output>
}

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
      <Location />
    </MemoryRouter>,
  )
}

const location = () => screen.getByTestId('location')
const nav = () => screen.getByRole('navigation', { name: 'Main navigation' })
const pageTitle = () => screen.getByRole('heading', { level: 1 })

describe('AppLayout (mobile)', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders the header with the page title, the page and the tab bar', () => {
    renderAt('/en/orders')

    const header = screen.getByRole('banner')
    expect(
      within(header).getByRole('heading', { level: 1, name: 'Orders' }),
    ).toBeInTheDocument()
    expect(
      within(header).getByRole('combobox', { name: 'Language' }),
    ).toHaveTextContent('EN')
    expect(screen.getByRole('main')).toHaveTextContent('Coming soon…')
    expect(within(nav()).getAllByRole('link')).toHaveLength(2)
  })

  it('has a single page title and puts it in the document title', () => {
    renderAt('/en/orders/11223')

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(pageTitle()).toHaveTextContent('Order 11223')
    expect(document.title).toBe('Order 11223 · Orders Hub')
  })

  it('links the tabs to the current language', () => {
    renderAt('/en/orders')

    expect(within(nav()).getByRole('link', { name: 'Orders' })).toHaveAttribute(
      'href',
      '/en/orders',
    )
    expect(within(nav()).getByRole('link', { name: 'Map' })).toHaveAttribute(
      'href',
      '/en/map',
    )
  })

  it('marks the current section, including nested pages', () => {
    renderAt('/en/orders/11223')

    expect(within(nav()).getByRole('link', { name: 'Orders' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(
      within(nav()).getByRole('link', { name: 'Map' }),
    ).not.toHaveAttribute('aria-current')
  })

  it('navigates between tabs and updates the title', async () => {
    renderAt('/en/orders')
    const user = userEvent.setup()

    await user.click(within(nav()).getByRole('link', { name: 'Map' }))

    expect(location()).toHaveTextContent('/en/map')
    expect(pageTitle()).toHaveTextContent('Map')
    expect(within(nav()).getByRole('link', { name: 'Map' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('switches the language and keeps the page and query', async () => {
    renderAt('/en/orders?page=3')
    const user = userEvent.setup()

    await user.click(screen.getByRole('combobox', { name: 'Language' }))
    await user.click(await screen.findByRole('option', { name: /Українська/ }))

    await waitFor(() =>
      expect(location()).toHaveTextContent('/uk/orders?page=3'),
    )
    await waitFor(() => expect(i18n.language).toBe('uk'))
    expect(
      screen.getByRole('navigation', { name: 'Основна навігація' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Мова' })).toHaveTextContent(
      'UK',
    )
    expect(pageTitle()).toHaveTextContent('Замовлення')
    expect(screen.getByRole('main')).toHaveTextContent('Незабаром…')
  })
})
