import { useEffect, useState } from 'react'

const STORAGE_KEY = 'sidebar-collapsed'

function read(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(read)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {
      // storage can be unavailable (private mode) — the state just isn't remembered
    }
  }, [collapsed])

  return [collapsed, setCollapsed] as const
}
