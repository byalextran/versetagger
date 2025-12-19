# Configuration Guide

Below are all supported options passed to the `VerseTagger` constructor. 

Note: The values seen below are the default values. None of these options need to be specified since they're all optional. 

```javascript
const versetagger = new VerseTagger({
  // Proxy server URL (to protect the YouVersion API Key)
  proxyUrl: 'https://versetagger.alextran.org',

  // Delay before showing modal on hover (milliseconds)
  hoverDelay: 500,

  // Automatically scan DOM on initialization
  autoScan: true,

  // CSS selectors for elements to exclude from scanning
  excludeSelectors: 'code, pre, script, style, head, meta, title, link, noscript, svg, canvas, iframe, video, select, option, button, a, .no-verse-tagging',

  // Default Bible version
  defaultVersion: 'NIV',

  // Color scheme ('light', 'dark', or 'auto')
  colorScheme: 'auto',

  // Theme name or custom theme object (see Theming section below )
  // If a custom theme is provided, the colorScheme setting will be ignored. 
  theme: 'default',

  accessibility: {
    // Enable keyboard navigation
    keyboardNav: true,

    // Enable screen reader announcements
    announceToScreenReaders: true
  },

  // CSS class added to tagged references
  referenceClass: 'verse-reference',

  // Open bible.com links in new tab
  openLinksInNewTab: true,

  // Enable debug logging
  debug: false
});
```

## Theming

Here's how to pass in a custom theme. Below are all available options along with their default values. You can pass in only the values you want to override. 

```javascript
const versetagger = new VerseTagger({
  theme: {
    // Colors
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
      closeButtonHoverBackground: '#f3f4f6'
    },

    // Spacing
    spacing: {
      modalPadding: '16px',
      modalBorderRadius: '8px',
      modalMaxWidth: '400px',
      versePadding: '8px 0',
      verseGap: '4px'
    },

    // Fonts
    fonts: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      verseNumberSize: '12px'
    }
  }
});
```
