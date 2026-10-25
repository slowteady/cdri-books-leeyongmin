import { useId, type KeyboardEvent, type MouseEvent } from 'react'

import { Icon } from '@/components/ui/icon'
import { IconButton } from '@/components/ui/icon-button'
import { LISTBOX_OPTION } from '@/components/ui/listbox-option-styles'
import { useSearchBar } from '@/features/book-search/hooks/use-search-bar'
import { useSearchHistoryDropdown } from '@/features/book-search/hooks/use-search-history-dropdown'
import type { SearchHistoryEntry } from '@/features/book-search/utils/search-history-entry'
import {
  SEARCH_TARGET_LABELS,
  type ActiveSearchMode,
} from '@/features/book-search/utils/search-mode'
import { cn } from '@/utils/cn'

const SEARCH_FIELD =
  'flex h-12.5 items-center gap-2.75 rounded-full bg-light-gray pl-2.5 group-data-history-open:rounded-t-3xl group-data-history-open:rounded-b-none'
const QUERY_INPUT =
  'h-full min-w-0 flex-1 bg-transparent pr-5 text-caption text-fg-primary outline-none placeholder:text-fg-subtitle'
const HISTORY_LISTBOX = 'absolute inset-x-0 top-full z-10 rounded-b-3xl bg-light-gray pt-1.75 pb-4'
const HISTORY_OPTION_LAYOUT = 'h-10 justify-between pr-6.25 pl-12.75 text-caption'

type SearchBarProps = {
  initialQuery: string
  searchKey: string
  onSearch: (searchMode: ActiveSearchMode) => void
}

export function SearchBar({ initialQuery, searchKey, onSearch }: SearchBarProps) {
  const historyDropdown = useSearchHistoryDropdown()
  const searchBar = useSearchBar({ initialQuery, searchKey, historyDropdown, onSearch })
  const historyListId = useId()
  const toHistoryOptionId = (index: number) => `${historyListId}-option-${index}`
  const activeHistoryOptionId =
    historyDropdown.highlightedIndex === null
      ? undefined
      : toHistoryOptionId(historyDropdown.highlightedIndex)

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        historyDropdown.moveHighlight('next')
        break
      case 'ArrowUp':
        event.preventDefault()
        historyDropdown.moveHighlight('previous')
        break
      case 'Enter':
        searchBar.confirmSelection()
        break
      case 'Escape':
        historyDropdown.close()
        break
      case 'Delete':
        if (!historyDropdown.highlightedEntry) break
        event.preventDefault()
        historyDropdown.removeHighlightedEntry()
        break
    }
  }

  return (
    <div
      data-history-open={historyDropdown.isVisible || undefined}
      className="group relative min-w-0 flex-1 lg:max-w-120"
    >
      <label className={SEARCH_FIELD}>
        <Icon name="search" className="shrink-0 text-fg-primary" />
        <input
          role="combobox"
          aria-label="검색어"
          aria-expanded={historyDropdown.isVisible}
          aria-controls={historyListId}
          aria-activedescendant={activeHistoryOptionId}
          value={searchBar.query}
          placeholder="검색어를 입력하세요"
          onChange={(event) => searchBar.changeQuery(event.target.value)}
          onFocus={historyDropdown.open}
          onClick={historyDropdown.open}
          onBlur={historyDropdown.close}
          onKeyDown={handleInputKeyDown}
          className={QUERY_INPUT}
        />
      </label>
      {historyDropdown.isVisible && (
        <ul
          id={historyListId}
          role="listbox"
          aria-label="최근 검색 기록"
          onMouseDown={(event) => event.preventDefault()}
          className={HISTORY_LISTBOX}
        >
          {historyDropdown.historyEntries.map((entry, index) => (
            <SearchHistoryOption
              key={`${entry.searchTarget}-${entry.query}`}
              id={toHistoryOptionId(index)}
              isHighlighted={index === historyDropdown.highlightedIndex}
              entry={entry}
              onSelect={() => searchBar.selectHistoryEntry(entry)}
              onRemove={() => historyDropdown.removeHistoryEntry(entry)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

type SearchHistoryOptionProps = {
  id: string
  isHighlighted: boolean
  entry: SearchHistoryEntry
  onSelect: () => void
  onRemove: () => void
}

function SearchHistoryOption({
  id,
  isHighlighted,
  entry,
  onSelect,
  onRemove,
}: SearchHistoryOptionProps) {
  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onRemove()
  }

  return (
    <li
      id={id}
      role="option"
      aria-selected={isHighlighted}
      onClick={onSelect}
      className={cn(LISTBOX_OPTION, HISTORY_OPTION_LAYOUT)}
    >
      <span className="flex min-w-0 items-center gap-2">
        {entry.searchTarget && (
          <span className="shrink-0 text-small">{SEARCH_TARGET_LABELS[entry.searchTarget]}</span>
        )}
        <span className="truncate">{entry.query}</span>
      </span>
      <IconButton
        icon="close"
        label={`${entry.query} 검색 기록 삭제`}
        tabIndex={-1}
        onClick={handleRemoveClick}
        className="size-6 text-black"
      />
    </li>
  )
}
