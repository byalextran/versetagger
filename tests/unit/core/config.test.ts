/**
 * Config Tests
 * Tests for configuration validation and merging
 */

import { describe, it, expect } from 'vitest';
import {
  mergeConfig,
  validateConfig,
  createConfig,
  DEFAULT_CONFIG,
  type VersetaggerConfig
} from '../../../src/core/config';

describe('Config System', () => {
  describe('DEFAULT_CONFIG', () => {
    it('should have all required default values', () => {
      expect(DEFAULT_CONFIG.proxyUrl).toBe('https://versetagger.alextran.org');
      expect(DEFAULT_CONFIG.hoverDelay).toBe(500);
      expect(DEFAULT_CONFIG.autoScan).toBe(true);
      expect(DEFAULT_CONFIG.excludeSelectors).toContain('code');
      expect(DEFAULT_CONFIG.defaultVersion).toBe('NIV');
      expect(DEFAULT_CONFIG.colorScheme).toBe('auto');
      expect(DEFAULT_CONFIG.theme).toBe('default');
      expect(DEFAULT_CONFIG.referenceClass).toBe('verse-reference');
      expect(DEFAULT_CONFIG.openLinksInNewTab).toBe(true);
      expect(DEFAULT_CONFIG.debug).toBe(false);
    });

    it('should have accessibility defaults', () => {
      expect(DEFAULT_CONFIG.accessibility.keyboardNav).toBe(true);
      expect(DEFAULT_CONFIG.accessibility.announceToScreenReaders).toBe(true);
    });
  });

  describe('mergeConfig()', () => {
    it('should merge user config with defaults', () => {
      const userConfig: VersetaggerConfig = {
        hoverDelay: 1000,
        defaultVersion: 'ESV'
      };

      const merged = mergeConfig(userConfig);

      expect(merged.hoverDelay).toBe(1000);
      expect(merged.defaultVersion).toBe('ESV');
      expect(merged.proxyUrl).toBe(DEFAULT_CONFIG.proxyUrl);
      expect(merged.autoScan).toBe(DEFAULT_CONFIG.autoScan);
    });

    it('should merge accessibility config', () => {
      const userConfig: VersetaggerConfig = {
        accessibility: {
          keyboardNav: false
        }
      };

      const merged = mergeConfig(userConfig);

      expect(merged.accessibility.keyboardNav).toBe(false);
      expect(merged.accessibility.announceToScreenReaders).toBe(true);
    });

    it('should handle empty user config', () => {
      const merged = mergeConfig({});
      expect(merged).toEqual(DEFAULT_CONFIG);
    });

    it('should merge all config options', () => {
      const userConfig: VersetaggerConfig = {
        proxyUrl: 'https://custom.example.com',
        hoverDelay: 750,
        autoScan: false,
        excludeSelectors: 'code, pre, .custom-exclude',
        defaultVersion: 'KJV',
        colorScheme: 'dark',
        theme: 'custom-theme',
        accessibility: {
          keyboardNav: false,
          announceToScreenReaders: false
        },
        referenceClass: 'scripture-link',
        openLinksInNewTab: false,
        debug: true
      };

      const merged = mergeConfig(userConfig);

      expect(merged.proxyUrl).toBe('https://custom.example.com');
      expect(merged.hoverDelay).toBe(750);
      expect(merged.autoScan).toBe(false);
      expect(merged.excludeSelectors).toBe('code, pre, .custom-exclude');
      expect(merged.defaultVersion).toBe('KJV');
      expect(merged.colorScheme).toBe('dark');
      expect(merged.theme).toBe('custom-theme');
      expect(merged.accessibility.keyboardNav).toBe(false);
      expect(merged.accessibility.announceToScreenReaders).toBe(false);
      expect(merged.referenceClass).toBe('scripture-link');
      expect(merged.openLinksInNewTab).toBe(false);
      expect(merged.debug).toBe(true);
    });
  });

  describe('validateConfig()', () => {
    it('should validate valid config without errors', () => {
      const validConfig: VersetaggerConfig = {
        proxyUrl: 'https://example.com/api',
        colorScheme: 'dark',
        hoverDelay: 1000
      };

      expect(() => validateConfig(validConfig)).not.toThrow();
    });

    it('should validate config with no options', () => {
      expect(() => validateConfig({})).not.toThrow();
    });

    describe('proxyUrl validation', () => {
      it('should throw error for invalid URL', () => {
        const invalidConfig: VersetaggerConfig = {
          proxyUrl: 'not-a-valid-url'
        };

        expect(() => validateConfig(invalidConfig)).toThrow(
          'VerseTagger: Invalid proxyUrl "not-a-valid-url". Must be a valid URL.'
        );
      });

      it('should throw error for malformed URL', () => {
        const invalidConfig: VersetaggerConfig = {
          proxyUrl: 'http://'
        };

        expect(() => validateConfig(invalidConfig)).toThrow(
          /VerseTagger: Invalid proxyUrl/
        );
      });

      it('should accept valid HTTP URL', () => {
        const validConfig: VersetaggerConfig = {
          proxyUrl: 'http://example.com'
        };

        expect(() => validateConfig(validConfig)).not.toThrow();
      });

      it('should accept valid HTTPS URL', () => {
        const validConfig: VersetaggerConfig = {
          proxyUrl: 'https://example.com/api/verses'
        };

        expect(() => validateConfig(validConfig)).not.toThrow();
      });
    });

    describe('colorScheme validation', () => {
      it('should accept "light"', () => {
        expect(() => validateConfig({ colorScheme: 'light' })).not.toThrow();
      });

      it('should accept "dark"', () => {
        expect(() => validateConfig({ colorScheme: 'dark' })).not.toThrow();
      });

      it('should accept "auto"', () => {
        expect(() => validateConfig({ colorScheme: 'auto' })).not.toThrow();
      });

      it('should throw error for invalid colorScheme', () => {
        const invalidConfig = {
          colorScheme: 'invalid' as any
        };

        expect(() => validateConfig(invalidConfig)).toThrow(
          'VerseTagger: Invalid colorScheme "invalid". Must be "light", "dark", or "auto".'
        );
      });

      it('should throw error for numeric colorScheme', () => {
        const invalidConfig = {
          colorScheme: 123 as any
        };

        expect(() => validateConfig(invalidConfig)).toThrow(
          /VerseTagger: Invalid colorScheme/
        );
      });
    });

    describe('hoverDelay validation', () => {
      it('should accept valid hoverDelay', () => {
        expect(() => validateConfig({ hoverDelay: 500 })).not.toThrow();
        expect(() => validateConfig({ hoverDelay: 0 })).not.toThrow();
        expect(() => validateConfig({ hoverDelay: 5000 })).not.toThrow();
      });

      it('should throw error for negative hoverDelay', () => {
        const invalidConfig: VersetaggerConfig = {
          hoverDelay: -100
        };

        expect(() => validateConfig(invalidConfig)).toThrow(
          'VerseTagger: Invalid hoverDelay "-100". Must be between 0 and 5000ms.'
        );
      });

      it('should throw error for hoverDelay > 5000', () => {
        const invalidConfig: VersetaggerConfig = {
          hoverDelay: 10000
        };

        expect(() => validateConfig(invalidConfig)).toThrow(
          'VerseTagger: Invalid hoverDelay "10000". Must be between 0 and 5000ms.'
        );
      });
    });

    describe('multiple validation errors', () => {
      it('should throw error for first invalid field encountered', () => {
        const invalidConfig: VersetaggerConfig = {
          proxyUrl: 'invalid-url',
          colorScheme: 'invalid' as any,
          hoverDelay: -500
        };

        // Should throw for proxyUrl since it's validated first
        expect(() => validateConfig(invalidConfig)).toThrow(
          /VerseTagger: Invalid proxyUrl/
        );
      });
    });
  });

  describe('createConfig()', () => {
    it('should create valid config from user input', () => {
      const userConfig: VersetaggerConfig = {
        defaultVersion: 'ESV',
        hoverDelay: 1000
      };

      const config = createConfig(userConfig);

      expect(config.defaultVersion).toBe('ESV');
      expect(config.hoverDelay).toBe(1000);
      expect(config.proxyUrl).toBe(DEFAULT_CONFIG.proxyUrl);
    });

    it('should throw error for invalid config', () => {
      const invalidConfig: VersetaggerConfig = {
        proxyUrl: 'not-a-url'
      };

      expect(() => createConfig(invalidConfig)).toThrow(
        /VerseTagger: Invalid proxyUrl/
      );
    });

    it('should create config with all defaults when empty', () => {
      const config = createConfig({});
      expect(config).toEqual(DEFAULT_CONFIG);
    });
  });
});
