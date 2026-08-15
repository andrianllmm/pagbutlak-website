import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts', 'src/**/*.spec.ts'],
    // Integration test files each call getPayload() independently, which
    // pushes the dev schema to the shared test database. Running files in
    // parallel races these pushes against each other (e.g. "relation ...
    // already exists"), so force them to run one at a time.
    fileParallelism: false,
  },
})
