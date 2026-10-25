import { fireEvent, render, screen } from '@testing-library/react'

import { mockReducedMotion } from '@/testing/mock-reduced-motion'

import { useHeightTransition } from './use-height-transition'

const CLOSED_HEIGHT = 100
const OPEN_HEIGHT = 344

function Drawer({ isOpen }: { isOpen: boolean }) {
  const drawerRef = useHeightTransition<HTMLElement>(isOpen)
  return (
    <section ref={drawerRef} aria-label="서랍">
      {isOpen ? '열림' : '닫힘'}
    </section>
  )
}

function getDrawer() {
  return screen.getByRole('region', { name: '서랍' })
}

function mockNaturalHeights() {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.textContent === '열림' ? OPEN_HEIGHT : CLOSED_HEIGHT
  })
}

describe('useHeightTransition', () => {
  test('열고 닫으면 이전 높이에서 새 높이로 부드럽게 옮겨 간다', () => {
    mockNaturalHeights()
    const { rerender } = render(<Drawer isOpen={false} />)

    rerender(<Drawer isOpen />)

    expect(getDrawer().style.height).toBe(`${OPEN_HEIGHT}px`)
    expect(getDrawer().style.transition).toContain('height')
    expect(getDrawer().style.overflow).toBe('hidden')
  })

  test('높이가 다 바뀌면 높이를 다시 내용에 맡긴다', () => {
    mockNaturalHeights()
    const { rerender } = render(<Drawer isOpen={false} />)
    rerender(<Drawer isOpen />)

    fireEvent.transitionEnd(getDrawer(), { propertyName: 'height' })

    expect(getDrawer().style.height).toBe('')
    expect(getDrawer().style.transition).toBe('')
    expect(getDrawer().style.overflow).toBe('')
  })

  test('동작 줄이기 설정이면 애니메이션 없이 바로 바꾼다', () => {
    mockNaturalHeights()
    mockReducedMotion()
    const { rerender } = render(<Drawer isOpen={false} />)

    rerender(<Drawer isOpen />)

    expect(getDrawer().style.height).toBe('')
  })

  test('처음 그릴 때는 애니메이션하지 않는다', () => {
    mockNaturalHeights()

    render(<Drawer isOpen />)

    expect(getDrawer().style.height).toBe('')
  })
})
