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

export function respondPending() {
  return new Promise<Response>(() => {})
}

export function mockPendingBookSearchApi() {
  return mockFetch(respondPending)
}

export function mockBookSearchApiFailingOnce(
  respondAfterFailure: (requestUrl: URL) => Response | Promise<Response>,
) {
  let hasFailed = false
  return mockFetch((requestUrl) => {
    if (hasFailed) return respondAfterFailure(requestUrl)
    hasFailed = true
    return new Response(null, { status: 503 })
  })
}
