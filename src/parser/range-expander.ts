/**
 * Expands verse ranges into individual verse numbers
 * Examples:
 *   "1-3" => [1, 2, 3]
 *   "1-3,5-7" => [1, 2, 3, 5, 6, 7]
 *   "5" => [5]
 *   "1,3,5" => [1, 3, 5]
 */

export interface VerseRange {
  start: number;
  end: number;
}

/**
 * Parse a verse range string into an array of verse numbers
 * Handles:
 * - Single verses: "5" => [5]
 * - Ranges: "1-3" => [1, 2, 3]
 * - Multiple ranges: "1-3,5-7" => [1, 2, 3, 5, 6, 7]
 * - Mixed: "1,3-5,7" => [1, 3, 4, 5, 7]
 */
export function expandVerseRange(rangeStr: string): number[] {
  const verses = new Set<number>();

  // Split by comma to get individual parts
  const parts = rangeStr.split(',').map(p => p.trim());

  for (const part of parts) {
    if (!part) continue;

    // Check if it's a range (contains hyphen or en-dash or em-dash)
    if (part.includes('-') || part.includes('–') || part.includes('—')) {
      const range = parseRange(part);
      if (range) {
        for (let i = range.start; i <= range.end; i++) {
          verses.add(i);
        }
      }
    } else {
      // Single verse number
      const verse = parseInt(part, 10);
      if (!isNaN(verse) && verse > 0) {
        verses.add(verse);
      }
    }
  }

  // Return sorted array
  return Array.from(verses).sort((a, b) => a - b);
}

/**
 * Parse a single range string into start and end numbers
 * Handles hyphens, en-dashes, and em-dashes
 */
function parseRange(rangeStr: string): VerseRange | null {
  // Normalize different dash types to standard hyphen
  const normalized = rangeStr
    .replace(/–/g, '-')  // en-dash
    .replace(/—/g, '-'); // em-dash

  const parts = normalized.split('-').map(p => p.trim());

  if (parts.length !== 2) {
    return null;
  }

  const start = parseInt(parts[0], 10);
  const end = parseInt(parts[1], 10);

  if (isNaN(start) || isNaN(end) || start <= 0 || end <= 0 || start > end) {
    return null;
  }

  return { start, end };
}

/**
 * Format verse numbers back into a compact range string
 * Useful for display purposes
 * Examples:
 *   [1, 2, 3] => "1-3"
 *   [1, 3, 5] => "1,3,5"
 *   [1, 2, 3, 5, 6, 7] => "1-3,5-7"
 */
export function formatVerseRange(verses: number[]): string {
  if (verses.length === 0) return '';
  if (verses.length === 1) return verses[0].toString();

  // Sort verses and remove duplicates
  const sorted = [...new Set(verses)].sort((a, b) => a - b);

  const ranges: string[] = [];
  let rangeStart = sorted[0];
  let rangeEnd = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === rangeEnd + 1) {
      // Continue the range
      rangeEnd = sorted[i];
    } else {
      // End current range and start new one
      if (rangeStart === rangeEnd) {
        ranges.push(rangeStart.toString());
      } else {
        ranges.push(`${rangeStart}-${rangeEnd}`);
      }
      rangeStart = sorted[i];
      rangeEnd = sorted[i];
    }
  }

  // Add final range
  if (rangeStart === rangeEnd) {
    ranges.push(rangeStart.toString());
  } else {
    ranges.push(`${rangeStart}-${rangeEnd}`);
  }

  return ranges.join(',');
}

/**
 * Validate that a verse range string is well-formed
 */
export function isValidVerseRange(rangeStr: string): boolean {
  if (!rangeStr || typeof rangeStr !== 'string') {
    return false;
  }

  const verses = expandVerseRange(rangeStr);
  return verses.length > 0;
}
