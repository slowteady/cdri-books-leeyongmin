import type { Ref } from 'react'

import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icon-paths'
import { useIsWishedBook, useWishlistActions } from '@/features/wishlist/stores/wishlist-store'
import type { Book } from '@/types/book'
import { cn } from '@/utils/cn'

type WishState = 'wished' | 'notWished'

type HeartStyle = {
  icon: IconName
  colorClassName: string
}

const COLLAPSED_ROW_HEART: Record<WishState, HeartStyle> = {
  wished: { icon: 'likeFillSmall', colorClassName: 'text-red' },
  notWished: { icon: 'likeLineSmall', colorClassName: 'text-white' },
}

const EXPANDED_ROW_HEART: Record<WishState, HeartStyle> = {
  wished: { icon: 'likeFill', colorClassName: 'text-red' },
  notWished: { icon: 'likeLine', colorClassName: 'text-gray' },
}

type WishlistButtonProps = {
  book: Book
  ref?: Ref<HTMLButtonElement>
  onUnwish?: () => void
}

export function WishlistButton({ book, ref, onUnwish }: WishlistButtonProps) {
  const isWished = useIsWishedBook(book.id)
  const { toggleWishedBook } = useWishlistActions()
  const wishState: WishState = isWished ? 'wished' : 'notWished'
  const collapsedRowHeart = COLLAPSED_ROW_HEART[wishState]
  const expandedRowHeart = EXPANDED_ROW_HEART[wishState]

  const handleClick = () => {
    toggleWishedBook(book)
    if (isWished) onUnwish?.()
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isWished}
      aria-label={`${book.title} 찜하기`}
      onClick={handleClick}
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
