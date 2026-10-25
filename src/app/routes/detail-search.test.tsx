import { createEvent, fireEvent, screen, within } from '@testing-library/react'

import { createKakaoBookSearchResponse } from '@/testing/data/kakao-books'
import { mockFetch } from '@/testing/mock-fetch'
import { useSearchHistoryStore } from '@/features/book-search/stores/search-history-store'
import { renderApp } from '@/testing/test-utils'

function mockBookSearchApi() {
  return mockFetch((requestUrl) => {
    const page = Number(requestUrl.searchParams.get('page'))
    return Response.json(createKakaoBookSearchResponse({ page, totalCount: 3 }))
  })
}

async function openDetailSearch(user: ReturnType<typeof renderApp>['user']) {
  await user.click(await screen.findByRole('button', { name: '상세검색' }))
  return screen.getByRole('dialog', { name: '상세 검색' })
}

describe('상세 검색', () => {
  test('상세검색 버튼을 누르면 상세 검색 팝업이 열린다', async () => {
    const { user } = renderApp('/')

    await openDetailSearch(user)

    expect(screen.getByRole('button', { name: '상세검색' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  test('팝업의 닫기 버튼을 누르면 닫히고 포커스가 상세검색 버튼으로 돌아간다', async () => {
    const { user } = renderApp('/')
    const dialog = await openDetailSearch(user)

    await user.click(within(dialog).getByRole('button', { name: '닫기' }))

    expect(screen.queryByRole('dialog', { name: '상세 검색' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '상세검색' })).toHaveFocus()
  })

  test('Esc를 누르면 팝업을 닫고 포커스가 상세검색 버튼으로 돌아간다', async () => {
    const { user } = renderApp('/')
    await openDetailSearch(user)

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: '상세 검색' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '상세검색' })).toHaveFocus()
  })

  test('팝업 바깥을 누르면 팝업을 닫는다', async () => {
    const { user } = renderApp('/')
    await openDetailSearch(user)

    await user.click(screen.getByRole('heading', { level: 1, name: '도서 검색' }))

    expect(screen.queryByRole('dialog', { name: '상세 검색' })).not.toBeInTheDocument()
  })

  test('팝업 안을 누르면 닫히지 않는다', async () => {
    const { user } = renderApp('/')
    const dialog = await openDetailSearch(user)

    await user.click(dialog)

    expect(screen.getByRole('dialog', { name: '상세 검색' })).toBeInTheDocument()
  })

  test('검색 조건의 기본값은 제목이다', async () => {
    const { user } = renderApp('/')
    const dialog = await openDetailSearch(user)

    expect(within(dialog).getByRole('combobox', { name: '검색 조건' })).toHaveTextContent('제목')
  })

  test('검색 조건을 누르면 지금 선택된 조건을 뺀 나머지를 보여주고, 고르면 그 조건으로 바뀐다', async () => {
    const { user } = renderApp('/')
    const dialog = await openDetailSearch(user)
    const searchTargetSelect = within(dialog).getByRole('combobox', { name: '검색 조건' })

    await user.click(searchTargetSelect)
    const optionLabels = within(dialog)
      .getAllByRole('option')
      .map((option) => option.textContent)
    await user.click(within(dialog).getByRole('option', { name: '저자명' }))

    expect(optionLabels).toEqual(['저자명', '출판사'])
    expect(searchTargetSelect).toHaveTextContent('저자명')
    expect(within(dialog).queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('검색 조건은 방향키로 고르고 Enter로 정할 수 있다', async () => {
    const { user } = renderApp('/')
    const dialog = await openDetailSearch(user)
    const searchTargetSelect = within(dialog).getByRole('combobox', { name: '검색 조건' })
    searchTargetSelect.focus()

    await user.keyboard('{ArrowDown}{ArrowDown}')
    const highlightedOption = within(dialog).getByRole('option', { name: '출판사' })
    expect(highlightedOption).toHaveAttribute('aria-selected', 'true')
    expect(searchTargetSelect).toHaveAttribute('aria-activedescendant', highlightedOption.id)
    await user.keyboard('{Enter}')

    expect(searchTargetSelect).toHaveTextContent('출판사')
    expect(within(dialog).queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('검색 조건 목록이 열린 상태에서 Esc를 누르면 목록만 닫고 팝업은 그대로 둔다', async () => {
    const { user } = renderApp('/')
    const dialog = await openDetailSearch(user)

    await user.click(within(dialog).getByRole('combobox', { name: '검색 조건' }))
    await user.keyboard('{Escape}')

    expect(within(dialog).queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: '상세 검색' })).toBeInTheDocument()
  })

  test('검색 조건에서 ↑를 누르면 목록의 마지막 조건부터 고른다', async () => {
    const { user } = renderApp('/')
    const dialog = await openDetailSearch(user)
    within(dialog).getByRole('combobox', { name: '검색 조건' }).focus()

    await user.keyboard('{ArrowUp}')

    expect(within(dialog).getByRole('option', { name: '출판사' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  test('조건과 검색어를 넣고 검색하기를 누르면 팝업을 닫고 그 조건으로 검색하며 메인 검색창은 비운다', async () => {
    mockBookSearchApi()
    const { router, user } = renderApp(`/?q=${encodeURIComponent('바다')}`)
    const dialog = await openDetailSearch(user)

    await user.click(within(dialog).getByRole('combobox', { name: '검색 조건' }))
    await user.click(within(dialog).getByRole('option', { name: '저자명' }))
    await user.type(within(dialog).getByRole('textbox', { name: '상세 검색어' }), '한강')
    await user.click(within(dialog).getByRole('button', { name: '검색하기' }))

    expect(screen.queryByRole('dialog', { name: '상세 검색' })).not.toBeInTheDocument()
    expect(router.state.location.search).toBe(`?q=${encodeURIComponent('한강')}&target=person`)
    expect(screen.getByRole('combobox', { name: '검색어' })).toHaveValue('')
  })

  test('상세 검색어가 비어 있으면 검색하지 않고 팝업을 그대로 둔다', async () => {
    const { router, user } = renderApp('/')
    const dialog = await openDetailSearch(user)

    await user.type(within(dialog).getByRole('textbox', { name: '상세 검색어' }), '   ')
    await user.click(within(dialog).getByRole('button', { name: '검색하기' }))

    expect(router.state.location.search).toBe('')
    expect(screen.getByRole('dialog', { name: '상세 검색' })).toBeInTheDocument()
  })

  test('상세 검색 중에 전체 검색을 하면 상세 검색 조건을 초기화한다', async () => {
    mockBookSearchApi()
    const { user } = renderApp(`/?q=${encodeURIComponent('한강')}&target=person`)

    await user.type(await screen.findByRole('combobox', { name: '검색어' }), '바다{Enter}')
    const dialog = await openDetailSearch(user)

    expect(within(dialog).getByRole('combobox', { name: '검색 조건' })).toHaveTextContent('제목')
    expect(within(dialog).getByRole('textbox', { name: '상세 검색어' })).toHaveValue('')
  })

  test('상세 검색 중에 팝업을 다시 열면 지금 검색 중인 조건과 검색어를 보여준다', async () => {
    mockBookSearchApi()
    const { user } = renderApp(`/?q=${encodeURIComponent('한강')}&target=person`)

    const dialog = await openDetailSearch(user)

    expect(within(dialog).getByRole('combobox', { name: '검색 조건' })).toHaveTextContent('저자명')
    expect(within(dialog).getByRole('textbox', { name: '상세 검색어' })).toHaveValue('한강')
  })

  test('상세 검색도 검색 조건과 함께 검색 기록에 저장한다', async () => {
    mockBookSearchApi()
    const { user } = renderApp('/')
    const dialog = await openDetailSearch(user)

    await user.click(within(dialog).getByRole('combobox', { name: '검색 조건' }))
    await user.click(within(dialog).getByRole('option', { name: '출판사' }))
    await user.type(within(dialog).getByRole('textbox', { name: '상세 검색어' }), '민음사{Enter}')

    expect(useSearchHistoryStore.getState().historyEntries).toEqual([
      { query: '민음사', searchTarget: 'publisher' },
    ])
  })

  test('팝업이 열리면 키보드 포커스가 첫 입력 요소인 검색 조건으로 들어간다', async () => {
    const { user } = renderApp('/')

    const dialog = await openDetailSearch(user)

    expect(within(dialog).getByRole('combobox', { name: '검색 조건' })).toHaveFocus()
  })

  test('상세 검색어를 한글 조합 중에 누른 Enter로는 검색을 제출하지 않는다', async () => {
    const { user } = renderApp('/')
    const dialog = await openDetailSearch(user)
    const detailQueryInput = within(dialog).getByRole('textbox', { name: '상세 검색어' })
    const composingEnter = createEvent.keyDown(detailQueryInput, {
      key: 'Enter',
      isComposing: true,
    })

    fireEvent(detailQueryInput, composingEnter)

    expect(composingEnter.defaultPrevented).toBe(true)
  })
})
