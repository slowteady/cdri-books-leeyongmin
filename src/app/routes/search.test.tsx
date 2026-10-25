import { screen } from '@testing-library/react'

import { createKakaoBookSearchResponse } from '@/testing/data/kakao-books'
import { mockFetch } from '@/testing/mock-fetch'
import { renderApp } from '@/testing/test-utils'

function mockBookSearchApi(totalCount: number) {
  return mockFetch((requestUrl) => {
    const page = Number(requestUrl.searchParams.get('page'))
    return Response.json(createKakaoBookSearchResponse({ page, totalCount }))
  })
}

describe('도서 검색 결과', () => {
  test('검색 전에는 검색된 결과가 없다고 보여준다', async () => {
    renderApp('/')

    expect(await screen.findByText('검색된 결과가 없습니다.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('도서 검색 결과총 0건')
  })

  test('URL의 검색어로 검색해 총 건수와 첫 10권을 보여준다', async () => {
    mockBookSearchApi(25)

    renderApp('/?q=테스트')

    expect(await screen.findByText('테스트 책 1')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(10)
    expect(screen.getByRole('status')).toHaveTextContent('도서 검색 결과총 25건')
  })

  test('더 보기를 누르면 다음 10권을 이어서 보여주고, 다 보여주면 더 보기를 감춘다', async () => {
    mockBookSearchApi(25)
    const { user } = renderApp('/?q=테스트')

    await user.click(await screen.findByRole('button', { name: '더 보기' }))
    expect(await screen.findByText('테스트 책 20')).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: '더 보기' }))
    expect(await screen.findByText('테스트 책 25')).toBeInTheDocument()

    expect(screen.getAllByRole('article')).toHaveLength(25)
    expect(screen.queryByRole('button', { name: '더 보기' })).not.toBeInTheDocument()
  })

  test('검색 결과가 없으면 검색된 결과가 없다고 보여준다', async () => {
    mockBookSearchApi(0)

    renderApp('/?q=없는책')

    expect(await screen.findByText('검색된 결과가 없습니다.')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  test('검색하는 동안에는 불러오는 중임을 알리고 빈 결과 문구를 보여주지 않는다', async () => {
    mockFetch(() => new Promise<Response>(() => {}))

    renderApp('/?q=테스트')

    expect(await screen.findByRole('status', { name: '검색 결과 불러오는 중' })).toBeInTheDocument()
    expect(screen.queryByText('검색된 결과가 없습니다.')).not.toBeInTheDocument()
  })

  test('검색하는 동안에는 결과 건수를 0건으로 알리지 않는다', async () => {
    mockFetch(() => new Promise<Response>(() => {}))

    renderApp('/?q=테스트')

    await screen.findByRole('status', { name: '검색 결과 불러오는 중' })
    expect(screen.getByText('도서 검색 결과').parentElement).not.toHaveTextContent('0건')
  })

  test('다시 시도를 누르면 응답이 올 때까지 에러 안내 대신 불러오는 중임을 알린다', async () => {
    let requestCount = 0
    mockFetch(() => {
      requestCount += 1
      if (requestCount === 1) return new Response(null, { status: 503 })
      return new Promise<Response>(() => {})
    })
    const { user } = renderApp('/?q=테스트')

    await user.click(await screen.findByRole('button', { name: '다시 시도' }))

    expect(await screen.findByRole('status', { name: '검색 결과 불러오는 중' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('검색이 일시적으로 실패하면 안내와 다시 시도 버튼을 보여주고, 다시 시도하면 결과를 보여준다', async () => {
    let requestCount = 0
    mockFetch((requestUrl) => {
      requestCount += 1
      if (requestCount === 1) return new Response(null, { status: 503 })
      const page = Number(requestUrl.searchParams.get('page'))
      return Response.json(createKakaoBookSearchResponse({ page, totalCount: 3 }))
    })
    const { user } = renderApp('/?q=테스트')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '일시적인 오류입니다. 다시 시도해 주세요.',
    )
    await user.click(screen.getByRole('button', { name: '다시 시도' }))

    expect(await screen.findByText('테스트 책 1')).toBeInTheDocument()
  })

  test('API 키가 잘못되면 .env 확인을 안내하고 다시 시도 버튼은 보여주지 않는다', async () => {
    mockFetch(() => Response.json({ errorType: 'AccessDeniedError' }, { status: 401 }))

    renderApp('/?q=테스트')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '서비스 설정 오류입니다. API 키(.env)를 확인해 주세요.',
    )
    expect(screen.queryByRole('button', { name: '다시 시도' })).not.toBeInTheDocument()
  })

  test('다음 목록을 불러오지 못하면 받은 목록은 그대로 두고 다시 시도할 수 있다', async () => {
    let shouldFailNextPage = true
    mockFetch((requestUrl) => {
      const page = Number(requestUrl.searchParams.get('page'))
      if (page === 2 && shouldFailNextPage) {
        shouldFailNextPage = false
        return new Response(null, { status: 503 })
      }
      return Response.json(createKakaoBookSearchResponse({ page, totalCount: 15 }))
    })
    const { user } = renderApp('/?q=테스트')

    await user.click(await screen.findByRole('button', { name: '더 보기' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('다음 목록을 불러오지 못했어요.')
    expect(screen.getAllByRole('article')).toHaveLength(10)

    await user.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(await screen.findByText('테스트 책 15')).toBeInTheDocument()
  })

  test('다음 목록을 불러오는 동안에는 불러오는 중임을 알린다', async () => {
    mockFetch((requestUrl) => {
      const page = Number(requestUrl.searchParams.get('page'))
      if (page === 2) return new Promise<Response>(() => {})
      return Response.json(createKakaoBookSearchResponse({ page, totalCount: 15 }))
    })
    const { user } = renderApp('/?q=테스트')

    await user.click(await screen.findByRole('button', { name: '더 보기' }))

    expect(await screen.findByRole('status', { name: '다음 목록 불러오는 중' })).toBeInTheDocument()
  })
})
