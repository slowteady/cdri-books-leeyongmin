import { render, screen } from '@testing-library/react'

import { ResultCount } from './result-count'

describe('ResultCount', () => {
  test('"도서 검색 결과 총 N건" 형식으로 건수를 알린다', () => {
    render(<ResultCount label="도서 검색 결과" count={1200} />)

    expect(screen.getByRole('status')).toHaveTextContent('도서 검색 결과총 1,200건')
  })
})
