import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/locales/i18n'
import App from './App.tsx'
import '@fontsource-variable/manrope'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
