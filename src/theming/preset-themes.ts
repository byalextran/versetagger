/**
 * Preset theme definitions for VerseTagger
 * Hardcoded light and dark themes with professional, accessible colors
 */

export interface ThemeColors {
  // Modal container
  modalBackground: string;
  modalBorder: string;
  modalShadow: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Interactive elements
  linkColor: string;
  linkHoverColor: string;

  // Verse numbers
  verseNumberColor: string;

  // Loading/error states
  loadingColor: string;
  errorBackground: string;
  errorText: string;

  // Close button
  closeButtonColor: string;
  closeButtonHoverColor: string;
  closeButtonBackground: string;
  closeButtonHoverBackground: string;
}

export interface ThemeSpacing {
  modalPadding: string;
  modalBorderRadius: string;
  modalMaxWidth: string;
  versePadding: string;
  verseGap: string;
}

export interface ThemeFonts {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  verseNumberSize: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  fonts: ThemeFonts;
}

/**
 * Default Light Theme
 * High contrast, professional appearance suitable for most websites
 */
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    // Modal container
    modalBackground: '#ffffff',
    modalBorder: '#e5e7eb',
    modalShadow: 'rgba(0, 0, 0, 0.1)',

    // Text colors
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',

    // Interactive elements
    linkColor: '#2563eb',
    linkHoverColor: '#1d4ed8',

    // Verse numbers
    verseNumberColor: '#9ca3af',

    // Loading/error states
    loadingColor: '#6b7280',
    errorBackground: '#fef2f2',
    errorText: '#dc2626',

    // Close button
    closeButtonColor: '#6b7280',
    closeButtonHoverColor: '#111827',
    closeButtonBackground: 'transparent',
    closeButtonHoverBackground: '#f3f4f6',
  },
  spacing: {
    modalPadding: '16px',
    modalBorderRadius: '8px',
    modalMaxWidth: '400px',
    versePadding: '8px 0',
    verseGap: '4px',
  },
  fonts: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.6',
    verseNumberSize: '12px',
  },
};

/**
 * Default Dark Theme
 * Comfortable dark mode colors with reduced eye strain
 */
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    // Modal container
    modalBackground: '#1f2937',
    modalBorder: '#374151',
    modalShadow: 'rgba(0, 0, 0, 0.5)',

    // Text colors
    textPrimary: '#f9fafb',
    textSecondary: '#e5e7eb',
    textMuted: '#9ca3af',

    // Interactive elements
    linkColor: '#60a5fa',
    linkHoverColor: '#93c5fd',

    // Verse numbers
    verseNumberColor: '#6b7280',

    // Loading/error states
    loadingColor: '#9ca3af',
    errorBackground: '#7f1d1d',
    errorText: '#fca5a5',

    // Close button
    closeButtonColor: '#9ca3af',
    closeButtonHoverColor: '#f9fafb',
    closeButtonBackground: 'transparent',
    closeButtonHoverBackground: '#374151',
  },
  spacing: {
    modalPadding: '16px',
    modalBorderRadius: '8px',
    modalMaxWidth: '400px',
    versePadding: '8px 0',
    verseGap: '4px',
  },
  fonts: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.6',
    verseNumberSize: '12px',
  },
};

/**
 * Get preset theme by name
 */
export function getPresetTheme(name: 'light' | 'dark'): Theme {
  return name === 'dark' ? darkTheme : lightTheme;
}

/**
 * All available preset themes
 */
export const presetThemes = {
  light: lightTheme,
  dark: darkTheme,
};
