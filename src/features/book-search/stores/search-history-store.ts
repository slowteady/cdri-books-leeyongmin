import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { MAX_SEARCH_HISTORY_COUNT } from '@/config/constants'
import { isSearchTarget, type SearchTarget } from '@/features/book-search/utils/search-mode'

export const SEARCH_HISTORY_STORAGE_KEY = 'cdri-books:search-history'

export type SearchHistoryEntry = {
  query: string
  searchTarget: SearchTarget | null
}

function isSameHistoryEntry(entry: SearchHistoryEntry, otherEntry: SearchHistoryEntry) {
  return entry.query === otherEntry.query && entry.searchTarget === otherEntry.searchTarget
}

export function prependHistoryEntry(
  historyEntries: SearchHistoryEntry[],
  newEntry: SearchHistoryEntry,
) {
  const query = newEntry.query.trim()
  if (!query) return historyEntries
  const trimmedEntry = { ...newEntry, query }
  const otherEntries = historyEntries.filter((entry) => !isSameHistoryEntry(entry, trimmedEntry))
  return [trimmedEntry, ...otherEntries].slice(0, MAX_SEARCH_HISTORY_COUNT)
}

function isSearchHistoryEntry(value: unknown): value is SearchHistoryEntry {
  if (typeof value !== 'object' || value === null) return false
  const { query, searchTarget } = value as Record<string, unknown>
  return typeof query === 'string' && (searchTarget === null || isSearchTarget(searchTarget))
}

function readStoredHistoryEntries(storedState: unknown) {
  if (typeof storedState !== 'object' || storedState === null) return []
  const { historyEntries } = storedState as Record<string, unknown>
  return Array.isArray(historyEntries) ? historyEntries.filter(isSearchHistoryEntry) : []
}

type SearchHistoryState = {
  historyEntries: SearchHistoryEntry[]
  actions: {
    addHistoryEntry: (entry: SearchHistoryEntry) => void
    removeHistoryEntry: (entry: SearchHistoryEntry) => void
  }
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      historyEntries: [],
      actions: {
        addHistoryEntry: (entry) =>
          set((state) => ({ historyEntries: prependHistoryEntry(state.historyEntries, entry) })),
        removeHistoryEntry: (entry) =>
          set((state) => ({
            historyEntries: state.historyEntries.filter(
              (historyEntry) => !isSameHistoryEntry(historyEntry, entry),
            ),
          })),
      },
    }),
    {
      name: SEARCH_HISTORY_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ historyEntries: state.historyEntries }),
      merge: (storedState, currentState) => ({
        ...currentState,
        historyEntries: readStoredHistoryEntries(storedState),
      }),
    },
  ),
)
