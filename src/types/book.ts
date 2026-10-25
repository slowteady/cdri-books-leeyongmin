export type Book = {
  id: string
  title: string
  authors: string[]
  publisher: string
  description: string | null
  detailUrl: string
  thumbnailUrl: string | null
  largeThumbnailUrl: string | null
  originalPrice: number | null
  salePrice: number | null
}
