import { render, screen } from '@testing-library/react'

import { useMorphTransition } from './use-morph-transition'

const SMALL_BOX = { offsetLeft: 48, offsetTop: 16, offsetWidth: 48, offsetHeight: 68 }
const LARGE_BOX = { offsetLeft: 54, offsetTop: 24, offsetWidth: 210, offsetHeight: 280 }

function Cover({ isLarge, isEnabled = true }: { isLarge: boolean; isEnabled?: boolean }) {
  const coverRef = useMorphTransition<HTMLDivElement>(isLarge, { isEnabled })
  return <div ref={coverRef} data-testid="cover" data-large={isLarge || undefined} />
}

function mockLayoutBoxes() {
  for (const property of Object.keys(SMALL_BOX) as (keyof typeof SMALL_BOX)[]) {
    vi.spyOn(HTMLElement.prototype, property, 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return (this.hasAttribute('data-large') ? LARGE_BOX : SMALL_BOX)[property]
    })
  }
}

function mockAnimate() {
  const animate = vi.fn(() => ({ cancel: vi.fn() }))
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true })
  onTestFinished(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  })
  return animate
}

function mockReducedMotion(isReduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: isReduced, media: query }))
}

describe('useMorphTransition', () => {
  test('크기와 위치가 바뀌면 이전 모습에서 새 모습으로 옮겨 가는 애니메이션을 한다', () => {
    mockLayoutBoxes()
    mockReducedMotion(false)
    const animate = mockAnimate()
    const { rerender } = render(<Cover isLarge={false} />)

    rerender(<Cover isLarge />)

    expect(animate).toHaveBeenCalledOnce()
    expect(animate).toHaveBeenCalledWith(
      [
        {
          transformOrigin: 'top left',
          transform: `translate(-6px, -8px) scale(${48 / 210}, ${68 / 280})`,
        },
        { transformOrigin: 'top left', transform: 'none' },
      ],
      expect.objectContaining({ duration: 300 }),
    )
    expect(screen.getByTestId('cover')).toBeInTheDocument()
  })

  test('동작 줄이기 설정이면 애니메이션하지 않는다', () => {
    mockLayoutBoxes()
    mockReducedMotion(true)
    const animate = mockAnimate()
    const { rerender } = render(<Cover isLarge={false} />)

    rerender(<Cover isLarge />)

    expect(animate).not.toHaveBeenCalled()
  })

  test('꺼 두면 크기가 바뀌어도 애니메이션하지 않는다', () => {
    mockLayoutBoxes()
    mockReducedMotion(false)
    const animate = mockAnimate()
    const { rerender } = render(<Cover isLarge={false} isEnabled={false} />)

    rerender(<Cover isLarge isEnabled={false} />)

    expect(animate).not.toHaveBeenCalled()
  })

  test('처음 그릴 때는 애니메이션하지 않는다', () => {
    mockLayoutBoxes()
    mockReducedMotion(false)
    const animate = mockAnimate()

    render(<Cover isLarge />)

    expect(animate).not.toHaveBeenCalled()
  })
})
