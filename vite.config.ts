import { fileURLToPath, URL } from 'node:url'

import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'

const BOOK_SEARCH_PROXY_PATH = '/api/books'
const KAKAO_API_ORIGIN = 'https://dapi.kakao.com'
const KAKAO_BOOK_SEARCH_PATH = '/v3/search/book'

function createBookSearchProxy(kakaoRestApiKey: string): Record<string, ProxyOptions> {
  return {
    [BOOK_SEARCH_PROXY_PATH]: {
      target: KAKAO_API_ORIGIN,
      changeOrigin: true,
      rewrite: (path) => path.replace(BOOK_SEARCH_PROXY_PATH, KAKAO_BOOK_SEARCH_PATH),
      headers: { Authorization: `KakaoAK ${kakaoRestApiKey}` },
    },
  }
}

export default defineConfig(({ mode }) => {
  const { KAKAO_REST_API_KEY = '' } = loadEnv(mode, process.cwd(), '')
  const bookSearchProxy = createBookSearchProxy(KAKAO_REST_API_KEY)

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { proxy: bookSearchProxy },
    preview: { proxy: bookSearchProxy },
  }
})
