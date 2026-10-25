import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Book } from '@/types/book'
import { isRecord } from '@/utils/is-record'

export const WISHLIST_STORAGE_KEY = 'cdri-books:wishlist'

function isStringOrNull(value: unknown) {
  return value === null || typeof value === 'string'
}

function isNumberOrNull(value: unknown) {
  return value === null || typeof value === 'number'
}

function isBook(value: unknown): value is Book {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    Array.isArray(value.authors) &&
    value.authors.every((author) => typeof author === 'string') &&
    typeof value.publisher === 'string' &&
    isStringOrNull(value.description) &&
    typeof value.detailUrl === 'string' &&
    isStringOrNull(value.thumbnailUrl) &&
    isNumberOrNull(value.originalPrice) &&
    isNumberOrNull(value.salePrice)
  )
}

function containsBook(books: Book[], bookId: string) {
  return books.some((book) => book.id === bookId)
}

function readStoredWishedBooks(storedState: unknown) {
  if (!isRecord(storedState)) return []
  const { wishedBooks } = storedState
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
            const isAlreadyWished = containsBook(state.wishedBooks, book.id)
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

export const useWishedBooks = () => useWishlistStore((state) => state.wishedBooks)
export const useIsWishedBook = (bookId: string) =>
  useWishlistStore((state) => containsBook(state.wishedBooks, bookId))
export const useWishlistActions = () => useWishlistStore((state) => state.actions)
