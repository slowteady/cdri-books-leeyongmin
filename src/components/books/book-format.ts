import type { Book } from '@/types/book'

const PRICE_UNAVAILABLE_MESSAGE = '가격 정보 없음'
const KAKAO_THUMBNAIL_SIZE_SEGMENT_PATTERN = /\/thumb\/R\d+x\d+(?:\.q\d+)?\//
const KAKAO_LARGE_THUMBNAIL_SIZE_SEGMENT = '/thumb/R400x0/'

export function getDisplayPrice(book: Pick<Book, 'originalPrice' | 'salePrice'>) {
  return book.salePrice ?? book.originalPrice
}

export function formatPrice(price: number | null) {
  return price === null ? PRICE_UNAVAILABLE_MESSAGE : `${price.toLocaleString('ko-KR')}원`
}

export function toLargeThumbnailUrl(thumbnailUrl: string) {
  return thumbnailUrl.replace(
    KAKAO_THUMBNAIL_SIZE_SEGMENT_PATTERN,
    KAKAO_LARGE_THUMBNAIL_SIZE_SEGMENT,
  )
}

export function getThumbnailUrlCandidates(thumbnailUrl: string | null, isExpanded: boolean) {
  if (!thumbnailUrl) return []
  return isExpanded ? [toLargeThumbnailUrl(thumbnailUrl), thumbnailUrl] : [thumbnailUrl]
}
