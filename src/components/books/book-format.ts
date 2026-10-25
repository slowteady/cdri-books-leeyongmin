import type { Book } from '@/types/book'

const PRICE_UNAVAILABLE_MESSAGE = '가격 정보 없음'

export function getDisplayPrice(book: Pick<Book, 'originalPrice' | 'salePrice'>) {
  return book.salePrice ?? book.originalPrice
}

export function formatPrice(price: number | null) {
  return price === null ? PRICE_UNAVAILABLE_MESSAGE : `${price.toLocaleString('ko-KR')}원`
}

export function getThumbnailUrlCandidates(
  { thumbnailUrl, largeThumbnailUrl }: Pick<Book, 'thumbnailUrl' | 'largeThumbnailUrl'>,
  isExpanded: boolean,
) {
  if (!thumbnailUrl) return []
  if (isExpanded && largeThumbnailUrl) return [largeThumbnailUrl, thumbnailUrl]
  return [thumbnailUrl]
}
