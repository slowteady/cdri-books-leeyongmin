import { useInfiniteQuery } from '@tanstack/react-query'

import { bookQueries, selectBookSearchResult } from '@/features/book-search/api/book-queries'
import { describeSearchError } from '@/features/book-search/utils/search-error'
import type { SearchMode } from '@/features/book-search/utils/search-mode'
import type { Book } from '@/types/book'

export type SearchResultsView =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string; canRetry: boolean; retry: () => void }
  | {
      status: 'success'
      books: Book[]
      totalCount: number
      hasMore: boolean
      isLoadingMore: boolean
      hasLoadMoreFailed: boolean
      loadMore: () => void
    }

export function useSearchResults(searchMode: SearchMode): SearchResultsView {
  const {
    data,
    isLoading,
    error,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery({ ...bookQueries.search(searchMode), select: selectBookSearchResult })

  if (isLoading) return { status: 'loading' }
  if (isError && !data) {
    return { status: 'error', ...describeSearchError(error), retry: () => void refetch() }
  }
  if (!data) return { status: 'idle' }
  if (data.books.length === 0) return { status: 'empty' }

  return {
    status: 'success',
    books: data.books,
    totalCount: data.totalCount,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    hasLoadMoreFailed: isFetchNextPageError,
    loadMore: () => void fetchNextPage(),
  }
}
