import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import type { Book } from '@/types/book'

import { BookListItem, type RenderWishlistButton } from './book-list-item'
import { BookListSkeleton } from './book-list-skeleton'

type BookListProps = {
  books: Book[]
  renderWishlistButton: RenderWishlistButton
  hasMore: boolean
  isLoadingMore?: boolean
  loadingMoreRowCount?: number
  hasLoadMoreFailed?: boolean
  onLoadMore: () => void
}

export function BookList({
  books,
  renderWishlistButton,
  hasMore,
  isLoadingMore = false,
  loadingMoreRowCount = 0,
  hasLoadMoreFailed = false,
  onLoadMore,
}: BookListProps) {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null)
  const loadMoreTriggerRef = useIntersectionObserver<HTMLButtonElement>(onLoadMore)
  const showsLoadMoreButton = hasMore && !isLoadingMore && !hasLoadMoreFailed

  const toggleExpandedBook = (bookId: string) => {
    setExpandedBookId((currentBookId) => (currentBookId === bookId ? null : bookId))
  }

  return (
    <>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <BookListItem
              book={book}
              isExpanded={expandedBookId === book.id}
              onToggleExpanded={toggleExpandedBook}
              renderWishlistButton={renderWishlistButton}
            />
          </li>
        ))}
      </ul>
      {isLoadingMore && (
        <BookListSkeleton label="다음 목록 불러오는 중" rowCount={loadingMoreRowCount} />
      )}
      {hasLoadMoreFailed && (
        <ErrorState
          message="다음 목록을 불러오지 못했어요."
          onRetry={onLoadMore}
          className="gap-3 py-8"
        />
      )}
      {showsLoadMoreButton && (
        <div className="flex justify-center py-8">
          <Button ref={loadMoreTriggerRef} variant="secondary" onClick={onLoadMore}>
            더 보기
          </Button>
        </div>
      )}
    </>
  )
}
