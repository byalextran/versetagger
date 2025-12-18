/**
 * VerseTagger Main Entry Point
 * Orchestrates all modules to provide scripture reference tagging functionality
 */

import type { VersetaggerConfig } from './config';
import { createConfig, mergeConfig } from './config';
import type { ScriptureReference } from '../parser/reference-parser';
import { DOMScanner, type ScannedReference } from './scanner';
import { YouVersionClient, type VerseContent } from '../api/youversion-client';
import { ModalManager } from '../modal/modal-manager';
import { EventHandler } from '../modal/event-handler';
import { renderVerseContent } from '../modal/modal-renderer';
import { ThemeManager } from '../theming/theme-manager';
import type { Theme } from '../theming/preset-themes';
import { findVersion } from '../parser/bible-versions';

/**
 * Main VerseTagger class
 * Public API for the library
 */
export class VerseTagger {
  private config: Required<VersetaggerConfig>;
  private scanner: DOMScanner;
  private apiClient: YouVersionClient;
  private modalManager: ModalManager;
  private eventHandler: EventHandler;
  private themeManager: ThemeManager;
  private scannedReferences: ScannedReference[] = [];
  private initialized = false;
  private cache: Map<string, VerseContent> = new Map();

  /**
   * Create a new VerseTagger instance
   * @param config - Configuration options
   */
  constructor(config: VersetaggerConfig) {
    // Validate and merge config with defaults
    this.config = createConfig(config);

    // Initialize modules
    this.scanner = new DOMScanner(this.config);
    this.apiClient = new YouVersionClient({
      proxyUrl: this.config.proxyUrl,
      defaultVersion: this.config.defaultVersion,
      debug: this.config.debug
    });

    this.modalManager = new ModalManager(this.config);
    this.eventHandler = new EventHandler(
      this.config,
      this.handleReferenceOpen.bind(this),
      this.handleReferenceClose.bind(this)
    );

    // Initialize theme manager
    const colorScheme = this.config.colorScheme;
    const customTheme = typeof this.config.theme === 'object' ? this.config.theme : undefined;
    this.themeManager = new ThemeManager(colorScheme, customTheme);

    // Setup theme
    this.themeManager.init();

    // Initialize modal with renderer
    this.modalManager.initialize((container, content) => {
      renderVerseContent(container, content, this.config);
    });

    this.initialized = true;

    if (this.config.debug) {
      console.log('[VerseTagger] Initialized with config:', this.config);
    }

    // Auto-scan on DOM ready if configured
    if (this.config.autoScan) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.scan());
      } else {
        // DOM already loaded, scan immediately
        this.scan();
      }
    }
  }

  /**
   * Scan the page (or specific element) for scripture references
   * @param element - Optional element to scan (defaults to document)
   * @returns Array of scanned references
   */
  scan(element?: HTMLElement): ScannedReference[] {
    if (!this.initialized) {
      throw new Error('VerseTagger: Cannot scan before initialization is complete');
    }

    const references = this.scanner.scan(element || document);

    // Attach event handlers to new references
    references.forEach(ref => {
      this.eventHandler.attach(ref.element);
    });

    // Track scanned references
    this.scannedReferences.push(...references);

    if (this.config.debug) {
      console.log(`[VerseTagger] Scanned ${references.length} references`, references);
    }

    return references;
  }

  /**
   * Re-scan the entire page
   * Clears previous scans and starts fresh
   * @returns Array of scanned references
   */
  rescan(): ScannedReference[] {
    if (!this.initialized) {
      throw new Error('VerseTagger: Cannot rescan before initialization is complete');
    }

    // Clear scanner cache
    this.scanner.clearCache();

    // Clear tracked references
    this.scannedReferences = [];

    // Scan again
    return this.scan();
  }

  /**
   * Update configuration
   * Applies new settings without requiring full re-initialization
   * @param newConfig - Partial configuration to update
   */
  updateConfig(newConfig: Partial<VersetaggerConfig>): void {
    if (!this.initialized) {
      throw new Error('VerseTagger: Cannot update config before initialization is complete');
    }

    // Merge with existing config
    this.config = mergeConfig({
      ...this.config,
      ...newConfig
    });

    // Update modules
    this.apiClient.updateConfig({
      proxyUrl: this.config.proxyUrl,
      defaultVersion: this.config.defaultVersion,
      debug: this.config.debug
    });

    this.modalManager.updateConfig(this.config);

    // If theme changed, update theme manager
    if (newConfig.theme || newConfig.colorScheme) {
      const colorScheme = newConfig.colorScheme || this.config.colorScheme;
      const customTheme = typeof newConfig.theme === 'object' ? newConfig.theme : undefined;

      if (typeof newConfig.theme === 'string' && (newConfig.theme === 'light' || newConfig.theme === 'dark')) {
        this.themeManager.setTheme(newConfig.theme);
      } else if (customTheme) {
        this.themeManager.setTheme(customTheme);
      }
    }

    if (this.config.debug) {
      console.log('[VerseTagger] Config updated:', this.config);
    }
  }

  /**
   * Set theme
   * @param theme - Theme name ('light' or 'dark') or custom theme object
   */
  setTheme(theme: 'light' | 'dark' | Partial<Theme>): void {
    if (!this.initialized) {
      throw new Error('VerseTagger: Cannot set theme before initialization is complete');
    }

    this.themeManager.setTheme(theme);

    if (this.config.debug) {
      console.log('[VerseTagger] Theme updated:', theme);
    }
  }

  /**
   * Destroy the VerseTagger instance
   * Cleanup all listeners, remove modals, and free resources
   */
  destroy(): void {
    if (!this.initialized) {
      return;
    }

    // Detach event handlers from all scanned references
    this.scannedReferences.forEach(ref => {
      try {
        this.eventHandler.detach(ref.element);
      } catch (e) {
        // Element may have been removed from DOM
        if (this.config.debug) {
          console.warn('[VerseTagger] Error detaching event handler:', e);
        }
      }
    });

    // Clear tracked references
    this.scannedReferences = [];

    // Clear cache
    this.cache.clear();

    // Destroy modules
    this.modalManager.destroy();
    this.themeManager.destroy();

    this.initialized = false;

    if (this.config.debug) {
      console.log('[VerseTagger] Destroyed');
    }
  }

  /**
   * Get current configuration
   * @returns Current configuration object
   */
  getConfig(): Required<VersetaggerConfig> {
    return { ...this.config };
  }

  /**
   * Get all scanned references
   * @returns Array of scanned references
   */
  getScannedReferences(): ScannedReference[] {
    return [...this.scannedReferences];
  }

  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Clear the verse cache
   */
  clearCache(): void {
    this.cache.clear();
    if (this.config.debug) {
      console.log('[VerseTagger] Cache cleared');
    }
  }

  /**
   * Handle reference open event
   * @private
   */
  private async handleReferenceOpen(element: HTMLElement, event: Event): Promise<void> {
    // Extract reference data from element
    const book = element.dataset.book;
    const chapter = element.dataset.chapter;
    const verses = element.dataset.verses;
    const version = element.dataset.version;

    if (!book || !chapter) {
      console.error('[VerseTagger] Missing reference data on element:', element);
      return;
    }

    // Determine which version to use
    const requestedVersion = version || this.config.defaultVersion;

    // Check if the version is licensed
    const versionInfo = findVersion(requestedVersion);
    if (versionInfo && !versionInfo.licensed) {
      // Show modal but display licensing message instead of making API call
      this.modalManager.showLoading(element);

      // Create a licensing message content
      const licensingContent: VerseContent = {
        book: book,
        chapter: parseInt(chapter),
        verses: verses || '',
        reference: `${book} ${chapter}${verses ? ':' + verses : ''}`,
        version: requestedVersion,
        content: "This Bible version isn't available to view here due to licensing restrictions.",
        isError: true
      };

      // Show the licensing message
      this.modalManager.showContent(licensingContent);
      return;
    }

    // Build cache key
    const cacheKey = this.buildCacheKey(book, parseInt(chapter), verses || '', requestedVersion);

    // Show loading state
    this.modalManager.showLoading(element);

    try {
      // Check cache first
      let content: VerseContent;
      if (this.cache.has(cacheKey)) {
        content = this.cache.get(cacheKey)!;
        if (this.config.debug) {
          console.log('[VerseTagger] Cache hit:', cacheKey);
        }
      } else {
        // Fetch from API
        if (this.config.debug) {
          console.log('[VerseTagger] Fetching verse:', { book, chapter, verses, version });
        }

        const reference: ScriptureReference = {
          book,
          chapter: parseInt(chapter),
          verses: verses || '',
          version: version || undefined,
          text: element.textContent || '',
          startIndex: 0,
          endIndex: 0
        };

        content = await this.apiClient.fetchVerse(reference);

        // Cache the result
        this.cache.set(cacheKey, content);
      }

      // Show content
      this.modalManager.showContent(content);
    } catch (error) {
      console.error('[VerseTagger] Error fetching verse:', error);

      let errorMessage = 'Failed to load verse content.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Create error content with the same structure as licensing errors
      const errorContent: VerseContent = {
        book: book,
        chapter: parseInt(chapter),
        verses: verses || '',
        reference: `${book} ${chapter}${verses ? ':' + verses : ''}`,
        version: requestedVersion,
        content: errorMessage,
        isError: true
      };

      this.modalManager.showContent(errorContent);
    }
  }

  /**
   * Handle reference close event
   * @private
   */
  private handleReferenceClose(element: HTMLElement, event: Event): void {
    // Check if modal (or bridge) is being hovered before closing
    const modalElement = document.getElementById('versetagger-modal');
    if (modalElement?.getAttribute('data-modal-hovered') === 'true') {
      // Don't close - user is hovering over modal or bridge
      return;
    }
    this.modalManager.hide();
  }

  /**
   * Build cache key for verse content
   * @private
   */
  private buildCacheKey(book: string, chapter: number, verses: string, version: string): string {
    return `${book}_${chapter}_${verses}_${version}`.toLowerCase();
  }

  /**
   * Get library version
   * @returns Version string
   */
  static get version(): string {
    return '0.1.0';
  }
}

// Export for use in other modules
export default VerseTagger;
