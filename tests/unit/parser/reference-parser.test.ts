import { describe, it, expect } from 'vitest';
import {
  parseReferences,
  parseReference,
  containsReferences,
  formatReference,
  isValidReference,
  type ScriptureReference
} from '@/parser/reference-parser';
import { assertReferenceMatches, assertIsValidReference } from '@tests/helpers/assertion-helpers';

describe('parseReferences', () => {
  describe('Basic Parsing', () => {
    it('should parse single verse reference', () => {
      const result = parseReferences('John 3:16');
      expect(result).toHaveLength(1);
      assertReferenceMatches(result[0], {
        book: 'JHN',
        chapter: 3,
        verses: '16',
        text: 'John 3:16'
      });
      expect(result[0].version).toBeUndefined();
    });

    it('should parse reference with version', () => {
      const result = parseReferences('John 3:16 ESV');
      expect(result).toHaveLength(1);
      assertReferenceMatches(result[0], {
        book: 'JHN',
        chapter: 3,
        verses: '16',
        version: 'ESV',
        text: 'John 3:16 ESV'
      });
    });

    it('should parse verse range with hyphen', () => {
      const result = parseReferences('Matthew 5:3-12');
      expect(result).toHaveLength(1);
      assertReferenceMatches(result[0], {
        book: 'MAT',
        chapter: 5,
        verses: '3-12'
      });
    });

    it('should parse verse range with en-dash', () => {
      const result = parseReferences('Matthew 5:3–12');
      expect(result).toHaveLength(1);
      assertReferenceMatches(result[0], {
        book: 'MAT',
        chapter: 5,
        verses: '3–12'
      });
    });

    it('should parse verse range with em-dash', () => {
      const result = parseReferences('Matthew 5:3—12');
      expect(result).toHaveLength(1);
      assertReferenceMatches(result[0], {
        book: 'MAT',
        chapter: 5,
        verses: '3—12'
      });
    });

    it('should maintain correct indices', () => {
      const result = parseReferences('Start John 3:16 end');
      expect(result[0].startIndex).toBe(6);
      expect(result[0].endIndex).toBe(15);
    });
  });

  describe('Multiple References', () => {
    it('should parse multiple references in same text', () => {
      const text = 'See John 3:16 and Romans 8:28 for comfort';
      const result = parseReferences(text);
      expect(result).toHaveLength(2);
      assertReferenceMatches(result[0], { book: 'JHN', chapter: 3, verses: '16' });
      assertReferenceMatches(result[1], { book: 'ROM', chapter: 8, verses: '28' });
    });

    it('should parse adjacent references', () => {
      const text = 'John 3:16 ESV and John 3:17 NIV';
      const result = parseReferences(text);
      expect(result).toHaveLength(2);
      assertReferenceMatches(result[0], { version: 'ESV' });
      assertReferenceMatches(result[1], { version: 'NIV' });
    });

    it('should maintain correct indices for multiple references', () => {
      const text = 'Start John 3:16 middle Romans 8:28 end';
      const result = parseReferences(text);
      expect(result[0].startIndex).toBe(6);
      expect(result[0].endIndex).toBe(15);
      expect(result[1].startIndex).toBe(23);
      expect(result[1].endIndex).toBe(34);
    });
  });

  describe('Book Name Variations', () => {
    it('should parse full book names', () => {
      expect(parseReferences('Genesis 1:1')[0].book).toBe('GEN');
      expect(parseReferences('Exodus 20:1')[0].book).toBe('EXO');
      expect(parseReferences('Revelation 22:21')[0].book).toBe('REV');
    });

    it('should parse abbreviated book names', () => {
      expect(parseReferences('Gen 1:1')[0].book).toBe('GEN');
      expect(parseReferences('Matt 5:1')[0].book).toBe('MAT');
      expect(parseReferences('Rom 8:28')[0].book).toBe('ROM');
      expect(parseReferences('Ps 23:1')[0].book).toBe('PSA');
    });

    it('should parse numbered books with full names', () => {
      expect(parseReferences('1 John 2:1')[0].book).toBe('1JN');
      expect(parseReferences('2 Corinthians 5:17')[0].book).toBe('2CO');
      expect(parseReferences('3 John 1:2')[0].book).toBe('3JN');
      expect(parseReferences('1 Samuel 17:45')[0].book).toBe('1SA');
      expect(parseReferences('2 Kings 2:11')[0].book).toBe('2KI');
    });

    it('should parse numbered book abbreviations', () => {
      expect(parseReferences('1 Cor 13:4')[0].book).toBe('1CO');
      expect(parseReferences('2 Tim 3:16')[0].book).toBe('2TI');
      expect(parseReferences('1 Pet 5:7')[0].book).toBe('1PE');
    });

    it('should handle case variations', () => {
      expect(parseReferences('john 3:16')[0].book).toBe('JHN');
      expect(parseReferences('JOHN 3:16')[0].book).toBe('JHN');
      expect(parseReferences('John 3:16')[0].book).toBe('JHN');
      expect(parseReferences('JoHn 3:16')[0].book).toBe('JHN');
    });

    it('should parse books with "of" in names', () => {
      expect(parseReferences('Song of Solomon 1:1')[0].book).toBe('SNG');
      expect(parseReferences('Song of Songs 2:1')[0].book).toBe('SNG');
    });
  });

  describe('Bible Version Variations', () => {
    const majorVersions = ['NIV', 'ESV', 'KJV', 'NASB', 'NLT', 'CSB', 'NKJV', 'AMP'];

    majorVersions.forEach(version => {
      it(`should parse ${version} version`, () => {
        const result = parseReferences(`John 3:16 ${version}`);
        expect(result[0].version).toBe(version);
      });
    });

    it('should parse version with numbers', () => {
      expect(parseReferences('John 3:16 NASB2020')[0].version).toBe('NASB2020');
    });

    it('should parse version with hyphens', () => {
      expect(parseReferences('John 3:16 NRSV-CI')[0].version).toBe('NRSV-CI');
    });

    it('should normalize version to uppercase', () => {
      expect(parseReferences('John 3:16 niv')[0].version).toBe('NIV');
      expect(parseReferences('John 3:16 esv')[0].version).toBe('ESV');
      expect(parseReferences('John 3:16 Niv')[0].version).toBe('NIV');
    });
  });

  describe('Invalid References (Should NOT Match)', () => {
    it('should not match chapter-only references', () => {
      expect(parseReferences('John 3')).toHaveLength(0);
      expect(parseReferences('Psalm 23')).toHaveLength(0);
      expect(parseReferences('Genesis 1')).toHaveLength(0);
    });

    it('should not match without space between book and chapter', () => {
      expect(parseReferences('John3:16')).toHaveLength(0);
      expect(parseReferences('Romans8:28')).toHaveLength(0);
    });

    it('should not match invalid book names', () => {
      expect(parseReferences('Steve 1:1')).toHaveLength(0);
      expect(parseReferences('Paul 2:3')).toHaveLength(0);
      expect(parseReferences('Jesus 4:5')).toHaveLength(0);
    });

    it('should not match missing colon', () => {
      expect(parseReferences('John 3 16')).toHaveLength(0);
      expect(parseReferences('Romans 8 28')).toHaveLength(0);
    });

    it('should not match without verse numbers', () => {
      expect(parseReferences('John 3:')).toHaveLength(0);
      expect(parseReferences('Romans :')).toHaveLength(0);
    });

    it('should skip references with chapter 0', () => {
      // These might match the regex pattern but should be filtered out
      expect(parseReferences('John 0:16')).toHaveLength(0);
      expect(parseReferences('Romans 0:1')).toHaveLength(0);
    });

    it('should skip references with negative chapters', () => {
      // These might match pattern but should be filtered as invalid
      expect(parseReferences('Genesis -1:1')).toHaveLength(0);
      expect(parseReferences('Psalm -5:3')).toHaveLength(0);
    });
  });

  describe('False Positive Prevention', () => {
    it('should not match email addresses', () => {
      expect(parseReferences('john3:16@example.com')).toHaveLength(0);
      expect(parseReferences('contact@john3:16.org')).toHaveLength(0);
      expect(parseReferences('user@psalm23:1.com')).toHaveLength(0);
    });

    it('should not match URLs', () => {
      expect(parseReferences('https://example.com/john3:16')).toHaveLength(0);
      expect(parseReferences('www.site.com/psalm23:1')).toHaveLength(0);
      expect(parseReferences('http://john3:16.example.com')).toHaveLength(0);
    });

    it('should not match file paths', () => {
      expect(parseReferences('psalm23:1.txt')).toHaveLength(0);
      expect(parseReferences('/path/to/john3:16.html')).toHaveLength(0);
      expect(parseReferences('C:\\john3:16\\file.doc')).toHaveLength(0);
    });

    it('should respect word boundaries', () => {
      // These contain book-like words but aren't references
      expect(parseReferences('markedly 3:16')).toHaveLength(0);
      expect(parseReferences('remark 5:10')).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      expect(parseReferences('')).toHaveLength(0);
    });

    it('should handle string with only whitespace', () => {
      expect(parseReferences('   \n\t  ')).toHaveLength(0);
    });

    it('should handle very long text', () => {
      const longText = 'a '.repeat(10000) + 'John 3:16' + ' a'.repeat(10000);
      const result = parseReferences(longText);
      expect(result).toHaveLength(1);
      assertReferenceMatches(result[0], { book: 'JHN', chapter: 3, verses: '16' });
    });

    it('should handle Unicode characters around references', () => {
      expect(parseReferences('→ John 3:16 ←')[0].book).toBe('JHN');
      expect(parseReferences('「John 3:16」')[0].book).toBe('JHN');
      expect(parseReferences('• John 3:16 •')[0].book).toBe('JHN');
    });

    it('should handle newlines and tabs', () => {
      expect(parseReferences('See\nJohn 3:16\nfor hope')[0].book).toBe('JHN');
      expect(parseReferences('See\tJohn 3:16\tfor hope')[0].book).toBe('JHN');
      expect(parseReferences('See\r\nJohn 3:16\r\nfor hope')[0].book).toBe('JHN');
    });

    it('should handle references with surrounding punctuation', () => {
      expect(parseReferences('(John 3:16)')[0].book).toBe('JHN');
      expect(parseReferences('[Romans 8:28]')[0].book).toBe('ROM');
      expect(parseReferences('"Psalm 23:1"')[0].book).toBe('PSA');
      expect(parseReferences('John 3:16!')[0].book).toBe('JHN');
      expect(parseReferences('John 3:16?')[0].book).toBe('JHN');
      expect(parseReferences('John 3:16.')[0].book).toBe('JHN');
      expect(parseReferences('John 3:16,')[0].book).toBe('JHN');
    });
  });

  describe('Verse Range Formats', () => {
    it('should parse single verse', () => {
      const result = parseReferences('John 3:16');
      expect(result[0].verses).toBe('16');
    });

    it('should parse simple range', () => {
      const result = parseReferences('Matthew 5:3-12');
      expect(result[0].verses).toBe('3-12');
    });

    it('should parse large verse numbers', () => {
      const result = parseReferences('Psalm 119:105');
      expect(result[0].verses).toBe('105');
    });

    it('should parse three-digit verses', () => {
      const result = parseReferences('Psalm 119:176');
      expect(result[0].verses).toBe('176');
    });
  });
});

describe('parseReference', () => {
  it('should return first reference from text', () => {
    const result = parseReference('John 3:16 and Romans 8:28');
    expect(result).not.toBeNull();
    assertReferenceMatches(result!, { book: 'JHN', chapter: 3, verses: '16' });
  });

  it('should return null if no references found', () => {
    expect(parseReference('No references here')).toBeNull();
    expect(parseReference('Just some text')).toBeNull();
    expect(parseReference('John 3 without verse')).toBeNull();
  });

  it('should handle empty string', () => {
    expect(parseReference('')).toBeNull();
  });
});

describe('containsReferences', () => {
  it('should return true if text contains references', () => {
    expect(containsReferences('John 3:16')).toBe(true);
    expect(containsReferences('See John 3:16 for hope')).toBe(true);
    expect(containsReferences('Romans 8:28 and Philippians 4:13')).toBe(true);
  });

  it('should return false if text has no references', () => {
    expect(containsReferences('No references')).toBe(false);
    expect(containsReferences('John 3 only chapter')).toBe(false);
    expect(containsReferences('Just regular text')).toBe(false);
  });

  it('should handle empty string', () => {
    expect(containsReferences('')).toBe(false);
  });

  it('should be performant on long text', () => {
    const text = 'a '.repeat(10000) + 'John 3:16';
    const start = performance.now();
    const result = containsReferences(text);
    const duration = performance.now() - start;

    expect(result).toBe(true);
    expect(duration).toBeLessThan(10); // Should be very fast
  });
});

describe('formatReference', () => {
  it('should format basic reference', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'JHN',
      chapter: 3,
      verses: '16'
    };
    expect(formatReference(ref)).toBe('John 3:16');
  });

  it('should format reference with version', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'JHN',
      chapter: 3,
      verses: '16',
      version: 'ESV'
    };
    expect(formatReference(ref)).toBe('John 3:16 ESV');
  });

  it('should format reference with range', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'MAT',
      chapter: 5,
      verses: '3-12'
    };
    expect(formatReference(ref)).toBe('Matthew 5:3-12');
  });

  it('should handle numbered books', () => {
    const ref: Partial<ScriptureReference> = {
      book: '1JN',
      chapter: 2,
      verses: '1'
    };
    expect(formatReference(ref)).toBe('1 John 2:1');
  });

  it('should handle missing version gracefully', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'ROM',
      chapter: 8,
      verses: '28'
    };
    expect(formatReference(ref)).toBe('Romans 8:28');
  });

  it('should handle partial reference', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'PSA'
    };
    // Should handle gracefully even with missing data
    const result = formatReference(ref);
    expect(result).toContain('Psalm');
  });

  it('should return empty string when book is missing', () => {
    const ref: Partial<ScriptureReference> = {
      chapter: 3,
      verses: '16'
    };
    expect(formatReference(ref)).toBe('');
  });

  it('should handle empty object', () => {
    expect(formatReference({})).toBe('');
  });

  it('should handle reference with no chapter but has book', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'JHN'
    };
    expect(formatReference(ref)).toBe('John');
  });
});

describe('isValidReference', () => {
  it('should validate complete references', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'JHN',
      chapter: 3,
      verses: '16'
    };
    expect(isValidReference(ref)).toBe(true);
  });

  it('should validate reference with version', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'JHN',
      chapter: 3,
      verses: '16',
      version: 'ESV'
    };
    expect(isValidReference(ref)).toBe(true);
  });

  it('should reject reference without book', () => {
    const ref: Partial<ScriptureReference> = {
      chapter: 3,
      verses: '16'
    };
    expect(isValidReference(ref)).toBe(false);
  });

  it('should reject reference without chapter', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'JHN',
      verses: '16'
    };
    expect(isValidReference(ref)).toBe(false);
  });

  it('should reject reference without verses', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'JHN',
      chapter: 3
    };
    expect(isValidReference(ref)).toBe(false);
  });

  it('should reject invalid book code', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'INVALID',
      chapter: 3,
      verses: '16'
    };
    expect(isValidReference(ref)).toBe(false);
  });

  it('should reject zero chapter', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'JHN',
      chapter: 0,
      verses: '16'
    };
    expect(isValidReference(ref)).toBe(false);
  });

  it('should reject negative chapter', () => {
    const ref: Partial<ScriptureReference> = {
      book: 'JHN',
      chapter: -1,
      verses: '16'
    };
    expect(isValidReference(ref)).toBe(false);
  });

  it('should handle empty object', () => {
    expect(isValidReference({})).toBe(false);
  });

  it('should handle null', () => {
    expect(isValidReference(null as any)).toBe(false);
  });

  it('should handle undefined', () => {
    expect(isValidReference(undefined as any)).toBe(false);
  });
});
