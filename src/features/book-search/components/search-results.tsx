import { BookList, BookListSkeleton } from '@/components/books/book-list'
import type { RenderWishlistButton } from '@/components/books/book-list-item'
import { ResultCount } from '@/components/books/result-count'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { BOOK_SEARCH_PAGE_SIZE } from '@/config/constants'
import {
  useSearchResults,
  type SearchResultsView,
} from '@/features/book-search/hooks/use-search-results'
import type { SearchMode } from '@/features/book-search/utils/search-mode'

type SearchResultsProps = {
  searchMode: SearchMode
  renderWishlistButton: RenderWishlistButton
}

export function SearchResults({ searchMode, renderWishlistButton }: SearchResultsProps) {
  const searchResultsView = useSearchResults(searchMode)

  return (
    <section aria-label="검색 결과" className="mt-6">
      <ResultCount label="도서 검색 결과" count={getResultCount(searchResultsView)} />
      <div className="mt-9">
        <SearchResultsBody
          searchResultsView={searchResultsView}
          renderWishlistButton={renderWishlistButton}
        />
      </div>
    </section>
  )
}

function getResultCount(searchResultsView: SearchResultsView) {
  if (searchResultsView.status === 'loading') return null
  return searchResultsView.status === 'success' ? searchResultsView.totalCount : 0
}

type SearchResultsBodyProps = {
  searchResultsView: SearchResultsView
  renderWishlistButton: RenderWishlistButton
}

function SearchResultsBody({ searchResultsView, renderWishlistButton }: SearchResultsBodyProps) {
  switch (searchResultsView.status) {
    case 'idle':
    case 'empty':
      return <EmptyState message="검색된 결과가 없습니다." />
    case 'error':
      return (
        <ErrorState
          message={searchResultsView.message}
          onRetry={searchResultsView.canRetry ? searchResultsView.retry : undefined}
          className="gap-4"
        />
      )
    case 'loading':
      return <BookListSkeleton label="검색 결과 불러오는 중" rowCount={BOOK_SEARCH_PAGE_SIZE} />
    case 'success':
      return (
        <BookList
          books={searchResultsView.books}
          renderWishlistButton={renderWishlistButton}
          hasMore={searchResultsView.hasMore}
          isLoadingMore={searchResultsView.isLoadingMore}
          loadingMoreRowCount={searchResultsView.nextPageBookCount}
          hasLoadMoreFailed={searchResultsView.hasLoadMoreFailed}
          onLoadMore={searchResultsView.loadMore}
        />
      )
  }
}
