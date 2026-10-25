import { DetailSearchPopover } from '@/features/book-search/components/detail-search-popover'
import { SearchBar } from '@/features/book-search/components/search-bar'
import { SearchResults } from '@/features/book-search/components/search-results'
import { useSearchNavigation } from '@/features/book-search/hooks/use-search-navigation'
import { WishlistButton } from '@/features/wishlist/components/wishlist-button'

export function SearchPage() {
  const { searchMode, searchKey, allSearchQuery, detailSearchCondition, search } =
    useSearchNavigation()

  return (
    <>
      <h1 className="text-title2 text-fg-title">도서 검색</h1>
      <div className="mt-4 flex items-center gap-4 lg:mt-7">
        <SearchBar initialQuery={allSearchQuery} searchKey={searchKey} onSearch={search} />
        <DetailSearchPopover
          currentCondition={detailSearchCondition}
          searchKey={searchKey}
          onSearch={search}
        />
      </div>
      <SearchResults
        key={searchKey}
        searchMode={searchMode}
        renderWishlistButton={(book) => <WishlistButton book={book} />}
      />
    </>
  )
}
