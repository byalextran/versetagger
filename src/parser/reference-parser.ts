/**
 * Scripture reference parser
 * Parses scripture references from text and extracts structured data
 */

import { findBook, getBookNamesRegex } from './book-mappings';
import { expandVerseRange } from './range-expander';
import { getTranslationsRegex } from './bible-versions';

export interface ScriptureReference {
  /** Original matched text */
  text: string;
  /** Book code (e.g., "GEN", "MAT") */
  book: string;
  /** Chapter number */
  chapter: number;
  /** Verse numbers (expanded from ranges) */
  verses: number[];
  /** Bible version (e.g., "NIV", "ESV"), undefined if not specified */
  version?: string;
  /** Start position in original text */
  startIndex: number;
  /** End position in original text */
  endIndex: number;
}

/**
 * Build regex pattern for matching scripture references
 * Matches patterns like:
 * - John 3:16
 * - 1 John 2:1-5
 * - Matthew 5:1-10,12-15
 * - Psalm 23
 * - Gen 1:1 NIV
 * - Matt 6:33 ESV
 */
let referencePattern: RegExp | null = null;

function buildReferencePattern(): RegExp {
  if (referencePattern) {
    return referencePattern;
  }

  // Get regex patterns from respective modules
  const bookPattern = getBookNamesRegex();
  const translationPattern = getTranslationsRegex();

  // Build the complete pattern
  // Format: <book> <chapter>:<verses> (<version>)?
  // Examples:
  //   John 3:16
  //   1 John 2:1-5
  //   Matthew 5:1-10,12-15
  //   Matt 6:33 NIV
  // Note: Verse numbers are required (chapter-only references are not matched)
  referencePattern = new RegExp(
    `\\b(${bookPattern})\\s+(\\d+):(\\d+(?:[–—-]\\d+)?(?:,\\s*\\d+(?:[–—-]\\d+)?)*)(?:\\s+(${translationPattern}))?\\b`,
    'gi'
  );

  return referencePattern;
}

/**
 * Parse all scripture references from a text string
 */
export function parseReferences(text: string): ScriptureReference[] {
  const pattern = buildReferencePattern();
  const references: ScriptureReference[] = [];
  let match: RegExpExecArray | null;

  // Reset regex state
  pattern.lastIndex = 0;

  while ((match = pattern.exec(text)) !== null) {
    const [fullMatch, bookName, chapterStr, versesStr, version] = match;

    // Find the book mapping
    const book = findBook(bookName);
    if (!book) {
      continue; // Skip if book not found
    }

    const chapter = parseInt(chapterStr, 10);
    if (isNaN(chapter) || chapter <= 0) {
      continue; // Skip invalid chapter
    }

    // Parse verses (required in the regex pattern)
    const verses = expandVerseRange(versesStr);
    if (verses.length === 0) {
      continue; // Skip if verse range is invalid
    }

    references.push({
      text: fullMatch,
      book: book.code,
      chapter,
      verses,
      version: version ? version.toUpperCase() : undefined,
      startIndex: match.index,
      endIndex: match.index + fullMatch.length
    });
  }

  return references;
}

/**
 * Parse a single scripture reference string
 * Returns null if the reference is invalid
 */
export function parseReference(text: string): ScriptureReference | null {
  const refs = parseReferences(text);
  return refs.length > 0 ? refs[0] : null;
}

/**
 * Check if a string contains any scripture references
 */
export function containsReferences(text: string): boolean {
  const pattern = buildReferencePattern();
  pattern.lastIndex = 0;
  return pattern.test(text);
}

/**
 * Format a scripture reference for display
 * Examples:
 *   formatReference({ book: "JHN", chapter: 3, verses: [16] }) => "John 3:16"
 *   formatReference({ book: "MAT", chapter: 5, verses: [1,2,3] }) => "Matthew 5:1-3"
 */
export function formatReference(ref: Partial<ScriptureReference>): string {
  if (!ref.book || !ref.chapter) {
    return '';
  }

  // Find book to get the full name
  const book = findBook(ref.book);
  const bookName = book ? book.name : ref.book;

  let result = `${bookName} ${ref.chapter}`;

  if (ref.verses && ref.verses.length > 0) {
    // Use the range formatter for compact display
    const verseStr = formatVerseRangeCompact(ref.verses);
    result += `:${verseStr}`;
  }

  if (ref.version) {
    result += ` ${ref.version}`;
  }

  return result;
}

/**
 * Helper to format verses compactly
 */
function formatVerseRangeCompact(verses: number[]): string {
  if (verses.length === 0) return '';
  if (verses.length === 1) return verses[0].toString();

  const sorted = [...verses].sort((a, b) => a - b);
  const ranges: string[] = [];
  let rangeStart = sorted[0];
  let rangeEnd = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === rangeEnd + 1) {
      rangeEnd = sorted[i];
    } else {
      if (rangeStart === rangeEnd) {
        ranges.push(rangeStart.toString());
      } else {
        ranges.push(`${rangeStart}-${rangeEnd}`);
      }
      rangeStart = sorted[i];
      rangeEnd = sorted[i];
    }
  }

  if (rangeStart === rangeEnd) {
    ranges.push(rangeStart.toString());
  } else {
    ranges.push(`${rangeStart}-${rangeEnd}`);
  }

  return ranges.join(',');
}

/**
 * Validate that a reference is well-formed
 */
export function isValidReference(ref: Partial<ScriptureReference>): boolean {
  if (!ref.book || !ref.chapter) {
    return false;
  }

  const book = findBook(ref.book);
  if (!book) {
    return false;
  }

  if (ref.chapter <= 0) {
    return false;
  }

  if (ref.verses && ref.verses.some(v => v <= 0)) {
    return false;
  }

  return true;
}
