// jsdom has no window.matchMedia. This stub answers every query with the same value,
// which tests switch with setMatchMedia(true) to render the desktop layout.
let matches = false
const listeners = new Set<() => void>()

export function setMatchMedia(value: boolean) {
  matches = value
  listeners.forEach((listener) => listener())
}

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: (media: string): MediaQueryList =>
    ({
      media,
      get matches() {
        return matches
      },
      onchange: null,
      addEventListener: (_: string, listener: () => void) =>
        listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) =>
        listeners.delete(listener),
      addListener: (listener: () => void) => listeners.add(listener),
      removeListener: (listener: () => void) => listeners.delete(listener),
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList,
})
