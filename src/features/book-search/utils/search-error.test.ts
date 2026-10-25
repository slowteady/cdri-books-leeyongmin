import { HttpError, NetworkError } from '@/lib/api-client'

import { describeSearchError } from './search-error'

describe('describeSearchError', () => {
  test('권한 오류(403)도 키 설정을 안내하고 다시 시도하지 않는다', () => {
    expect(describeSearchError(new HttpError(403))).toEqual({
      message: '서비스 설정 오류입니다. API 키(.env)를 확인해 주세요.',
      canRetry: false,
    })
  })

  test('잘못된 요청(400)은 검색어 확인을 안내하고 다시 시도하지 않는다', () => {
    expect(describeSearchError(new HttpError(400))).toEqual({
      message: '검색어를 확인해 주세요.',
      canRetry: false,
    })
  })

  test('요청이 너무 많으면(429) 잠시 후 다시 시도하라고 안내한다', () => {
    expect(describeSearchError(new HttpError(429))).toEqual({
      message: '요청이 많아요. 잠시 후 다시 시도해 주세요.',
      canRetry: true,
    })
  })

  test('네트워크에 연결하지 못하면 연결 확인을 안내하고 다시 시도할 수 있다', () => {
    expect(describeSearchError(new NetworkError())).toEqual({
      message: '네트워크 연결을 확인하고 다시 시도해 주세요.',
      canRetry: true,
    })
  })

  test('네트워크 오류가 아닌 예상하지 못한 오류는 일시적인 오류로 안내한다', () => {
    expect(describeSearchError(new TypeError('undefined is not a function'))).toEqual({
      message: '일시적인 오류입니다. 다시 시도해 주세요.',
      canRetry: true,
    })
  })

  test('서버 오류(5xx)는 일시적인 오류로 안내하고 다시 시도할 수 있다', () => {
    expect(describeSearchError(new HttpError(500))).toEqual({
      message: '일시적인 오류입니다. 다시 시도해 주세요.',
      canRetry: true,
    })
  })
})
