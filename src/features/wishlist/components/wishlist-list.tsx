import { BookList } from '@/components/books/book-list'
import type { RenderWishlistButton } from '@/components/books/book-list-item'
import { ResultCount } from '@/components/books/result-count'
import { EmptyState } from '@/components/ui/empty-state'
import { useWishlistList } from '@/features/wishlist/hooks/use-wishlist-list'
import { useFocusRegistry } from '@/hooks/use-focus-registry'
import type { Book } from '@/types/book'

import { WishlistButton } from './wishlist-button'

export function WishlistList() {
  const { books, totalCount, hasMore, loadMore, findNextFocusBookId } = useWishlistList()
  const {
    registerElement: registerWishlistButton,
    registerFallbackElement: registerWishlistSection,
    focusOnNextFrame,
  } = useFocusRegistry<string>()

  const renderWishlistButton: RenderWishlistButton = (book) => (
    <WishlistButton
      book={book}
      ref={registerWishlistButton(book.id)}
      onUnwish={() => focusOnNextFrame(findNextFocusBookId(book.id))}
    />
  )

  return (
    <section
      ref={registerWishlistSection}
      aria-label="찜한 책 목록"
      tabIndex={-1}
      className="mt-3 outline-none"
    >
      <ResultCount label="찜한 책" count={totalCount} />
      <div className="mt-9">
        <WishlistListBody
          books={books}
          renderWishlistButton={renderWishlistButton}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>
    </section>
  )
}

type WishlistListBodyProps = {
  books: Book[]
  renderWishlistButton: RenderWishlistButton
  hasMore: boolean
  onLoadMore: () => void
}

function WishlistListBody({
  books,
  renderWishlistButton,
  hasMore,
  onLoadMore,
}: WishlistListBodyProps) {
  if (books.length === 0) return <EmptyState message="찜한 책이 없습니다." />

  return (
    <BookList
      books={books}
      renderWishlistButton={renderWishlistButton}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
    />
  )
}
