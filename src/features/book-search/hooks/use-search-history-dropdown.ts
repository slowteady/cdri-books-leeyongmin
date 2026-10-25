import { useState } from 'react'

import {
  useSearchHistoryActions,
  useSearchHistoryEntries,
  type SearchHistoryEntry,
} from '@/features/book-search/stores/search-history-store'
import { useListboxNavigation, type HighlightDirection } from '@/hooks/use-listbox-navigation'

export function useSearchHistoryDropdown() {
  const historyEntries = useSearchHistoryEntries()
  const { removeHistoryEntry } = useSearchHistoryActions()
  const [isOpen, setIsOpen] = useState(false)
  const listboxNavigation = useListboxNavigation(historyEntries)
  const isVisible = isOpen && historyEntries.length > 0
  const highlightedEntry = isVisible ? listboxNavigation.highlightedItem : null

  const close = () => {
    setIsOpen(false)
    listboxNavigation.resetHighlight()
  }

  const moveHighlight = (direction: HighlightDirection) => {
    setIsOpen(true)
    listboxNavigation.moveHighlight(direction)
  }

  const removeEntry = (entry: SearchHistoryEntry) => {
    removeHistoryEntry(entry)
    listboxNavigation.resetHighlight()
  }

  const removeHighlightedEntry = () => {
    if (highlightedEntry) removeEntry(highlightedEntry)
  }

  return {
    historyEntries,
    isVisible,
    highlightedIndex: listboxNavigation.highlightedIndex,
    highlightedEntry,
    open: () => setIsOpen(true),
    close,
    moveHighlight,
    removeEntry,
    removeHighlightedEntry,
  }
}
