import { expect } from 'vitest';

/**
 * Create a clean DOM element for testing
 */
export function createTestElement(html: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

/**
 * Count verse reference links in an element
 */
export function countVerseLinks(element: HTMLElement): number {
  return element.querySelectorAll('a.verse-reference').length;
}

/**
 * Get all verse reference links from an element
 */
export function getVerseLinks(element: HTMLElement): HTMLAnchorElement[] {
  return Array.from(element.querySelectorAll('a.verse-reference'));
}

/**
 * Assert that a link has correct attributes
 */
export function assertValidVerseLink(link: HTMLAnchorElement): void {
  expect(link.tagName).toBe('A');
  expect(link.className).toBe('verse-reference');
  expect(link.dataset.book).toBeTruthy();
  expect(link.dataset.chapter).toBeTruthy();
  expect(link.dataset.verses).toBeTruthy();
  expect(link.href).toContain('bible.com');
}
