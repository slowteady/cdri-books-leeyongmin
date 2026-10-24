import type { ComponentProps } from 'react'

import { cn } from '@/utils/cn'

import { Icon } from './icon'
import type { IconName } from './icon-paths'

type IconButtonProps = Omit<ComponentProps<'button'>, 'children' | 'aria-label'> & {
  icon: IconName
  label: string
  iconClassName?: string
}

export function IconButton({
  icon,
  label,
  iconClassName,
  className,
  type = 'button',
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn('inline-flex shrink-0 cursor-pointer items-center justify-center', className)}
      {...buttonProps}
    >
      <Icon name={icon} className={iconClassName} />
    </button>
  )
}
