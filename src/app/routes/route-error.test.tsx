import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { routes } from '@/app/router'

function BrokenPage(): never {
  throw new Error('화면을 그리지 못함')
}

describe('화면 오류', () => {
  test('화면을 그리다 오류가 나면 오류를 알리고 처음 화면으로 돌아갈 길을 준다', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const [rootRoute] = routes
    const router = createMemoryRouter([
      {
        path: '/',
        Component: rootRoute?.Component,
        ErrorBoundary: rootRoute?.ErrorBoundary,
        children: [{ index: true, Component: BrokenPage }],
      },
    ])

    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', { level: 1, name: '문제가 발생했습니다' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '도서 검색으로 돌아가기' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
