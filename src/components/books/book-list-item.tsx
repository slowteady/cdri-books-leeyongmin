import { useId, useState, type ReactNode } from 'react'

import { buttonStyles } from '@/components/ui/button-styles'
import { Icon } from '@/components/ui/icon'
import type { Book } from '@/types/book'

import { formatPrice, getDisplayPrice, toLargeThumbnailUrl } from './book-format'

type BookListItemProps = {
  book: Book
  isExpanded: boolean
  onToggleExpanded: () => void
  wishlistSlot: ReactNode
}

export function BookListItem({
  book,
  isExpanded,
  onToggleExpanded,
  wishlistSlot,
}: BookListItemProps) {
  const elementId = useId()
  const titleId = `${elementId}-title`
  const descriptionId = `${elementId}-description`

  return (
    <article
      aria-labelledby={titleId}
      data-expanded={isExpanded || undefined}
      className="group flex items-center border-b border-divider py-4 pr-4 pl-12 data-expanded:items-stretch data-expanded:pt-6 data-expanded:pb-10 data-expanded:pl-13.5"
    >
      <BookThumbnail book={book} isExpanded={isExpanded} wishlistSlot={wishlistSlot} />
      <BookSummary
        book={book}
        isExpanded={isExpanded}
        titleId={titleId}
        descriptionId={descriptionId}
      />
      <BookActions
        book={book}
        isExpanded={isExpanded}
        descriptionId={descriptionId}
        onToggleExpanded={onToggleExpanded}
      />
    </article>
  )
}

type BookThumbnailProps = {
  book: Book
  isExpanded: boolean
  wishlistSlot: ReactNode
}

function BookThumbnail({ book, isExpanded, wishlistSlot }: BookThumbnailProps) {
  const [failedThumbnailUrls, setFailedThumbnailUrls] = useState<string[]>([])
  const thumbnailUrlCandidates = getThumbnailUrlCandidates(book.thumbnailUrl, isExpanded)
  const thumbnailUrl = thumbnailUrlCandidates.find((url) => !failedThumbnailUrls.includes(url))

  const handleThumbnailError = () => {
    if (thumbnailUrl) setFailedThumbnailUrls((urls) => [...urls, thumbnailUrl])
  }

  return (
    <div className="relative h-17 w-12 shrink-0 group-data-expanded:h-70 group-data-expanded:w-52.5">
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt=""
          width={48}
          height={68}
          loading="lazy"
          decoding="async"
          onError={handleThumbnailError}
          className="size-full object-cover"
        />
      ) : (
        <div className="size-full bg-light-gray" />
      )}
      <div className="absolute top-0 right-0 group-data-expanded:top-2 group-data-expanded:right-2">
        {wishlistSlot}
      </div>
    </div>
  )
}

function getThumbnailUrlCandidates(thumbnailUrl: string | null, isExpanded: boolean) {
  if (!thumbnailUrl) return []
  return isExpanded ? [toLargeThumbnailUrl(thumbnailUrl), thumbnailUrl] : [thumbnailUrl]
}

type BookSummaryProps = {
  book: Book
  isExpanded: boolean
  titleId: string
  descriptionId: string
}

function BookSummary({ book, isExpanded, titleId, descriptionId }: BookSummaryProps) {
  return (
    <div className="ml-12 min-w-0 flex-1 group-data-expanded:ml-8 group-data-expanded:pt-5">
      <div className="flex min-w-0 items-center gap-4">
        <h3
          id={titleId}
          className="truncate text-title3 text-fg-primary group-data-expanded:leading-6.5 group-data-expanded:whitespace-normal"
        >
          {book.title}
        </h3>
        {book.authors.length > 0 && (
          <p className="shrink-0 text-body2 text-fg-secondary group-data-expanded:leading-5.5 group-data-expanded:text-fg-subtitle">
            {book.authors.join(', ')}
          </p>
        )}
      </div>
      <section
        id={descriptionId}
        hidden={!isExpanded}
        aria-label="책 소개"
        className="mt-4 max-w-90"
      >
        <h4 className="text-body2 leading-6.5 font-bold text-fg-primary">책 소개</h4>
        <p className="mt-3 text-small leading-4 whitespace-pre-line text-fg-primary">
          {book.description ?? '책 소개가 없습니다.'}
        </p>
      </section>
    </div>
  )
}

type BookActionsProps = {
  book: Book
  isExpanded: boolean
  descriptionId: string
  onToggleExpanded: () => void
}

function BookActions({ book, isExpanded, descriptionId, onToggleExpanded }: BookActionsProps) {
  const hasDiscount = book.salePrice !== null

  return (
    <div className="ml-6 flex shrink-0 items-center group-data-expanded:flex-col group-data-expanded:items-end">
      <p className="mr-14 text-title3 text-fg-primary group-data-expanded:hidden">
        {formatPrice(getDisplayPrice(book))}
      </p>
      <div className="hidden flex-col items-end gap-2 group-data-expanded:mt-auto group-data-expanded:flex">
        <PriceRow label="원가">
          <OriginalPrice price={book.originalPrice} hasDiscount={hasDiscount} />
        </PriceRow>
        {hasDiscount && (
          <PriceRow label="할인가">
            <strong className="text-title3 leading-6.5 text-fg-primary">
              {formatPrice(book.salePrice)}
            </strong>
          </PriceRow>
        )}
      </div>
      <a
        href={book.detailUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonStyles({
          className: 'w-28.75 group-data-expanded:mt-7 group-data-expanded:w-60',
        })}
      >
        구매하기
      </a>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={descriptionId}
        onClick={onToggleExpanded}
        className={buttonStyles({
          variant: 'secondary',
          className:
            'ml-2 w-28.75 gap-1.5 px-0 group-data-expanded:order-first group-data-expanded:ml-0',
        })}
      >
        상세보기
        <Icon name="chevronDown" className="text-ui-gray group-data-expanded:rotate-180" />
      </button>
    </div>
  )
}

type PriceRowProps = {
  label: string
  children: ReactNode
}

function PriceRow({ label, children }: PriceRowProps) {
  return (
    <p className="flex items-center gap-2">
      <span className="w-9.25 text-right text-small leading-5.5 text-fg-subtitle">{label}</span>
      {children}
    </p>
  )
}

type OriginalPriceProps = {
  price: number | null
  hasDiscount: boolean
}

function OriginalPrice({ price, hasDiscount }: OriginalPriceProps) {
  const PriceElement = hasDiscount ? 'del' : 'span'

  return (
    <PriceElement className="text-title3 leading-6.5 font-demilight text-fg-primary">
      {formatPrice(price)}
    </PriceElement>
  )
}
