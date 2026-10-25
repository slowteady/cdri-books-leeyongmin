import { HTTP_STATUS, HttpError, NetworkError } from '@/lib/api-client'

type SearchErrorDescription = {
  message: string
  canRetry: boolean
}

const AUTH_FAILURE_STATUSES: number[] = [HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]

export function describeSearchError(error: unknown): SearchErrorDescription {
  if (error instanceof NetworkError) {
    return { message: '네트워크 연결을 확인하고 다시 시도해 주세요.', canRetry: true }
  }
  const status = error instanceof HttpError ? error.status : null
  if (status === HTTP_STATUS.BAD_REQUEST) {
    return { message: '검색어를 확인해 주세요.', canRetry: false }
  }
  if (status !== null && AUTH_FAILURE_STATUSES.includes(status)) {
    return { message: '서비스 설정 오류입니다. API 키(.env)를 확인해 주세요.', canRetry: false }
  }
  if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
    return { message: '요청이 많아요. 잠시 후 다시 시도해 주세요.', canRetry: true }
  }
  return { message: '일시적인 오류입니다. 다시 시도해 주세요.', canRetry: true }
}
