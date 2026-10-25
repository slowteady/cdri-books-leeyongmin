import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createBook } from '@/testing/data/books'
import { mockVisibleIntersectionObserver } from '@/testing/mock-intersection-observer'
import type { Book } from '@/types/book'

import { BookList } from './book-list'

const books: Book[] = [
  createBook({ id: 'a', title: '노르웨이의 숲' }),
  createBook({ id: 'b', title: '해변의 카프카' }),
]

type BookListOptions = {
  hasMore?: boolean
  isLoadingMore?: boolean
  hasLoadMoreFailed?: boolean
}

function renderBookList({
  hasMore = false,
  isLoadingMore = false,
  hasLoadMoreFailed = false,
}: BookListOptions = {}) {
  const handleLoadMore = vi.fn()
  render(
    <BookList
      books={books}
      renderWishlistButton={() => null}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      hasLoadMoreFailed={hasLoadMoreFailed}
      onLoadMore={handleLoadMore}
    />,
  )
  return { handleLoadMore }
}

describe('BookList', () => {
  test('받은 책을 순서대로 목록으로 보여준다', () => {
    renderBookList()

    expect(screen.getAllByRole('article').map((article) => article.textContent)).toEqual([
      expect.stringContaining('노르웨이의 숲'),
      expect.stringContaining('해변의 카프카'),
    ])
  })

  test('상세보기는 한 번에 한 권만 펼친다', async () => {
    renderBookList()
    const [firstToggle, secondToggle] = screen.getAllByRole('button', { name: '상세보기' })

    await userEvent.click(firstToggle)
    await userEvent.click(secondToggle)

    expect(firstToggle).toHaveAttribute('aria-expanded', 'false')
    expect(secondToggle).toHaveAttribute('aria-expanded', 'true')
  })

  test('펼친 책의 상세보기를 다시 누르면 접는다', async () => {
    renderBookList()
    const [firstToggle] = screen.getAllByRole('button', { name: '상세보기' })

    await userEvent.click(firstToggle)
    await userEvent.click(firstToggle)

    expect(firstToggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('더 불러올 결과가 있으면 더 보기 버튼으로 다음 목록을 요청한다', async () => {
    const { handleLoadMore } = renderBookList({ hasMore: true })

    await userEvent.click(screen.getByRole('button', { name: '더 보기' }))

    expect(handleLoadMore).toHaveBeenCalledOnce()
  })

  test('다음 목록을 불러오지 못하면 기존 목록은 두고 다시 시도 버튼을 보여준다', async () => {
    const { handleLoadMore } = renderBookList({ hasMore: true, hasLoadMoreFailed: true })

    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }))

    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByRole('alert')).toHaveTextContent('다음 목록을 불러오지 못했어요')
    expect(screen.queryByRole('button', { name: '더 보기' })).not.toBeInTheDocument()
    expect(handleLoadMore).toHaveBeenCalledOnce()
  })

  test('다음 목록을 불러오는 중에는 더 보기 대신 불러오는 중임을 알린다', () => {
    renderBookList({ hasMore: true, isLoadingMore: true })

    expect(screen.getByRole('status', { name: '다음 목록 불러오는 중' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '더 보기' })).not.toBeInTheDocument()
  })

  test('목록 끝이 화면에 가까워지면 자동으로 다음 목록을 요청한다', () => {
    mockVisibleIntersectionObserver()

    const { handleLoadMore } = renderBookList({ hasMore: true })

    expect(handleLoadMore).toHaveBeenCalledOnce()
  })

  test('다음 목록을 불러오지 못한 상태에서는 자동으로 다시 요청하지 않는다', () => {
    mockVisibleIntersectionObserver()

    const { handleLoadMore } = renderBookList({ hasMore: true, hasLoadMoreFailed: true })

    expect(handleLoadMore).not.toHaveBeenCalled()
  })
})
