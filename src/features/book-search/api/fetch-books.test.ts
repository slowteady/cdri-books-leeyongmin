import { mockFetch } from '@/testing/mock-fetch'

import { createKakaoBookDocument } from '@/testing/data/kakao-books'

import { fetchBooks } from './fetch-books'

const EMPTY_KAKAO_RESPONSE = {
  meta: { total_count: 0, pageable_count: 0, is_end: true },
  documents: [],
}

describe('fetchBooks', () => {
  test('전체 검색은 검색어, 페이지, 페이지당 10개를 요청한다', async () => {
    const fetchMock = mockFetch(() => Response.json(EMPTY_KAKAO_RESPONSE))

    await fetchBooks({ type: 'all', query: '노르웨이' }, 2, new AbortController().signal)

    const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]), window.location.origin)
    expect(requestUrl.pathname).toBe('/api/books')
    expect(Object.fromEntries(requestUrl.searchParams)).toEqual({
      query: '노르웨이',
      page: '2',
      size: '10',
    })
  })

  test('상세 검색은 검색 조건도 함께 요청한다', async () => {
    const fetchMock = mockFetch(() => Response.json(EMPTY_KAKAO_RESPONSE))

    await fetchBooks(
      { type: 'detail', searchTarget: 'person', query: '한강' },
      1,
      new AbortController().signal,
    )

    const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]), window.location.origin)
    expect(requestUrl.searchParams.get('target')).toBe('person')
  })

  test('응답을 Book 목록과 페이지 정보로 바꾼다', async () => {
    mockFetch(() =>
      Response.json({
        meta: { total_count: 1200, pageable_count: 1000, is_end: false },
        documents: [createKakaoBookDocument({ title: 'Tom &amp; Jerry' })],
      }),
    )

    const bookSearchPage = await fetchBooks(
      { type: 'all', query: 'tom' },
      1,
      new AbortController().signal,
    )

    expect(bookSearchPage).toMatchObject({ totalCount: 1200, pageableCount: 1000, isEnd: false })
    expect(bookSearchPage.books.map((book) => book.title)).toEqual(['Tom & Jerry'])
  })

  test('검색어가 바뀌면 이전 요청을 취소할 수 있도록 취소 신호를 넘긴다', async () => {
    const fetchMock = mockFetch(() => Response.json(EMPTY_KAKAO_RESPONSE))
    const abortController = new AbortController()

    await fetchBooks({ type: 'all', query: 'a' }, 1, abortController.signal)

    expect(fetchMock.mock.calls[0]?.[1]).toEqual({ signal: abortController.signal })
  })
})
