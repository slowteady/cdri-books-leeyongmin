import { SearchBar } from '@/features/book-search/components/search-bar'
import { SearchResults } from '@/features/book-search/components/search-results'
import { useSearchNavigation } from '@/features/book-search/hooks/use-search-navigation'
import { toSearchMode } from '@/features/book-search/stores/search-history-store'

export function SearchPage() {
  const { searchMode, search } = useSearchNavigation()

  return (
    <>
      <h1 className="text-title2 text-fg-title">도서 검색</h1>
      <div className="mt-4 flex items-center gap-4 lg:mt-7">
        <SearchBar
          initialQuery={searchMode.type === 'all' ? searchMode.query : ''}
          onSearch={(query) => search({ type: 'all', query })}
          onSelectHistoryEntry={(entry) => search(toSearchMode(entry))}
        />
      </div>
      <SearchResults searchMode={searchMode} renderWishlistButton={() => null} />
    </>
  )
}
