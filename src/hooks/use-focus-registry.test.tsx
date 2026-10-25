import { render, screen, waitFor } from '@testing-library/react'

import { useFocusRegistry } from './use-focus-registry'

type ButtonGroupProps = {
  buttonKeys: string[]
  focusTargetKey: string | null
}

function ButtonGroup({ buttonKeys, focusTargetKey }: ButtonGroupProps) {
  const { registerElement, registerFallbackElement, focusOnNextFrame } = useFocusRegistry<string>()

  return (
    <section ref={registerFallbackElement} aria-label="버튼 묶음" tabIndex={-1}>
      {buttonKeys.map((buttonKey) => (
        <button key={buttonKey} type="button" ref={registerElement(buttonKey)}>
          {buttonKey}
        </button>
      ))}
      <button type="button" onClick={() => focusOnNextFrame(focusTargetKey)}>
        포커스 옮기기
      </button>
    </section>
  )
}

function moveFocus() {
  screen.getByRole('button', { name: '포커스 옮기기' }).click()
}

describe('useFocusRegistry', () => {
  test('등록한 요소 중 지정한 키의 요소로 포커스를 옮긴다', async () => {
    render(<ButtonGroup buttonKeys={['a', 'b']} focusTargetKey="b" />)

    moveFocus()

    await waitFor(() => expect(screen.getByRole('button', { name: 'b' })).toHaveFocus())
  })

  test('키가 없으면 대체 요소로 포커스를 옮긴다', async () => {
    render(<ButtonGroup buttonKeys={['a']} focusTargetKey={null} />)

    moveFocus()

    await waitFor(() => expect(screen.getByRole('region', { name: '버튼 묶음' })).toHaveFocus())
  })

  test('화면에서 사라진 요소는 등록에서 빠져 대체 요소로 포커스를 옮긴다', async () => {
    const { rerender } = render(<ButtonGroup buttonKeys={['a', 'b']} focusTargetKey="b" />)
    rerender(<ButtonGroup buttonKeys={['a']} focusTargetKey="b" />)

    moveFocus()

    await waitFor(() => expect(screen.getByRole('region', { name: '버튼 묶음' })).toHaveFocus())
  })
})
