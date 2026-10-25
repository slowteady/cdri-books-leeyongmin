import type { Book } from '@/types/book'

export function createBook(overrides: Partial<Book> = {}): Book {
  return {
    id: '9788937434488',
    title: '노르웨이의 숲',
    authors: ['무라카미 하루키'],
    publisher: '민음사',
    description: '나를 언제까지나 잊지 마, 내가 여기 있었다는 걸 기억해 줘.',
    detailUrl: 'https://search.daum.net/search?w=bookpage&bookId=540378',
    thumbnailUrl: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=540378',
    largeThumbnailUrl: 'https://search1.kakaocdn.net/thumb/R400x0/?fname=540378',
    originalPrice: 16000,
    salePrice: 13500,
    ...overrides,
  }
}
