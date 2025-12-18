/**
 * Book mappings for scripture references
 * Maps book names, abbreviations, and common variations to YouVersion book codes
 */

export interface BookMapping {
  name: string;
  code: string;
  testament: 'OT' | 'NT';
  abbreviations: string[];
  alternateNames: string[];
}

export const BOOK_MAPPINGS: BookMapping[] = [
  // Old Testament
  {
    name: 'Genesis',
    code: 'GEN',
    testament: 'OT',
    abbreviations: ['Gen'],
    alternateNames: []
  },
  {
    name: 'Exodus',
    code: 'EXO',
    testament: 'OT',
    abbreviations: ['Ex'],
    alternateNames: []
  },
  {
    name: 'Leviticus',
    code: 'LEV',
    testament: 'OT',
    abbreviations: ['Lev'],
    alternateNames: []
  },
  {
    name: 'Numbers',
    code: 'NUM',
    testament: 'OT',
    abbreviations: ['Num'],
    alternateNames: []
  },
  {
    name: 'Deuteronomy',
    code: 'DEU',
    testament: 'OT',
    abbreviations: ['Deut'],
    alternateNames: []
  },
  {
    name: 'Joshua',
    code: 'JOS',
    testament: 'OT',
    abbreviations: ['Josh'],
    alternateNames: []
  },
  {
    name: 'Judges',
    code: 'JDG',
    testament: 'OT',
    abbreviations: ['Judg'],
    alternateNames: []
  },
  {
    name: 'Ruth',
    code: 'RUT',
    testament: 'OT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: '1 Samuel',
    code: '1SA',
    testament: 'OT',
    abbreviations: ['1 Sam'],
    alternateNames: []
  },
  {
    name: '2 Samuel',
    code: '2SA',
    testament: 'OT',
    abbreviations: ['2 Sam'],
    alternateNames: []
  },
  {
    name: '1 Kings',
    code: '1KI',
    testament: 'OT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: '2 Kings',
    code: '2KI',
    testament: 'OT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: '1 Chronicles',
    code: '1CH',
    testament: 'OT',
    abbreviations: ['1 Chron'],
    alternateNames: []
  },
  {
    name: '2 Chronicles',
    code: '2CH',
    testament: 'OT',
    abbreviations: ['2 Chron'],
    alternateNames: []
  },
  {
    name: 'Ezra',
    code: 'EZR',
    testament: 'OT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Nehemiah',
    code: 'NEH',
    testament: 'OT',
    abbreviations: ['Neh'],
    alternateNames: []
  },
  {
    name: 'Esther',
    code: 'EST',
    testament: 'OT',
    abbreviations: ['Est'],
    alternateNames: []
  },
  {
    name: 'Job',
    code: 'JOB',
    testament: 'OT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Psalm',
    code: 'PSA',
    testament: 'OT',
    abbreviations: ['Ps'],
    alternateNames: []
  },
  {
    name: 'Proverbs',
    code: 'PRO',
    testament: 'OT',
    abbreviations: ['Prov'],
    alternateNames: []
  },
  {
    name: 'Ecclesiastes',
    code: 'ECC',
    testament: 'OT',
    abbreviations: ['Eccles'],
    alternateNames: []
  },
  {
    name: 'Song of Solomon',
    code: 'SNG',
    testament: 'OT',
    abbreviations: ['Song'],
    alternateNames: []
  },
  {
    name: 'Isaiah',
    code: 'ISA',
    testament: 'OT',
    abbreviations: ['Isa'],
    alternateNames: []
  },
  {
    name: 'Jeremiah',
    code: 'JER',
    testament: 'OT',
    abbreviations: ['Jer'],
    alternateNames: []
  },
  {
    name: 'Lamentations',
    code: 'LAM',
    testament: 'OT',
    abbreviations: ['Lam'],
    alternateNames: []
  },
  {
    name: 'Ezekiel',
    code: 'EZK',
    testament: 'OT',
    abbreviations: ['Ezek'],
    alternateNames: []
  },
  {
    name: 'Daniel',
    code: 'DAN',
    testament: 'OT',
    abbreviations: ['Dan'],
    alternateNames: []
  },
  {
    name: 'Hosea',
    code: 'HOS',
    testament: 'OT',
    abbreviations: ['Hos'],
    alternateNames: []
  },
  {
    name: 'Joel',
    code: 'JOL',
    testament: 'OT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Amos',
    code: 'AMO',
    testament: 'OT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Obadiah',
    code: 'OBA',
    testament: 'OT',
    abbreviations: ['Obad'],
    alternateNames: []
  },
  {
    name: 'Jonah',
    code: 'JON',
    testament: 'OT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Micah',
    code: 'MIC',
    testament: 'OT',
    abbreviations: ['Mic'],
    alternateNames: []
  },
  {
    name: 'Nahum',
    code: 'NAM',
    testament: 'OT',
    abbreviations: ['Nah'],
    alternateNames: []
  },
  {
    name: 'Habakkuk',
    code: 'HAB',
    testament: 'OT',
    abbreviations: ['Hab'],
    alternateNames: []
  },
  {
    name: 'Zephaniah',
    code: 'ZEP',
    testament: 'OT',
    abbreviations: ['Zeph'],
    alternateNames: []
  },
  {
    name: 'Haggai',
    code: 'HAG',
    testament: 'OT',
    abbreviations: ['Hag'],
    alternateNames: []
  },
  {
    name: 'Zechariah',
    code: 'ZEC',
    testament: 'OT',
    abbreviations: ['Zech'],
    alternateNames: []
  },
  {
    name: 'Malachi',
    code: 'MAL',
    testament: 'OT',
    abbreviations: ['Mal'],
    alternateNames: []
  },

  // New Testament
  {
    name: 'Matthew',
    code: 'MAT',
    testament: 'NT',
    abbreviations: ['Matt'],
    alternateNames: []
  },
  {
    name: 'Mark',
    code: 'MRK',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Luke',
    code: 'LUK',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'John',
    code: 'JHN',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Acts',
    code: 'ACT',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Romans',
    code: 'ROM',
    testament: 'NT',
    abbreviations: ['Rom'],
    alternateNames: []
  },
  {
    name: '1 Corinthians',
    code: '1CO',
    testament: 'NT',
    abbreviations: ['1 Cor'],
    alternateNames: []
  },
  {
    name: '2 Corinthians',
    code: '2CO',
    testament: 'NT',
    abbreviations: ['2 Cor'],
    alternateNames: []
  },
  {
    name: 'Galatians',
    code: 'GAL',
    testament: 'NT',
    abbreviations: ['Gal'],
    alternateNames: []
  },
  {
    name: 'Ephesians',
    code: 'EPH',
    testament: 'NT',
    abbreviations: ['Eph'],
    alternateNames: []
  },
  {
    name: 'Philippians',
    code: 'PHP',
    testament: 'NT',
    abbreviations: ['Phil'],
    alternateNames: []
  },
  {
    name: 'Colossians',
    code: 'COL',
    testament: 'NT',
    abbreviations: ['Col'],
    alternateNames: []
  },
  {
    name: '1 Thessalonians',
    code: '1TH',
    testament: 'NT',
    abbreviations: ['1 Thess'],
    alternateNames: []
  },
  {
    name: '2 Thessalonians',
    code: '2TH',
    testament: 'NT',
    abbreviations: ['2 Thess'],
    alternateNames: []
  },
  {
    name: '1 Timothy',
    code: '1TI',
    testament: 'NT',
    abbreviations: ['1 Tim'],
    alternateNames: []
  },
  {
    name: '2 Timothy',
    code: '2TI',
    testament: 'NT',
    abbreviations: ['2 Tim'],
    alternateNames: []
  },
  {
    name: 'Titus',
    code: 'TIT',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Philemon',
    code: 'PHM',
    testament: 'NT',
    abbreviations: ['Philem'],
    alternateNames: []
  },
  {
    name: 'Hebrews',
    code: 'HEB',
    testament: 'NT',
    abbreviations: ['Heb'],
    alternateNames: []
  },
  {
    name: 'James',
    code: 'JAS',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: '1 Peter',
    code: '1PE',
    testament: 'NT',
    abbreviations: ['1 Pet'],
    alternateNames: []
  },
  {
    name: '2 Peter',
    code: '2PE',
    testament: 'NT',
    abbreviations: ['2 Pet'],
    alternateNames: []
  },
  {
    name: '1 John',
    code: '1JN',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: '2 John',
    code: '2JN',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: '3 John',
    code: '3JN',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Jude',
    code: 'JUD',
    testament: 'NT',
    abbreviations: [],
    alternateNames: []
  },
  {
    name: 'Revelation',
    code: 'REV',
    testament: 'NT',
    abbreviations: ['Rev'],
    alternateNames: []
  }
];

/**
 * Build a lookup map for fast book name resolution
 * Maps normalized names/abbreviations to book codes
 */
export function buildBookLookup(): Map<string, BookMapping> {
  const lookup = new Map<string, BookMapping>();

  for (const book of BOOK_MAPPINGS) {
    // Add full name
    lookup.set(normalizeBookName(book.name), book);

    // Add book code (e.g., "GEN", "PRO", "JER")
    lookup.set(normalizeBookName(book.code), book);

    // Add all abbreviations
    for (const abbr of book.abbreviations) {
      lookup.set(normalizeBookName(abbr), book);
    }

    // Add all alternate names
    for (const alt of book.alternateNames) {
      lookup.set(normalizeBookName(alt), book);
    }
  }

  return lookup;
}

/**
 * Normalize book name for lookup
 * Removes extra spaces, converts to lowercase, removes periods
 */
export function normalizeBookName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, '')  // Remove periods
    .replace(/\s+/g, ' ')  // Normalize spaces
    .trim();
}

/**
 * Find a book by name or abbreviation
 */
const bookLookup = buildBookLookup();

export function findBook(bookName: string): BookMapping | undefined {
  return bookLookup.get(normalizeBookName(bookName));
}

/**
 * Get all book names (for building regex patterns)
 */
export function getAllBookNames(): string[] {
  const names: string[] = [];

  for (const book of BOOK_MAPPINGS) {
    names.push(book.name);
    names.push(...book.abbreviations);
    names.push(...book.alternateNames);
  }

  return names;
}

/**
 * Get regex pattern for matching book names
 * Returns a pattern that matches all book names, abbreviations, and alternate names
 * Pattern is sorted by length (longest first) to ensure proper matching
 */
export function getBookNamesRegex(): string {
  const names = getAllBookNames();

  // Sort by length (longest first) to match longer names before shorter ones
  // This ensures "1 Corinthians" matches before "1 Cor"
  names.sort((a, b) => b.length - a.length);

  // Escape special regex characters and join with |
  return names
    .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
}
