import { BookList } from '@/components/books/book-list'
import { ResultCount } from '@/components/books/result-count'
import { EmptyState } from '@/components/ui/empty-state'
import { useWishlistList } from '@/features/wishlist/hooks/use-wishlist-list'

import { WishlistButton } from './wishlist-button'

export function WishlistList() {
  const {
    books,
    totalCount,
    hasMore,
    loadMore,
    registerWishlistSection,
    registerWishlistButton,
    moveFocusAfterRemoval,
  } = useWishlistList()

  return (
    <section
      ref={registerWishlistSection}
      aria-label="찜한 책 목록"
      tabIndex={-1}
      className="mt-5 outline-none"
    >
      <ResultCount label="찜한 책" count={totalCount} />
      <div className="mt-9">
        {totalCount === 0 && <EmptyState message="찜한 책이 없습니다." />}
        {totalCount > 0 && (
          <BookList
            books={books}
            renderWishlistButton={(book) => (
              <WishlistButton
                book={book}
                ref={registerWishlistButton(book.id)}
                onUnwish={() => moveFocusAfterRemoval(book.id)}
              />
            )}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </section>
  )
}
