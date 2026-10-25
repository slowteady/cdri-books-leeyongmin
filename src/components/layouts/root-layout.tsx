import { Outlet, ScrollRestoration } from 'react-router'

import { toPathWithSearch } from '@/utils/to-path-with-search'

import { AppShell } from './app-shell'

export function RootLayout() {
  return (
    <>
      <AppShell>
        <Outlet />
      </AppShell>
      <ScrollRestoration getKey={toPathWithSearch} />
    </>
  )
}
