import '@testing-library/jest-dom/vitest'

import { useSearchHistoryStore } from '@/features/book-search/stores/search-history-store'
import { useWishlistStore } from '@/features/wishlist/stores/wishlist-store'

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
  useSearchHistoryStore.setState(useSearchHistoryStore.getInitialState(), true)
  useWishlistStore.setState(useWishlistStore.getInitialState(), true)
})
