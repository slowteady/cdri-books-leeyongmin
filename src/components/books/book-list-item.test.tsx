import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createBook } from '@/testing/data/books'
import type { Book } from '@/types/book'

import { BookListItem } from './book-list-item'

function renderBookListItem({ book = createBook(), isExpanded = false } = {}) {
  const handleToggleExpanded = vi.fn()
  const { container } = render(
    <BookListItem
      book={book}
      isExpanded={isExpanded}
      onToggleExpanded={handleToggleExpanded}
      renderWishlistButton={() => <button type="button">찜하기</button>}
    />,
  )
  return { container, handleToggleExpanded }
}

function renderExpanded(overrides: Partial<Book>) {
  return renderBookListItem({ book: createBook(overrides), isExpanded: true })
}

describe('BookListItem', () => {
  test('상세보기로 펼치면 행 높이가 서랍처럼 늘어나며 열린다', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isExpandedRow = this.querySelector('[data-expanded]') ?? this.closest('[data-expanded]')
      return isExpandedRow ? 344 : 100
    })
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query }))
    const book = createBook()
    const props = { book, onToggleExpanded: vi.fn(), renderWishlistButton: () => null }
    const { rerender } = render(<BookListItem {...props} isExpanded={false} />)

    rerender(<BookListItem {...props} isExpanded />)

    const drawer = screen.getByRole('article').parentElement
    expect(drawer?.style.height).toBe('344px')
    expect(drawer?.style.overflow).toBe('hidden')
  })

  test('제목, 저자, 목록 가격을 보여준다', () => {
    renderBookListItem()

    expect(screen.getByRole('heading', { name: '노르웨이의 숲' })).toBeInTheDocument()
    expect(screen.getByText('무라카미 하루키')).toBeInTheDocument()
    expect(screen.getAllByText('13,500원').length).toBeGreaterThan(0)
  })

  test('책 제목은 페이지 제목 바로 아래 단계이고, 책 소개는 그 아래 단계다', () => {
    renderExpanded({})

    expect(screen.getByRole('heading', { level: 2, name: '노르웨이의 숲' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: '책 소개' })).toBeInTheDocument()
  })

  test('구매하기를 누르면 새 탭으로 해당 책의 상세페이지로 이동한다', () => {
    renderBookListItem()

    const purchaseLink = screen.getByRole('link', { name: /구매하기/ })
    expect(purchaseLink).toHaveAttribute('href', createBook().detailUrl)
    expect(purchaseLink).toHaveAttribute('target', '_blank')
    expect(purchaseLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('상세보기는 책 소개 영역을 펼치고 접는 버튼이다', async () => {
    const { handleToggleExpanded } = renderBookListItem()
    const toggleButton = screen.getByRole('button', { name: '상세보기' })
    const descriptionRegion = document.getElementById(
      toggleButton.getAttribute('aria-controls') ?? '',
    )

    await userEvent.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(descriptionRegion).not.toBeVisible()
    expect(handleToggleExpanded).toHaveBeenCalledExactlyOnceWith(createBook().id)
  })

  test('펼치면 책 소개와 원가, 할인가를 보여준다', () => {
    renderExpanded({})

    expect(screen.getByRole('button', { name: '상세보기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByText(createBook().description ?? '')).toBeVisible()
    expect(screen.getByText('16,000원').tagName).toBe('DEL')
    expect(screen.getByText('13,500원', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByText('할인가')).toBeInTheDocument()
  })

  test('할인가가 없으면 할인가를 노출하지 않고 원가에 취소선을 긋지 않는다', () => {
    renderExpanded({ salePrice: null })

    expect(screen.queryByText('할인가')).not.toBeInTheDocument()
    expect(screen.queryByText('16,000원', { selector: 'del' })).not.toBeInTheDocument()
  })

  test('책 소개가 없으면 안내 문구를 보여준다', () => {
    renderExpanded({ description: null })

    expect(screen.getByText('책 소개가 없습니다.')).toBeInTheDocument()
  })

  test('펼친 큰 썸네일을 불러오지 못하면 원래 썸네일로 바꾼다', () => {
    const { container } = renderBookListItem({ isExpanded: true })

    fireEvent.error(getThumbnail(container))

    expect(getThumbnail(container)).toHaveAttribute('src', createBook().thumbnailUrl)
  })

  test('썸네일을 불러오지 못하면 빈 표지를 보여준다', () => {
    const { container } = renderBookListItem()

    fireEvent.error(getThumbnail(container))

    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})

function getThumbnail(container: HTMLElement) {
  const thumbnail = container.querySelector('img')
  if (!thumbnail) throw new Error('썸네일 이미지가 없습니다')
  return thumbnail
}
