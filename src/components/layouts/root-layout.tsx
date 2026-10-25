import { Outlet, ScrollRestoration, type Location } from 'react-router'

import { AppShell } from './app-shell'

function toScrollPositionKey({ pathname, search }: Location) {
  return pathname + search
}

export function RootLayout() {
  return (
    <>
      <AppShell>
        <Outlet />
      </AppShell>
      <ScrollRestoration getKey={toScrollPositionKey} />
    </>
  )
}
