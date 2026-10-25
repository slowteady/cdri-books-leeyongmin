import { render } from '@testing-library/react'

import { EXPAND_TRANSITION_DURATION_MS } from '@/config/constants'
import { mockAnimate } from '@/testing/mock-animate'
import { mockReducedMotion } from '@/testing/mock-reduced-motion'

import { useMorphTransition } from './use-morph-transition'

const LAYOUT_PROPERTIES = ['offsetLeft', 'offsetTop', 'offsetWidth', 'offsetHeight'] as const
const SMALL_BOX = { offsetLeft: 48, offsetTop: 16, offsetWidth: 48, offsetHeight: 68 }
const LARGE_BOX = { offsetLeft: 54, offsetTop: 24, offsetWidth: 210, offsetHeight: 280 }

type CoverProps = {
  isLarge: boolean
  growOnly?: boolean
}

function Cover({ isLarge, growOnly = false }: CoverProps) {
  const coverRef = useMorphTransition<HTMLElement>(isLarge, { growOnly })
  return <figure ref={coverRef} aria-label="표지" data-large={isLarge || undefined} />
}

function mockLayoutBoxes() {
  for (const property of LAYOUT_PROPERTIES) {
    vi.spyOn(HTMLElement.prototype, property, 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return (this.hasAttribute('data-large') ? LARGE_BOX : SMALL_BOX)[property]
    })
  }
}

describe('useMorphTransition', () => {
  test('크기와 위치가 바뀌면 이전 모습에서 새 모습으로 옮겨 가는 애니메이션을 한다', () => {
    mockLayoutBoxes()
    const animate = mockAnimate()
    const { rerender } = render(<Cover isLarge={false} />)

    rerender(<Cover isLarge />)

    expect(animate).toHaveBeenCalledExactlyOnceWith(
      [
        {
          transformOrigin: 'top left',
          transform: `translate(-6px, -8px) scale(${48 / 210}, ${68 / 280})`,
        },
        { transformOrigin: 'top left', transform: 'none' },
      ],
      expect.objectContaining({ duration: EXPAND_TRANSITION_DURATION_MS }),
    )
  })

  test('동작 줄이기 설정이면 애니메이션하지 않는다', () => {
    mockLayoutBoxes()
    mockReducedMotion()
    const animate = mockAnimate()
    const { rerender } = render(<Cover isLarge={false} />)

    rerender(<Cover isLarge />)

    expect(animate).not.toHaveBeenCalled()
  })

  test('커질 때만 애니메이션하도록 하면 커질 때는 애니메이션한다', () => {
    mockLayoutBoxes()
    const animate = mockAnimate()
    const { rerender } = render(<Cover isLarge={false} growOnly />)

    rerender(<Cover isLarge growOnly />)

    expect(animate).toHaveBeenCalledOnce()
  })

  test('커질 때만 애니메이션하도록 하면 줄어들 때는 바로 바꾼다', () => {
    mockLayoutBoxes()
    const animate = mockAnimate()
    const { rerender } = render(<Cover isLarge growOnly />)

    rerender(<Cover isLarge={false} growOnly />)

    expect(animate).not.toHaveBeenCalled()
  })

  test('처음 그릴 때는 애니메이션하지 않는다', () => {
    mockLayoutBoxes()
    const animate = mockAnimate()

    render(<Cover isLarge />)

    expect(animate).not.toHaveBeenCalled()
  })
})
