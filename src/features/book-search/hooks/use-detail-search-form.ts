import { useState } from 'react'

import type {
  ActiveSearchMode,
  DetailSearchCondition,
  SearchTarget,
} from '@/features/book-search/utils/search-mode'

const DEFAULT_SEARCH_TARGET: SearchTarget = 'title'

function toDraftCondition(currentCondition: DetailSearchCondition | null): DetailSearchCondition {
  return currentCondition ?? { searchTarget: DEFAULT_SEARCH_TARGET, query: '' }
}

type UseDetailSearchFormParams = {
  currentCondition: DetailSearchCondition | null
  searchKey: string
  onSearch: (searchMode: ActiveSearchMode) => void
}

export function useDetailSearchForm({
  currentCondition,
  searchKey,
  onSearch,
}: UseDetailSearchFormParams) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftCondition, setDraftCondition] = useState(() => toDraftCondition(currentCondition))
  const [syncedSearchKey, setSyncedSearchKey] = useState(searchKey)

  if (searchKey !== syncedSearchKey) {
    setSyncedSearchKey(searchKey)
    setDraftCondition(toDraftCondition(currentCondition))
  }

  const changeSearchTarget = (searchTarget: SearchTarget) =>
    setDraftCondition((condition) => ({ ...condition, searchTarget }))

  const changeQuery = (query: string) => setDraftCondition((condition) => ({ ...condition, query }))

  const submit = () => {
    const trimmedQuery = draftCondition.query.trim()
    if (!trimmedQuery) return
    setIsOpen(false)
    onSearch({ type: 'detail', searchTarget: draftCondition.searchTarget, query: trimmedQuery })
  }

  return {
    isOpen,
    searchTarget: draftCondition.searchTarget,
    query: draftCondition.query,
    changeOpen: setIsOpen,
    changeSearchTarget,
    changeQuery,
    submit,
  }
}
