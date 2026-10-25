import { useState } from 'react'
import { useLocation } from 'react-router'

export function useLastVisitedPath(tabPathname: string) {
  const { pathname, search } = useLocation()
  const [lastVisitedPath, setLastVisitedPath] = useState(tabPathname)
  const currentPath = pathname + search

  if (pathname === tabPathname && currentPath !== lastVisitedPath) {
    setLastVisitedPath(currentPath)
  }

  return lastVisitedPath
}
