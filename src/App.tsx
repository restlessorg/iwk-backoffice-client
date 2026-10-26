import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { ROUTES } from './config/routes'
import { AppLayout } from './layouts/AppLayout'
import { LanguageRoute } from './routes/LanguageRoute'
import { OrdersPage } from './pages/orders/OrdersPage'
import { MapPage } from './pages/map/MapPage'
import { OrderPage } from './pages/order/OrderPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.ORDERS} replace />}
        />
        <Route path='/:lng/' element={<LanguageRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
            <Route path={ROUTES.MAP} element={<MapPage />} />
            <Route path={ROUTES.SELECTED_ORDER} element={<OrderPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
