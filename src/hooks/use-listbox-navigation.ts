import { useState } from 'react'

export type HighlightDirection = 'next' | 'previous'

function getNextHighlightIndex(
  currentIndex: number | null,
  direction: HighlightDirection,
  optionCount: number,
) {
  if (currentIndex === null) return direction === 'next' ? 0 : optionCount - 1
  const step = direction === 'next' ? 1 : -1
  return (currentIndex + step + optionCount) % optionCount
}

export function useListboxNavigation<Option>(options: Option[]) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const highlightedOption = highlightedIndex === null ? null : (options[highlightedIndex] ?? null)

  const moveHighlight = (direction: HighlightDirection) => {
    if (options.length === 0) return
    setHighlightedIndex((currentIndex) =>
      getNextHighlightIndex(currentIndex, direction, options.length),
    )
  }

  const resetHighlight = () => setHighlightedIndex(null)

  return { highlightedIndex, highlightedOption, moveHighlight, resetHighlight }
}
