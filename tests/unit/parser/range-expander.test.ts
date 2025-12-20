import { describe, it, expect } from 'vitest';
import {
  expandVerseRange,
  formatVerseRange,
  isValidVerseRange
} from '@/parser/range-expander';

describe('expandVerseRange', () => {
  describe('Single Verses', () => {
    it('should expand single verse', () => {
      expect(expandVerseRange('5')).toEqual([5]);
    });

    it('should expand verse 1', () => {
      expect(expandVerseRange('1')).toEqual([1]);
    });

    it('should expand large verse number', () => {
      expect(expandVerseRange('176')).toEqual([176]);
    });

    it('should expand multiple single verses', () => {
      expect(expandVerseRange('1,3,5')).toEqual([1, 3, 5]);
    });

    it('should expand non-consecutive verses', () => {
      expect(expandVerseRange('1,5,10,15')).toEqual([1, 5, 10, 15]);
    });
  });

  describe('Simple Ranges', () => {
    it('should expand simple range', () => {
      expect(expandVerseRange('1-3')).toEqual([1, 2, 3]);
    });

    it('should expand range with hyphen', () => {
      expect(expandVerseRange('5-8')).toEqual([5, 6, 7, 8]);
    });

    it('should expand range with en-dash', () => {
      expect(expandVerseRange('5–8')).toEqual([5, 6, 7, 8]);
    });

    it('should expand range with em-dash', () => {
      expect(expandVerseRange('5—8')).toEqual([5, 6, 7, 8]);
    });

    it('should expand two-number range', () => {
      expect(expandVerseRange('10-11')).toEqual([10, 11]);
    });

    it('should expand large range', () => {
      const result = expandVerseRange('1-10');
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('Multiple Ranges', () => {
    it('should expand multiple ranges', () => {
      expect(expandVerseRange('1-3,5-7')).toEqual([1, 2, 3, 5, 6, 7]);
    });

    it('should expand three ranges', () => {
      expect(expandVerseRange('1-2,5-6,10-11')).toEqual([1, 2, 5, 6, 10, 11]);
    });

    it('should expand ranges with different dash types', () => {
      expect(expandVerseRange('1-3,5–7,10—12')).toEqual([1, 2, 3, 5, 6, 7, 10, 11, 12]);
    });
  });

  describe('Mixed Format', () => {
    it('should expand mixed single verses and ranges', () => {
      expect(expandVerseRange('1,3-5,7')).toEqual([1, 3, 4, 5, 7]);
    });

    it('should expand complex mixed format', () => {
      expect(expandVerseRange('1,3,5-8,10,12-14')).toEqual([1, 3, 5, 6, 7, 8, 10, 12, 13, 14]);
    });

    it('should handle single verse before range', () => {
      expect(expandVerseRange('1,3-5')).toEqual([1, 3, 4, 5]);
    });

    it('should handle single verse after range', () => {
      expect(expandVerseRange('1-3,5')).toEqual([1, 2, 3, 5]);
    });
  });

  describe('Deduplication', () => {
    it('should remove duplicate verses', () => {
      expect(expandVerseRange('1,2,2,3')).toEqual([1, 2, 3]);
    });

    it('should remove duplicates from overlapping ranges', () => {
      expect(expandVerseRange('1-5,3-7')).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should handle completely overlapping ranges', () => {
      expect(expandVerseRange('1-5,2-4')).toEqual([1, 2, 3, 4, 5]);
    });

    it('should deduplicate single verses in ranges', () => {
      expect(expandVerseRange('1-3,2,3,4-6')).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('Sorting', () => {
    it('should sort verses in ascending order', () => {
      expect(expandVerseRange('5,1,3')).toEqual([1, 3, 5]);
    });

    it('should sort ranges', () => {
      expect(expandVerseRange('10-12,1-3,5-7')).toEqual([1, 2, 3, 5, 6, 7, 10, 11, 12]);
    });

    it('should sort mixed format', () => {
      expect(expandVerseRange('10,5,1,7-9,3')).toEqual([1, 3, 5, 7, 8, 9, 10]);
    });
  });

  describe('Invalid Ranges', () => {
    it('should handle invalid range where end < start', () => {
      const result = expandVerseRange('5-3');
      expect(result).toEqual([]);
    });

    it('should handle zero in range', () => {
      const result = expandVerseRange('0-5');
      expect(result).toEqual([]);
    });

    it('should handle negative numbers', () => {
      const result = expandVerseRange('-1-5');
      expect(result).toEqual([]);
    });

    it('should ignore invalid verses but keep valid ones', () => {
      const result = expandVerseRange('1,2,0,3');
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      expect(expandVerseRange('')).toEqual([]);
    });

    it('should handle whitespace only', () => {
      expect(expandVerseRange('   ')).toEqual([]);
    });

    it('should handle whitespace in range', () => {
      expect(expandVerseRange(' 1 - 3 , 5 ')).toEqual([1, 2, 3, 5]);
    });

    it('should handle extra whitespace between parts', () => {
      expect(expandVerseRange('1  ,  3  -  5  ,  7')).toEqual([1, 3, 4, 5, 7]);
    });

    it('should handle large verse numbers', () => {
      expect(expandVerseRange('150-152')).toEqual([150, 151, 152]);
    });

    it('should handle very large range efficiently', () => {
      const result = expandVerseRange('1-100');
      expect(result).toHaveLength(100);
      expect(result[0]).toBe(1);
      expect(result[99]).toBe(100);
    });

    it('should handle single digit ranges', () => {
      expect(expandVerseRange('1-9')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should handle three digit ranges', () => {
      expect(expandVerseRange('100-103')).toEqual([100, 101, 102, 103]);
    });
  });

  describe('Non-numeric Input', () => {
    it('should handle non-numeric values', () => {
      const result = expandVerseRange('abc');
      expect(result).toEqual([]);
    });

    it('should handle mixed numeric and non-numeric', () => {
      const result = expandVerseRange('1,abc,3');
      expect(result).toEqual([1, 3]);
    });

    it('should handle partial non-numeric ranges', () => {
      const result = expandVerseRange('1-abc');
      expect(result).toEqual([]);
    });
  });

  describe('Special Characters', () => {
    it('should handle trailing comma', () => {
      const result = expandVerseRange('1,2,3,');
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle leading comma', () => {
      const result = expandVerseRange(',1,2,3');
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle multiple consecutive commas', () => {
      const result = expandVerseRange('1,,2,,3');
      expect(result).toEqual([1, 2, 3]);
    });
  });
});

describe('formatVerseRange', () => {
  describe('Single Verses', () => {
    it('should format single verse', () => {
      expect(formatVerseRange([5])).toBe('5');
    });

    it('should format verse 1', () => {
      expect(formatVerseRange([1])).toBe('1');
    });

    it('should format large verse number', () => {
      expect(formatVerseRange([176])).toBe('176');
    });
  });

  describe('Consecutive Verses as Ranges', () => {
    it('should format two consecutive verses as range', () => {
      expect(formatVerseRange([1, 2])).toBe('1-2');
    });

    it('should format three consecutive verses as range', () => {
      expect(formatVerseRange([1, 2, 3])).toBe('1-3');
    });

    it('should format long consecutive range', () => {
      expect(formatVerseRange([5, 6, 7, 8, 9, 10])).toBe('5-10');
    });
  });

  describe('Non-consecutive Verses', () => {
    it('should format non-consecutive verses as list', () => {
      expect(formatVerseRange([1, 3, 5])).toBe('1,3,5');
    });

    it('should format scattered verses', () => {
      expect(formatVerseRange([1, 5, 10])).toBe('1,5,10');
    });
  });

  describe('Mixed Consecutive and Non-consecutive', () => {
    it('should format mixed ranges and singles', () => {
      expect(formatVerseRange([1, 2, 3, 5, 6, 7])).toBe('1-3,5-7');
    });

    it('should format complex pattern', () => {
      expect(formatVerseRange([1, 2, 3, 5, 7, 8, 9])).toBe('1-3,5,7-9');
    });

    it('should format single verse between ranges', () => {
      expect(formatVerseRange([1, 2, 4, 6, 7, 8])).toBe('1-2,4,6-8');
    });

    it('should format ranges with single verse gaps', () => {
      expect(formatVerseRange([1, 2, 4, 5, 7, 8])).toBe('1-2,4-5,7-8');
    });
  });

  describe('Unsorted Input', () => {
    it('should sort before formatting', () => {
      expect(formatVerseRange([5, 1, 3, 2])).toBe('1-3,5');
    });

    it('should handle completely unsorted array', () => {
      expect(formatVerseRange([10, 1, 5, 3, 2])).toBe('1-3,5,10');
    });

    it('should handle reverse order', () => {
      expect(formatVerseRange([5, 4, 3, 2, 1])).toBe('1-5');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      expect(formatVerseRange([])).toBe('');
    });

    it('should handle large numbers', () => {
      expect(formatVerseRange([150, 151, 152])).toBe('150-152');
    });

    it('should handle very long range', () => {
      const verses = Array.from({ length: 100 }, (_, i) => i + 1);
      expect(formatVerseRange(verses)).toBe('1-100');
    });

    it('should handle many small ranges', () => {
      expect(formatVerseRange([1, 2, 5, 6, 9, 10, 13, 14])).toBe('1-2,5-6,9-10,13-14');
    });
  });

  describe('Duplicates', () => {
    it('should handle duplicate verses', () => {
      expect(formatVerseRange([1, 2, 2, 3])).toBe('1-3');
    });

    it('should deduplicate before formatting', () => {
      expect(formatVerseRange([1, 1, 2, 2, 3, 3])).toBe('1-3');
    });
  });
});

describe('isValidVerseRange', () => {
  describe('Valid Ranges', () => {
    it('should validate single verse', () => {
      expect(isValidVerseRange('1')).toBe(true);
      expect(isValidVerseRange('5')).toBe(true);
      expect(isValidVerseRange('176')).toBe(true);
    });

    it('should validate simple range', () => {
      expect(isValidVerseRange('1-3')).toBe(true);
      expect(isValidVerseRange('5-10')).toBe(true);
    });

    it('should validate range with en-dash', () => {
      expect(isValidVerseRange('1–3')).toBe(true);
    });

    it('should validate range with em-dash', () => {
      expect(isValidVerseRange('1—3')).toBe(true);
    });

    it('should validate multiple verses', () => {
      expect(isValidVerseRange('1,3,5')).toBe(true);
    });

    it('should validate mixed format', () => {
      expect(isValidVerseRange('1,3-5,7')).toBe(true);
    });

    it('should validate with whitespace', () => {
      expect(isValidVerseRange(' 1 - 3 ')).toBe(true);
    });
  });

  describe('Invalid Ranges', () => {
    it('should reject empty string', () => {
      expect(isValidVerseRange('')).toBe(false);
    });

    it('should reject whitespace only', () => {
      expect(isValidVerseRange('   ')).toBe(false);
    });

    it('should reject non-numeric values', () => {
      expect(isValidVerseRange('abc')).toBe(false);
    });

    it('should reject zero', () => {
      expect(isValidVerseRange('0')).toBe(false);
    });

    it('should reject negative numbers', () => {
      expect(isValidVerseRange('-1')).toBe(false);
    });

    it('should reject range with zero', () => {
      expect(isValidVerseRange('0-5')).toBe(false);
    });

    it('should reject invalid range (end < start)', () => {
      expect(isValidVerseRange('5-3')).toBe(false);
    });
  });

  describe('Type Errors', () => {
    it('should handle null gracefully', () => {
      expect(isValidVerseRange(null as any)).toBe(false);
    });

    it('should handle undefined gracefully', () => {
      expect(isValidVerseRange(undefined as any)).toBe(false);
    });

    it('should handle number type', () => {
      expect(isValidVerseRange(5 as any)).toBe(false);
    });

    it('should handle array type', () => {
      expect(isValidVerseRange([1, 2, 3] as any)).toBe(false);
    });

    it('should handle object type', () => {
      expect(isValidVerseRange({} as any)).toBe(false);
    });
  });
});
