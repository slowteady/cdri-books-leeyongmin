import {
  prependHistoryEntry,
  SEARCH_HISTORY_STORAGE_KEY,
  useSearchHistoryStore,
  type SearchHistoryEntry,
} from './search-history-store'

function allSearchEntry(query: string): SearchHistoryEntry {
  return { query, searchTarget: null }
}

describe('prependHistoryEntry', () => {
  test('가장 최근 검색어를 맨 앞에 저장한다', () => {
    expect(prependHistoryEntry([allSearchEntry('숲')], allSearchEntry('바다'))).toEqual([
      allSearchEntry('바다'),
      allSearchEntry('숲'),
    ])
  })

  test('같은 검색어를 다시 검색하면 중복 저장하지 않고 맨 앞으로 옮긴다', () => {
    const historyEntries = [allSearchEntry('숲'), allSearchEntry('바다')]

    expect(prependHistoryEntry(historyEntries, allSearchEntry('바다'))).toEqual([
      allSearchEntry('바다'),
      allSearchEntry('숲'),
    ])
  })

  test('검색어가 같아도 상세 검색 조건이 다르면 다른 기록으로 저장한다', () => {
    const detailSearchEntry: SearchHistoryEntry = { query: '한강', searchTarget: 'person' }

    expect(prependHistoryEntry([allSearchEntry('한강')], detailSearchEntry)).toEqual([
      detailSearchEntry,
      allSearchEntry('한강'),
    ])
  })

  test('최대 8개까지 저장하고, 넘으면 가장 오래된 검색어부터 지운다', () => {
    const eightEntries = ['8', '7', '6', '5', '4', '3', '2', '1'].map(allSearchEntry)

    const historyEntries = prependHistoryEntry(eightEntries, allSearchEntry('9'))

    expect(historyEntries.map((entry) => entry.query)).toEqual([
      '9',
      '8',
      '7',
      '6',
      '5',
      '4',
      '3',
      '2',
    ])
  })

  test('검색어 앞뒤 공백은 지우고, 공백뿐인 검색어는 저장하지 않는다', () => {
    expect(prependHistoryEntry([], allSearchEntry('  숲 '))).toEqual([allSearchEntry('숲')])
    expect(prependHistoryEntry([allSearchEntry('숲')], allSearchEntry('   '))).toEqual([
      allSearchEntry('숲'),
    ])
  })
})

describe('useSearchHistoryStore', () => {
  test('검색 기록을 추가하고 항목별로 삭제한다', () => {
    const { actions } = useSearchHistoryStore.getState()

    actions.addHistoryEntry(allSearchEntry('숲'))
    actions.addHistoryEntry(allSearchEntry('바다'))
    actions.removeHistoryEntry(allSearchEntry('숲'))

    expect(useSearchHistoryStore.getState().historyEntries).toEqual([allSearchEntry('바다')])
  })

  test('브라우저를 다시 열어도 유지되도록 기록만 localStorage에 저장한다', () => {
    useSearchHistoryStore.getState().actions.addHistoryEntry(allSearchEntry('숲'))

    const storedValue = JSON.parse(localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY) ?? 'null')
    expect(storedValue).toEqual({
      state: { historyEntries: [allSearchEntry('숲')] },
      version: 1,
    })
  })

  test('저장값이 깨져 있으면 형식이 올바른 기록만 복원하고, 복원 후에도 기록을 추가할 수 있다', async () => {
    localStorage.setItem(
      SEARCH_HISTORY_STORAGE_KEY,
      JSON.stringify({
        state: {
          historyEntries: [
            allSearchEntry('숲'),
            { query: 1 },
            { query: '바다', searchTarget: 'isbn' },
            null,
          ],
        },
        version: 1,
      }),
    )

    await useSearchHistoryStore.persist.rehydrate()
    useSearchHistoryStore.getState().actions.addHistoryEntry(allSearchEntry('하늘'))

    expect(useSearchHistoryStore.getState().historyEntries).toEqual([
      allSearchEntry('하늘'),
      allSearchEntry('숲'),
    ])
  })
})
