import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'

import { BOOK_ROW_BASE, BOOK_THUMBNAIL_SIZE } from './book-row-styles'

const SKELETON_ROW_MOBILE_LAYOUT = `items-center ${BOOK_ROW_BASE}`
const SKELETON_ROW_DESKTOP_LAYOUT = 'lg:h-25 lg:flex-nowrap lg:gap-12 lg:py-0 lg:pr-4 lg:pl-12'

type BookListSkeletonProps = {
  label: string
  rowCount: number
}

export function BookListSkeleton({ label, rowCount }: BookListSkeletonProps) {
  return (
    <div role="status" aria-label={label}>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <div key={rowIndex} className={cn(SKELETON_ROW_MOBILE_LAYOUT, SKELETON_ROW_DESKTOP_LAYOUT)}>
          <Skeleton className={BOOK_THUMBNAIL_SIZE} />
          <Skeleton className="h-4.5 min-w-0 flex-1 rounded-lg" />
          <Skeleton className="h-12 basis-full rounded-lg lg:w-60 lg:basis-auto" />
        </div>
      ))}
    </div>
  )
}
