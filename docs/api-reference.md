# API Reference

Complete reference for VerseTagger's public API.

## Constructor

### `new VerseTagger(config)`

Creates a new VerseTagger instance and initializes the library.

**Parameters:**
- `config` (VersetaggerConfig): Configuration object

**Returns:** VerseTagger instance

**Throws:** Error if configuration is invalid

**Example:**

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  trigger: 'hover',
  colorScheme: 'auto'
});
```

See [Configuration Guide](./configuration.md) for all available options.

---

## Instance Methods

### `scan(element?)`

Scans the page or a specific element for scripture references and enhances them.

**Parameters:**
- `element` (HTMLElement, optional): Element to scan. Defaults to entire document.

**Returns:** Array of `ScannedReference` objects

**Example:**

```javascript
// Scan entire page
const references = versetagger.scan();

// Scan specific element
const article = document.querySelector('article');
const references = versetagger.scan(article);

console.log(`Found ${references.length} scripture references`);
```

**ScannedReference Object:**

```typescript
interface ScannedReference {
  element: HTMLElement;      // The enhanced element
  reference: ScriptureReference;  // Parsed reference data
}

interface ScriptureReference {
  book: string;              // Book code (e.g., "JHN")
  chapter: number;           // Chapter number
  verses: number[];          // Verse numbers
  version?: string;          // Bible version (e.g., "NIV")
  text: string;              // Original text
  startIndex: number;        // Start position in text
  endIndex: number;          // End position in text
}
```

---

### `rescan()`

Clears the scan cache and re-scans the entire page from scratch.

**Returns:** Array of `ScannedReference` objects

**Example:**

```javascript
// Load new content
document.querySelector('#content').innerHTML = newContent;

// Re-scan entire page
versetagger.rescan();
```

**Use Cases:**
- After dynamically loading content
- After removing content from the page
- When you want to apply new exclusion rules

---

### `updateConfig(config)`

Updates configuration dynamically without re-initializing.

**Parameters:**
- `config` (Partial\<VersetaggerConfig\>): Configuration options to update

**Returns:** void

**Example:**

```javascript
// Change trigger mode
versetagger.updateConfig({
  trigger: 'click'
});

// Update multiple options
versetagger.updateConfig({
  trigger: 'both',
  hoverDelay: 300,
  defaultVersion: 'ESV'
});
```

**Note:** Some configuration changes may require re-scanning:

```javascript
versetagger.updateConfig({
  excludeSelectors: 'code, pre, .comments'
});
versetagger.rescan();  // Apply new exclusions
```

---

### `setTheme(theme)`

Changes the theme at runtime.

**Parameters:**
- `theme` ('light' | 'dark' | Partial\<Theme\>): Theme name or custom theme object

**Returns:** void

**Example:**

```javascript
// Switch to dark theme
versetagger.setTheme('dark');

// Switch to light theme
versetagger.setTheme('light');

// Apply custom theme
versetagger.setTheme({
  colors: {
    modalBackground: '#f8f9fa',
    textPrimary: '#212529'
  }
});
```

See [Theming Guide](./theming.md) for theme structure and examples.

---

### `destroy()`

Destroys the VerseTagger instance, cleaning up all event listeners, removing modals, and freeing resources.

**Returns:** void

**Example:**

```javascript
// Clean up before page navigation
window.addEventListener('beforeunload', () => {
  versetagger.destroy();
});

// Or in a SPA
function cleanupPage() {
  versetagger.destroy();
}
```

**What gets cleaned up:**
- All event listeners on tagged references
- Modal elements removed from DOM
- Theme styles removed
- Cache cleared
- All tracked references cleared

After calling `destroy()`, the instance cannot be used again. Create a new instance if needed.

---

### `getConfig()`

Returns the current configuration.

**Returns:** `Required<VersetaggerConfig>`

**Example:**

```javascript
const config = versetagger.getConfig();
console.log('Proxy URL:', config.proxyUrl);
console.log('Trigger mode:', config.trigger);
console.log('Default version:', config.defaultVersion);
```

**Note:** Returns a copy of the config, so modifying it won't affect VerseTagger. Use `updateConfig()` to change settings.

---

### `getScannedReferences()`

Returns all references that have been scanned and enhanced.

**Returns:** Array of `ScannedReference` objects

**Example:**

```javascript
const references = versetagger.getScannedReferences();

console.log(`Total references: ${references.length}`);

// List all books found
const books = [...new Set(references.map(ref => ref.reference.book))];
console.log('Books found:', books);

// Find specific reference
const john316 = references.find(ref =>
  ref.reference.book === 'JHN' &&
  ref.reference.chapter === 3 &&
  ref.reference.verses.includes(16)
);
```

---

### `getCacheStats()`

Returns statistics about the verse content cache.

**Returns:** Object with cache information

```typescript
{
  size: number;      // Number of cached verses
  keys: string[];    // Cache keys
}
```

**Example:**

```javascript
const stats = versetagger.getCacheStats();
console.log(`Cached verses: ${stats.size}`);
console.log('Cache keys:', stats.keys);

// Example cache key: "jhn_3_16_niv"
```

**Use Cases:**
- Monitoring memory usage
- Debugging cache behavior
- Performance optimization

---

### `clearCache()`

Clears all cached verse content.

**Returns:** void

**Example:**

```javascript
// Clear cache manually
versetagger.clearCache();

// Clear cache periodically
setInterval(() => {
  const stats = versetagger.getCacheStats();
  if (stats.size > 100) {
    versetagger.clearCache();
  }
}, 60000);  // Every minute
```

**Use Cases:**
- Free memory after extensive use
- Force fresh API requests
- Development/testing

---

## Static Properties

### `VerseTagger.version`

Returns the library version string.

**Type:** string (readonly)

**Example:**

```javascript
console.log('VerseTagger version:', VerseTagger.version);
// Output: "0.1.0"
```

---

## Type Definitions

### `VersetaggerConfig`

Main configuration interface. See [Configuration Guide](./configuration.md) for details.

```typescript
interface VersetaggerConfig {
  proxyUrl: string;
  behavior?: 'link-only' | 'modal-only' | 'both';
  trigger?: 'hover' | 'click' | 'both';
  hoverDelay?: number;
  autoScan?: boolean;
  excludeSelectors?: string;
  defaultVersion?: string;
  colorScheme?: 'light' | 'dark' | 'auto';
  theme?: string | object;
  accessibility?: {
    keyboardNav?: boolean;
    announceToScreenReaders?: boolean;
  };
  referenceClass?: string;
  openLinksInNewTab?: boolean;
  linkFormat?: string;
  debug?: boolean;
}
```

### `Theme`

Theme object structure. See [Theming Guide](./theming.md) for details.

```typescript
interface Theme {
  name: string;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  fonts: ThemeFonts;
}
```

### `ScannedReference`

Information about a scanned scripture reference.

```typescript
interface ScannedReference {
  element: HTMLElement;
  reference: ScriptureReference;
}
```

### `ScriptureReference`

Parsed scripture reference data.

```typescript
interface ScriptureReference {
  book: string;          // Book code
  chapter: number;       // Chapter number
  verses: number[];      // Array of verse numbers
  version?: string;      // Bible version
  text: string;          // Original matched text
  startIndex: number;    // Start position
  endIndex: number;      // End position
}
```

---

## Common Patterns

### Initialization with Error Handling

```javascript
try {
  const versetagger = new VerseTagger({
    proxyUrl: 'https://my-proxy.workers.dev'
  });
} catch (error) {
  console.error('VerseTagger initialization failed:', error.message);
  // Fallback behavior
}
```

### Progressive Enhancement

```javascript
// Check if browser supports VerseTagger
if (typeof VerseTagger !== 'undefined') {
  const versetagger = new VerseTagger({
    proxyUrl: 'https://my-proxy.workers.dev'
  });
} else {
  console.warn('VerseTagger not available');
}
```

### Manual Control for SPAs

```javascript
class MyApp {
  constructor() {
    this.versetagger = new VerseTagger({
      proxyUrl: 'https://my-proxy.workers.dev',
      autoScan: false
    });
  }

  loadPage(content) {
    document.querySelector('#app').innerHTML = content;
    this.versetagger.scan(document.querySelector('#app'));
  }

  cleanup() {
    this.versetagger.destroy();
  }
}
```

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import VerseTagger from 'versetagger';

function Article({ content }) {
  const articleRef = useRef(null);
  const versetaggerRef = useRef(null);

  useEffect(() => {
    // Initialize on mount
    if (!versetaggerRef.current) {
      versetaggerRef.current = new VerseTagger({
        proxyUrl: 'https://my-proxy.workers.dev',
        autoScan: false
      });
    }

    // Scan when content changes
    if (articleRef.current) {
      versetaggerRef.current.scan(articleRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (versetaggerRef.current) {
        versetaggerRef.current.destroy();
        versetaggerRef.current = null;
      }
    };
  }, [content]);

  return <article ref={articleRef}>{content}</article>;
}
```

### Vue Integration

```vue
<template>
  <article ref="article" v-html="content"></article>
</template>

<script>
import VerseTagger from 'versetagger';

export default {
  data() {
    return {
      versetagger: null
    };
  },
  mounted() {
    this.versetagger = new VerseTagger({
      proxyUrl: 'https://my-proxy.workers.dev',
      autoScan: false
    });
    this.versetagger.scan(this.$refs.article);
  },
  watch: {
    content() {
      this.$nextTick(() => {
        this.versetagger.scan(this.$refs.article);
      });
    }
  },
  beforeUnmount() {
    if (this.versetagger) {
      this.versetagger.destroy();
    }
  }
};
</script>
```

### Theme Toggle with LocalStorage

```javascript
// Initialize with saved theme
const savedTheme = localStorage.getItem('theme') || 'auto';
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  colorScheme: savedTheme
});

// Toggle theme
function toggleTheme() {
  const currentTheme = versetagger.getConfig().colorScheme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  versetagger.setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}

document.querySelector('#theme-toggle').addEventListener('click', toggleTheme);
```

### Monitoring Performance

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  debug: true
});

// Monitor scanning performance
console.time('scan');
const references = versetagger.scan();
console.timeEnd('scan');

console.log(`Found ${references.length} references`);

// Monitor cache efficiency
setInterval(() => {
  const stats = versetagger.getCacheStats();
  console.log(`Cache size: ${stats.size} verses`);
}, 10000);
```

---

## Browser Compatibility

VerseTagger is compatible with:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (Chrome Android, Safari iOS)

Requires ES2017+ support.

---

## Next Steps

- [Configuration Guide](./configuration.md) - Detailed configuration options
- [Theming Guide](./theming.md) - Customize appearance
- [Getting Started](./getting-started.md) - Initial setup
- [Examples](../examples/) - Working code examples
