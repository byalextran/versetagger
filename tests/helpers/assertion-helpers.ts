import { expect } from 'vitest';
import type { ScriptureReference } from '@/parser/reference-parser';

/**
 * Assert reference matches expected values
 */
export function assertReferenceMatches(
  actual: ScriptureReference,
  expected: Partial<ScriptureReference>
): void {
  if (expected.book) expect(actual.book).toBe(expected.book);
  if (expected.chapter !== undefined) expect(actual.chapter).toBe(expected.chapter);
  if (expected.verses) expect(actual.verses).toBe(expected.verses);
  if (expected.version !== undefined) expect(actual.version).toBe(expected.version);
  if (expected.text) expect(actual.text).toBe(expected.text);
  if (expected.startIndex !== undefined) expect(actual.startIndex).toBe(expected.startIndex);
  if (expected.endIndex !== undefined) expect(actual.endIndex).toBe(expected.endIndex);
}

/**
 * Assert that a value is a valid scripture reference
 */
export function assertIsValidReference(ref: any): asserts ref is ScriptureReference {
  expect(typeof ref.book).toBe('string');
  expect(typeof ref.chapter).toBe('number');
  expect(typeof ref.verses).toBe('string');
  expect(typeof ref.text).toBe('string');
  expect(typeof ref.startIndex).toBe('number');
  expect(typeof ref.endIndex).toBe('number');
}
