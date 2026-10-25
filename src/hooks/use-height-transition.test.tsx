import { fireEvent, render, screen } from '@testing-library/react'

import { useHeightTransition } from './use-height-transition'

const CLOSED_HEIGHT = 100
const OPEN_HEIGHT = 344

function Drawer({ isOpen }: { isOpen: boolean }) {
  const drawerRef = useHeightTransition<HTMLDivElement>(isOpen)
  return (
    <div ref={drawerRef} data-testid="drawer">
      {isOpen ? '열림' : '닫힘'}
    </div>
  )
}

function mockNaturalHeights() {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.textContent === '열림' ? OPEN_HEIGHT : CLOSED_HEIGHT
  })
}

function mockReducedMotion(isReduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: isReduced, media: query }))
}

describe('useHeightTransition', () => {
  test('열고 닫으면 이전 높이에서 새 높이로 부드럽게 옮겨 간다', () => {
    mockNaturalHeights()
    mockReducedMotion(false)
    const { rerender } = render(<Drawer isOpen={false} />)

    rerender(<Drawer isOpen />)

    const drawer = screen.getByTestId('drawer')
    expect(drawer.style.height).toBe(`${OPEN_HEIGHT}px`)
    expect(drawer.style.transition).toContain('height')
    expect(drawer.style.overflow).toBe('hidden')
  })

  test('높이가 다 바뀌면 높이를 다시 내용에 맡긴다', () => {
    mockNaturalHeights()
    mockReducedMotion(false)
    const { rerender } = render(<Drawer isOpen={false} />)
    rerender(<Drawer isOpen />)
    const drawer = screen.getByTestId('drawer')

    fireEvent.transitionEnd(drawer, { propertyName: 'height' })

    expect(drawer.style.height).toBe('')
    expect(drawer.style.transition).toBe('')
    expect(drawer.style.overflow).toBe('')
  })

  test('동작 줄이기 설정이면 애니메이션 없이 바로 바꾼다', () => {
    mockNaturalHeights()
    mockReducedMotion(true)
    const { rerender } = render(<Drawer isOpen={false} />)

    rerender(<Drawer isOpen />)

    expect(screen.getByTestId('drawer').style.height).toBe('')
  })

  test('처음 그릴 때는 애니메이션하지 않는다', () => {
    mockNaturalHeights()
    mockReducedMotion(false)

    render(<Drawer isOpen />)

    expect(screen.getByTestId('drawer').style.height).toBe('')
  })
})
