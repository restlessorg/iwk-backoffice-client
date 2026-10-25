import { useCallback, useSyncExternalStore } from 'react'

const supported = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!supported()) return () => {}
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )
  const getSnapshot = () => supported() && window.matchMedia(query).matches

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
