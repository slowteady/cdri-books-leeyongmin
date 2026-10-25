import { cn } from '@/utils/cn'

type SkeletonProps = {
  className: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <span aria-hidden="true" className={cn('bg-light-gray motion-safe:animate-pulse', className)} />
  )
}
