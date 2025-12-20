import { describe, it, expect } from 'vitest';
import {
  BOOK_MAPPINGS,
  buildBookLookup,
  normalizeBookName,
  findBook,
  getAllBookNames,
  getBookNamesRegex,
  type BookMapping
} from '@/parser/book-mappings';

describe('BOOK_MAPPINGS', () => {
  it('should contain all 66 books of the Bible', () => {
    expect(BOOK_MAPPINGS).toHaveLength(66);
  });

  it('should have 39 Old Testament books', () => {
    const otBooks = BOOK_MAPPINGS.filter(b => b.testament === 'OT');
    expect(otBooks).toHaveLength(39);
  });

  it('should have 27 New Testament books', () => {
    const ntBooks = BOOK_MAPPINGS.filter(b => b.testament === 'NT');
    expect(ntBooks).toHaveLength(27);
  });

  it('should have unique book codes', () => {
    const codes = BOOK_MAPPINGS.map(b => b.code);
    const uniqueCodes = new Set(codes);
    expect(codes.length).toBe(uniqueCodes.size);
  });

  it('should have valid book codes (3 uppercase letters/numbers)', () => {
    BOOK_MAPPINGS.forEach(book => {
      expect(book.code).toMatch(/^[A-Z0-9]{3}$/);
    });
  });

  it('should have non-empty names', () => {
    BOOK_MAPPINGS.forEach(book => {
      expect(book.name.length).toBeGreaterThan(0);
    });
  });

  it('should have abbreviations array for each book', () => {
    BOOK_MAPPINGS.forEach(book => {
      expect(Array.isArray(book.abbreviations)).toBe(true);
    });
  });

  it('should start with Genesis', () => {
    expect(BOOK_MAPPINGS[0].code).toBe('GEN');
    expect(BOOK_MAPPINGS[0].name).toBe('Genesis');
  });

  it('should end with Revelation', () => {
    expect(BOOK_MAPPINGS[65].code).toBe('REV');
    expect(BOOK_MAPPINGS[65].name).toBe('Revelation');
  });

  it('should have correct order (OT then NT)', () => {
    let foundNT = false;
    BOOK_MAPPINGS.forEach(book => {
      if (book.testament === 'NT') {
        foundNT = true;
      }
      if (foundNT) {
        expect(book.testament).toBe('NT');
      }
    });
  });
});

describe('buildBookLookup', () => {
  it('should return a Map', () => {
    const lookup = buildBookLookup();
    expect(lookup instanceof Map).toBe(true);
  });

  it('should contain entries for all books', () => {
    const lookup = buildBookLookup();
    expect(lookup.size).toBeGreaterThan(66); // More than 66 because of abbreviations
  });

  it('should find books by full name', () => {
    const lookup = buildBookLookup();
    expect(lookup.get('genesis')?.code).toBe('GEN');
    expect(lookup.get('revelation')?.code).toBe('REV');
  });

  it('should find books by abbreviation', () => {
    const lookup = buildBookLookup();
    expect(lookup.get('gen')?.code).toBe('GEN');
    expect(lookup.get('matt')?.code).toBe('MAT');
    expect(lookup.get('rev')?.code).toBe('REV');
  });

  it('should find numbered books', () => {
    const lookup = buildBookLookup();
    expect(lookup.get('1 john')?.code).toBe('1JN');
    expect(lookup.get('2 corinthians')?.code).toBe('2CO');
  });

  it('should normalize keys to lowercase', () => {
    const lookup = buildBookLookup();
    expect(lookup.get('john')).toBeDefined();
    expect(lookup.get('JOHN')).toBeUndefined(); // Keys should be lowercase
  });
});

describe('normalizeBookName', () => {
  it('should convert to lowercase', () => {
    expect(normalizeBookName('JOHN')).toBe('john');
    expect(normalizeBookName('Genesis')).toBe('genesis');
    expect(normalizeBookName('MATTHEW')).toBe('matthew');
  });

  it('should trim whitespace', () => {
    expect(normalizeBookName(' John ')).toBe('john');
    expect(normalizeBookName('  Genesis  ')).toBe('genesis');
  });

  it('should normalize multiple spaces', () => {
    expect(normalizeBookName('1  John')).toBe('1 john');
    expect(normalizeBookName('Song   of   Solomon')).toBe('song of solomon');
  });

  it('should handle empty string', () => {
    expect(normalizeBookName('')).toBe('');
  });

  it('should handle string with only whitespace', () => {
    expect(normalizeBookName('   ')).toBe('');
  });

  it('should preserve numbers in numbered books', () => {
    expect(normalizeBookName('1 John')).toBe('1 john');
    expect(normalizeBookName('2 Corinthians')).toBe('2 corinthians');
    expect(normalizeBookName('3 John')).toBe('3 john');
  });
});

describe('findBook', () => {
  describe('Full Names', () => {
    it('should find Genesis', () => {
      expect(findBook('Genesis')?.code).toBe('GEN');
    });

    it('should find Exodus', () => {
      expect(findBook('Exodus')?.code).toBe('EXO');
    });

    it('should find Leviticus', () => {
      expect(findBook('Leviticus')?.code).toBe('LEV');
    });

    it('should find Matthew', () => {
      expect(findBook('Matthew')?.code).toBe('MAT');
    });

    it('should find John', () => {
      expect(findBook('John')?.code).toBe('JHN');
    });

    it('should find Revelation', () => {
      expect(findBook('Revelation')?.code).toBe('REV');
    });

    it('should find Psalms', () => {
      const book = findBook('Psalms');
      expect(book?.code).toBe('PSA');
    });

    it('should find Song of Solomon', () => {
      expect(findBook('Song of Solomon')?.code).toBe('SNG');
    });

    it('should find Song of Songs', () => {
      expect(findBook('Song of Songs')?.code).toBe('SNG');
    });
  });

  describe('Abbreviations', () => {
    it('should find Gen', () => {
      expect(findBook('Gen')?.code).toBe('GEN');
    });

    it('should find Matt', () => {
      expect(findBook('Matt')?.code).toBe('MAT');
    });

    it('should find Ps', () => {
      expect(findBook('Ps')?.code).toBe('PSA');
    });

    it('should find Rom', () => {
      expect(findBook('Rom')?.code).toBe('ROM');
    });

    it('should find Rev', () => {
      expect(findBook('Rev')?.code).toBe('REV');
    });

    it('should find Eph', () => {
      expect(findBook('Eph')?.code).toBe('EPH');
    });

    it('should find Phil', () => {
      expect(findBook('Phil')?.code).toBe('PHP');
    });
  });

  describe('Numbered Books', () => {
    it('should find 1 Samuel', () => {
      expect(findBook('1 Samuel')?.code).toBe('1SA');
    });

    it('should find 2 Samuel', () => {
      expect(findBook('2 Samuel')?.code).toBe('2SA');
    });

    it('should find 1 Kings', () => {
      expect(findBook('1 Kings')?.code).toBe('1KI');
    });

    it('should find 2 Kings', () => {
      expect(findBook('2 Kings')?.code).toBe('2KI');
    });

    it('should find 1 Chronicles', () => {
      expect(findBook('1 Chronicles')?.code).toBe('1CH');
    });

    it('should find 2 Chronicles', () => {
      expect(findBook('2 Chronicles')?.code).toBe('2CH');
    });

    it('should find 1 Corinthians', () => {
      expect(findBook('1 Corinthians')?.code).toBe('1CO');
    });

    it('should find 2 Corinthians', () => {
      expect(findBook('2 Corinthians')?.code).toBe('2CO');
    });

    it('should find 1 Thessalonians', () => {
      expect(findBook('1 Thessalonians')?.code).toBe('1TH');
    });

    it('should find 2 Thessalonians', () => {
      expect(findBook('2 Thessalonians')?.code).toBe('2TH');
    });

    it('should find 1 Timothy', () => {
      expect(findBook('1 Timothy')?.code).toBe('1TI');
    });

    it('should find 2 Timothy', () => {
      expect(findBook('2 Timothy')?.code).toBe('2TI');
    });

    it('should find 1 Peter', () => {
      expect(findBook('1 Peter')?.code).toBe('1PE');
    });

    it('should find 2 Peter', () => {
      expect(findBook('2 Peter')?.code).toBe('2PE');
    });

    it('should find 1 John', () => {
      expect(findBook('1 John')?.code).toBe('1JN');
    });

    it('should find 2 John', () => {
      expect(findBook('2 John')?.code).toBe('2JN');
    });

    it('should find 3 John', () => {
      expect(findBook('3 John')?.code).toBe('3JN');
    });
  });

  describe('Numbered Book Abbreviations', () => {
    it('should find 1 Cor', () => {
      expect(findBook('1 Cor')?.code).toBe('1CO');
    });

    it('should find 2 Cor', () => {
      expect(findBook('2 Cor')?.code).toBe('2CO');
    });

    it('should find 1 Tim', () => {
      expect(findBook('1 Tim')?.code).toBe('1TI');
    });

    it('should find 2 Tim', () => {
      expect(findBook('2 Tim')?.code).toBe('2TI');
    });

    it('should find 1 Pet', () => {
      expect(findBook('1 Pet')?.code).toBe('1PE');
    });

    it('should find 2 Pet', () => {
      expect(findBook('2 Pet')?.code).toBe('2PE');
    });
  });

  describe('Case Insensitive', () => {
    it('should find john (lowercase)', () => {
      expect(findBook('john')?.code).toBe('JHN');
    });

    it('should find JOHN (uppercase)', () => {
      expect(findBook('JOHN')?.code).toBe('JHN');
    });

    it('should find JoHn (mixed case)', () => {
      expect(findBook('JoHn')?.code).toBe('JHN');
    });

    it('should find genesis (lowercase)', () => {
      expect(findBook('genesis')?.code).toBe('GEN');
    });

    it('should find GENESIS (uppercase)', () => {
      expect(findBook('GENESIS')?.code).toBe('GEN');
    });
  });

  describe('Not Found', () => {
    it('should return undefined for invalid book', () => {
      expect(findBook('Steve')).toBeUndefined();
      expect(findBook('Invalid')).toBeUndefined();
      expect(findBook('Paul')).toBeUndefined();
      expect(findBook('Jesus')).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(findBook('')).toBeUndefined();
    });

    it('should return undefined for whitespace', () => {
      expect(findBook('   ')).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle extra whitespace', () => {
      expect(findBook(' John ')?.code).toBe('JHN');
      expect(findBook('  Genesis  ')?.code).toBe('GEN');
    });

    it('should handle multiple spaces in numbered books', () => {
      expect(findBook('1  John')?.code).toBe('1JN');
      expect(findBook('2   Corinthians')?.code).toBe('2CO');
    });
  });
});

describe('getAllBookNames', () => {
  it('should return array of strings', () => {
    const names = getAllBookNames();
    expect(Array.isArray(names)).toBe(true);
    names.forEach(name => {
      expect(typeof name).toBe('string');
    });
  });

  it('should return more than 66 names (includes abbreviations)', () => {
    const names = getAllBookNames();
    expect(names.length).toBeGreaterThan(66);
  });

  it('should include Genesis', () => {
    const names = getAllBookNames();
    expect(names).toContain('Genesis');
  });

  it('should include Revelation', () => {
    const names = getAllBookNames();
    expect(names).toContain('Revelation');
  });

  it('should include abbreviations', () => {
    const names = getAllBookNames();
    expect(names).toContain('Gen');
    expect(names).toContain('Matt');
    expect(names).toContain('Rev');
  });

  it('should include numbered books', () => {
    const names = getAllBookNames();
    expect(names).toContain('1 John');
    expect(names).toContain('2 Corinthians');
    expect(names).toContain('3 John');
  });

  it('should not have duplicate entries', () => {
    const names = getAllBookNames();
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });

  it('should have all entries non-empty', () => {
    const names = getAllBookNames();
    names.forEach(name => {
      expect(name.length).toBeGreaterThan(0);
    });
  });
});

describe('getBookNamesRegex', () => {
  it('should return a valid string pattern', () => {
    const pattern = getBookNamesRegex();
    expect(typeof pattern).toBe('string');
    expect(pattern.length).toBeGreaterThan(0);
  });

  it('should be a valid regex pattern', () => {
    const pattern = getBookNamesRegex();
    expect(() => new RegExp(pattern)).not.toThrow();
  });

  it('should match Genesis', () => {
    const pattern = getBookNamesRegex();
    const regex = new RegExp(pattern, 'i');
    expect(regex.test('Genesis')).toBe(true);
  });

  it('should match abbreviations', () => {
    const pattern = getBookNamesRegex();
    const regex = new RegExp(pattern, 'i');
    expect(regex.test('Gen')).toBe(true);
    expect(regex.test('Matt')).toBe(true);
  });

  it('should match numbered books', () => {
    const pattern = getBookNamesRegex();
    const regex = new RegExp(pattern, 'i');
    expect(regex.test('1 John')).toBe(true);
    expect(regex.test('2 Corinthians')).toBe(true);
  });

  it('should prioritize longer names (to avoid partial matches)', () => {
    const pattern = getBookNamesRegex();
    const names = pattern.split('|');

    // "1 Corinthians" should appear before "1 Cor"
    const corinthiansIdx = names.findIndex(n => n.includes('Corinthians'));
    const corIdx = names.findIndex(n => n === '1 Cor' || n === '2 Cor');

    if (corinthiansIdx !== -1 && corIdx !== -1) {
      expect(corinthiansIdx).toBeLessThan(corIdx);
    }
  });

  it('should not match invalid books', () => {
    const pattern = getBookNamesRegex();
    const regex = new RegExp(`^(${pattern})$`, 'i');
    expect(regex.test('Steve')).toBe(false);
    expect(regex.test('Paul')).toBe(false);
    expect(regex.test('Invalid')).toBe(false);
  });
});
