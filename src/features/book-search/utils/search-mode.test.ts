import { parseSearchMode, toSearchParams } from './search-mode'

function parse(queryString: string) {
  return parseSearchMode(new URLSearchParams(queryString))
}

describe('parseSearchMode', () => {
  test('검색어가 없으면 검색 전 상태다', () => {
    expect(parse('')).toEqual({ type: 'idle' })
  })

  test('검색어만 있으면 전체 검색이다', () => {
    expect(parse('q=노르웨이')).toEqual({ type: 'all', query: '노르웨이' })
  })

  test('검색어 앞뒤 공백은 지우고, 공백뿐이면 검색 전 상태다', () => {
    expect(parse('q=%20%20숲%20')).toEqual({ type: 'all', query: '숲' })
    expect(parse('q=%20%20')).toEqual({ type: 'idle' })
  })

  test('검색 조건이 있으면 상세 검색이다', () => {
    expect(parse('q=한강&target=person')).toEqual({
      type: 'detail',
      searchTarget: 'person',
      query: '한강',
    })
  })

  test('허용되지 않은 검색 조건은 무시하고 전체 검색으로 본다', () => {
    expect(parse('q=a&target=isbn')).toEqual({ type: 'all', query: 'a' })
  })
})

describe('toSearchParams', () => {
  test('전체 검색은 검색어만 URL에 남긴다', () => {
    expect(toSearchParams({ type: 'all', query: '숲' }).toString()).toBe('q=%EC%88%B2')
  })

  test('상세 검색은 검색어와 검색 조건을 함께 남긴다', () => {
    const searchParams = toSearchParams({
      type: 'detail',
      searchTarget: 'publisher',
      query: '민음사',
    })

    expect(searchParams.get('q')).toBe('민음사')
    expect(searchParams.get('target')).toBe('publisher')
  })
})
