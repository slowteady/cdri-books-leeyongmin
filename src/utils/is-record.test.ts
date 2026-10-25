import { isRecord } from './is-record'

describe('isRecord', () => {
  test('속성을 읽을 수 있는 객체면 참이다', () => {
    expect(isRecord({ query: '바다' })).toBe(true)
  })

  test('null이나 문자열·숫자 같은 원시값이면 거짓이다', () => {
    expect([null, undefined, '바다', 1, true].some(isRecord)).toBe(false)
  })
})
