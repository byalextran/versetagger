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

### `behavior`

**Type:** `'link-only' | 'modal-only' | 'both'`
**Default:** `'both'`

Controls how scripture references are enhanced:

- `'link-only'`: Convert references to clickable links (opens YouVersion in new tab)
- `'modal-only'`: Show modals but don't create links
- `'both'`: Create links AND show modals

```javascript
// Just create links, no modals
{
  behavior: 'link-only'
}

// Show modals but no links
{
  behavior: 'modal-only'
}

// Both links and modals (default)
{
  behavior: 'both'
}
```

### `trigger`

**Type:** `'hover' | 'click' | 'both'`
**Default:** `'hover'`

How to trigger the modal display:

- `'hover'`: Show modal on mouse hover
- `'click'`: Show modal on click
- `'both'`: Show on hover or click

```javascript
// Hover to show modal
{
  trigger: 'hover'
}

// Click to show modal
{
  trigger: 'click'
}

// Hover or click
{
  trigger: 'both'
}
```

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

### `linkFormat`

**Type:** `string`
**Default:** `'https://www.bible.com/bible/{version}/{book}.{chapter}.{verses}'`

Custom URL format for Bible links. Use placeholders:
- `{book}` - Book code
- `{chapter}` - Chapter number
- `{verses}` - Verse numbers
- `{version}` - Bible version

```javascript
{
  linkFormat: 'https://www.biblegateway.com/passage/?search={book}+{chapter}:{verses}&version={version}'
}
```

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
  behavior: 'both',
  trigger: 'hover',
  hoverDelay: 500,
  autoScan: true,
  excludeSelectors: 'code, pre, .no-verses',

  // Bible settings
  defaultVersion: 'NIV',
  linkFormat: 'https://www.bible.com/bible/{version}/{book}.{chapter}.{verses}',
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

### Click-Only Modals

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  trigger: 'click',
  hoverDelay: 0
});
```

### Links Only (No Modals)

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  behavior: 'link-only'
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
  proxyUrl: 'https://my-proxy.workers.dev',
  trigger: 'hover'
});

// Update later
versetagger.updateConfig({
  trigger: 'click',
  colorScheme: 'dark'
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
    behavior: 'invalid'
  });
} catch (error) {
  console.error(error.message);
  // "VerseTagger: Invalid behavior..."
}
```

## TypeScript Support

VerseTagger includes full TypeScript definitions:

```typescript
import VerseTagger, { type VersetaggerConfig } from 'versetagger';

const config: VersetaggerConfig = {
  proxyUrl: 'https://my-proxy.workers.dev',
  trigger: 'hover',  // Autocomplete and type checking!
  colorScheme: 'auto'
};

const versetagger = new VerseTagger(config);
```

## Next Steps

- [Theming Guide](./theming.md) - Customize appearance
- [API Reference](./api-reference.md) - Public methods
- [Getting Started](./getting-started.md) - Basic setup
