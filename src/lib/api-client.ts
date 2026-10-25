export class HttpError extends Error {
  readonly status: number
  readonly errorType: string | null

  constructor(status: number, errorType: string | null) {
    super(`HTTP ${status}`)
    this.name = 'HttpError'
    this.status = status
    this.errorType = errorType
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

type KakaoErrorBody = { errorType?: unknown }

async function readErrorType(response: Response) {
  const errorBody = (await response.json().catch(() => null)) as KakaoErrorBody | null
  return typeof errorBody?.errorType === 'string' ? errorBody.errorType : null
}

export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await requestOrThrowNetworkError(url, init)
  if (!response.ok) throw new HttpError(response.status, await readErrorType(response))
  return (await response.json()) as T
}
