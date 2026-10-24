import { render, screen } from '@testing-library/react'

import { IconButton } from './icon-button'

describe('IconButton', () => {
  test('아이콘만 보이지만 label이 버튼의 접근 이름이 된다', () => {
    render(<IconButton icon="closeFlat" label="닫기" />)

    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument()
  })
})
