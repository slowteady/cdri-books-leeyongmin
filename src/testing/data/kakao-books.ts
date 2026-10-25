import type { KakaoBookDocument } from '@/features/book-search/api/to-book'

export function createKakaoBookDocument(
  overrides: Partial<KakaoBookDocument> = {},
): KakaoBookDocument {
  return {
    title: '노르웨이의 숲',
    contents: '첫 문장입니다.',
    url: 'https://search.daum.net/search?w=bookpage&bookId=540378',
    isbn: '8937434482 9788937434488',
    datetime: '2017-08-07T00:00:00.000+09:00',
    authors: ['무라카미 하루키'],
    publisher: '민음사',
    translators: ['양억관'],
    price: 17000,
    sale_price: 15300,
    thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=540378',
    status: '정상판매',
    ...overrides,
  }
}

type KakaoBookSearchResponseOptions = {
  page: number
  totalCount: number
  pageSize?: number
}

export function createKakaoBookSearchResponse({
  page,
  totalCount,
  pageSize = 10,
}: KakaoBookSearchResponseOptions) {
  const firstIndex = (page - 1) * pageSize
  const documentCount = Math.max(0, Math.min(pageSize, totalCount - firstIndex))
  return {
    meta: {
      total_count: totalCount,
      pageable_count: totalCount,
      is_end: firstIndex + documentCount >= totalCount,
    },
    documents: Array.from({ length: documentCount }, (_, offset) => {
      const bookNumber = firstIndex + offset + 1
      return createKakaoBookDocument({
        title: `테스트 책 ${bookNumber}`,
        isbn: `${9780000000000 + bookNumber}`,
        url: `https://search.daum.net/search?w=bookpage&bookId=${bookNumber}`,
      })
    }),
  }
}
