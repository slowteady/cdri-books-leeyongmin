import type { ActiveSearchMode, SearchTarget } from './search-mode'

export type SearchHistoryEntry = {
  query: string
  searchTarget: SearchTarget | null
}

export function toSearchMode(entry: SearchHistoryEntry): ActiveSearchMode {
  return entry.searchTarget
    ? { type: 'detail', searchTarget: entry.searchTarget, query: entry.query }
    : { type: 'all', query: entry.query }
}

export function toHistoryEntry(searchMode: ActiveSearchMode): SearchHistoryEntry {
  return {
    query: searchMode.query,
    searchTarget: searchMode.type === 'detail' ? searchMode.searchTarget : null,
  }
}
