import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Book } from '@/types/book'

export const WISHLIST_STORAGE_KEY = 'cdri-books:wishlist'

function isStringOrNull(value: unknown) {
  return value === null || typeof value === 'string'
}

function isNumberOrNull(value: unknown) {
  return value === null || typeof value === 'number'
}

function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) return false
  const book = value as Record<string, unknown>
  return (
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    Array.isArray(book.authors) &&
    book.authors.every((author) => typeof author === 'string') &&
    typeof book.publisher === 'string' &&
    isStringOrNull(book.description) &&
    typeof book.detailUrl === 'string' &&
    isStringOrNull(book.thumbnailUrl) &&
    isNumberOrNull(book.originalPrice) &&
    isNumberOrNull(book.salePrice)
  )
}

function readStoredWishedBooks(storedState: unknown) {
  if (typeof storedState !== 'object' || storedState === null) return []
  const { wishedBooks } = storedState as Record<string, unknown>
  return Array.isArray(wishedBooks) ? wishedBooks.filter(isBook) : []
}

type WishlistState = {
  wishedBooks: Book[]
  actions: {
    toggleWishedBook: (book: Book) => void
  }
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishedBooks: [],
      actions: {
        toggleWishedBook: (book) =>
          set((state) => {
            const isAlreadyWished = state.wishedBooks.some(
              (wishedBook) => wishedBook.id === book.id,
            )
            return {
              wishedBooks: isAlreadyWished
                ? state.wishedBooks.filter((wishedBook) => wishedBook.id !== book.id)
                : [book, ...state.wishedBooks],
            }
          }),
      },
    }),
    {
      name: WISHLIST_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ wishedBooks: state.wishedBooks }),
      merge: (storedState, currentState) => ({
        ...currentState,
        wishedBooks: readStoredWishedBooks(storedState),
      }),
    },
  ),
)
