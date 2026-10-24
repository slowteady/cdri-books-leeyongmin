import { render, screen } from '@testing-library/react'

import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  test('안내 문구를 보여주고 책 그림은 장식으로 처리한다', () => {
    render(<EmptyState message="검색된 결과가 없습니다." />)

    expect(screen.getByText('검색된 결과가 없습니다.')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
