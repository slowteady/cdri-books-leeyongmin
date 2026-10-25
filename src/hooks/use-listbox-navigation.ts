import { useState } from 'react'

export type HighlightDirection = 'next' | 'previous'

function getNextHighlightIndex(
  currentIndex: number | null,
  direction: HighlightDirection,
  itemCount: number,
) {
  if (currentIndex === null) return direction === 'next' ? 0 : itemCount - 1
  const step = direction === 'next' ? 1 : -1
  return (currentIndex + step + itemCount) % itemCount
}

export function useListboxNavigation<Item>(items: Item[]) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const highlightedItem = highlightedIndex === null ? null : (items[highlightedIndex] ?? null)

  const moveHighlight = (direction: HighlightDirection) => {
    if (items.length === 0) return
    setHighlightedIndex((currentIndex) =>
      getNextHighlightIndex(currentIndex, direction, items.length),
    )
  }

  const resetHighlight = () => setHighlightedIndex(null)

  return { highlightedIndex, highlightedItem, moveHighlight, resetHighlight }
}
