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

type KakaoErrorBody = { errorType?: unknown }

async function readErrorType(response: Response) {
  const errorBody = (await response.json().catch(() => null)) as KakaoErrorBody | null
  return typeof errorBody?.errorType === 'string' ? errorBody.errorType : null
}

export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) throw new HttpError(response.status, await readErrorType(response))
  return (await response.json()) as T
}
