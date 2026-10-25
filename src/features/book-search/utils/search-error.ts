import { HttpError } from '@/lib/api-client'

type SearchErrorDescription = {
  message: string
  canRetry: boolean
}

const BAD_REQUEST_STATUS = 400
const UNAUTHORIZED_STATUSES = [401, 403]
const TOO_MANY_REQUESTS_STATUS = 429

export function describeSearchError(error: unknown): SearchErrorDescription {
  const status = error instanceof HttpError ? error.status : null
  if (status === BAD_REQUEST_STATUS) {
    return { message: '검색어를 확인해 주세요.', canRetry: false }
  }
  if (status !== null && UNAUTHORIZED_STATUSES.includes(status)) {
    return { message: '서비스 설정 오류입니다. API 키(.env)를 확인해 주세요.', canRetry: false }
  }
  if (status === TOO_MANY_REQUESTS_STATUS) {
    return { message: '요청이 많아요. 잠시 후 다시 시도해 주세요.', canRetry: true }
  }
  return { message: '일시적인 오류입니다. 다시 시도해 주세요.', canRetry: true }
}
