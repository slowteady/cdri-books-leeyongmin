import { useState } from 'react'

import {
  toSearchMode,
  type SearchHistoryEntry,
} from '@/features/book-search/utils/search-history-entry'
import type { ActiveSearchMode } from '@/features/book-search/utils/search-mode'

import type { SearchHistoryDropdown } from './use-search-history-dropdown'

type UseSearchBarParams = {
  initialQuery: string
  searchKey: string
  historyDropdown: Pick<SearchHistoryDropdown, 'highlightedEntry' | 'close' | 'resetHighlight'>
  onSearch: (searchMode: ActiveSearchMode) => void
}

export function useSearchBar({
  initialQuery,
  searchKey,
  historyDropdown,
  onSearch,
}: UseSearchBarParams) {
  const [query, setQuery] = useState(initialQuery)
  const [syncedSearchKey, setSyncedSearchKey] = useState(searchKey)

  if (searchKey !== syncedSearchKey) {
    setSyncedSearchKey(searchKey)
    setQuery(initialQuery)
  }

  const changeQuery = (nextQuery: string) => {
    setQuery(nextQuery)
    historyDropdown.resetHighlight()
  }

  const selectHistoryEntry = (entry: SearchHistoryEntry) => {
    historyDropdown.close()
    onSearch(toSearchMode(entry))
  }

  const confirmSelection = () => {
    if (historyDropdown.highlightedEntry) {
      selectHistoryEntry(historyDropdown.highlightedEntry)
      return
    }
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return
    historyDropdown.close()
    onSearch({ type: 'all', query: trimmedQuery })
  }

  return {
    query,
    changeQuery,
    confirmSelection,
    selectHistoryEntry,
  }
}
