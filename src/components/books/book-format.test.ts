import { formatPrice, getDisplayPrice, getThumbnailUrlCandidates } from './book-format'

describe('getDisplayPrice', () => {
  test('할인가가 있으면 할인가, 없으면 원가를 목록 가격으로 쓴다', () => {
    expect(getDisplayPrice({ originalPrice: 16000, salePrice: 13500 })).toBe(13500)
    expect(getDisplayPrice({ originalPrice: 16000, salePrice: null })).toBe(16000)
  })
})

describe('formatPrice', () => {
  test('천 단위 쉼표와 원을 붙이고, 가격이 없으면 안내 문구를 쓴다', () => {
    expect(formatPrice(13500)).toBe('13,500원')
    expect(formatPrice(null)).toBe('가격 정보 없음')
  })
})

describe('getThumbnailUrlCandidates', () => {
  const thumbnailUrl = 'https://example.com/cover.jpg'
  const largeThumbnailUrl = 'https://example.com/cover-large.jpg'

  test('펼치면 큰 표지를 먼저 쓰고, 실패하면 원래 표지를 쓴다', () => {
    expect(getThumbnailUrlCandidates({ thumbnailUrl, largeThumbnailUrl }, true)).toEqual([
      largeThumbnailUrl,
      thumbnailUrl,
    ])
  })

  test('큰 표지 주소가 없으면 펼쳐도 원래 표지만 쓴다', () => {
    expect(getThumbnailUrlCandidates({ thumbnailUrl, largeThumbnailUrl: null }, true)).toEqual([
      thumbnailUrl,
    ])
  })

  test('접혀 있으면 원래 표지만 쓴다', () => {
    expect(getThumbnailUrlCandidates({ thumbnailUrl, largeThumbnailUrl }, false)).toEqual([
      thumbnailUrl,
    ])
  })

  test('표지가 없으면 쓸 주소가 없다', () => {
    expect(
      getThumbnailUrlCandidates({ thumbnailUrl: null, largeThumbnailUrl: null }, true),
    ).toEqual([])
  })
})
