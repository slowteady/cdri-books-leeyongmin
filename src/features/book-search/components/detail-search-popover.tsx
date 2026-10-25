import type { FormEvent, KeyboardEvent } from 'react'

import { Button } from '@/components/ui/button'
import { buttonStyles } from '@/components/ui/button-styles'
import { Popover } from '@/components/ui/popover'
import { Select, type SelectOption } from '@/components/ui/select'
import { useDetailSearchForm } from '@/features/book-search/hooks/use-detail-search-form'
import {
  SEARCH_TARGET_LABELS,
  SEARCH_TARGETS,
  type ActiveSearchMode,
  type DetailSearchCondition,
  type SearchTarget,
} from '@/features/book-search/utils/search-mode'

const DETAIL_QUERY_INPUT =
  'h-9 min-w-0 flex-1 border-b border-primary pr-2 pl-2.25 text-body2 leading-5.5 text-fg-primary outline-none placeholder:text-fg-subtitle'

const SEARCH_TARGET_OPTIONS: SelectOption<SearchTarget>[] = SEARCH_TARGETS.map((searchTarget) => ({
  value: searchTarget,
  label: SEARCH_TARGET_LABELS[searchTarget],
}))

type DetailSearchPopoverProps = {
  currentCondition: DetailSearchCondition | null
  searchKey: string
  onSearch: (searchMode: ActiveSearchMode) => void
}

export function DetailSearchPopover({
  currentCondition,
  searchKey,
  onSearch,
}: DetailSearchPopoverProps) {
  const detailSearchForm = useDetailSearchForm({ currentCondition, searchKey, onSearch })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    detailSearchForm.submit()
  }

  const handleQueryKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault()
  }

  return (
    <Popover
      label="상세 검색"
      triggerLabel="상세검색"
      triggerClassName={buttonStyles({ variant: 'outline', size: 'sm', className: 'mt-0.75' })}
      isOpen={detailSearchForm.isOpen}
      onOpenChange={detailSearchForm.changeOpen}
    >
      <form onSubmit={handleSubmit}>
        <div className="mt-0.25 flex gap-1">
          <Select
            label="검색 조건"
            options={SEARCH_TARGET_OPTIONS}
            value={detailSearchForm.searchTarget}
            onChange={detailSearchForm.changeSearchTarget}
          />
          <input
            aria-label="상세 검색어"
            value={detailSearchForm.query}
            placeholder="검색어 입력"
            onChange={(event) => detailSearchForm.changeQuery(event.target.value)}
            onKeyDown={handleQueryKeyDown}
            className={DETAIL_QUERY_INPUT}
          />
        </div>
        <Button type="submit" size="md" className="mt-3.75 w-full">
          검색하기
        </Button>
      </form>
    </Popover>
  )
}
