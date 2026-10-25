export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR_MIN: 500,
} as const

export class HttpError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`HTTP ${status}`)
    this.name = 'HttpError'
    this.status = status
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Network request failed')
    this.name = 'NetworkError'
  }
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

async function requestOrThrowNetworkError(url: string, init?: RequestInit) {
  try {
    return await fetch(url, init)
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new NetworkError()
  }
}

export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await requestOrThrowNetworkError(url, init)
  if (!response.ok) throw new HttpError(response.status)
  return (await response.json()) as T
}
