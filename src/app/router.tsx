import type { RouteObject } from 'react-router'

import { RootLayout } from '@/components/layouts/root-layout'

import { NotFoundPage } from './routes/not-found'
import { RouteErrorPage } from './routes/route-error'
import { SearchPage } from './routes/search'
import { WishlistPage } from './routes/wishlist'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RouteErrorPage,
    children: [
      { index: true, Component: SearchPage },
      { path: 'wishlist', Component: WishlistPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]
