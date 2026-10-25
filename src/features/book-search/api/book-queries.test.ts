import { QueryClient, skipToken } from '@tanstack/react-query'

import { createBook } from '@/testing/data/books'
import { mockFetch } from '@/testing/mock-fetch'

import { bookQueries, getNextSearchPage, selectBookSearchResult } from './book-queries'
import type { BookSearchPage } from './fetch-books'

function createBookSearchPage(overrides: Partial<BookSearchPage> = {}): BookSearchPage {
  return { books: [], totalCount: 100, pageableCount: 100, isEnd: false, ...overrides }
}

describe('getNextSearchPage', () => {
  test('남은 결과가 있으면 다음 페이지 번호를 돌려준다', () => {
    expect(getNextSearchPage(createBookSearchPage(), 1)).toBe(2)
  })

  test('마지막 페이지라고 응답하면 더 요청하지 않는다', () => {
    expect(getNextSearchPage(createBookSearchPage({ isEnd: true }), 1)).toBeUndefined()
  })

  test('결과가 0건이면 마지막 페이지가 아니라고 응답해도 더 요청하지 않는다', () => {
    const emptyPage = createBookSearchPage({ totalCount: 0, pageableCount: 0, isEnd: false })

    expect(getNextSearchPage(emptyPage, 1)).toBeUndefined()
  })

  test('조회 가능한 결과 수를 다 보여줬으면 더 요청하지 않는다', () => {
    const lastPage = createBookSearchPage({ pageableCount: 25 })

    expect(getNextSearchPage(lastPage, 2)).toBe(3)
    expect(getNextSearchPage(lastPage, 3)).toBeUndefined()
  })

  test('Kakao 문서상 최대 페이지(50)를 넘겨 요청하지 않는다', () => {
    const largeResultPage = createBookSearchPage({ pageableCount: 1000 })

    expect(getNextSearchPage(largeResultPage, 49)).toBe(50)
    expect(getNextSearchPage(largeResultPage, 50)).toBeUndefined()
  })
})

describe('selectBookSearchResult', () => {
  test('받은 페이지들의 책을 순서대로 이어 붙이고 전체 건수를 함께 돌려준다', () => {
    const firstPage = createBookSearchPage({ totalCount: 30, books: [createBook({ id: 'a' })] })
    const secondPage = createBookSearchPage({ totalCount: 30, books: [createBook({ id: 'b' })] })

    const bookSearchResult = selectBookSearchResult({
      pages: [firstPage, secondPage],
      pageParams: [1, 2],
    })

    expect(bookSearchResult.books.map((book) => book.id)).toEqual(['a', 'b'])
    expect(bookSearchResult.totalCount).toBe(30)
  })

  test('여러 페이지에 같은 책이 다시 나오면 처음 것만 남긴다', () => {
    const firstPage = createBookSearchPage({
      books: [createBook({ id: 'a' }), createBook({ id: 'b' })],
    })
    const secondPage = createBookSearchPage({
      books: [createBook({ id: 'b' }), createBook({ id: 'c' })],
    })

    const bookSearchResult = selectBookSearchResult({
      pages: [firstPage, secondPage],
      pageParams: [1, 2],
    })

    expect(bookSearchResult.books.map((book) => book.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('selectBookSearchResult의 다음 페이지 책 수', () => {
  test('남은 결과가 한 페이지보다 많으면 한 페이지 분량을 돌려준다', () => {
    const page = createBookSearchPage({ pageableCount: 100 })

    expect(selectBookSearchResult({ pages: [page], pageParams: [1] }).nextPageBookCount).toBe(10)
  })

  test('마지막 페이지에 남은 결과가 적으면 그만큼만 돌려준다', () => {
    const page = createBookSearchPage({ pageableCount: 25 })

    const bookSearchResult = selectBookSearchResult({ pages: [page, page], pageParams: [1, 2] })

    expect(bookSearchResult.nextPageBookCount).toBe(5)
  })

  test('Kakao 문서상 최대 페이지(50)까지 불러왔으면 0을 돌려준다', () => {
    const page = createBookSearchPage({ pageableCount: 1000 })
    const pages = Array.from({ length: 50 }, () => page)

    const bookSearchResult = selectBookSearchResult({
      pages,
      pageParams: pages.map((_, index) => index + 1),
    })

    expect(bookSearchResult.nextPageBookCount).toBe(0)
  })
})

describe('bookQueries.search', () => {
  test('검색 전에는 요청하지 않는다', () => {
    expect(bookQueries.search({ type: 'idle' }).queryFn).toBe(skipToken)
  })

  test('검색 모드의 검색어와 조건으로 책을 요청한다', async () => {
    const fetchMock = mockFetch(() =>
      Response.json({ meta: { total_count: 0, pageable_count: 0, is_end: true }, documents: [] }),
    )

    await new QueryClient().fetchInfiniteQuery(
      bookQueries.search({ type: 'detail', searchTarget: 'publisher', query: '민음사' }),
    )

    const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]), window.location.origin)
    expect(requestUrl.searchParams.get('query')).toBe('민음사')
    expect(requestUrl.searchParams.get('target')).toBe('publisher')
  })

  test('다음 페이지를 불러오면 다음 페이지 번호로 요청한다', async () => {
    const requestedPages: string[] = []
    mockFetch((requestUrl) => {
      requestedPages.push(requestUrl.searchParams.get('page') ?? '')
      return Response.json({
        meta: { total_count: 30, pageable_count: 30, is_end: false },
        documents: [],
      })
    })

    await new QueryClient().fetchInfiniteQuery({
      ...bookQueries.search({ type: 'all', query: 'a' }),
      pages: 2,
    })

    expect(requestedPages).toEqual(['1', '2'])
  })

  test('검색 모드가 다르면 서로 다른 캐시에 저장한다', () => {
    const allSearchKey = bookQueries.search({ type: 'all', query: '숲' }).queryKey
    const detailSearchKey = bookQueries.search({
      type: 'detail',
      searchTarget: 'title',
      query: '숲',
    }).queryKey

    expect(allSearchKey).not.toEqual(detailSearchKey)
  })
})
