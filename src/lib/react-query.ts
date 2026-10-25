import { QueryClient } from '@tanstack/react-query'

import { QUERY_GC_TIME_MS } from '@/config/constants'

import { HTTP_STATUS, HttpError, NetworkError } from './api-client'

const NO_RETRY_COUNT = 0
const MAX_RETRY_COUNT_FOR_TOO_MANY_REQUESTS = 1
const MAX_RETRY_COUNT_FOR_TEMPORARY_FAILURE = 2

function getMaxRetryCount(error: unknown) {
  if (error instanceof NetworkError) return MAX_RETRY_COUNT_FOR_TEMPORARY_FAILURE
  if (!(error instanceof HttpError)) return NO_RETRY_COUNT
  if (error.status === HTTP_STATUS.TOO_MANY_REQUESTS) return MAX_RETRY_COUNT_FOR_TOO_MANY_REQUESTS
  if (error.status >= HTTP_STATUS.SERVER_ERROR_MIN) return MAX_RETRY_COUNT_FOR_TEMPORARY_FAILURE
  return NO_RETRY_COUNT
}

export function shouldRetryQuery(failureCount: number, error: unknown) {
  return failureCount < getMaxRetryCount(error)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: shouldRetryQuery, gcTime: QUERY_GC_TIME_MS },
  },
})
