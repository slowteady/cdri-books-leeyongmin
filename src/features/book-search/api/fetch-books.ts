import { BOOK_SEARCH_API_PATH } from '@/config/api'
import { BOOK_SEARCH_PAGE_SIZE } from '@/config/constants'
import type { ActiveSearchMode } from '@/features/book-search/utils/search-mode'
import { getJson } from '@/lib/api-client'
import type { Book } from '@/types/book'

import { toBook, type KakaoBookDocument } from './to-book'

export type BookSearchPage = {
  books: Book[]
  totalCount: number
  pageableCount: number
  isEnd: boolean
}

type KakaoBookSearchResponse = {
  meta: { total_count: number; pageable_count: number; is_end: boolean }
  documents: KakaoBookDocument[]
}

export async function fetchBooks(
  searchMode: ActiveSearchMode,
  page: number,
  signal: AbortSignal,
): Promise<BookSearchPage> {
  const searchParams = new URLSearchParams({
    query: searchMode.query,
    page: String(page),
    size: String(BOOK_SEARCH_PAGE_SIZE),
  })
  if (searchMode.type === 'detail') searchParams.set('target', searchMode.searchTarget)
  const { meta, documents } = await getJson<KakaoBookSearchResponse>(
    `${BOOK_SEARCH_API_PATH}?${searchParams}`,
    { signal },
  )
  return {
    books: documents.map(toBook),
    totalCount: meta.total_count,
    pageableCount: meta.pageable_count,
    isEnd: meta.is_end,
  }
}
