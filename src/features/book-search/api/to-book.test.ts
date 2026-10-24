import { createKakaoBookDocument } from '@/testing/data/kakao-books'

import { toBook } from './to-book'

describe('toBook', () => {
  test('제목, 저자, 출판사, 상세페이지 주소를 옮긴다', () => {
    const book = toBook(createKakaoBookDocument())

    expect(book).toMatchObject({
      title: '노르웨이의 숲',
      authors: ['무라카미 하루키'],
      publisher: '민음사',
      detailUrl: 'https://search.daum.net/search?w=bookpage&bookId=540378',
    })
  })

  test('원가와 할인가를 옮긴다', () => {
    const book = toBook(createKakaoBookDocument({ price: 17000, sale_price: 15300 }))

    expect(book).toMatchObject({ originalPrice: 17000, salePrice: 15300 })
  })

  test('할인가는 원가보다 싸고 0보다 클 때만 할인가로 본다', () => {
    expect(toBook(createKakaoBookDocument({ sale_price: -1 })).salePrice).toBeNull()
    expect(toBook(createKakaoBookDocument({ sale_price: 17000 })).salePrice).toBeNull()
    expect(toBook(createKakaoBookDocument({ sale_price: 18000 })).salePrice).toBeNull()
  })

  test('원가가 0이면 가격 정보가 없는 것으로 본다', () => {
    const book = toBook(createKakaoBookDocument({ price: 0, sale_price: -1 }))

    expect(book).toMatchObject({ originalPrice: null, salePrice: null })
  })

  test('id는 ISBN13을 우선하고, 없으면 ISBN10, 둘 다 없으면 상세페이지 주소를 쓴다', () => {
    expect(toBook(createKakaoBookDocument({ isbn: '8937434482 9788937434488' })).id).toBe(
      '9788937434488',
    )
    expect(toBook(createKakaoBookDocument({ isbn: ' 9791161991597' })).id).toBe('9791161991597')
    expect(toBook(createKakaoBookDocument({ isbn: '8937434482 ' })).id).toBe('8937434482')
    expect(toBook(createKakaoBookDocument({ isbn: '' })).id).toBe(createKakaoBookDocument().url)
  })

  test('썸네일 주소를 옮긴다', () => {
    expect(toBook(createKakaoBookDocument()).thumbnailUrl).toBe(createKakaoBookDocument().thumbnail)
  })

  test('썸네일 주소가 비어 있으면 썸네일이 없는 것으로 본다', () => {
    expect(toBook(createKakaoBookDocument({ thumbnail: '' })).thumbnailUrl).toBeNull()
  })

  test('책 소개를 옮긴다', () => {
    expect(toBook(createKakaoBookDocument({ contents: '첫 문장입니다.' })).description).toBe(
      '첫 문장입니다.',
    )
  })

  test('책 소개가 비어 있거나 공백뿐이면 소개가 없는 것으로 본다', () => {
    expect(toBook(createKakaoBookDocument({ contents: '' })).description).toBeNull()
    expect(toBook(createKakaoBookDocument({ contents: '   ' })).description).toBeNull()
  })

  test('책 소개가 문장 중간에서 끊겨 오면 끝에 말줄임표를 붙인다', () => {
    expect(toBook(createKakaoBookDocument({ contents: '잘린 문장인데' })).description).toBe(
      '잘린 문장인데…',
    )
    expect(toBook(createKakaoBookDocument({ contents: '끝난 문장.' })).description).toBe(
      '끝난 문장.',
    )
  })

  test('책 소개와 제목의 HTML 엔티티를 글자로 바꾼다', () => {
    const book = toBook(
      createKakaoBookDocument({
        title: 'Tom &amp; Jerry',
        contents: 'A &lt;B&gt; &#39;C&#x27; &quot;D&quot;&nbsp;&apos;E&apos;.',
      }),
    )

    expect(book.title).toBe('Tom & Jerry')
    expect(book.description).toBe(`A <B> 'C' "D"\u00A0'E'.`)
  })

  test('모르는 엔티티는 그대로 둔다', () => {
    expect(toBook(createKakaoBookDocument({ contents: '&unknown; 문장.' })).description).toBe(
      '&unknown; 문장.',
    )
  })

  test('범위를 벗어난 숫자 엔티티는 그대로 둔다', () => {
    expect(toBook(createKakaoBookDocument({ contents: '&#99999999; 문장.' })).description).toBe(
      '&#99999999; 문장.',
    )
  })

  test('비어 있는 저자 이름은 빼고 앞뒤 공백을 지운다', () => {
    expect(toBook(createKakaoBookDocument({ authors: ['', ' 한강 ', '  '] })).authors).toEqual([
      '한강',
    ])
  })
})
