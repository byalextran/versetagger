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
    abbreviations: ['Gen', 'Ge', 'Gn'],
    alternateNames: []
  },
  {
    name: 'Exodus',
    code: 'EXO',
    testament: 'OT',
    abbreviations: ['Exod', 'Exo', 'Ex'],
    alternateNames: []
  },
  {
    name: 'Leviticus',
    code: 'LEV',
    testament: 'OT',
    abbreviations: ['Lev', 'Le', 'Lv'],
    alternateNames: []
  },
  {
    name: 'Numbers',
    code: 'NUM',
    testament: 'OT',
    abbreviations: ['Num', 'Nu', 'Nm', 'Nb'],
    alternateNames: []
  },
  {
    name: 'Deuteronomy',
    code: 'DEU',
    testament: 'OT',
    abbreviations: ['Deut', 'Deu', 'De', 'Dt'],
    alternateNames: []
  },
  {
    name: 'Joshua',
    code: 'JOS',
    testament: 'OT',
    abbreviations: ['Josh', 'Jos', 'Jsh'],
    alternateNames: []
  },
  {
    name: 'Judges',
    code: 'JDG',
    testament: 'OT',
    abbreviations: ['Judg', 'Jdg', 'Jg', 'Jdgs'],
    alternateNames: []
  },
  {
    name: 'Ruth',
    code: 'RUT',
    testament: 'OT',
    abbreviations: ['Rth', 'Ru'],
    alternateNames: []
  },
  {
    name: '1 Samuel',
    code: '1SA',
    testament: 'OT',
    abbreviations: ['1 Sam', '1Sam', '1 Sa', '1Sa', 'I Sam', 'I Sa', 'First Samuel'],
    alternateNames: ['1 Sm', '1Sm']
  },
  {
    name: '2 Samuel',
    code: '2SA',
    testament: 'OT',
    abbreviations: ['2 Sam', '2Sam', '2 Sa', '2Sa', 'II Sam', 'II Sa', 'Second Samuel'],
    alternateNames: ['2 Sm', '2Sm']
  },
  {
    name: '1 Kings',
    code: '1KI',
    testament: 'OT',
    abbreviations: ['1 Kgs', '1Kgs', '1 Ki', '1Ki', 'I Kings', 'I Kgs', 'First Kings'],
    alternateNames: ['1 Kin', '1Kin']
  },
  {
    name: '2 Kings',
    code: '2KI',
    testament: 'OT',
    abbreviations: ['2 Kgs', '2Kgs', '2 Ki', '2Ki', 'II Kings', 'II Kgs', 'Second Kings'],
    alternateNames: ['2 Kin', '2Kin']
  },
  {
    name: '1 Chronicles',
    code: '1CH',
    testament: 'OT',
    abbreviations: ['1 Chr', '1Chr', '1 Ch', '1Ch', 'I Chronicles', 'I Chr', 'First Chronicles'],
    alternateNames: ['1 Chron', '1Chron']
  },
  {
    name: '2 Chronicles',
    code: '2CH',
    testament: 'OT',
    abbreviations: ['2 Chr', '2Chr', '2 Ch', '2Ch', 'II Chronicles', 'II Chr', 'Second Chronicles'],
    alternateNames: ['2 Chron', '2Chron']
  },
  {
    name: 'Ezra',
    code: 'EZR',
    testament: 'OT',
    abbreviations: ['Ezr', 'Ez'],
    alternateNames: []
  },
  {
    name: 'Nehemiah',
    code: 'NEH',
    testament: 'OT',
    abbreviations: ['Neh', 'Ne'],
    alternateNames: []
  },
  {
    name: 'Esther',
    code: 'EST',
    testament: 'OT',
    abbreviations: ['Esth', 'Est', 'Es'],
    alternateNames: []
  },
  {
    name: 'Job',
    code: 'JOB',
    testament: 'OT',
    abbreviations: ['Jb'],
    alternateNames: []
  },
  {
    name: 'Psalm',
    code: 'PSA',
    testament: 'OT',
    abbreviations: ['Ps', 'Psa', 'Psm', 'Pss'],
    alternateNames: ['Psalms']
  },
  {
    name: 'Proverbs',
    code: 'PRO',
    testament: 'OT',
    abbreviations: ['Prov', 'Pro', 'Prv', 'Pr'],
    alternateNames: []
  },
  {
    name: 'Ecclesiastes',
    code: 'ECC',
    testament: 'OT',
    abbreviations: ['Eccles', 'Eccle', 'Ecc', 'Ec', 'Qoh'],
    alternateNames: []
  },
  {
    name: 'Song of Solomon',
    code: 'SNG',
    testament: 'OT',
    abbreviations: ['Song', 'Song of Sol', 'SOS', 'So', 'SS'],
    alternateNames: ['Song of Songs', 'Canticles', 'Canticle of Canticles']
  },
  {
    name: 'Isaiah',
    code: 'ISA',
    testament: 'OT',
    abbreviations: ['Isa', 'Is'],
    alternateNames: []
  },
  {
    name: 'Jeremiah',
    code: 'JER',
    testament: 'OT',
    abbreviations: ['Jer', 'Je', 'Jr'],
    alternateNames: []
  },
  {
    name: 'Lamentations',
    code: 'LAM',
    testament: 'OT',
    abbreviations: ['Lam', 'La'],
    alternateNames: []
  },
  {
    name: 'Ezekiel',
    code: 'EZK',
    testament: 'OT',
    abbreviations: ['Ezek', 'Eze', 'Ezk'],
    alternateNames: []
  },
  {
    name: 'Daniel',
    code: 'DAN',
    testament: 'OT',
    abbreviations: ['Dan', 'Da', 'Dn'],
    alternateNames: []
  },
  {
    name: 'Hosea',
    code: 'HOS',
    testament: 'OT',
    abbreviations: ['Hos', 'Ho'],
    alternateNames: []
  },
  {
    name: 'Joel',
    code: 'JOL',
    testament: 'OT',
    abbreviations: ['Joe', 'Jl'],
    alternateNames: []
  },
  {
    name: 'Amos',
    code: 'AMO',
    testament: 'OT',
    abbreviations: ['Am'],
    alternateNames: []
  },
  {
    name: 'Obadiah',
    code: 'OBA',
    testament: 'OT',
    abbreviations: ['Obad', 'Ob'],
    alternateNames: []
  },
  {
    name: 'Jonah',
    code: 'JON',
    testament: 'OT',
    abbreviations: ['Jon', 'Jnh'],
    alternateNames: []
  },
  {
    name: 'Micah',
    code: 'MIC',
    testament: 'OT',
    abbreviations: ['Mic', 'Mc'],
    alternateNames: []
  },
  {
    name: 'Nahum',
    code: 'NAM',
    testament: 'OT',
    abbreviations: ['Nah', 'Na'],
    alternateNames: []
  },
  {
    name: 'Habakkuk',
    code: 'HAB',
    testament: 'OT',
    abbreviations: ['Hab', 'Hb'],
    alternateNames: []
  },
  {
    name: 'Zephaniah',
    code: 'ZEP',
    testament: 'OT',
    abbreviations: ['Zeph', 'Zep', 'Zp'],
    alternateNames: []
  },
  {
    name: 'Haggai',
    code: 'HAG',
    testament: 'OT',
    abbreviations: ['Hag', 'Hg'],
    alternateNames: []
  },
  {
    name: 'Zechariah',
    code: 'ZEC',
    testament: 'OT',
    abbreviations: ['Zech', 'Zec', 'Zc'],
    alternateNames: []
  },
  {
    name: 'Malachi',
    code: 'MAL',
    testament: 'OT',
    abbreviations: ['Mal', 'Ml'],
    alternateNames: []
  },

  // New Testament
  {
    name: 'Matthew',
    code: 'MAT',
    testament: 'NT',
    abbreviations: ['Matt', 'Mat', 'Mt'],
    alternateNames: []
  },
  {
    name: 'Mark',
    code: 'MRK',
    testament: 'NT',
    abbreviations: ['Mrk', 'Mar', 'Mk', 'Mr'],
    alternateNames: []
  },
  {
    name: 'Luke',
    code: 'LUK',
    testament: 'NT',
    abbreviations: ['Luk', 'Lk'],
    alternateNames: []
  },
  {
    name: 'John',
    code: 'JHN',
    testament: 'NT',
    abbreviations: ['Jhn', 'Jn'],
    alternateNames: []
  },
  {
    name: 'Acts',
    code: 'ACT',
    testament: 'NT',
    abbreviations: ['Act', 'Ac'],
    alternateNames: ['Acts of the Apostles']
  },
  {
    name: 'Romans',
    code: 'ROM',
    testament: 'NT',
    abbreviations: ['Rom', 'Ro', 'Rm'],
    alternateNames: []
  },
  {
    name: '1 Corinthians',
    code: '1CO',
    testament: 'NT',
    abbreviations: ['1 Cor', '1Cor', '1 Co', '1Co', 'I Corinthians', 'I Cor', 'First Corinthians'],
    alternateNames: []
  },
  {
    name: '2 Corinthians',
    code: '2CO',
    testament: 'NT',
    abbreviations: ['2 Cor', '2Cor', '2 Co', '2Co', 'II Corinthians', 'II Cor', 'Second Corinthians'],
    alternateNames: []
  },
  {
    name: 'Galatians',
    code: 'GAL',
    testament: 'NT',
    abbreviations: ['Gal', 'Ga'],
    alternateNames: []
  },
  {
    name: 'Ephesians',
    code: 'EPH',
    testament: 'NT',
    abbreviations: ['Eph', 'Ephes'],
    alternateNames: []
  },
  {
    name: 'Philippians',
    code: 'PHP',
    testament: 'NT',
    abbreviations: ['Phil', 'Php', 'Pp'],
    alternateNames: []
  },
  {
    name: 'Colossians',
    code: 'COL',
    testament: 'NT',
    abbreviations: ['Col', 'Co'],
    alternateNames: []
  },
  {
    name: '1 Thessalonians',
    code: '1TH',
    testament: 'NT',
    abbreviations: ['1 Thess', '1Thess', '1 Thes', '1Thes', '1 Th', '1Th', 'I Thessalonians', 'I Thess', 'First Thessalonians'],
    alternateNames: []
  },
  {
    name: '2 Thessalonians',
    code: '2TH',
    testament: 'NT',
    abbreviations: ['2 Thess', '2Thess', '2 Thes', '2Thes', '2 Th', '2Th', 'II Thessalonians', 'II Thess', 'Second Thessalonians'],
    alternateNames: []
  },
  {
    name: '1 Timothy',
    code: '1TI',
    testament: 'NT',
    abbreviations: ['1 Tim', '1Tim', '1 Ti', '1Ti', 'I Timothy', 'I Tim', 'First Timothy'],
    alternateNames: []
  },
  {
    name: '2 Timothy',
    code: '2TI',
    testament: 'NT',
    abbreviations: ['2 Tim', '2Tim', '2 Ti', '2Ti', 'II Timothy', 'II Tim', 'Second Timothy'],
    alternateNames: []
  },
  {
    name: 'Titus',
    code: 'TIT',
    testament: 'NT',
    abbreviations: ['Tit', 'Ti'],
    alternateNames: []
  },
  {
    name: 'Philemon',
    code: 'PHM',
    testament: 'NT',
    abbreviations: ['Philem', 'Phm', 'Pm'],
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
    abbreviations: ['Jas', 'Jm'],
    alternateNames: []
  },
  {
    name: '1 Peter',
    code: '1PE',
    testament: 'NT',
    abbreviations: ['1 Pet', '1Pet', '1 Pe', '1Pe', 'I Peter', 'I Pet', 'First Peter'],
    alternateNames: ['1 Pt', '1Pt']
  },
  {
    name: '2 Peter',
    code: '2PE',
    testament: 'NT',
    abbreviations: ['2 Pet', '2Pet', '2 Pe', '2Pe', 'II Peter', 'II Pet', 'Second Peter'],
    alternateNames: ['2 Pt', '2Pt']
  },
  {
    name: '1 John',
    code: '1JN',
    testament: 'NT',
    abbreviations: ['1 Jn', '1Jn', '1 Jhn', '1Jhn', 'I John', 'I Jn', 'First John'],
    alternateNames: []
  },
  {
    name: '2 John',
    code: '2JN',
    testament: 'NT',
    abbreviations: ['2 Jn', '2Jn', '2 Jhn', '2Jhn', 'II John', 'II Jn', 'Second John'],
    alternateNames: []
  },
  {
    name: '3 John',
    code: '3JN',
    testament: 'NT',
    abbreviations: ['3 Jn', '3Jn', '3 Jhn', '3Jhn', 'III John', 'III Jn', 'Third John'],
    alternateNames: []
  },
  {
    name: 'Jude',
    code: 'JUD',
    testament: 'NT',
    abbreviations: ['Jud', 'Jd'],
    alternateNames: []
  },
  {
    name: 'Revelation',
    code: 'REV',
    testament: 'NT',
    abbreviations: ['Rev', 'Re', 'The Revelation'],
    alternateNames: ['Apocalypse', 'The Apocalypse']
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
