import { cn } from '@/utils/cn'

const BASE_CLASS_NAME =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-lg disabled:cursor-not-allowed disabled:opacity-50'

const VARIANT_CLASS_NAMES = {
  primary: 'bg-primary text-white',
  secondary: 'bg-light-gray text-fg-secondary',
  outline: 'border border-fg-subtitle bg-white text-fg-subtitle',
} as const

const SIZE_CLASS_NAMES = {
  lg: 'h-12 px-5 text-caption',
  md: 'h-9 px-2.5 text-body2 leading-5.5',
  sm: 'h-8.75 px-2.5 text-body2',
} as const

export type ButtonVariant = keyof typeof VARIANT_CLASS_NAMES
export type ButtonSize = keyof typeof SIZE_CLASS_NAMES

type ButtonStyleOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function buttonStyles({
  variant = 'primary',
  size = 'lg',
  className,
}: ButtonStyleOptions = {}) {
  return cn(BASE_CLASS_NAME, VARIANT_CLASS_NAMES[variant], SIZE_CLASS_NAMES[size], className)
}
