import { useLayoutEffect, useRef } from 'react'

import { EXPAND_TRANSITION_DURATION_MS, EXPAND_TRANSITION_EASING } from '@/config/constants'
import { prefersReducedMotion } from '@/utils/prefers-reduced-motion'

const HEIGHT_TRANSITION = `height ${EXPAND_TRANSITION_DURATION_MS}ms ${EXPAND_TRANSITION_EASING}`

function forceReflow(element: HTMLElement) {
  element.getBoundingClientRect()
}

function releaseHeight(element: HTMLElement) {
  element.style.removeProperty('height')
  element.style.removeProperty('transition')
  element.style.removeProperty('overflow')
}

export function useHeightTransition<AnimatedElement extends HTMLElement>(trigger: unknown) {
  const elementRef = useRef<AnimatedElement>(null)
  const settledHeightRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)

  useLayoutEffect(() => {
    const element = elementRef.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      if (!isAnimatingRef.current) settledHeightRef.current = element.offsetHeight
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const element = elementRef.current
    if (!element) return
    const startHeight = isAnimatingRef.current
      ? element.getBoundingClientRect().height
      : settledHeightRef.current
    releaseHeight(element)
    const endHeight = element.offsetHeight
    settledHeightRef.current = endHeight
    isAnimatingRef.current = false
    if (startHeight === null || startHeight === endHeight || prefersReducedMotion()) return

    isAnimatingRef.current = true
    element.style.overflow = 'hidden'
    element.style.height = `${startHeight}px`
    forceReflow(element)
    element.style.transition = HEIGHT_TRANSITION
    element.style.height = `${endHeight}px`

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== element || event.propertyName !== 'height') return
      isAnimatingRef.current = false
      releaseHeight(element)
    }
    element.addEventListener('transitionend', handleTransitionEnd)
    return () => element.removeEventListener('transitionend', handleTransitionEnd)
  }, [trigger])

  return elementRef
}
