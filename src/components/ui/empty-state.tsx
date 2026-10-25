import bookEmptyImageUrl from '@/assets/book-empty.png'

const EMPTY_STATE_IMAGE_SIZE_PX = 80

type EmptyStateProps = {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 pt-21">
      <img
        src={bookEmptyImageUrl}
        alt=""
        width={EMPTY_STATE_IMAGE_SIZE_PX}
        height={EMPTY_STATE_IMAGE_SIZE_PX}
      />
      <p className="text-caption text-fg-secondary">{message}</p>
    </div>
  )
}
