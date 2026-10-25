type ResultCountProps = {
  label: string
  count: number | null
}

export function ResultCount({ label, count }: ResultCountProps) {
  return (
    <p role="status" className="flex gap-4 text-caption leading-6 text-fg-primary">
      <span>{label}</span>
      {count === null ? (
        <CountSkeleton />
      ) : (
        <span>
          총 <span className="text-primary">{count.toLocaleString('ko-KR')}</span>건
        </span>
      )}
    </p>
  )
}

function CountSkeleton() {
  return (
    <span className="my-1 h-4 w-16 rounded-sm bg-light-gray motion-safe:animate-pulse">
      <span className="sr-only">건수 불러오는 중</span>
    </span>
  )
}
