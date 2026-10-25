import { useRef, useState } from 'react'

import { WISHLIST_PAGE_SIZE } from '@/config/constants'
import { useWishedBooks } from '@/features/wishlist/stores/wishlist-store'

export function useWishlistList() {
  const wishedBooks = useWishedBooks()
  const [visibleCount, setVisibleCount] = useState(WISHLIST_PAGE_SIZE)
  const wishlistButtonsRef = useRef(new Map<string, HTMLButtonElement>())
  const wishlistSectionRef = useRef<HTMLElement>(null)
  const visibleBooks = wishedBooks.slice(0, visibleCount)

  const registerWishlistButton = (bookId: string) => (button: HTMLButtonElement | null) => {
    if (!button) return
    wishlistButtonsRef.current.set(bookId, button)
    return () => {
      wishlistButtonsRef.current.delete(bookId)
    }
  }

  const moveFocusAfterRemoval = (removedBookId: string) => {
    const removedIndex = visibleBooks.findIndex((book) => book.id === removedBookId)
    const nextFocusBook = visibleBooks[removedIndex + 1] ?? visibleBooks[removedIndex - 1]
    requestAnimationFrame(() => {
      const nextFocusTarget = nextFocusBook
        ? wishlistButtonsRef.current.get(nextFocusBook.id)
        : wishlistSectionRef.current
      nextFocusTarget?.focus()
    })
  }

  return {
    books: visibleBooks,
    totalCount: wishedBooks.length,
    hasMore: visibleCount < wishedBooks.length,
    loadMore: () => setVisibleCount((count) => count + WISHLIST_PAGE_SIZE),
    wishlistSectionRef,
    registerWishlistButton,
    moveFocusAfterRemoval,
  }
}
