/**
 * Configuration system for VerseTagger
 * Type-safe configuration with validation and defaults
 */

export type ColorScheme = 'light' | 'dark' | 'auto';

export interface VersetaggerConfig {
  /**
   * URL of the proxy server that forwards requests to YouVersion API
   * @default 'https://versetagger.alextran.org'
   * Example: "https://your-worker.workers.dev/api/verses"
   */
  proxyUrl?: string;

  /**
   * Delay in milliseconds before showing modal on hover
   * @default 500
   */
  hoverDelay?: number;

  /**
   * Automatically scan the DOM on initialization
   * @default true
   */
  autoScan?: boolean;

  /**
   * CSS selector for elements to exclude from scanning
   * @default 'code, pre, script, style, .no-verse-tagging'
   */
  excludeSelectors?: string;

  /**
   * Default Bible version to use when not specified in reference
   * @default 'NIV'
   */
  defaultVersion?: string;

  /**
   * Color scheme for modals
   * - 'light': Light theme
   * - 'dark': Dark theme
   * - 'auto': Detect from system preference
   * @default 'auto'
   */
  colorScheme?: ColorScheme;

  /**
   * Theme name or custom theme object
   * @default 'default'
   */
  theme?: string | object;

  /**
   * Accessibility configuration
   */
  accessibility?: {
    /**
     * Enable keyboard navigation
     * @default true
     */
    keyboardNav?: boolean;

    /**
     * Enable screen reader announcements
     * @default true
     */
    announceToScreenReaders?: boolean;
  };

  /**
   * Custom CSS class to add to tagged references
   * @default 'verse-reference'
   */
  referenceClass?: string;

  /**
   * Whether to open links in new tab
   * @default true
   */
  openLinksInNewTab?: boolean;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Required<VersetaggerConfig> = {
  proxyUrl: 'https://versetagger.alextran.org', // Default proxy URL
  hoverDelay: 500,
  autoScan: true,
  excludeSelectors: 'code, pre, script, style, head, meta, title, link, noscript, svg, canvas, iframe, video, select, option, button, a, .no-verse-tagging',
  defaultVersion: 'NIV',
  colorScheme: 'auto',
  theme: 'default',
  accessibility: {
    keyboardNav: true,
    announceToScreenReaders: true
  },
  referenceClass: 'verse-reference',
  openLinksInNewTab: true,
  debug: false
};

/**
 * Merge user config with defaults
 */
export function mergeConfig(userConfig: VersetaggerConfig): Required<VersetaggerConfig> {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
    accessibility: {
      ...DEFAULT_CONFIG.accessibility,
      ...(userConfig.accessibility || {})
    }
  };
}

/**
 * Validate configuration
 * Throws error if configuration is invalid
 */
export function validateConfig(config: VersetaggerConfig): void {
  // Validate URL format if provided
  if (config.proxyUrl) {
    try {
      new URL(config.proxyUrl);
    } catch {
      throw new Error(`VerseTagger: Invalid proxyUrl "${config.proxyUrl}". Must be a valid URL.`);
    }
  }

  // Validate color scheme
  if (config.colorScheme && !['light', 'dark', 'auto'].includes(config.colorScheme)) {
    throw new Error(
      `VerseTagger: Invalid colorScheme "${config.colorScheme}". Must be "light", "dark", or "auto".`
    );
  }

  // Validate hover delay
  if (config.hoverDelay !== undefined && (config.hoverDelay < 0 || config.hoverDelay > 5000)) {
    throw new Error(
      `VerseTagger: Invalid hoverDelay "${config.hoverDelay}". Must be between 0 and 5000ms.`
    );
  }
}

/**
 * Create and validate configuration
 */
export function createConfig(userConfig: VersetaggerConfig): Required<VersetaggerConfig> {
  validateConfig(userConfig);
  return mergeConfig(userConfig);
}
