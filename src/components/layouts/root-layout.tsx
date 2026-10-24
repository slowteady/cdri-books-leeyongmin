import { NavLink, Outlet } from 'react-router'

export function RootLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-content px-4 pt-20 pb-20">
        <Outlet />
      </main>
    </>
  )
}

const NAVIGATION_TAB_CLASS_NAME =
  'border-b border-transparent py-0.5 text-body1 leading-6.75 text-fg-primary aria-[current=page]:border-primary'

function Header() {
  return (
    <header className="flex h-20 items-center bg-white px-4 lg:px-40">
      <p className="text-title1 text-fg-primary">CERTICOS BOOKS</p>
      <nav aria-label="주요 메뉴" className="ml-6 flex gap-6 lg:ml-100 lg:gap-14">
        <NavLink to="/" className={NAVIGATION_TAB_CLASS_NAME}>
          도서 검색
        </NavLink>
        <NavLink to="/wishlist" className={NAVIGATION_TAB_CLASS_NAME}>
          내가 찜한 책
        </NavLink>
      </nav>
    </header>
  )
}
