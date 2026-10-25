import { act, renderHook } from '@testing-library/react'

import { useListboxNavigation } from './use-listbox-navigation'

describe('useListboxNavigation', () => {
  test('처음 ↑를 누르면 마지막 항목을 고른다', () => {
    const { result } = renderHook(() => useListboxNavigation(['바다', '숲', '하늘']))

    act(() => result.current.moveHighlight('previous'))

    expect(result.current.highlightedItem).toBe('하늘')
  })

  test('마지막 항목에서 ↓를 누르면 처음 항목으로 돌아간다', () => {
    const { result } = renderHook(() => useListboxNavigation(['바다', '숲']))

    act(() => result.current.moveHighlight('next'))
    act(() => result.current.moveHighlight('next'))
    act(() => result.current.moveHighlight('next'))

    expect(result.current.highlightedItem).toBe('바다')
  })

  test('항목이 없으면 방향키를 눌러도 아무것도 고르지 않는다', () => {
    const { result } = renderHook(() => useListboxNavigation<string>([]))

    act(() => result.current.moveHighlight('previous'))

    expect(result.current.highlightedIndex).toBeNull()
  })
})
