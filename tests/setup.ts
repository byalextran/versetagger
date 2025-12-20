import { beforeAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/dom';

// Set up JSDOM globals
beforeAll(() => {
  // Extend JSDOM with any needed globals
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Clean up DOM after each test
afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});
