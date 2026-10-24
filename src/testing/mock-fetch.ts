type FetchResponder = (requestUrl: URL) => Response | Promise<Response>

export function mockFetch(respond: FetchResponder) {
  const fetchMock = vi.fn((input: RequestInfo | URL, _init?: RequestInit) =>
    Promise.resolve(respond(new URL(String(input), window.location.origin))),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
