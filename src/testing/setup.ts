import '@testing-library/jest-dom/vitest'

import { useSearchHistoryStore } from '@/features/book-search/stores/search-history-store'

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
  useSearchHistoryStore.setState(useSearchHistoryStore.getInitialState(), true)
})
