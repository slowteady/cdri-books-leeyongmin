import { QueryClient } from '@tanstack/react-query'

import { QUERY_GC_TIME_MS } from '@/config/constants'

import { HttpError, NetworkError } from './api-client'

const TOO_MANY_REQUESTS_STATUS = 429
const SERVER_ERROR_MIN_STATUS = 500
const MAX_RETRY_COUNT_FOR_TOO_MANY_REQUESTS = 1
const MAX_RETRY_COUNT_FOR_TEMPORARY_FAILURE = 2

function getMaxRetryCount(error: unknown) {
  if (error instanceof NetworkError) return MAX_RETRY_COUNT_FOR_TEMPORARY_FAILURE
  if (!(error instanceof HttpError)) return 0
  if (error.status === TOO_MANY_REQUESTS_STATUS) return MAX_RETRY_COUNT_FOR_TOO_MANY_REQUESTS
  if (error.status >= SERVER_ERROR_MIN_STATUS) return MAX_RETRY_COUNT_FOR_TEMPORARY_FAILURE
  return 0
}

export function shouldRetryQuery(failureCount: number, error: unknown) {
  return failureCount < getMaxRetryCount(error)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: shouldRetryQuery, gcTime: QUERY_GC_TIME_MS },
  },
})
