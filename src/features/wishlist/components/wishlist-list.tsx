import { BookList } from '@/components/books/book-list'
import { ResultCount } from '@/components/books/result-count'
import { EmptyState } from '@/components/ui/empty-state'
import { useWishlistList } from '@/features/wishlist/hooks/use-wishlist-list'

import { WishlistButton } from './wishlist-button'

export function WishlistList() {
  const wishlistList = useWishlistList()

  return (
    <section aria-label="찜한 책 목록" className="mt-5">
      <ResultCount label="찜한 책" count={wishlistList.totalCount} />
      <div className="mt-9">
        {wishlistList.totalCount === 0 ? (
          <EmptyState message="찜한 책이 없습니다." />
        ) : (
          <BookList
            books={wishlistList.books}
            renderWishlistButton={(book) => (
              <WishlistButton
                book={book}
                ref={wishlistList.registerWishlistButton(book.id)}
                onUnwish={() => wishlistList.moveFocusAfterRemoval(book.id)}
              />
            )}
            hasMore={wishlistList.hasMore}
            isLoadingMore={false}
            hasLoadMoreFailed={false}
            onLoadMore={wishlistList.loadMore}
          />
        )}
      </div>
    </section>
  )
}
