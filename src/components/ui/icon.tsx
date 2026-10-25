import type { SVGProps } from 'react'

import { cn } from '@/utils/cn'

import { ICON_DEFINITIONS, type IconName } from './icon-paths'

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'> & {
  name: IconName
}

export function Icon({ name, className, ...svgProps }: IconProps) {
  const { width, height, paths } = ICON_DEFINITIONS[name]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
      {...svgProps}
    >
      {paths.map((pathProps) => (
        <path key={pathProps.d} {...pathProps} />
      ))}
    </svg>
  )
}
