import { useState } from 'react'

import { WISHLIST_PAGE_SIZE } from '@/config/constants'
import { useWishedBooks } from '@/features/wishlist/stores/wishlist-store'

export function useWishlistList() {
  const wishedBooks = useWishedBooks()
  const [visibleCount, setVisibleCount] = useState(WISHLIST_PAGE_SIZE)
  const visibleBooks = wishedBooks.slice(0, visibleCount)

  const findNextFocusBookId = (removedBookId: string) => {
    const removedIndex = visibleBooks.findIndex((book) => book.id === removedBookId)
    const nextFocusBook = visibleBooks[removedIndex + 1] ?? visibleBooks[removedIndex - 1]
    return nextFocusBook?.id ?? null
  }

  return {
    books: visibleBooks,
    totalCount: wishedBooks.length,
    hasMore: visibleCount < wishedBooks.length,
    loadMore: () => setVisibleCount((count) => count + WISHLIST_PAGE_SIZE),
    findNextFocusBookId,
  }
}
