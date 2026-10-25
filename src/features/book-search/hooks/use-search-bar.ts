import { useState } from 'react'

import type { SearchHistoryEntry } from '@/features/book-search/stores/search-history-store'

import { useSearchHistoryDropdown } from './use-search-history-dropdown'

type UseSearchBarParams = {
  initialQuery: string
  onSearch: (query: string) => void
  onSelectHistoryEntry: (entry: SearchHistoryEntry) => void
}

export function useSearchBar({ initialQuery, onSearch, onSelectHistoryEntry }: UseSearchBarParams) {
  const historyDropdown = useSearchHistoryDropdown()
  const [query, setQuery] = useState(initialQuery)
  const [syncedInitialQuery, setSyncedInitialQuery] = useState(initialQuery)

  if (initialQuery !== syncedInitialQuery) {
    setSyncedInitialQuery(initialQuery)
    setQuery(initialQuery)
  }

  const selectHistoryEntry = (entry: SearchHistoryEntry) => {
    historyDropdown.close()
    setQuery(entry.searchTarget ? '' : entry.query)
    onSelectHistoryEntry(entry)
  }

  const confirmSelection = () => {
    if (historyDropdown.highlightedEntry) {
      selectHistoryEntry(historyDropdown.highlightedEntry)
      return
    }
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return
    historyDropdown.close()
    onSearch(trimmedQuery)
  }

  return {
    query,
    changeQuery: setQuery,
    confirmSelection,
    selectHistoryEntry,
    historyDropdown,
  }
}
