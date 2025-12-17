/**
 * Configuration system for VerseTagger
 * Type-safe configuration with validation and defaults
 */

export type BehaviorMode = 'link-only' | 'modal-only' | 'both';
export type TriggerMode = 'hover' | 'click' | 'both';
export type ColorScheme = 'light' | 'dark' | 'auto';

export interface VersetaggerConfig {
  /**
   * Required: URL of the proxy server that forwards requests to YouVersion API
   * Example: "https://your-worker.workers.dev/api/verses"
   */
  proxyUrl: string;

  /**
   * Behavior mode for scripture references
   * - 'link-only': Only convert to clickable links (no modal)
   * - 'modal-only': Show modals but don't make links
   * - 'both': Convert to links AND show modals
   * @default 'both'
   */
  behavior?: BehaviorMode;

  /**
   * How to trigger the modal display
   * - 'hover': Show on mouse hover
   * - 'click': Show on click
   * - 'both': Show on hover or click
   * @default 'hover'
   */
  trigger?: TriggerMode;

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
   * Custom link format for YouVersion
   * Use {book}, {chapter}, {verses}, {version} as placeholders
   * @default 'https://www.bible.com/bible/{version}/{book}.{chapter}.{verses}'
   */
  linkFormat?: string;

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
  proxyUrl: '', // Required, no default
  behavior: 'both',
  trigger: 'hover',
  hoverDelay: 500,
  autoScan: true,
  excludeSelectors: 'code, pre, script, style, .no-verse-tagging',
  defaultVersion: 'NIV',
  colorScheme: 'auto',
  theme: 'default',
  accessibility: {
    keyboardNav: true,
    announceToScreenReaders: true
  },
  referenceClass: 'verse-reference',
  openLinksInNewTab: true,
  linkFormat: 'https://www.bible.com/bible/{version}/{book}.{chapter}.{verses}',
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
  // Required fields
  if (!config.proxyUrl) {
    throw new Error(
      'VerseTagger: proxyUrl is required. Please provide a URL to your API proxy server. ' +
      'See documentation for proxy setup: https://github.com/yourusername/versetagger#proxy-setup'
    );
  }

  // Validate URL format
  try {
    new URL(config.proxyUrl);
  } catch {
    throw new Error(`VerseTagger: Invalid proxyUrl "${config.proxyUrl}". Must be a valid URL.`);
  }

  // Validate behavior mode
  if (config.behavior && !['link-only', 'modal-only', 'both'].includes(config.behavior)) {
    throw new Error(
      `VerseTagger: Invalid behavior "${config.behavior}". Must be "link-only", "modal-only", or "both".`
    );
  }

  // Validate trigger mode
  if (config.trigger && !['hover', 'click', 'both'].includes(config.trigger)) {
    throw new Error(
      `VerseTagger: Invalid trigger "${config.trigger}". Must be "hover", "click", or "both".`
    );
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
