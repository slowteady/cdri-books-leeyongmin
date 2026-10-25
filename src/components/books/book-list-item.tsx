import { useId, useState, type ReactNode } from 'react'

import { buttonStyles } from '@/components/ui/button-styles'
import { Icon } from '@/components/ui/icon'
import { useHeightTransition } from '@/hooks/use-height-transition'
import { useMorphTransition } from '@/hooks/use-morph-transition'
import type { Book } from '@/types/book'
import { cn } from '@/utils/cn'
import { preloadImage } from '@/utils/preload-image'

import {
  formatPrice,
  getDisplayPrice,
  getThumbnailUrlCandidates,
  toLargeThumbnailUrl,
} from './book-format'
import {
  BOOK_ROW_BASE,
  BOOK_THUMBNAIL_HEIGHT_PX,
  BOOK_THUMBNAIL_SIZE,
  BOOK_THUMBNAIL_WIDTH_PX,
} from './book-row-styles'

const ITEM_MOBILE_LAYOUT = `group relative items-start ${BOOK_ROW_BASE}`
const ITEM_DESKTOP_LAYOUT = 'lg:flex-nowrap lg:items-center lg:gap-0 lg:pr-4 lg:pb-3.75 lg:pl-12'
const ITEM_DESKTOP_EXPANDED_LAYOUT =
  'lg:data-expanded:items-stretch lg:data-expanded:pt-6 lg:data-expanded:pb-9.75 lg:data-expanded:pl-13.5'

export type RenderWishlistButton = (book: Book) => ReactNode

type BookListItemProps = {
  book: Book
  isExpanded: boolean
  onToggleExpanded: (bookId: string) => void
  renderWishlistButton: RenderWishlistButton
}

export function BookListItem({
  book,
  isExpanded,
  onToggleExpanded,
  renderWishlistButton,
}: BookListItemProps) {
  const elementId = useId()
  const titleId = `${elementId}-title`
  const descriptionId = `${elementId}-description`
  const drawerRef = useHeightTransition<HTMLDivElement>(isExpanded)

  return (
    <div ref={drawerRef}>
      <article
        aria-labelledby={titleId}
        data-expanded={isExpanded || undefined}
        className={cn(ITEM_MOBILE_LAYOUT, ITEM_DESKTOP_LAYOUT, ITEM_DESKTOP_EXPANDED_LAYOUT)}
      >
        <BookThumbnail
          book={book}
          isExpanded={isExpanded}
          wishlistButton={renderWishlistButton(book)}
        />
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
          onToggleExpanded={() => onToggleExpanded(book.id)}
        />
      </article>
    </div>
  )
}

const THUMBNAIL_FRAME = `relative ${BOOK_THUMBNAIL_SIZE} bg-light-gray`
const THUMBNAIL_EXPANDED_SIZE =
  'group-data-expanded:h-34 group-data-expanded:w-24 lg:group-data-expanded:h-70 lg:group-data-expanded:w-52.5'
const WISHLIST_BUTTON_POSITION =
  'absolute -top-1 -right-1 group-data-expanded:top-0 group-data-expanded:right-0 lg:group-data-expanded:top-2 lg:group-data-expanded:right-2'

type BookThumbnailProps = {
  book: Book
  isExpanded: boolean
  wishlistButton: ReactNode
}

function BookThumbnail({ book, isExpanded, wishlistButton }: BookThumbnailProps) {
  const thumbnailRef = useMorphTransition<HTMLDivElement>(isExpanded, { growOnly: true })
  const [failedThumbnailUrls, setFailedThumbnailUrls] = useState<string[]>([])
  const thumbnailUrlCandidates = getThumbnailUrlCandidates(book.thumbnailUrl, isExpanded)
  const thumbnailUrl = thumbnailUrlCandidates.find((url) => !failedThumbnailUrls.includes(url))

  const handleThumbnailError = () => {
    if (thumbnailUrl) setFailedThumbnailUrls((urls) => [...urls, thumbnailUrl])
  }

  return (
    <div ref={thumbnailRef} className={cn(THUMBNAIL_FRAME, THUMBNAIL_EXPANDED_SIZE)}>
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt=""
          width={BOOK_THUMBNAIL_WIDTH_PX}
          height={BOOK_THUMBNAIL_HEIGHT_PX}
          loading="lazy"
          decoding="async"
          onError={handleThumbnailError}
          className="size-full object-cover"
        />
      )}
      <div className={WISHLIST_BUTTON_POSITION}>{wishlistButton}</div>
    </div>
  )
}

const SUMMARY_LAYOUT =
  'min-w-0 flex-1 lg:ml-12 lg:group-data-expanded:ml-8 lg:group-data-expanded:pt-5'
const TITLE_ROW_LAYOUT =
  'flex min-w-0 flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-4'
const TITLE_TEXT =
  'text-title3 leading-6.5 text-fg-primary lg:truncate lg:leading-4.5 lg:group-data-expanded:leading-6.5 lg:group-data-expanded:whitespace-normal'
const AUTHOR_TEXT =
  'text-body2 text-fg-secondary group-data-expanded:leading-5.5 group-data-expanded:text-fg-subtitle lg:shrink-0'

type BookSummaryProps = {
  book: Book
  isExpanded: boolean
  titleId: string
  descriptionId: string
}

function BookSummary({ book, isExpanded, titleId, descriptionId }: BookSummaryProps) {
  return (
    <div className={SUMMARY_LAYOUT}>
      <div className={TITLE_ROW_LAYOUT}>
        <h2 id={titleId} className={TITLE_TEXT}>
          {book.title}
        </h2>
        {book.authors.length > 0 && <p className={AUTHOR_TEXT}>{book.authors.join(', ')}</p>}
      </div>
      <section
        id={descriptionId}
        hidden={!isExpanded}
        aria-label="책 소개"
        className="mt-4 lg:max-w-90"
      >
        <h3 className="text-body2 leading-6.5 font-bold text-fg-primary">책 소개</h3>
        <p className="mt-3 text-small leading-4 whitespace-pre-line text-fg-primary">
          {book.description ?? '책 소개가 없습니다.'}
        </p>
      </section>
    </div>
  )
}

const ACTIONS_MOBILE_LAYOUT = 'flex basis-full flex-wrap items-center gap-2'
const ACTIONS_DESKTOP_LAYOUT =
  'lg:ml-6 lg:basis-auto lg:flex-nowrap lg:gap-0 lg:group-data-expanded:flex-col lg:group-data-expanded:items-end'
const COLLAPSED_PRICE_TEXT =
  'basis-full text-title3 text-fg-primary group-data-expanded:hidden lg:mr-14 lg:basis-auto'
const EXPANDED_PRICES_LAYOUT =
  'hidden basis-full flex-col items-start gap-2 group-data-expanded:flex lg:mr-1 lg:basis-auto lg:group-data-expanded:mt-auto'
const PURCHASE_LINK_LAYOUT =
  'flex-1 lg:w-28.75 lg:flex-none lg:group-data-expanded:mt-7 lg:group-data-expanded:w-60'
const TOGGLE_BUTTON_LAYOUT =
  'flex-1 lg:ml-2 lg:w-28.75 lg:flex-none lg:pr-4.25 lg:group-data-expanded:order-first lg:group-data-expanded:mt-0.5 lg:group-data-expanded:ml-0'
const TOGGLE_ICON =
  'translate-y-0.5 text-ui-gray group-data-expanded:translate-y-0 group-data-expanded:rotate-180'

type BookActionsProps = {
  book: Book
  isExpanded: boolean
  descriptionId: string
  onToggleExpanded: () => void
}

function BookActions({ book, isExpanded, descriptionId, onToggleExpanded }: BookActionsProps) {
  const hasDiscount = book.salePrice !== null

  const preloadExpandedThumbnail = () => {
    if (book.thumbnailUrl && !isExpanded) preloadImage(toLargeThumbnailUrl(book.thumbnailUrl))
  }

  return (
    <div className={cn(ACTIONS_MOBILE_LAYOUT, ACTIONS_DESKTOP_LAYOUT)}>
      <p className={COLLAPSED_PRICE_TEXT}>{formatPrice(getDisplayPrice(book))}</p>
      <div className={EXPANDED_PRICES_LAYOUT}>
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
        className={buttonStyles({ className: PURCHASE_LINK_LAYOUT })}
      >
        구매하기
      </a>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={descriptionId}
        onClick={onToggleExpanded}
        onPointerEnter={preloadExpandedThumbnail}
        onFocus={preloadExpandedThumbnail}
        className={buttonStyles({ variant: 'secondary', className: TOGGLE_BUTTON_LAYOUT })}
      >
        상세보기
        <Icon name="chevronDown" className={TOGGLE_ICON} />
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
      <span className="h-5 w-9.25 text-right text-small leading-5.5 text-fg-subtitle">{label}</span>
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
