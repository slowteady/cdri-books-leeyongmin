import { screen } from '@testing-library/react'

import { mockBookSearchApi } from '@/testing/mock-book-search-api'
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

  test('다른 탭으로 이동하면 새 페이지를 맨 위부터 보여준다', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const { user } = renderApp('/')
    await screen.findByRole('heading', { level: 1, name: '도서 검색' })
    scrollTo.mockClear()

    await user.click(screen.getByRole('link', { name: '내가 찜한 책' }))

    await screen.findByRole('heading', { level: 1, name: '내가 찜한 책' })
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  test('찜 탭에 갔다가 도서 검색 탭으로 돌아오면 보던 검색 결과를 그대로 보여준다', async () => {
    mockBookSearchApi()
    const { router, user } = renderApp('/?q=바다')
    await screen.findByText('테스트 책 1')
    await user.click(screen.getByRole('link', { name: '내가 찜한 책' }))
    await screen.findByRole('heading', { level: 1, name: '내가 찜한 책' })

    await user.click(screen.getByRole('link', { name: '도서 검색' }))

    expect(await screen.findByText('테스트 책 1')).toBeInTheDocument()
    expect(new URLSearchParams(router.state.location.search).get('q')).toBe('바다')
    expect(screen.getByRole('combobox', { name: '검색어' })).toHaveValue('바다')
  })

  test('찜 탭에 갔다가 도서 검색 탭으로 돌아오면 보던 스크롤 위치로 돌아간다', async () => {
    mockBookSearchApi()
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const { user } = renderApp('/?q=바다')
    await screen.findByText('테스트 책 1')
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(640)
    await user.click(screen.getByRole('link', { name: '내가 찜한 책' }))
    await screen.findByRole('heading', { level: 1, name: '내가 찜한 책' })
    scrollTo.mockClear()

    await user.click(screen.getByRole('link', { name: '도서 검색' }))

    await screen.findByText('테스트 책 1')
    expect(scrollTo).toHaveBeenLastCalledWith(0, 640)
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
