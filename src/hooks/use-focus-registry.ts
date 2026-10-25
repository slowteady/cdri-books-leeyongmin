import { useRef } from 'react'

export function useFocusRegistry<Key>() {
  const elementsRef = useRef(new Map<Key, HTMLElement>())
  const fallbackElementRef = useRef<HTMLElement | null>(null)

  const registerElement = (key: Key) => (element: HTMLElement | null) => {
    if (!element) return
    elementsRef.current.set(key, element)
    return () => {
      elementsRef.current.delete(key)
    }
  }

  const registerFallbackElement = (element: HTMLElement | null) => {
    fallbackElementRef.current = element
  }

  const focusOnNextFrame = (key: Key | null) => {
    requestAnimationFrame(() => {
      const registeredElement = key === null ? undefined : elementsRef.current.get(key)
      const focusTarget = registeredElement ?? fallbackElementRef.current
      focusTarget?.focus()
    })
  }

  return { registerElement, registerFallbackElement, focusOnNextFrame }
}
