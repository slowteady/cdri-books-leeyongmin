import bookEmptyImageUrl from '@/assets/book-empty.png'

type EmptyStateProps = {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 pt-21">
      <img src={bookEmptyImageUrl} alt="" width={80} height={80} />
      <p className="text-caption text-fg-secondary">{message}</p>
    </div>
  )
}
