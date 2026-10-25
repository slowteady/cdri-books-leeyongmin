import { useState } from 'react'

import type { SearchTarget } from '@/features/book-search/utils/search-mode'

const DEFAULT_SEARCH_TARGET: SearchTarget = 'title'

export type DetailSearchCondition = {
  searchTarget: SearchTarget
  query: string
}

type UseDetailSearchFormParams = {
  currentCondition: DetailSearchCondition | null
  searchKey: string
  onSearch: (searchTarget: SearchTarget, query: string) => void
}

export function useDetailSearchForm({
  currentCondition,
  searchKey,
  onSearch,
}: UseDetailSearchFormParams) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTarget, setSearchTarget] = useState<SearchTarget>(
    currentCondition?.searchTarget ?? DEFAULT_SEARCH_TARGET,
  )
  const [query, setQuery] = useState(currentCondition?.query ?? '')
  const [syncedSearchKey, setSyncedSearchKey] = useState(searchKey)

  if (searchKey !== syncedSearchKey) {
    setSyncedSearchKey(searchKey)
    setSearchTarget(currentCondition?.searchTarget ?? DEFAULT_SEARCH_TARGET)
    setQuery(currentCondition?.query ?? '')
  }

  const submit = () => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return
    setIsOpen(false)
    onSearch(searchTarget, trimmedQuery)
  }

  return {
    isOpen,
    searchTarget,
    query,
    changeOpen: setIsOpen,
    changeSearchTarget: setSearchTarget,
    changeQuery: setQuery,
    submit,
  }
}
