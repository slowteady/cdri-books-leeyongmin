import { cn } from './cn'

describe('cn', () => {
  test('조건이 거짓인 클래스는 빼고 공백으로 잇는다', () => {
    const isExpanded = false

    expect(cn('flex', isExpanded && 'h-86', null, undefined, 'gap-2')).toBe('flex gap-2')
  })
})
