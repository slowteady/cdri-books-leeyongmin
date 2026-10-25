export const SEARCH_TARGETS = ['title', 'person', 'publisher'] as const

export type SearchTarget = (typeof SEARCH_TARGETS)[number]

export const SEARCH_TARGET_LABELS: Record<SearchTarget, string> = {
  title: '제목',
  person: '저자명',
  publisher: '출판사',
}

export type SearchMode =
  | { type: 'idle' }
  | { type: 'all'; query: string }
  | { type: 'detail'; searchTarget: SearchTarget; query: string }

export type DetailSearchCondition = {
  searchTarget: SearchTarget
  query: string
}

export function isSearchTarget(value: unknown): value is SearchTarget {
  return SEARCH_TARGETS.some((searchTarget) => searchTarget === value)
}

const SEARCH_QUERY_PARAM = 'q'
const SEARCH_TARGET_PARAM = 'target'

export function parseSearchMode(searchParams: URLSearchParams): SearchMode {
  const query = searchParams.get(SEARCH_QUERY_PARAM)?.trim()
  if (!query) return { type: 'idle' }
  const searchTarget = searchParams.get(SEARCH_TARGET_PARAM)
  if (isSearchTarget(searchTarget)) return { type: 'detail', searchTarget, query }
  return { type: 'all', query }
}

export type ActiveSearchMode = Exclude<SearchMode, { type: 'idle' }>

export function toDetailSearchCondition(searchMode: SearchMode): DetailSearchCondition | null {
  if (searchMode.type !== 'detail') return null
  return { searchTarget: searchMode.searchTarget, query: searchMode.query }
}

export function toSearchParams(searchMode: ActiveSearchMode) {
  const searchParams = new URLSearchParams({ [SEARCH_QUERY_PARAM]: searchMode.query })
  if (searchMode.type === 'detail') searchParams.set(SEARCH_TARGET_PARAM, searchMode.searchTarget)
  return searchParams
}
