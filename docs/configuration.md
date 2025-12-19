# Configuration Guide

VerseTagger is highly configurable to fit your specific needs. This guide covers all available configuration options.

## Configuration Object

All options are passed to the `VerseTagger` constructor:

```javascript
const versetagger = new VerseTagger({
  // Your configuration here
});
```

## Required Options

### `proxyUrl`

**Type:** `string` (required)

URL of your proxy server that forwards requests to the YouVersion API.

```javascript
{
  proxyUrl: 'https://my-proxy.workers.dev'
}
```

See [Cloudflare Proxy Setup](./cloudflare-proxy.md) for details on setting up a proxy.

## Behavior Options

### `hoverDelay`

**Type:** `number` (milliseconds)
**Default:** `500`
**Range:** `0` to `5000`

Delay before showing modal on hover. Helps prevent accidental triggers.

```javascript
{
  hoverDelay: 300  // Show modal 300ms after hover starts
}
```

### `autoScan`

**Type:** `boolean`
**Default:** `true`

Automatically scan the DOM on page load. Set to `false` if you want to manually control scanning.

```javascript
{
  autoScan: false
}

// Then scan manually
versetagger.scan();
```

### `excludeSelectors`

**Type:** `string` (CSS selector)
**Default:** `'code, pre, script, style, .no-verse-tagging'`

CSS selector for elements to exclude from scanning. VerseTagger will not detect references inside these elements.

```javascript
{
  excludeSelectors: 'code, pre, .comments, #sidebar'
}
```

**Default excluded elements:**
- `code` - Code blocks
- `pre` - Preformatted text
- `script` - Script tags
- `style` - Style tags
- `.no-verse-tagging` - Custom class to exclude specific sections

## Bible Settings

### `defaultVersion`

**Type:** `string`
**Default:** `'NIV'`

Default Bible version to use when not specified in the reference.

```javascript
{
  defaultVersion: 'ESV'
}
```

Common versions: `NIV`, `ESV`, `KJV`, `NKJV`, `NLT`, `MSG`, `NASB`, `CSB`

### `openLinksInNewTab`

**Type:** `boolean`
**Default:** `true`

Whether to open Bible links in a new tab.

```javascript
{
  openLinksInNewTab: false  // Open in same tab
}
```

## Appearance Options

### `colorScheme`

**Type:** `'light' | 'dark' | 'auto'`
**Default:** `'auto'`

Color scheme for modals:

- `'light'`: Always use light theme
- `'dark'`: Always use dark theme
- `'auto'`: Automatically detect from system preference (`prefers-color-scheme`)

```javascript
{
  colorScheme: 'dark'
}
```

### `theme`

**Type:** `string | object`
**Default:** `'default'`

Theme name or custom theme object. See [Theming Guide](./theming.md) for details.

```javascript
// Use preset theme
{
  theme: 'default'
}

// Custom theme object
{
  theme: {
    colors: {
      modalBackground: '#ffffff',
      textPrimary: '#000000',
      linkColor: '#0066cc'
    }
  }
}
```

### `referenceClass`

**Type:** `string`
**Default:** `'verse-reference'`

Custom CSS class added to tagged references. Useful for custom styling.

```javascript
{
  referenceClass: 'my-verse-link'
}
```

Then in your CSS:

```css
.my-verse-link {
  color: #0066cc;
  text-decoration: underline;
  font-weight: bold;
}

.my-verse-link:hover {
  color: #004499;
}
```

## Accessibility Options

### `accessibility.keyboardNav`

**Type:** `boolean`
**Default:** `true`

Enable keyboard navigation (Enter/Space to open, Escape to close).

```javascript
{
  accessibility: {
    keyboardNav: true
  }
}
```

### `accessibility.announceToScreenReaders`

**Type:** `boolean`
**Default:** `true`

Enable screen reader announcements for modal state changes.

```javascript
{
  accessibility: {
    announceToScreenReaders: true
  }
}
```

## Developer Options

### `debug`

**Type:** `boolean`
**Default:** `false`

Enable debug logging to console. Helpful for troubleshooting.

```javascript
{
  debug: true
}
```

Logs include:
- Initialization details
- Scanned references
- API requests and cache hits
- Theme changes
- Configuration updates

## Complete Configuration Example

Here's an example with all options:

```javascript
const versetagger = new VerseTagger({
  // Required
  proxyUrl: 'https://my-proxy.workers.dev',

  // Behavior
  hoverDelay: 500,
  autoScan: true,
  excludeSelectors: 'code, pre, .no-verses',

  // Bible settings
  defaultVersion: 'NIV',
  openLinksInNewTab: true,

  // Appearance
  colorScheme: 'auto',
  theme: 'default',
  referenceClass: 'verse-reference',

  // Accessibility
  accessibility: {
    keyboardNav: true,
    announceToScreenReaders: true
  },

  // Developer
  debug: false
});
```

## Configuration Presets

Here are some common configuration presets for different use cases:

### Minimal Setup

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev'
});
```

### Manual Scanning for SPAs

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  autoScan: false
});

// Scan when needed
router.on('routeChange', () => {
  versetagger.rescan();
});
```

### Dark Theme Only

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  colorScheme: 'dark'
});
```

### Custom Styling

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  referenceClass: 'bible-verse',
  theme: {
    colors: {
      modalBackground: '#f8f9fa',
      textPrimary: '#212529',
      linkColor: '#0066cc'
    },
    fonts: {
      fontFamily: 'Georgia, serif',
      fontSize: '16px'
    }
  }
});
```

### High Performance (Minimal Delay)

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  hoverDelay: 100,  // Quick response
  excludeSelectors: 'code, pre, footer, .sidebar'  // Skip non-essential areas
});
```

## Runtime Configuration Updates

You can update configuration after initialization:

```javascript
// Initial setup
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev'
});

// Update later
versetagger.updateConfig({
  colorScheme: 'dark',
  hoverDelay: 300
});
```

**Note:** Some configuration changes may require re-scanning:

```javascript
versetagger.updateConfig({
  excludeSelectors: 'code, pre, .comments'
});

// Re-scan to apply new exclusions
versetagger.rescan();
```

## Validation

VerseTagger validates configuration on initialization. Invalid configuration will throw an error:

```javascript
// Missing required field
try {
  const versetagger = new VerseTagger({});
} catch (error) {
  console.error(error.message);
  // "VerseTagger: proxyUrl is required..."
}

// Invalid value
try {
  const versetagger = new VerseTagger({
    proxyUrl: 'https://my-proxy.workers.dev',
    colorScheme: 'invalid'
  });
} catch (error) {
  console.error(error.message);
  // "VerseTagger: Invalid colorScheme..."
}
```

## TypeScript Support

VerseTagger includes full TypeScript definitions:

```typescript
import VerseTagger, { type VersetaggerConfig } from 'versetagger';

const config: VersetaggerConfig = {
  proxyUrl: 'https://my-proxy.workers.dev',
  colorScheme: 'auto'  // Autocomplete and type checking!
};

const versetagger = new VerseTagger(config);
```

## Next Steps

- [Theming Guide](./theming.md) - Customize appearance
- [API Reference](./api-reference.md) - Public methods
- [Getting Started](./getting-started.md) - Basic setup
