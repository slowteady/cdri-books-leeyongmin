import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default defineConfig((configEnv) =>
  mergeConfig(viteConfig(configEnv), {
    test: {
      environment: 'jsdom',
      globals: true,
      css: false,
      setupFiles: ['./src/testing/setup.ts'],
    },
  }),
)
