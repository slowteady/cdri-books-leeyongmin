import type { ReactNode } from 'react'
import { NavLink } from 'react-router'

import { useLastVisitedPath } from '@/hooks/use-last-visited-path'
import { cn } from '@/utils/cn'

const HEADER_MOBILE_LAYOUT = 'flex flex-col items-start gap-3 bg-white px-4 py-4'
const HEADER_DESKTOP_LAYOUT = 'sm:h-20 sm:flex-row sm:items-center sm:gap-0 sm:py-0 lg:px-40'
const NAVIGATION_TAB_CLASS_NAME =
  'border-b border-transparent py-0.5 text-body1 leading-6.75 text-fg-primary aria-current-page:border-primary'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <Header />
      <main className="mx-auto box-content max-w-content px-4 pt-10 pb-20 lg:pt-20">
        {children}
      </main>
    </>
  )
}

function Header() {
  const searchTabPath = useLastVisitedPath('/')

  return (
    <header className={cn(HEADER_MOBILE_LAYOUT, HEADER_DESKTOP_LAYOUT)}>
      <p className="text-title1 text-fg-primary">CERTICOS BOOKS</p>
      <nav aria-label="주요 메뉴" className="flex gap-6 sm:ml-10 lg:ml-100 lg:gap-14">
        <NavLink to={searchTabPath} className={NAVIGATION_TAB_CLASS_NAME}>
          도서 검색
        </NavLink>
        <NavLink to="/wishlist" className={NAVIGATION_TAB_CLASS_NAME}>
          내가 찜한 책
        </NavLink>
      </nav>
    </header>
  )
}
