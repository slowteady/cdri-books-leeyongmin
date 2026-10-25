import { useState } from 'react'

import {
  useSearchHistoryActions,
  useSearchHistoryEntries,
} from '@/features/book-search/stores/search-history-store'
import type { SearchHistoryEntry } from '@/features/book-search/utils/search-history-entry'
import { useListboxNavigation, type HighlightDirection } from '@/hooks/use-listbox-navigation'

export function useSearchHistoryDropdown() {
  const historyEntries = useSearchHistoryEntries()
  const searchHistoryActions = useSearchHistoryActions()
  const [isOpen, setIsOpen] = useState(false)
  const listboxNavigation = useListboxNavigation(historyEntries)
  const isVisible = isOpen && historyEntries.length > 0
  const highlightedEntry = isVisible ? listboxNavigation.highlightedOption : null

  const close = () => {
    setIsOpen(false)
    listboxNavigation.resetHighlight()
  }

  const moveHighlight = (direction: HighlightDirection) => {
    setIsOpen(true)
    listboxNavigation.moveHighlight(direction)
  }

  const removeHistoryEntry = (entry: SearchHistoryEntry) => {
    searchHistoryActions.removeHistoryEntry(entry)
    listboxNavigation.resetHighlight()
  }

  const removeHighlightedEntry = () => {
    if (highlightedEntry) removeHistoryEntry(highlightedEntry)
  }

  return {
    historyEntries,
    isVisible,
    highlightedIndex: isVisible ? listboxNavigation.highlightedIndex : null,
    highlightedEntry,
    open: () => setIsOpen(true),
    close,
    moveHighlight,
    removeHistoryEntry,
    removeHighlightedEntry,
  }
}

export type SearchHistoryDropdown = ReturnType<typeof useSearchHistoryDropdown>
