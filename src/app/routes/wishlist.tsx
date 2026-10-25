import { WishlistList } from '@/features/wishlist/components/wishlist-list'

export function WishlistPage() {
  return (
    <>
      <h1 className="text-title2 leading-8 text-fg-title">내가 찜한 책</h1>
      <WishlistList />
    </>
  )
}
