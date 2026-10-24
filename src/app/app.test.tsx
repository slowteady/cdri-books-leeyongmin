import { render, screen } from '@testing-library/react'

import { App } from './app'

describe('App', () => {
  test('앱을 실행하면 도서 검색 화면이 보인다', async () => {
    render(<App />)

    expect(await screen.findByRole('heading', { level: 1, name: '도서 검색' })).toBeInTheDocument()
  })
})
