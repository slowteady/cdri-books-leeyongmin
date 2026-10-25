import { useLocation, useSearchParams } from 'react-router'

import {
  toHistoryEntry,
  useSearchHistoryActions,
} from '@/features/book-search/stores/search-history-store'
import {
  parseSearchMode,
  toSearchParams,
  type ActiveSearchMode,
} from '@/features/book-search/utils/search-mode'

export function useSearchNavigation() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { key: searchKey } = useLocation()
  const { addHistoryEntry } = useSearchHistoryActions()
  const searchMode = parseSearchMode(searchParams)

  const search = (nextSearchMode: ActiveSearchMode) => {
    addHistoryEntry(toHistoryEntry(nextSearchMode))
    setSearchParams(toSearchParams(nextSearchMode))
  }

  return { searchMode, searchKey, search }
}
