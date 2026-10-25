import { createBook } from '@/testing/data/books'

import { useWishlistStore, WISHLIST_STORAGE_KEY } from './wishlist-store'

function getWishedBookIds() {
  return useWishlistStore.getState().wishedBooks.map((book) => book.id)
}

describe('useWishlistStore', () => {
  test('찜하면 가장 최근에 찜한 책이 맨 앞에 온다', () => {
    const { actions } = useWishlistStore.getState()

    actions.toggleWishedBook(createBook({ id: 'a' }))
    actions.toggleWishedBook(createBook({ id: 'b' }))

    expect(getWishedBookIds()).toEqual(['b', 'a'])
  })

  test('이미 찜한 책을 다시 누르면 찜을 해제한다', () => {
    const { actions } = useWishlistStore.getState()

    actions.toggleWishedBook(createBook({ id: 'a' }))
    actions.toggleWishedBook(createBook({ id: 'b' }))
    actions.toggleWishedBook(createBook({ id: 'a' }))

    expect(getWishedBookIds()).toEqual(['b'])
  })

  test('브라우저를 다시 열어도 유지되도록 찜한 책만 localStorage에 저장한다', () => {
    const book = createBook({ id: 'a' })

    useWishlistStore.getState().actions.toggleWishedBook(book)

    const storedValue = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) ?? 'null')
    expect(storedValue).toEqual({ state: { wishedBooks: [book] }, version: 2 })
  })

  test('저장값이 깨져 있으면 형식이 올바른 책만 복원하고, 복원 후에도 찜할 수 있다', async () => {
    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify({
        state: { wishedBooks: [createBook({ id: 'a' }), { id: 1 }, null, 'broken'] },
        version: 2,
      }),
    )

    await useWishlistStore.persist.rehydrate()
    useWishlistStore.getState().actions.toggleWishedBook(createBook({ id: 'b' }))

    expect(getWishedBookIds()).toEqual(['b', 'a'])
  })

  test('필드 형식이 다른 책은 복원하지 않는다', async () => {
    const validBook = createBook({ id: 'valid' })
    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify({
        state: {
          wishedBooks: [
            validBook,
            { ...createBook({ id: 'string-price' }), originalPrice: '16000' },
            { ...createBook({ id: 'author-not-array' }), authors: '한강' },
            { ...createBook({ id: 'missing-detail-url' }), detailUrl: undefined },
            { ...createBook({ id: 'missing-large-thumbnail' }), largeThumbnailUrl: undefined },
          ],
        },
        version: 2,
      }),
    )

    await useWishlistStore.persist.rehydrate()

    expect(getWishedBookIds()).toEqual(['valid'])
  })

  test('큰 표지 주소가 생기기 전(버전 1)에 저장한 찜은 큰 표지 주소 없이 복원한다', async () => {
    const { largeThumbnailUrl: _, ...bookSavedInVersion1 } = createBook({ id: 'saved-in-v1' })
    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify({ state: { wishedBooks: [bookSavedInVersion1] }, version: 1 }),
    )

    await useWishlistStore.persist.rehydrate()

    expect(useWishlistStore.getState().wishedBooks).toEqual([
      { ...bookSavedInVersion1, largeThumbnailUrl: null },
    ])
  })
})
