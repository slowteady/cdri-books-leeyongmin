import { useState } from 'react'

import type { SearchTarget } from '@/features/book-search/utils/search-mode'

const DEFAULT_SEARCH_TARGET: SearchTarget = 'title'

export type DetailSearchCondition = {
  searchTarget: SearchTarget
  query: string
}

type UseDetailSearchFormParams = {
  currentCondition: DetailSearchCondition | null
  onSearch: (searchTarget: SearchTarget, query: string) => void
}

function toConditionKey(condition: DetailSearchCondition | null) {
  return condition ? `${condition.searchTarget}:${condition.query}` : ''
}

export function useDetailSearchForm({ currentCondition, onSearch }: UseDetailSearchFormParams) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTarget, setSearchTarget] = useState<SearchTarget>(
    currentCondition?.searchTarget ?? DEFAULT_SEARCH_TARGET,
  )
  const [query, setQuery] = useState(currentCondition?.query ?? '')
  const [syncedConditionKey, setSyncedConditionKey] = useState(toConditionKey(currentCondition))

  if (toConditionKey(currentCondition) !== syncedConditionKey) {
    setSyncedConditionKey(toConditionKey(currentCondition))
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
