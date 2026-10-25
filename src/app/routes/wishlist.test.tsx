import { screen, waitFor } from '@testing-library/react'

import { useWishlistStore } from '@/features/wishlist/stores/wishlist-store'
import { createBook } from '@/testing/data/books'
import { createKakaoBookSearchResponse } from '@/testing/data/kakao-books'
import { mockFetch } from '@/testing/mock-fetch'
import { renderApp } from '@/testing/test-utils'

function mockBookSearchApi(totalCount = 3) {
  return mockFetch((requestUrl) => {
    const page = Number(requestUrl.searchParams.get('page'))
    return Response.json(createKakaoBookSearchResponse({ page, totalCount }))
  })
}

describe('찜하기', () => {
  test('검색 결과의 하트를 누르면 찜하고, 다시 누르면 찜을 해제한다', async () => {
    mockBookSearchApi()
    const { user } = renderApp('/?q=테스트')
    const wishlistButton = await screen.findByRole('button', { name: '테스트 책 1 찜하기' })

    await user.click(wishlistButton)
    expect(wishlistButton).toHaveAttribute('aria-pressed', 'true')

    await user.click(wishlistButton)
    expect(wishlistButton).toHaveAttribute('aria-pressed', 'false')
  })

  test('찜한 책은 내가 찜한 책 페이지에 찜한 건수와 함께 나온다', async () => {
    mockBookSearchApi()
    const { user } = renderApp('/?q=테스트')

    await user.click(await screen.findByRole('button', { name: '테스트 책 2 찜하기' }))
    await user.click(screen.getByRole('link', { name: '내가 찜한 책' }))

    expect(await screen.findByRole('heading', { name: '테스트 책 2' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('찜한 책총 1건')
  })

  test('찜한 책이 없으면 찜한 책이 없다고 보여준다', async () => {
    renderApp('/wishlist')

    expect(await screen.findByText('찜한 책이 없습니다.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('찜한 책총 0건')
  })

  test('찜한 책은 페이지당 10권씩 보여주고 더 보기로 이어서 보여준다', async () => {
    useWishlistStore.setState({
      wishedBooks: Array.from({ length: 12 }, (_, index) =>
        createBook({ id: `book-${index + 1}`, title: `찜한 책 ${index + 1}` }),
      ),
    })
    const { user } = renderApp('/wishlist')

    expect(await screen.findAllByRole('article')).toHaveLength(10)
    await user.click(screen.getByRole('button', { name: '더 보기' }))

    expect(screen.getAllByRole('article')).toHaveLength(12)
    expect(screen.queryByRole('button', { name: '더 보기' })).not.toBeInTheDocument()
  })

  test('찜 페이지에서 찜을 해제하면 바로 목록에서 빠지고 포커스는 다음 책의 하트로 옮긴다', async () => {
    useWishlistStore.setState({
      wishedBooks: [
        createBook({ id: 'first', title: '첫 번째 책' }),
        createBook({ id: 'second', title: '두 번째 책' }),
      ],
    })
    const { user } = renderApp('/wishlist')

    await user.click(await screen.findByRole('button', { name: '첫 번째 책 찜하기' }))

    expect(screen.queryByRole('heading', { name: '첫 번째 책' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('찜한 책총 1건')
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '두 번째 책 찜하기' })).toHaveFocus(),
    )
  })

  test('마지막 책의 찜을 해제하면 포커스는 이전 책의 하트로 옮긴다', async () => {
    useWishlistStore.setState({
      wishedBooks: [
        createBook({ id: 'first', title: '첫 번째 책' }),
        createBook({ id: 'second', title: '두 번째 책' }),
      ],
    })
    const { user } = renderApp('/wishlist')

    await user.click(await screen.findByRole('button', { name: '두 번째 책 찜하기' }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: '첫 번째 책 찜하기' })).toHaveFocus(),
    )
  })

  test('찜 페이지는 검색 API를 다시 부르지 않고 찜한 시점의 책 정보를 보여준다', async () => {
    const fetchMock = mockBookSearchApi()
    useWishlistStore.setState({
      wishedBooks: [createBook({ id: 'saved', title: '찜할 때 본 제목', salePrice: 9900 })],
    })

    renderApp('/wishlist')

    expect(await screen.findByRole('heading', { name: '찜할 때 본 제목' })).toBeInTheDocument()
    expect(screen.getAllByText('9,900원').length).toBeGreaterThan(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
