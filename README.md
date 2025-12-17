# VerseTagger

A lightweight, pure TypeScript library that automatically detects Bible references in web pages and displays verse content in elegant, customizable modals.

## Features

- **Automatic Detection**: Scans your page for scripture references like "John 3:16", "Genesis 1:1-3", or "Psalm 23 NIV"
- **Elegant Modals**: Displays verse content in beautiful, accessible modals on hover or click
- **Highly Customizable**: Configure behavior, triggers, themes, and more
- **Light & Dark Themes**: Built-in themes with automatic system preference detection
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Zero Dependencies**: No external dependencies in the core library
- **TypeScript**: Full TypeScript support with type definitions included
- **Tiny Bundle**: Less than 13KB gzipped
- **Flexible Integration**: Works with any website or framework

## Quick Start

### 1. Installation

#### Via npm

```bash
npm install versetagger
```

```javascript
import VerseTagger from 'versetagger';

const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev'
});
```

#### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/versetagger@latest/dist/versetagger.js"></script>
<script>
  const versetagger = new VerseTagger({
    proxyUrl: 'https://your-proxy.workers.dev'
  });
</script>
```

### 2. Set Up a Proxy Server

VerseTagger requires a proxy server to securely communicate with the YouVersion API (to protect your API key). We provide a ready-to-deploy Cloudflare Worker example.

See [Cloudflare Proxy Setup Guide](./docs/cloudflare-proxy.md) for detailed instructions.

### 3. Use It

Add scripture references to your HTML:

```html
<p>
  My favorite verse is John 3:16. I also love reading Psalm 23
  and Romans 8:28-30 ESV.
</p>
```

VerseTagger will automatically detect these references and make them interactive!

## Basic Usage

### Simple Configuration

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev',
  trigger: 'hover',        // Show modal on hover
  colorScheme: 'auto',     // Auto-detect light/dark mode
  defaultVersion: 'NIV'    // Default Bible version
});
```

### Manual Scanning

```javascript
// Disable auto-scan
const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev',
  autoScan: false
});

// Scan manually when ready
versetagger.scan();

// Or scan a specific element
const article = document.querySelector('article');
versetagger.scan(article);
```

### Dynamic Content

```javascript
// Re-scan after loading new content
fetch('/api/article')
  .then(response => response.text())
  .then(html => {
    document.querySelector('#content').innerHTML = html;
    versetagger.rescan();
  });
```

## Configuration Options

VerseTagger is highly configurable. Here are some common options:

```javascript
const versetagger = new VerseTagger({
  // Required
  proxyUrl: 'https://your-proxy.workers.dev',

  // Behavior
  behavior: 'both',           // 'link-only', 'modal-only', or 'both'
  trigger: 'hover',            // 'hover', 'click', or 'both'
  hoverDelay: 500,             // Delay before showing modal (ms)

  // Appearance
  colorScheme: 'auto',         // 'light', 'dark', or 'auto'
  theme: 'default',            // Use preset theme or custom theme object

  // Bible settings
  defaultVersion: 'NIV',       // Default Bible translation

  // Advanced
  autoScan: true,              // Scan on page load
  excludeSelectors: 'code, pre', // Elements to skip
  debug: false                 // Enable debug logging
});
```

See [Configuration Guide](./docs/configuration.md) for all available options.

## Theming

VerseTagger includes beautiful light and dark themes that automatically adapt to your user's system preferences.

### Custom Theme

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev',
  theme: {
    colors: {
      modalBackground: '#ffffff',
      textPrimary: '#000000',
      linkColor: '#0066cc',
      // ... more colors
    },
    spacing: {
      modalPadding: '20px',
      modalBorderRadius: '12px',
      // ... more spacing
    },
    fonts: {
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      // ... more fonts
    }
  }
});
```

### Change Theme at Runtime

```javascript
// Switch to dark theme
versetagger.setTheme('dark');

// Apply custom theme
versetagger.setTheme({
  colors: { modalBackground: '#f5f5f5' }
});
```

See [Theming Guide](./docs/theming.md) for complete theme customization.

## API Reference

### Constructor

```javascript
new VerseTagger(config: VersetaggerConfig)
```

### Methods

- `scan(element?: HTMLElement)` - Scan page or specific element for references
- `rescan()` - Clear and re-scan entire page
- `updateConfig(config)` - Update configuration dynamically
- `setTheme(theme)` - Change theme at runtime
- `destroy()` - Cleanup listeners and remove modals
- `getConfig()` - Get current configuration
- `getScannedReferences()` - Get all scanned references
- `getCacheStats()` - Get cache statistics
- `clearCache()` - Clear verse cache

See [API Reference](./docs/api-reference.md) for detailed documentation.

## Browser Support

VerseTagger supports all modern browsers:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari and Chrome Android

Requires ES2017+ support.

## Examples

- [Basic Usage](./examples/basic.html) - Simple integration example
- [Custom Theme](./examples/custom-theme.html) - Custom theme example
- [Cloudflare Worker Proxy](./examples/cloudflare-worker/) - Proxy server example

## Documentation

- [Getting Started](./docs/getting-started.md) - Detailed setup guide
- [Configuration](./docs/configuration.md) - All configuration options
- [Theming](./docs/theming.md) - Theme customization guide
- [API Reference](./docs/api-reference.md) - Complete API documentation
- [Cloudflare Proxy Setup](./docs/cloudflare-proxy.md) - Proxy server setup

## Performance

- Bundle size: ~13KB gzipped (UMD), ~12KB gzipped (ESM)
- Time to interactive: <100ms after DOMContentLoaded
- Modal open latency: <300ms (cached), <1s (network)
- Efficient caching with minimal memory footprint

## Security

VerseTagger takes security seriously:

- **XSS Prevention**: All API responses are sanitized
- **CSP Compatible**: No inline scripts or eval()
- **API Key Protection**: Requires server-side proxy (keys never exposed client-side)
- **Safe HTML**: Whitelist-based sanitization for verse content

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Credits

- Verse content provided by [YouVersion](https://www.youversion.com/)
- Built with TypeScript and esbuild

## Support

- [Documentation](./docs/)
- [GitHub Issues](https://github.com/yourusername/versetagger/issues)
- [Examples](./examples/)

---

Made with care for the web development community.
