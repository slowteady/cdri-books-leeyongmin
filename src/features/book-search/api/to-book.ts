import type { Book } from '@/types/book'

export type KakaoBookDocument = {
  title: string
  contents: string
  url: string
  isbn: string
  datetime: string
  authors: string[]
  publisher: string
  translators: string[]
  price: number
  sale_price: number
  thumbnail: string
  status: string
}

const ISBN13_LENGTH = 13
const ISBN10_LENGTH = 10

function toBookId(isbn: string, detailUrl: string) {
  const isbnCodes = isbn.trim().split(/\s+/)
  return (
    isbnCodes.find((code) => code.length === ISBN13_LENGTH) ??
    isbnCodes.find((code) => code.length === ISBN10_LENGTH) ??
    detailUrl
  )
}

const HTML_ENTITY_PATTERN = /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi
const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
}

const MAX_CODE_POINT = 0x10ffff

function parseNumericEntity(entityName: string) {
  if (entityName.startsWith('#x')) return Number.parseInt(entityName.slice(2), 16)
  if (entityName.startsWith('#')) return Number.parseInt(entityName.slice(1), 10)
  return null
}

function decodeHtmlEntity(entity: string, entityName: string) {
  const codePoint = parseNumericEntity(entityName)
  if (codePoint === null) return NAMED_HTML_ENTITIES[entityName.toLowerCase()] ?? entity
  return codePoint <= MAX_CODE_POINT ? String.fromCodePoint(codePoint) : entity
}

function decodeHtmlEntities(text: string) {
  return text.replace(HTML_ENTITY_PATTERN, decodeHtmlEntity)
}

const SENTENCE_ENDING_PATTERN = /[.!?…"'”’)」』]$/
const TRUNCATION_MARK = '…'

function toDescription(contents: string) {
  const description = decodeHtmlEntities(contents).trim()
  if (!description) return null
  return SENTENCE_ENDING_PATTERN.test(description) ? description : description + TRUNCATION_MARK
}

function toAuthors(authors: string[]) {
  return authors.map((author) => author.trim()).filter(Boolean)
}

function toOriginalPrice(price: number) {
  return price > 0 ? price : null
}

function toSalePrice(originalPrice: number, salePrice: number) {
  const isDiscounted = salePrice > 0 && salePrice < originalPrice
  return isDiscounted ? salePrice : null
}

export function toBook(kakaoBook: KakaoBookDocument): Book {
  return {
    id: toBookId(kakaoBook.isbn, kakaoBook.url),
    title: decodeHtmlEntities(kakaoBook.title),
    authors: toAuthors(kakaoBook.authors),
    publisher: kakaoBook.publisher,
    description: toDescription(kakaoBook.contents),
    detailUrl: kakaoBook.url,
    thumbnailUrl: kakaoBook.thumbnail || null,
    originalPrice: toOriginalPrice(kakaoBook.price),
    salePrice: toSalePrice(kakaoBook.price, kakaoBook.sale_price),
  }
}
