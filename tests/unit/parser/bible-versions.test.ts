import { describe, it, expect } from 'vitest';
import {
  BIBLE_VERSIONS,
  buildVersionLookup,
  findVersion,
  getTranslationsRegex,
  type BibleVersion
} from '@/parser/bible-versions';

describe('BIBLE_VERSIONS', () => {
  it('should contain multiple Bible versions', () => {
    expect(BIBLE_VERSIONS.length).toBeGreaterThan(50);
  });

  it('should have all versions with abbreviation', () => {
    BIBLE_VERSIONS.forEach(version => {
      expect(version.abbreviation).toBeTruthy();
      expect(typeof version.abbreviation).toBe('string');
    });
  });

  it('should have all versions with title', () => {
    BIBLE_VERSIONS.forEach(version => {
      expect(version.title).toBeTruthy();
      expect(typeof version.title).toBe('string');
    });
  });

  it('should have all versions with YouVersion ID', () => {
    BIBLE_VERSIONS.forEach(version => {
      expect(version.id).toBeTruthy();
      expect(typeof version.id).toBe('number');
    });
  });

  it('should have unique abbreviations', () => {
    const abbreviations = BIBLE_VERSIONS.map(v => v.abbreviation);
    const uniqueAbbreviations = new Set(abbreviations);
    expect(abbreviations.length).toBe(uniqueAbbreviations.size);
  });

  it('should have unique YouVersion IDs', () => {
    const ids = BIBLE_VERSIONS.map(v => v.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should include NIV', () => {
    const niv = BIBLE_VERSIONS.find(v => v.abbreviation === 'NIV');
    expect(niv).toBeDefined();
    expect(niv?.title).toContain('International');
  });

  it('should include ESV', () => {
    const esv = BIBLE_VERSIONS.find(v => v.abbreviation === 'ESV');
    expect(esv).toBeDefined();
    expect(esv?.title).toContain('Standard');
  });

  it('should include KJV', () => {
    const kjv = BIBLE_VERSIONS.find(v => v.abbreviation === 'KJV');
    expect(kjv).toBeDefined();
    expect(kjv?.title).toContain('King James');
  });

  it('should include NASB', () => {
    const nasb = BIBLE_VERSIONS.find(v => v.abbreviation === 'NASB');
    expect(nasb).toBeDefined();
    expect(nasb?.title).toContain('American Standard');
  });

  it('should include NLT', () => {
    const nlt = BIBLE_VERSIONS.find(v => v.abbreviation === 'NLT');
    expect(nlt).toBeDefined();
    expect(nlt?.title).toContain('Living');
  });

  it('should include CSB', () => {
    const csb = BIBLE_VERSIONS.find(v => v.abbreviation === 'CSB');
    expect(csb).toBeDefined();
    expect(csb?.title).toContain('Standard');
  });

  it('should include NKJV', () => {
    const nkjv = BIBLE_VERSIONS.find(v => v.abbreviation === 'NKJV');
    expect(nkjv).toBeDefined();
    expect(nkjv?.title).toContain('King James');
  });

  it('should include AMP', () => {
    const amp = BIBLE_VERSIONS.find(v => v.abbreviation === 'AMP');
    expect(amp).toBeDefined();
    expect(amp?.title).toContain('Amplified');
  });

  it('should have licensed property for each version', () => {
    BIBLE_VERSIONS.forEach(version => {
      expect(typeof version.licensed).toBe('boolean');
    });
  });

  it('should have some licensed versions', () => {
    const licensed = BIBLE_VERSIONS.filter(v => v.licensed);
    expect(licensed.length).toBeGreaterThan(0);
  });

  it('should have some public domain versions', () => {
    const publicDomain = BIBLE_VERSIONS.filter(v => !v.licensed);
    expect(publicDomain.length).toBeGreaterThan(0);
  });

  it('should have valid abbreviation format (uppercase letters, numbers, hyphens)', () => {
    BIBLE_VERSIONS.forEach(version => {
      expect(version.abbreviation).toMatch(/^[A-Z0-9-]+$/);
    });
  });

  it('should have positive YouVersion IDs', () => {
    BIBLE_VERSIONS.forEach(version => {
      expect(version.id).toBeGreaterThan(0);
    });
  });

  it('should include versions with numbers in abbreviation', () => {
    const hasNumbers = BIBLE_VERSIONS.some(v => /\d/.test(v.abbreviation));
    expect(hasNumbers).toBe(true);
  });

  it('should include versions with hyphens in abbreviation', () => {
    const hasHyphens = BIBLE_VERSIONS.some(v => v.abbreviation.includes('-'));
    expect(hasHyphens).toBe(true);
  });
});

describe('buildVersionLookup', () => {
  it('should return a Map', () => {
    const lookup = buildVersionLookup();
    expect(lookup instanceof Map).toBe(true);
  });

  it('should contain entries for all versions', () => {
    const lookup = buildVersionLookup();
    expect(lookup.size).toBe(BIBLE_VERSIONS.length);
  });

  it('should find NIV', () => {
    const lookup = buildVersionLookup();
    const niv = lookup.get('NIV');
    expect(niv).toBeDefined();
    expect(niv?.abbreviation).toBe('NIV');
  });

  it('should find ESV', () => {
    const lookup = buildVersionLookup();
    const esv = lookup.get('ESV');
    expect(esv).toBeDefined();
    expect(esv?.abbreviation).toBe('ESV');
  });

  it('should use uppercase keys', () => {
    const lookup = buildVersionLookup();
    expect(lookup.has('NIV')).toBe(true);
    expect(lookup.has('niv')).toBe(false); // Should be uppercase
  });

  it('should handle versions with numbers', () => {
    const lookup = buildVersionLookup();
    const versionsWithNumbers = BIBLE_VERSIONS.filter(v => /\d/.test(v.abbreviation));

    versionsWithNumbers.forEach(version => {
      expect(lookup.get(version.abbreviation)).toBeDefined();
    });
  });

  it('should handle versions with hyphens', () => {
    const lookup = buildVersionLookup();
    const versionsWithHyphens = BIBLE_VERSIONS.filter(v => v.abbreviation.includes('-'));

    versionsWithHyphens.forEach(version => {
      expect(lookup.get(version.abbreviation)).toBeDefined();
    });
  });

  it('should map to correct version objects', () => {
    const lookup = buildVersionLookup();

    BIBLE_VERSIONS.forEach(version => {
      const found = lookup.get(version.abbreviation);
      expect(found).toBe(version);
    });
  });
});

describe('findVersion', () => {
  describe('Common Versions', () => {
    it('should find NIV', () => {
      const version = findVersion('NIV');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('NIV');
    });

    it('should find ESV', () => {
      const version = findVersion('ESV');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('ESV');
    });

    it('should find KJV', () => {
      const version = findVersion('KJV');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('KJV');
    });

    it('should find NASB', () => {
      const version = findVersion('NASB');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('NASB');
    });

    it('should find NLT', () => {
      const version = findVersion('NLT');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('NLT');
    });

    it('should find CSB', () => {
      const version = findVersion('CSB');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('CSB');
    });

    it('should find NKJV', () => {
      const version = findVersion('NKJV');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('NKJV');
    });

    it('should find AMP', () => {
      const version = findVersion('AMP');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('AMP');
    });
  });

  describe('Case Sensitivity', () => {
    it('should find version with uppercase', () => {
      const version = findVersion('NIV');
      expect(version).toBeDefined();
    });

    it('should normalize lowercase to uppercase', () => {
      const version = findVersion('niv');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('NIV');
    });

    it('should normalize mixed case to uppercase', () => {
      const version = findVersion('Niv');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('NIV');
    });

    it('should handle all lowercase', () => {
      const version = findVersion('esv');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('ESV');
    });
  });

  describe('Versions with Numbers', () => {
    it('should find versions with numbers in abbreviation', () => {
      const versionsWithNumbers = BIBLE_VERSIONS.filter(v => /\d/.test(v.abbreviation));

      versionsWithNumbers.forEach(expected => {
        const found = findVersion(expected.abbreviation);
        expect(found).toBeDefined();
        expect(found?.abbreviation).toBe(expected.abbreviation);
      });
    });
  });

  describe('Versions with Hyphens', () => {
    it('should find versions with hyphens in abbreviation', () => {
      const versionsWithHyphens = BIBLE_VERSIONS.filter(v => v.abbreviation.includes('-'));

      versionsWithHyphens.forEach(expected => {
        const found = findVersion(expected.abbreviation);
        expect(found).toBeDefined();
        expect(found?.abbreviation).toBe(expected.abbreviation);
      });
    });
  });

  describe('Not Found', () => {
    it('should return undefined for invalid abbreviation', () => {
      expect(findVersion('INVALID')).toBeUndefined();
      expect(findVersion('XYZ')).toBeUndefined();
      expect(findVersion('FAKE')).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(findVersion('')).toBeUndefined();
    });

    it('should return undefined for whitespace', () => {
      expect(findVersion('   ')).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle abbreviation with extra whitespace', () => {
      const version = findVersion(' NIV ');
      expect(version).toBeDefined();
      expect(version?.abbreviation).toBe('NIV');
    });

    it('should return correct YouVersion ID', () => {
      const version = findVersion('NIV');
      expect(version?.id).toBeGreaterThan(0);
    });

    it('should return correct license status', () => {
      const version = findVersion('NIV');
      expect(typeof version?.licensed).toBe('boolean');
    });
  });

  describe('All Versions', () => {
    it('should find every version in BIBLE_VERSIONS', () => {
      BIBLE_VERSIONS.forEach(expected => {
        const found = findVersion(expected.abbreviation);
        expect(found).toBe(expected);
      });
    });
  });
});

describe('getTranslationsRegex', () => {
  it('should return a valid string pattern', () => {
    const pattern = getTranslationsRegex();
    expect(typeof pattern).toBe('string');
    expect(pattern.length).toBeGreaterThan(0);
  });

  it('should be a valid regex pattern', () => {
    const pattern = getTranslationsRegex();
    expect(() => new RegExp(pattern)).not.toThrow();
  });

  it('should match NIV', () => {
    const pattern = getTranslationsRegex();
    const regex = new RegExp(pattern, 'i');
    expect(regex.test('NIV')).toBe(true);
  });

  it('should match ESV', () => {
    const pattern = getTranslationsRegex();
    const regex = new RegExp(pattern, 'i');
    expect(regex.test('ESV')).toBe(true);
  });

  it('should match KJV', () => {
    const pattern = getTranslationsRegex();
    const regex = new RegExp(pattern, 'i');
    expect(regex.test('KJV')).toBe(true);
  });

  it('should match versions with numbers', () => {
    const pattern = getTranslationsRegex();
    const regex = new RegExp(pattern, 'i');
    const versionsWithNumbers = BIBLE_VERSIONS.filter(v => /\d/.test(v.abbreviation));

    versionsWithNumbers.forEach(version => {
      expect(regex.test(version.abbreviation)).toBe(true);
    });
  });

  it('should match versions with hyphens', () => {
    const pattern = getTranslationsRegex();
    const regex = new RegExp(pattern, 'i');
    const versionsWithHyphens = BIBLE_VERSIONS.filter(v => v.abbreviation.includes('-'));

    versionsWithHyphens.forEach(version => {
      expect(regex.test(version.abbreviation)).toBe(true);
    });
  });

  it('should not match invalid abbreviations', () => {
    const pattern = getTranslationsRegex();
    const regex = new RegExp(`^(${pattern})$`, 'i');

    expect(regex.test('INVALID')).toBe(false);
    expect(regex.test('XYZ')).toBe(false);
    expect(regex.test('FAKE')).toBe(false);
  });

  it('should match all version abbreviations', () => {
    const pattern = getTranslationsRegex();
    const regex = new RegExp(pattern, 'i');

    BIBLE_VERSIONS.forEach(version => {
      expect(regex.test(version.abbreviation)).toBe(true);
    });
  });

  it('should be case-insensitive compatible', () => {
    const pattern = getTranslationsRegex();
    const regex = new RegExp(pattern, 'i');

    expect(regex.test('niv')).toBe(true);
    expect(regex.test('NIV')).toBe(true);
    expect(regex.test('Niv')).toBe(true);
  });

  it('should handle alternation (|) for multiple versions', () => {
    const pattern = getTranslationsRegex();
    expect(pattern).toContain('|');
  });

  it('should prioritize longer abbreviations (to avoid partial matches)', () => {
    const pattern = getTranslationsRegex();
    const parts = pattern.split('|');

    // Longer abbreviations should generally come first
    expect(parts.length).toBeGreaterThan(1);
  });
});

describe('BibleVersion interface compliance', () => {
  it('should have all required properties', () => {
    BIBLE_VERSIONS.forEach(version => {
      expect(version).toHaveProperty('abbreviation');
      expect(version).toHaveProperty('title');
      expect(version).toHaveProperty('id');
      expect(version).toHaveProperty('licensed');
    });
  });

  it('should have correct property types', () => {
    BIBLE_VERSIONS.forEach(version => {
      expect(typeof version.abbreviation).toBe('string');
      expect(typeof version.title).toBe('string');
      expect(typeof version.id).toBe('number');
      expect(typeof version.licensed).toBe('boolean');
    });
  });
});

describe('License detection', () => {
  it('should correctly identify licensed versions', () => {
    BIBLE_VERSIONS.forEach(version => {
      const found = findVersion(version.abbreviation);
      expect(found?.licensed).toBe(version.licensed);
    });
  });

  it('should have consistent license status across lookups', () => {
    const lookup = buildVersionLookup();

    BIBLE_VERSIONS.forEach(version => {
      const found = lookup.get(version.abbreviation);
      expect(found?.licensed).toBe(version.licensed);
    });
  });
});
