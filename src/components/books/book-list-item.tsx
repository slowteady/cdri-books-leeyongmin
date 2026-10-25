import { useId, useState, type ReactNode } from 'react'

import { buttonStyles } from '@/components/ui/button-styles'
import { Icon } from '@/components/ui/icon'
import type { Book } from '@/types/book'
import { cn } from '@/utils/cn'

import { formatPrice, getDisplayPrice, toLargeThumbnailUrl } from './book-format'

const ITEM_MOBILE_LAYOUT = 'group flex flex-wrap items-start gap-4 border-b border-divider py-4'
const ITEM_DESKTOP_LAYOUT = 'lg:flex-nowrap lg:items-center lg:gap-0 lg:pr-4 lg:pl-12'
const ITEM_DESKTOP_EXPANDED_LAYOUT =
  'lg:data-expanded:items-stretch lg:data-expanded:pt-6 lg:data-expanded:pb-10 lg:data-expanded:pl-13.5'

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
      className={cn(ITEM_MOBILE_LAYOUT, ITEM_DESKTOP_LAYOUT, ITEM_DESKTOP_EXPANDED_LAYOUT)}
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
    <div className="relative h-17 w-12 shrink-0 group-data-expanded:h-34 group-data-expanded:w-24 lg:group-data-expanded:h-70 lg:group-data-expanded:w-52.5">
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
      <div className="absolute top-0 right-0 lg:group-data-expanded:top-2 lg:group-data-expanded:right-2">
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
    <div className="min-w-0 flex-1 lg:ml-12 lg:group-data-expanded:ml-8 lg:group-data-expanded:pt-5">
      <div className="flex min-w-0 flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-4">
        <h3
          id={titleId}
          className="text-title3 leading-6.5 text-fg-primary lg:truncate lg:leading-4.5 lg:group-data-expanded:leading-6.5 lg:group-data-expanded:whitespace-normal"
        >
          {book.title}
        </h3>
        {book.authors.length > 0 && (
          <p className="text-body2 text-fg-secondary group-data-expanded:leading-5.5 group-data-expanded:text-fg-subtitle lg:shrink-0">
            {book.authors.join(', ')}
          </p>
        )}
      </div>
      <section
        id={descriptionId}
        hidden={!isExpanded}
        aria-label="책 소개"
        className="mt-4 lg:max-w-90"
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
    <div className="flex basis-full flex-wrap items-center gap-2 lg:ml-6 lg:basis-auto lg:flex-nowrap lg:gap-0 lg:group-data-expanded:flex-col lg:group-data-expanded:items-end">
      <p className="basis-full text-title3 text-fg-primary group-data-expanded:hidden lg:mr-14 lg:basis-auto">
        {formatPrice(getDisplayPrice(book))}
      </p>
      <div className="hidden basis-full flex-col items-start gap-2 group-data-expanded:flex lg:basis-auto lg:items-end lg:group-data-expanded:mt-auto">
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
          className:
            'flex-1 lg:w-28.75 lg:flex-none lg:group-data-expanded:mt-7 lg:group-data-expanded:w-60',
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
            'flex-1 lg:ml-2 lg:w-28.75 lg:flex-none lg:group-data-expanded:order-first lg:group-data-expanded:ml-0',
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
