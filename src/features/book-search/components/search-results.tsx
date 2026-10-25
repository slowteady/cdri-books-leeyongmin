import type { ReactNode } from 'react'

import { BookList, BookListSkeleton } from '@/components/books/book-list'
import { ResultCount } from '@/components/books/result-count'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import {
  useSearchResults,
  type SearchResultsView,
} from '@/features/book-search/hooks/use-search-results'
import type { SearchMode } from '@/features/book-search/utils/search-mode'
import type { Book } from '@/types/book'

type SearchResultsProps = {
  searchMode: SearchMode
  renderWishlistButton: (book: Book) => ReactNode
}

export function SearchResults({ searchMode, renderWishlistButton }: SearchResultsProps) {
  const searchResultsView = useSearchResults(searchMode)
  const totalCount = searchResultsView.status === 'success' ? searchResultsView.totalCount : 0

  return (
    <section aria-label="검색 결과" className="mt-6">
      <ResultCount label="도서 검색 결과" count={totalCount} />
      <div className="mt-9">
        <SearchResultsBody
          searchResultsView={searchResultsView}
          renderWishlistButton={renderWishlistButton}
        />
      </div>
    </section>
  )
}

type SearchResultsBodyProps = {
  searchResultsView: SearchResultsView
  renderWishlistButton: (book: Book) => ReactNode
}

function SearchResultsBody({ searchResultsView, renderWishlistButton }: SearchResultsBodyProps) {
  switch (searchResultsView.status) {
    case 'idle':
    case 'empty':
      return <EmptyState message="검색된 결과가 없습니다." />
    case 'error':
      return (
        <div role="alert" className="flex flex-col items-center gap-4">
          <p className="text-caption text-fg-secondary">{searchResultsView.message}</p>
          {searchResultsView.canRetry && (
            <Button variant="secondary" onClick={searchResultsView.retry}>
              다시 시도
            </Button>
          )}
        </div>
      )
    case 'loading':
      return <BookListSkeleton label="검색 결과 불러오는 중" rowCount={3} />
    case 'success':
      return (
        <BookList
          books={searchResultsView.books}
          renderWishlistButton={renderWishlistButton}
          hasMore={searchResultsView.hasMore}
          isLoadingMore={searchResultsView.isLoadingMore}
          hasLoadMoreFailed={searchResultsView.hasLoadMoreFailed}
          onLoadMore={searchResultsView.loadMore}
        />
      )
  }
}
