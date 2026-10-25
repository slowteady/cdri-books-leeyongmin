import type { Ref } from 'react'

import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icon-paths'
import { useWishlistButton } from '@/features/wishlist/hooks/use-wishlist-button'
import type { Book } from '@/types/book'
import { cn } from '@/utils/cn'

type WishState = 'wished' | 'notWished'

type HeartStyle = {
  icon: IconName
  colorClassName: string
}

const COLLAPSED_ROW_HEART = {
  wished: { icon: 'heartFillSmall', colorClassName: 'text-red' },
  notWished: { icon: 'heartLineSmall', colorClassName: 'text-white' },
} as const satisfies Record<WishState, HeartStyle>

const EXPANDED_ROW_HEART = {
  wished: { icon: 'heartFill', colorClassName: 'text-red' },
  notWished: { icon: 'heartLine', colorClassName: 'text-gray' },
} as const satisfies Record<WishState, HeartStyle>

type WishlistButtonProps = {
  book: Book
  ref?: Ref<HTMLButtonElement>
  onUnwish?: () => void
}

export function WishlistButton({ book, ref, onUnwish }: WishlistButtonProps) {
  const { isWished, toggleWishlist } = useWishlistButton({ book, onUnwish })
  const wishState: WishState = isWished ? 'wished' : 'notWished'
  const collapsedRowHeart = COLLAPSED_ROW_HEART[wishState]
  const expandedRowHeart = EXPANDED_ROW_HEART[wishState]

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isWished}
      aria-label={`${book.title} 찜하기`}
      onClick={toggleWishlist}
      className="flex size-6 cursor-pointer items-center justify-center"
    >
      <Icon
        name={collapsedRowHeart.icon}
        className={cn(collapsedRowHeart.colorClassName, 'group-data-expanded:hidden')}
      />
      <Icon
        name={expandedRowHeart.icon}
        className={cn(expandedRowHeart.colorClassName, 'hidden group-data-expanded:block')}
      />
    </button>
  )
}
