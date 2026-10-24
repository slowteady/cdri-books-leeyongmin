type ResultCountProps = {
  label: string
  count: number
}

export function ResultCount({ label, count }: ResultCountProps) {
  return (
    <p role="status" className="flex gap-4 text-caption leading-6 text-fg-primary">
      <span>{label}</span>
      <span>
        총 <span className="text-primary">{count.toLocaleString('ko-KR')}</span>건
      </span>
    </p>
  )
}
