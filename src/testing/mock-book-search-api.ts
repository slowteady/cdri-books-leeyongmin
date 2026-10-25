import { createKakaoBookSearchResponse } from './data/kakao-books'
import { mockFetch } from './mock-fetch'

const DEFAULT_TOTAL_COUNT = 3

export function getRequestedPage(requestUrl: URL) {
  return Number(requestUrl.searchParams.get('page'))
}

export function respondWithBookSearchPage(requestUrl: URL, totalCount = DEFAULT_TOTAL_COUNT) {
  const page = getRequestedPage(requestUrl)
  return Response.json(createKakaoBookSearchResponse({ page, totalCount }))
}

export function mockBookSearchApi(totalCount = DEFAULT_TOTAL_COUNT) {
  return mockFetch((requestUrl) => respondWithBookSearchPage(requestUrl, totalCount))
}
