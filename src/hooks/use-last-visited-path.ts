import { useState } from 'react'
import { useLocation } from 'react-router'

import { toPathWithSearch } from '@/utils/to-path-with-search'

export function useLastVisitedPath(tabPathname: string) {
  const location = useLocation()
  const [lastVisitedPath, setLastVisitedPath] = useState(tabPathname)
  const currentPath = toPathWithSearch(location)

  if (location.pathname === tabPathname && currentPath !== lastVisitedPath) {
    setLastVisitedPath(currentPath)
  }

  return lastVisitedPath
}
