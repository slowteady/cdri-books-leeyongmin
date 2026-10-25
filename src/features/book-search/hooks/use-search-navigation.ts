import { useLocation, useSearchParams } from 'react-router'

import { useSearchHistoryActions } from '@/features/book-search/stores/search-history-store'
import { toHistoryEntry } from '@/features/book-search/utils/search-history-entry'
import {
  parseSearchMode,
  toDetailSearchCondition,
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

  return {
    searchMode,
    searchKey,
    allSearchQuery: searchMode.type === 'all' ? searchMode.query : '',
    detailSearchCondition: toDetailSearchCondition(searchMode),
    search,
  }
}
