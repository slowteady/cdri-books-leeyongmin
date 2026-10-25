import { Link } from 'react-router'

import { AppShell } from '@/components/layouts/app-shell'
import { buttonStyles } from '@/components/ui/button-styles'

export function RouteErrorPage() {
  return (
    <AppShell>
      <h1 className="text-title2 text-fg-title">문제가 발생했습니다</h1>
      <p className="mt-4 text-caption text-fg-secondary">잠시 후 다시 시도해 주세요.</p>
      <Link to="/" className={buttonStyles({ variant: 'secondary', className: 'mt-6' })}>
        도서 검색으로 돌아가기
      </Link>
    </AppShell>
  )
}
