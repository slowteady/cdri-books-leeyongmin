import { mockFetch } from '@/testing/mock-fetch'

import { getJson, HttpError, NetworkError } from './api-client'

describe('getJson', () => {
  test('성공하면 응답 본문 JSON을 돌려준다', async () => {
    mockFetch(() => Response.json({ documents: [] }))

    await expect(getJson('/api/books')).resolves.toEqual({ documents: [] })
  })

  test('실패하면 상태 코드와 Kakao 에러 종류를 담은 HttpError를 던진다', async () => {
    mockFetch(() =>
      Response.json({ errorType: 'RequestThrottled', message: 'quota' }, { status: 429 }),
    )

    const error = await getJson('/api/books').catch((thrownError: unknown) => thrownError)

    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ status: 429, errorType: 'RequestThrottled' })
  })

  test('에러 본문이 JSON이 아니어도 상태 코드로 HttpError를 던진다', async () => {
    mockFetch(() => new Response('Bad Gateway', { status: 502 }))

    await expect(getJson('/api/books')).rejects.toMatchObject({ status: 502, errorType: null })
  })

  test('네트워크에 연결하지 못하면 NetworkError를 던진다', async () => {
    mockFetch(() => Promise.reject(new TypeError('Failed to fetch')))

    await expect(getJson('/api/books')).rejects.toBeInstanceOf(NetworkError)
  })

  test('요청이 취소되면 취소 오류를 바꾸지 않고 그대로 던진다', async () => {
    const abortError = new DOMException('aborted', 'AbortError')
    mockFetch(() => Promise.reject(abortError))

    await expect(getJson('/api/books')).rejects.toBe(abortError)
  })

  test('요청 취소 신호를 fetch에 그대로 넘긴다', async () => {
    const fetchMock = mockFetch(() => Response.json({}))
    const abortController = new AbortController()

    await getJson('/api/books', { signal: abortController.signal })

    expect(fetchMock).toHaveBeenCalledWith('/api/books', { signal: abortController.signal })
  })
})
