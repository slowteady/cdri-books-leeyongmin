import { useIsWishedBook, useWishlistActions } from '@/features/wishlist/stores/wishlist-store'
import type { Book } from '@/types/book'

type UseWishlistButtonParams = {
  book: Book
  onUnwish?: () => void
}

export function useWishlistButton({ book, onUnwish }: UseWishlistButtonParams) {
  const isWished = useIsWishedBook(book.id)
  const { toggleWishedBook } = useWishlistActions()

  const toggleWishlist = () => {
    toggleWishedBook(book)
    if (isWished) onUnwish?.()
  }

  return { isWished, toggleWishlist }
}
