# VerseTagger

VerseTagger is a TypeScript library that detects scripture references on a webpage and turns them into interactive links. No need to manually link them yourself. 

[View Demo](./demo.html)

## Features

- **Automatic Detection**: Scans your page for scripture references like John 3:16, Gen 1:1-3, or Psalm 23:1 NIV
- **Elegant Modals**: Displays verse content in simple, elegant modals on hover
- **Light & Dark Themes**: Built-in themes with automatic system preference detection
- **Themeable**: Customize the look and feel of the modal to fit your site design
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Zero Dependencies**: No external dependencies in the core library
- **TypeScript**: Full TypeScript support with type definitions included
- **Flexible Integration**: Works with any website or framework

## Quick Start

Add this right before the `</body>` tag of any page you want VerseTagger to process. 

```html
<script src="https://cdn.jsdelivr.net/npm/versetagger@latest/dist/versetagger.js"></script>
<script>
  // use default options
  const versetagger = new VerseTagger({});
</script>
```

Once the page loads, any scripture references should automatically be tagged. 

## Configuration

Below are all supported options with their default values. Specify only the values you want to override. 

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

Below are all supported options with their default values. Specify only the values you want to override. 

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

## Cloudflare Worker Proxy

By default this script uses a proxy at `https://versetagger.alextran.org` to protect my YouVersion API key from misuse. 

If you'd like to use your own proxy and YouVersion API key, follow the instructions below. 

### Prerequisites

1. **Cloudflare Account (free)**: Sign up at [Cloudflare Workers](https://workers.cloudflare.com/)
2. **YouVersion API Key (free)**: Register as a [YouVersion Platform](https://platform.youversion.com/) Developer and create an application
3. **Wrangler CLI**: Install globally with `npm install -g wrangler`

### Setup Instructions

#### 1. Clone this repo

```bash
git clone https://github.com/byalextran/versetagger.git
cd versetagger
```

#### 2. Authenticate with Cloudflare

```bash
wrangler login
# Follow the link/instructions to authenticate
```

#### 3. Deploy the worker to production

```bash
wrangler deploy
```

#### 4. Set your YouVersion API key

```bash
wrangler secret put YOUVERSION_API_KEY
# Enter your API key when prompted
```

#### 5. Test the deployment

After deployment, you'll get a URL like: `https://versetagger-proxy.your-subdomain.workers.dev`.

Visit that URL and you should see output similar to this:

```json
{"error":"Missing required parameters: book, chapter, and verses are required"}
```
