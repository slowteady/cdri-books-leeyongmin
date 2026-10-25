import { useSearchParams } from 'react-router'

import { parseSearchMode } from '@/features/book-search/utils/search-mode'

export function useSearchNavigation() {
  const [searchParams] = useSearchParams()
  const searchMode = parseSearchMode(searchParams)

  return { searchMode }
}
