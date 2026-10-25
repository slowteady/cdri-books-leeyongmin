import { useEffect, type RefObject } from 'react'

export function useOutsidePointerDown(
  containerRef: RefObject<HTMLElement | null>,
  onOutsidePointerDown: () => void,
  isEnabled: boolean,
) {
  useEffect(() => {
    if (!isEnabled) return
    const handlePointerDown = (event: PointerEvent) => {
      const container = containerRef.current
      if (container && event.target instanceof Node && !container.contains(event.target)) {
        onOutsidePointerDown()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [containerRef, onOutsidePointerDown, isEnabled])
}
