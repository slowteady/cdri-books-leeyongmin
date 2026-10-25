import { useLayoutEffect, useRef } from 'react'

import { EXPAND_TRANSITION_DURATION_MS, EXPAND_TRANSITION_EASING } from '@/config/constants'
import { prefersReducedMotion } from '@/utils/prefers-reduced-motion'

type LayoutBox = {
  left: number
  top: number
  width: number
  height: number
}

function readLayoutBox(element: HTMLElement): LayoutBox {
  return {
    left: element.offsetLeft,
    top: element.offsetTop,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }
}

function isSameLayoutBox(box: LayoutBox, otherBox: LayoutBox) {
  return (
    box.left === otherBox.left &&
    box.top === otherBox.top &&
    box.width === otherBox.width &&
    box.height === otherBox.height
  )
}

function isGrowing(previousBox: LayoutBox, currentBox: LayoutBox) {
  return currentBox.width * currentBox.height > previousBox.width * previousBox.height
}

function toInvertedTransform(previousBox: LayoutBox, currentBox: LayoutBox) {
  const translate = `translate(${previousBox.left - currentBox.left}px, ${previousBox.top - currentBox.top}px)`
  const scale = `scale(${previousBox.width / currentBox.width}, ${previousBox.height / currentBox.height})`
  return `${translate} ${scale}`
}

type MorphTransitionOptions = {
  shouldAnimateGrowthOnly?: boolean
}

export function useMorphTransition<AnimatedElement extends HTMLElement>(
  trigger: unknown,
  { shouldAnimateGrowthOnly = false }: MorphTransitionOptions = {},
) {
  const elementRef = useRef<AnimatedElement>(null)
  const previousBoxRef = useRef<LayoutBox | null>(null)

  useLayoutEffect(() => {
    const element = elementRef.current
    if (!element) return
    const previousBox = previousBoxRef.current
    const currentBox = readLayoutBox(element)
    previousBoxRef.current = currentBox
    if (!previousBox || isSameLayoutBox(previousBox, currentBox)) return
    if (shouldAnimateGrowthOnly && !isGrowing(previousBox, currentBox)) return
    if (prefersReducedMotion() || typeof element.animate !== 'function') return

    const animation = element.animate(
      [
        { transformOrigin: 'top left', transform: toInvertedTransform(previousBox, currentBox) },
        { transformOrigin: 'top left', transform: 'none' },
      ],
      { duration: EXPAND_TRANSITION_DURATION_MS, easing: EXPAND_TRANSITION_EASING },
    )
    return () => animation.cancel()
  }, [trigger, shouldAnimateGrowthOnly])

  return elementRef
}
