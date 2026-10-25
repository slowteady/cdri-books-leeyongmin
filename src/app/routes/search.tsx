import { SearchResults } from '@/features/book-search/components/search-results'
import { useSearchNavigation } from '@/features/book-search/hooks/use-search-navigation'

export function SearchPage() {
  const { searchMode } = useSearchNavigation()

  return (
    <>
      <h1 className="text-title2 text-fg-title">도서 검색</h1>
      <SearchResults searchMode={searchMode} renderWishlistButton={() => null} />
    </>
  )
}
