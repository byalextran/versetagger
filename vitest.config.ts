import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Use JSDOM for DOM testing
    environment: 'jsdom',

    // Global setup file
    setupFiles: ['./tests/setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'src/parser/**/*.ts',
        'src/core/scanner.ts',
        'src/core/config.ts'
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/types.ts',
        '**/index.ts'
      ],
      // Target 90%+ coverage
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90
      }
    },

    // Test timeout for performance tests
    testTimeout: 10000,

    // Show full diff on failures
    outputDiffMaxSize: 10000,

    // Globals for cleaner test syntax
    globals: true,

    // Include patterns
    include: ['tests/**/*.test.ts'],

    // Exclude patterns
    exclude: ['**/node_modules/**', '**/dist/**']
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests')
    }
  }
});
