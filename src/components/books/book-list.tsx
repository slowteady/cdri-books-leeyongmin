import { useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import type { Book } from '@/types/book'

import { BookListItem } from './book-list-item'

type BookListProps = {
  books: Book[]
  renderWishlistButton: (book: Book) => ReactNode
  hasMore: boolean
  isLoadingMore: boolean
  hasLoadMoreFailed: boolean
  onLoadMore: () => void
}

export function BookList({
  books,
  renderWishlistButton,
  hasMore,
  isLoadingMore,
  hasLoadMoreFailed,
  onLoadMore,
}: BookListProps) {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null)
  const loadMoreTriggerRef = useIntersectionObserver<HTMLButtonElement>(onLoadMore)

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
      {isLoadingMore && <BookListSkeleton label="다음 목록 불러오는 중" rowCount={2} />}
      {hasLoadMoreFailed && (
        <div role="alert" className="flex flex-col items-center gap-3 py-8">
          <p className="text-caption text-fg-secondary">다음 목록을 불러오지 못했어요.</p>
          <Button variant="secondary" onClick={onLoadMore}>
            다시 시도
          </Button>
        </div>
      )}
      {hasMore && !isLoadingMore && !hasLoadMoreFailed && (
        <div className="flex justify-center py-8">
          <Button ref={loadMoreTriggerRef} variant="secondary" onClick={onLoadMore}>
            더 보기
          </Button>
        </div>
      )}
    </>
  )
}

type BookListSkeletonProps = {
  label: string
  rowCount: number
}

export function BookListSkeleton({ label, rowCount }: BookListSkeletonProps) {
  return (
    <div role="status" aria-label={label}>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-wrap items-center gap-4 border-b border-divider py-4 motion-safe:animate-pulse lg:h-25 lg:flex-nowrap lg:gap-12 lg:py-0 lg:pr-4 lg:pl-12"
        >
          <div className="h-17 w-12 shrink-0 bg-light-gray" />
          <div className="h-4.5 min-w-0 flex-1 rounded-lg bg-light-gray" />
          <div className="h-12 basis-full rounded-lg bg-light-gray lg:w-60 lg:basis-auto" />
        </div>
      ))}
    </div>
  )
}
