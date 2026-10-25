import { Outlet, ScrollRestoration } from 'react-router'

import { AppShell } from './app-shell'

export function RootLayout() {
  return (
    <>
      <AppShell>
        <Outlet />
      </AppShell>
      <ScrollRestoration />
    </>
  )
}
