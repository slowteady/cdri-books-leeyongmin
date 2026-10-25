import { render } from '@testing-library/react'
import type { ReactElement } from 'react'

import { Icon } from './icon'

function renderIconSvg(element: ReactElement) {
  const { container } = render(element)
  return container.querySelector('svg')
}

describe('Icon', () => {
  test('장식용이라 보조기기에서 숨긴다', () => {
    const svg = renderIconSvg(<Icon name="search" />)

    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  test('Figma 원본 크기를 기본 크기로 쓴다', () => {
    const svg = renderIconSvg(<Icon name="chevronDown" />)

    expect(svg).toHaveAttribute('width', '14')
    expect(svg).toHaveAttribute('height', '8')
    expect(svg).toHaveAttribute('viewBox', '0 0 14 8')
  })

  test('색은 글자색을 따른다', () => {
    const svg = renderIconSvg(<Icon name="heartFill" className="text-red" />)

    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg).toHaveClass('text-red')
  })
})
