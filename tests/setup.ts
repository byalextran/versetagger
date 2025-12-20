import { beforeAll, afterEach } from 'vitest';

// Set up JSDOM globals
beforeAll(() => {
  // Extend JSDOM with any needed globals
  if (typeof global.ResizeObserver === 'undefined') {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

// Clean up DOM after each test (for integration tests)
afterEach(() => {
  if (typeof document !== 'undefined' && document.body) {
    document.body.innerHTML = '';
  }
});
