import { infiniteQueryOptions, skipToken, type InfiniteData } from '@tanstack/react-query'

import {
  BOOK_SEARCH_PAGE_SIZE,
  BOOK_SEARCH_STALE_TIME_MS,
  MAX_BOOK_SEARCH_PAGE,
} from '@/config/constants'
import type { SearchMode } from '@/features/book-search/utils/search-mode'
import type { Book } from '@/types/book'

import { fetchBooks, type BookSearchPage } from './fetch-books'

type BookSearchResult = {
  books: Book[]
  totalCount: number
  nextPageBookCount: number
}

const MAX_AVAILABLE_BOOK_COUNT = MAX_BOOK_SEARCH_PAGE * BOOK_SEARCH_PAGE_SIZE

function toAvailableBookCount(pageableCount: number) {
  return Math.min(pageableCount, MAX_AVAILABLE_BOOK_COUNT)
}

export function getNextSearchPage(lastPage: BookSearchPage, lastPageNumber: number) {
  const lastAvailablePageNumber = Math.ceil(
    toAvailableBookCount(lastPage.pageableCount) / BOOK_SEARCH_PAGE_SIZE,
  )
  if (lastPage.isEnd || lastPageNumber >= lastAvailablePageNumber) return undefined
  return lastPageNumber + 1
}

function countNextPageBooks(pages: BookSearchPage[]) {
  const lastPage = pages.at(-1)
  if (!lastPage) return 0
  const remainingCount =
    toAvailableBookCount(lastPage.pageableCount) - pages.length * BOOK_SEARCH_PAGE_SIZE
  return Math.max(0, Math.min(BOOK_SEARCH_PAGE_SIZE, remainingCount))
}

function removeDuplicateBooks(books: Book[]) {
  const seenBookIds = new Set<string>()
  return books.filter((book) => {
    if (seenBookIds.has(book.id)) return false
    seenBookIds.add(book.id)
    return true
  })
}

export function selectBookSearchResult(
  bookSearchData: InfiniteData<BookSearchPage, number>,
): BookSearchResult {
  return {
    books: removeDuplicateBooks(bookSearchData.pages.flatMap((page) => page.books)),
    totalCount: bookSearchData.pages[0]?.totalCount ?? 0,
    nextPageBookCount: countNextPageBooks(bookSearchData.pages),
  }
}

export const bookQueries = {
  all: () => ['books'] as const,
  search: (searchMode: SearchMode) =>
    infiniteQueryOptions({
      queryKey: [...bookQueries.all(), 'search', searchMode],
      queryFn:
        searchMode.type === 'idle'
          ? skipToken
          : ({ pageParam, signal }) => fetchBooks(searchMode, pageParam, signal),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _allPages, lastPageNumber) =>
        getNextSearchPage(lastPage, lastPageNumber),
      staleTime: BOOK_SEARCH_STALE_TIME_MS,
    }),
}
