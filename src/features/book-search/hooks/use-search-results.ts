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
      nextPageBookCount: number
      hasLoadMoreFailed: boolean
      loadMore: () => void
    }

export function useSearchResults(searchMode: SearchMode): SearchResultsView {
  const {
    data: bookSearchResult,
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
  if (isError && !bookSearchResult) {
    return { status: 'error', ...describeSearchError(error), retry: () => void refetch() }
  }
  if (!bookSearchResult) return { status: 'idle' }
  if (bookSearchResult.books.length === 0) return { status: 'empty' }

  return {
    status: 'success',
    books: bookSearchResult.books,
    totalCount: bookSearchResult.totalCount,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    nextPageBookCount: bookSearchResult.nextPageBookCount,
    hasLoadMoreFailed: isFetchNextPageError,
    loadMore: () => void fetchNextPage(),
  }
}
