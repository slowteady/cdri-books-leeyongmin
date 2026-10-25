import { act, fireEvent, screen, within } from '@testing-library/react'

import { createKakaoBookSearchResponse } from '@/testing/data/kakao-books'
import { mockFetch } from '@/testing/mock-fetch'
import { useSearchHistoryStore } from '@/features/book-search/stores/search-history-store'
import { renderApp } from '@/testing/test-utils'

function mockBookSearchApi(totalCount = 3) {
  return mockFetch((requestUrl) => {
    const page = Number(requestUrl.searchParams.get('page'))
    return Response.json(createKakaoBookSearchResponse({ page, totalCount }))
  })
}

function getSearchInput() {
  return screen.getByRole('combobox', { name: '검색어' })
}

describe('검색창', () => {
  test('검색어를 입력하고 Enter를 누르면 그 검색어로 검색한다', async () => {
    mockBookSearchApi()
    const { router, user } = renderApp('/')

    await user.type(await screen.findByRole('combobox', { name: '검색어' }), '노르웨이{Enter}')

    expect(router.state.location.search).toBe(`?q=${encodeURIComponent('노르웨이')}`)
    expect(await screen.findByText('테스트 책 1')).toBeInTheDocument()
    expect(getSearchInput()).toHaveValue('노르웨이')
  })

  test('공백만 입력하고 Enter를 누르면 검색하지 않는다', async () => {
    const { router, user } = renderApp('/')

    await user.type(await screen.findByRole('combobox', { name: '검색어' }), '   {Enter}')

    expect(router.state.location.search).toBe('')
  })

  test('한글 조합 중에 누른 Enter로는 검색하지 않는다', async () => {
    const { router, user } = renderApp('/')
    const searchInput = await screen.findByRole('combobox', { name: '검색어' })
    await user.type(searchInput, '노르')

    fireEvent.keyDown(searchInput, { key: 'Enter', isComposing: true })

    expect(router.state.location.search).toBe('')
  })

  test('검색하면 검색어를 검색 기록에 저장한다', async () => {
    mockBookSearchApi()
    const { user } = renderApp('/')

    await user.type(await screen.findByRole('combobox', { name: '검색어' }), '노르웨이{Enter}')

    expect(useSearchHistoryStore.getState().historyEntries).toEqual([
      { query: '노르웨이', searchTarget: null },
    ])
  })

  test('검색창을 누르면 최근 검색 기록을 펼친다', async () => {
    useSearchHistoryStore.setState({
      historyEntries: [
        { query: '바다', searchTarget: null },
        { query: '숲', searchTarget: null },
      ],
    })
    const { user } = renderApp('/')

    await user.click(await screen.findByRole('combobox', { name: '검색어' }))

    const historyList = screen.getByRole('listbox', { name: '최근 검색 기록' })
    expect(
      within(historyList)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual([expect.stringContaining('바다'), expect.stringContaining('숲')])
    expect(getSearchInput()).toHaveAttribute('aria-expanded', 'true')
  })

  test('검색 기록이 없으면 목록을 펼치지 않는다', async () => {
    const { user } = renderApp('/')

    await user.click(await screen.findByRole('combobox', { name: '검색어' }))

    expect(screen.queryByRole('listbox', { name: '최근 검색 기록' })).not.toBeInTheDocument()
    expect(getSearchInput()).toHaveAttribute('aria-expanded', 'false')
  })

  test('검색 기록을 누르면 그 검색어로 다시 검색한다', async () => {
    mockBookSearchApi()
    useSearchHistoryStore.setState({ historyEntries: [{ query: '바다', searchTarget: null }] })
    const { router, user } = renderApp('/')

    await user.click(await screen.findByRole('combobox', { name: '검색어' }))
    await user.click(screen.getByRole('option', { name: /바다/ }))

    expect(router.state.location.search).toBe(`?q=${encodeURIComponent('바다')}`)
    expect(screen.queryByRole('listbox', { name: '최근 검색 기록' })).not.toBeInTheDocument()
  })

  test('상세 검색 기록에는 검색 조건을 함께 보여주고, 누르면 그 조건으로 검색하며 검색창은 비운다', async () => {
    mockBookSearchApi()
    useSearchHistoryStore.setState({ historyEntries: [{ query: '한강', searchTarget: 'person' }] })
    const { router, user } = renderApp('/')

    await user.click(await screen.findByRole('combobox', { name: '검색어' }))
    const detailHistoryOption = screen.getByRole('option', { name: /한강/ })
    expect(detailHistoryOption).toHaveTextContent('저자명')
    await user.click(detailHistoryOption)

    expect(router.state.location.search).toBe(`?q=${encodeURIComponent('한강')}&target=person`)
    expect(getSearchInput()).toHaveValue('')
  })

  test('기록 옆 X를 누르면 그 기록만 지우고 검색하지는 않는다', async () => {
    useSearchHistoryStore.setState({
      historyEntries: [
        { query: '바다', searchTarget: null },
        { query: '숲', searchTarget: null },
      ],
    })
    const { router, user } = renderApp('/')

    await user.click(await screen.findByRole('combobox', { name: '검색어' }))
    await user.click(screen.getByRole('button', { name: '바다 검색 기록 삭제' }))

    expect(useSearchHistoryStore.getState().historyEntries).toEqual([
      { query: '숲', searchTarget: null },
    ])
    expect(router.state.location.search).toBe('')
  })

  test('방향키로 기록을 고르고 Enter를 누르면 고른 기록으로 한 번만 검색한다', async () => {
    const fetchMock = mockBookSearchApi()
    useSearchHistoryStore.setState({
      historyEntries: [
        { query: '바다', searchTarget: null },
        { query: '숲', searchTarget: null },
      ],
    })
    const { router, user } = renderApp('/')

    await user.click(await screen.findByRole('combobox', { name: '검색어' }))
    await user.keyboard('{ArrowDown}{ArrowDown}')
    const highlightedOption = screen.getByRole('option', { name: /숲/ })
    expect(highlightedOption).toHaveAttribute('aria-selected', 'true')
    expect(getSearchInput()).toHaveAttribute('aria-activedescendant', highlightedOption.id)
    await user.keyboard('{Enter}')

    expect(router.state.location.search).toBe(`?q=${encodeURIComponent('숲')}`)
    await screen.findByText('테스트 책 1')
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  test('Esc를 누르면 기록 목록을 닫는다', async () => {
    useSearchHistoryStore.setState({ historyEntries: [{ query: '바다', searchTarget: null }] })
    const { user } = renderApp('/')

    await user.click(await screen.findByRole('combobox', { name: '검색어' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('listbox', { name: '최근 검색 기록' })).not.toBeInTheDocument()
  })

  test('방향키로 고른 기록은 Delete 키로 지울 수 있다', async () => {
    useSearchHistoryStore.setState({
      historyEntries: [
        { query: '바다', searchTarget: null },
        { query: '숲', searchTarget: null },
      ],
    })
    const { user } = renderApp('/')

    await user.click(await screen.findByRole('combobox', { name: '검색어' }))
    await user.keyboard('{ArrowDown}{Delete}')

    expect(useSearchHistoryStore.getState().historyEntries).toEqual([
      { query: '숲', searchTarget: null },
    ])
  })

  test('기록을 고르지 않았을 때 Delete 키는 입력한 글자를 지운다', async () => {
    useSearchHistoryStore.setState({ historyEntries: [{ query: '바다', searchTarget: null }] })
    const { user } = renderApp('/')
    const searchInput = await screen.findByRole('combobox', { name: '검색어' })

    await user.type(searchInput, '하늘')
    await user.keyboard('{Home}{Delete}')

    expect(searchInput).toHaveValue('늘')
    expect(useSearchHistoryStore.getState().historyEntries).toHaveLength(1)
  })

  test('검색창 밖을 누르면 기록 목록을 닫는다', async () => {
    useSearchHistoryStore.setState({ historyEntries: [{ query: '바다', searchTarget: null }] })
    const { user } = renderApp('/')

    await user.click(await screen.findByRole('combobox', { name: '검색어' }))
    await user.click(screen.getByRole('heading', { level: 1, name: '도서 검색' }))

    expect(screen.queryByRole('listbox', { name: '최근 검색 기록' })).not.toBeInTheDocument()
  })

  test('Enter로 검색하면 기록 목록을 닫는다', async () => {
    mockBookSearchApi()
    useSearchHistoryStore.setState({ historyEntries: [{ query: '바다', searchTarget: null }] })
    const { user } = renderApp('/')

    await user.type(await screen.findByRole('combobox', { name: '검색어' }), '하늘{Enter}')

    expect(screen.queryByRole('listbox', { name: '최근 검색 기록' })).not.toBeInTheDocument()
  })

  test('검색어가 담긴 주소로 들어오면 검색창에 그 검색어를 보여준다', async () => {
    mockBookSearchApi()

    renderApp(`/?q=${encodeURIComponent('노르웨이')}`)

    expect(await screen.findByRole('combobox', { name: '검색어' })).toHaveValue('노르웨이')
  })

  test('뒤로 가기로 이전 검색으로 돌아가면 검색창도 이전 검색어로 바뀐다', async () => {
    mockBookSearchApi()
    const { router, user } = renderApp('/')
    const searchInput = await screen.findByRole('combobox', { name: '검색어' })
    await user.type(searchInput, '바다{Enter}')
    await user.clear(searchInput)
    await user.type(searchInput, '숲{Enter}')

    await act(() => router.navigate(-1))

    expect(getSearchInput()).toHaveValue('바다')
  })

  test('Enter로 검색한 뒤에도 키보드 포커스가 검색창에 남아 있다', async () => {
    mockBookSearchApi()
    const { user } = renderApp('/')
    const searchInput = await screen.findByRole('combobox', { name: '검색어' })

    await user.type(searchInput, '바다{Enter}')
    await screen.findByText('테스트 책 1')

    expect(getSearchInput()).toHaveFocus()
  })
})
