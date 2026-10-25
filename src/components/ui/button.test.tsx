import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from './button'

describe('Button', () => {
  test('기본 type이 button이라 폼 안에서 눌러도 제출되지 않는다', async () => {
    const handleSubmit = vi.fn()
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        <Button>상세보기</Button>
      </form>,
    )

    await userEvent.click(screen.getByRole('button', { name: '상세보기' }))

    expect(handleSubmit).not.toHaveBeenCalled()
  })

  test('바깥에서 준 폭 클래스를 함께 적용한다', () => {
    render(<Button className="w-28.75">구매하기</Button>)

    expect(screen.getByRole('button', { name: '구매하기' })).toHaveClass('w-28.75', 'bg-primary')
  })
})
