import { screen } from '@testing-library/react'

import { renderApp } from '@/testing/test-utils'

describe('페이지 이동', () => {
  test('첫 화면은 도서 검색 페이지다', async () => {
    renderApp('/')

    expect(await screen.findByRole('heading', { level: 1, name: '도서 검색' })).toBeInTheDocument()
  })

  test('헤더의 "내가 찜한 책" 탭을 누르면 찜 페이지로 이동한다', async () => {
    const { user } = renderApp('/')

    await user.click(await screen.findByRole('link', { name: '내가 찜한 책' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: '내가 찜한 책' }),
    ).toBeInTheDocument()
  })

  test('현재 페이지의 탭만 현재 탭으로 표시한다', async () => {
    renderApp('/wishlist')

    expect(await screen.findByRole('link', { name: '내가 찜한 책' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: '도서 검색' })).not.toHaveAttribute('aria-current')
  })

  test('없는 주소로 들어오면 페이지를 찾을 수 없다고 알려준다', async () => {
    renderApp('/unknown-page')

    expect(
      await screen.findByRole('heading', { level: 1, name: '페이지를 찾을 수 없습니다' }),
    ).toBeInTheDocument()
  })
})
