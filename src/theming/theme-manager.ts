/**
 * Theme Manager
 * Handles theme validation, application, auto-detection, and switching
 */

import type { Theme, ThemeColors, ThemeSpacing, ThemeFonts } from './preset-themes';
import { getPresetTheme } from './preset-themes';
import { injectThemeVariables, injectBaseStyles, hasBaseStyles } from './css-injector';
import { MODAL_BASE_STYLES } from '../modal/modal-styles';

export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * ThemeManager handles all theme-related functionality
 */
export class ThemeManager {
  private currentTheme: Theme;
  private mode: ThemeMode;
  private mediaQuery: MediaQueryList | null = null;
  private mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;

  constructor(mode: ThemeMode = 'auto', customTheme?: Partial<Theme>) {
    this.mode = mode;

    // Resolve initial theme
    if (customTheme) {
      this.currentTheme = this.validateAndMergeTheme(customTheme);
    } else {
      this.currentTheme = this.resolveTheme(mode);
    }

    // Setup auto-detection if mode is 'auto'
    if (mode === 'auto') {
      this.setupAutoDetection();
    }
  }

  /**
   * Initialize the theme system
   * Injects base styles and applies the current theme
   */
  public init(): void {
    // Inject base styles if not already present
    if (!hasBaseStyles()) {
      injectBaseStyles(MODAL_BASE_STYLES);
    }

    // Apply the current theme
    this.applyTheme(this.currentTheme);
  }

  /**
   * Switch to a different theme
   * Can accept 'light', 'dark', or a custom theme object
   */
  public setTheme(theme: 'light' | 'dark' | Partial<Theme>): void {
    if (typeof theme === 'string') {
      this.currentTheme = getPresetTheme(theme);
      this.mode = theme;
    } else {
      this.currentTheme = this.validateAndMergeTheme(theme);
      this.mode = 'auto'; // Custom themes don't have a specific mode
    }

    this.applyTheme(this.currentTheme);
  }

  /**
   * Get the current theme
   */
  public getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Get the current theme mode
   */
  public getMode(): ThemeMode {
    return this.mode;
  }

  /**
   * Cleanup theme manager
   * Removes auto-detection listener
   */
  public destroy(): void {
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeListener(this.mediaQueryListener);
      this.mediaQueryListener = null;
      this.mediaQuery = null;
    }
  }

  /**
   * Resolve theme based on mode
   */
  private resolveTheme(mode: ThemeMode): Theme {
    if (mode === 'auto') {
      return this.detectColorScheme() === 'dark' ? getPresetTheme('dark') : getPresetTheme('light');
    }
    return getPresetTheme(mode);
  }

  /**
   * Detect system color scheme preference
   */
  private detectColorScheme(): 'light' | 'dark' {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light';
    }

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return darkModeQuery.matches ? 'dark' : 'light';
  }

  /**
   * Setup auto-detection for color scheme changes
   */
  private setupAutoDetection(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQueryListener = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? getPresetTheme('dark') : getPresetTheme('light');
      this.currentTheme = newTheme;
      this.applyTheme(newTheme);
    };

    // Modern browsers
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', this.mediaQueryListener);
    } else {
      // Fallback for older browsers
      this.mediaQuery.addListener(this.mediaQueryListener);
    }
  }

  /**
   * Apply theme by injecting CSS custom properties
   */
  private applyTheme(theme: Theme): void {
    const cssVariables = this.themeToCSSVariables(theme);
    injectThemeVariables(cssVariables);
  }

  /**
   * Convert theme object to CSS custom properties
   */
  private themeToCSSVariables(theme: Theme): Record<string, string> {
    const variables: Record<string, string> = {};

    // Colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      variables[key] = value;
    });

    // Spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      variables[key] = value;
    });

    // Fonts
    Object.entries(theme.fonts).forEach(([key, value]) => {
      variables[key] = value;
    });

    return variables;
  }

  /**
   * Validate and merge custom theme with defaults
   * Ensures all required properties exist
   */
  private validateAndMergeTheme(customTheme: Partial<Theme>): Theme {
    const baseTheme = getPresetTheme('light');

    // Deep merge colors
    const colors: ThemeColors = {
      ...baseTheme.colors,
      ...(customTheme.colors || {}),
    };

    // Deep merge spacing
    const spacing: ThemeSpacing = {
      ...baseTheme.spacing,
      ...(customTheme.spacing || {}),
    };

    // Deep merge fonts
    const fonts: ThemeFonts = {
      ...baseTheme.fonts,
      ...(customTheme.fonts || {}),
    };

    return {
      name: customTheme.name || 'custom',
      colors,
      spacing,
      fonts,
    };
  }

  /**
   * Validate theme object structure
   * Returns true if theme has all required properties
   */
  public static isValidTheme(theme: unknown): theme is Theme {
    if (!theme || typeof theme !== 'object') {
      return false;
    }

    const t = theme as Partial<Theme>;

    // Check for required top-level properties
    if (!t.colors || !t.spacing || !t.fonts) {
      return false;
    }

    // Validate colors
    const requiredColorProps: (keyof ThemeColors)[] = [
      'modalBackground',
      'modalBorder',
      'modalShadow',
      'textPrimary',
      'textSecondary',
      'textMuted',
      'linkColor',
      'linkHoverColor',
      'verseNumberColor',
      'loadingColor',
      'errorBackground',
      'errorText',
      'closeButtonColor',
      'closeButtonHoverColor',
      'closeButtonBackground',
      'closeButtonHoverBackground',
    ];

    for (const prop of requiredColorProps) {
      if (typeof t.colors[prop] !== 'string') {
        return false;
      }
    }

    // Validate spacing
    const requiredSpacingProps: (keyof ThemeSpacing)[] = [
      'modalPadding',
      'modalBorderRadius',
      'modalMaxWidth',
      'versePadding',
      'verseGap',
    ];

    for (const prop of requiredSpacingProps) {
      if (typeof t.spacing[prop] !== 'string') {
        return false;
      }
    }

    // Validate fonts
    const requiredFontProps: (keyof ThemeFonts)[] = [
      'fontFamily',
      'fontSize',
      'lineHeight',
      'verseNumberSize',
    ];

    for (const prop of requiredFontProps) {
      if (typeof t.fonts[prop] !== 'string') {
        return false;
      }
    }

    return true;
  }
}
