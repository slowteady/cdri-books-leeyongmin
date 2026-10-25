import { HttpError, NetworkError } from './api-client'
import { shouldRetryQuery } from './react-query'

describe('shouldRetryQuery', () => {
  test('요청이 잘못됐거나 키가 틀린 오류(400·401·403)는 다시 시도하지 않는다', () => {
    for (const status of [400, 401, 403]) {
      expect(shouldRetryQuery(0, new HttpError(status, null))).toBe(false)
    }
  })

  test('요청이 너무 많다는 오류(429)는 한 번만 다시 시도한다', () => {
    expect(shouldRetryQuery(0, new HttpError(429, 'RequestThrottled'))).toBe(true)
    expect(shouldRetryQuery(1, new HttpError(429, 'RequestThrottled'))).toBe(false)
  })

  test('서버 오류(5xx)와 네트워크 오류는 두 번까지 다시 시도한다', () => {
    const serverError = new HttpError(503, null)
    const networkError = new NetworkError()

    expect(shouldRetryQuery(1, serverError)).toBe(true)
    expect(shouldRetryQuery(2, serverError)).toBe(false)
    expect(shouldRetryQuery(1, networkError)).toBe(true)
    expect(shouldRetryQuery(2, networkError)).toBe(false)
  })

  test('네트워크 오류가 아닌 예상하지 못한 오류는 다시 시도하지 않는다', () => {
    expect(shouldRetryQuery(0, new TypeError('undefined is not a function'))).toBe(false)
  })
})
