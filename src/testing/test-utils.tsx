import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { routes } from '@/app/router'

export function renderApp(initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  const user = userEvent.setup()
  render(<RouterProvider router={router} />)
  return { router, user }
}
