# Getting Started with VerseTagger

This guide will walk you through setting up VerseTagger on your website, from installation to your first interactive scripture references.

## Prerequisites

Before you begin, you'll need:

1. A website where you want to add scripture reference functionality
2. A YouVersion API key (get one at [developers.youversion.com](https://developers.youversion.com/))
3. A proxy server to securely handle API requests (we'll set this up below)

## Installation

VerseTagger can be installed via npm or loaded directly from a CDN.

### Option 1: NPM Installation (Recommended for Bundlers)

If you're using a module bundler like Webpack, Vite, or Rollup:

```bash
npm install versetagger
```

Then import it in your JavaScript:

```javascript
import VerseTagger from 'versetagger';

const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev'
});
```

### Option 2: CDN Installation (Easiest for Static Sites)

Add this script tag to your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Welcome to My Blog</h1>
  <p>My favorite verse is John 3:16.</p>

  <!-- Load VerseTagger from CDN -->
  <script src="https://cdn.jsdelivr.net/npm/versetagger@latest/dist/versetagger.js"></script>

  <!-- Initialize VerseTagger -->
  <script>
    const versetagger = new VerseTagger({
      proxyUrl: 'https://your-proxy.workers.dev'
    });
  </script>
</body>
</html>
```

The library will be available globally as `VerseTagger`.

### Option 3: Download and Self-Host

1. Download the latest release from [GitHub Releases](https://github.com/yourusername/versetagger/releases)
2. Extract the `dist/versetagger.js` file
3. Upload it to your web server
4. Include it in your HTML:

```html
<script src="/path/to/versetagger.js"></script>
<script>
  const versetagger = new VerseTagger({
    proxyUrl: 'https://your-proxy.workers.dev'
  });
</script>
```

## Setting Up Your Proxy Server

VerseTagger requires a proxy server to communicate with the YouVersion API. This keeps your API key secure and prevents it from being exposed in client-side code.

### Quick Setup with Cloudflare Workers (Free)

The easiest way to set up a proxy is using Cloudflare Workers. We provide a ready-to-deploy example.

**Step 1: Install Wrangler CLI**

```bash
npm install -g wrangler
```

**Step 2: Copy the Example Worker**

```bash
# From your VerseTagger installation
cp -r node_modules/versetagger/examples/cloudflare-worker ./my-proxy
cd my-proxy
```

Or download from GitHub: [examples/cloudflare-worker](https://github.com/yourusername/versetagger/tree/main/examples/cloudflare-worker)

**Step 3: Deploy**

```bash
# Login to Cloudflare
wrangler login

# Set your API key as a secret
wrangler secret put YOUVERSION_API_KEY
# Paste your YouVersion API key when prompted

# Deploy the worker
wrangler deploy
```

You'll get a URL like: `https://my-proxy.your-subdomain.workers.dev`

**Step 4: Test It**

```bash
curl "https://my-proxy.your-subdomain.workers.dev?book=JHN&chapter=3&verses=16&version=NIV"
```

You should see JSON with verse content.

For detailed proxy setup instructions, see the [Cloudflare Proxy Setup Guide](./cloudflare-proxy.md).

## Basic Configuration

Now that you have a proxy URL, let's initialize VerseTagger with some basic configuration:

```javascript
const versetagger = new VerseTagger({
  // Required: Your proxy server URL
  proxyUrl: 'https://your-proxy.workers.dev',

  // Optional: Customize behavior
  colorScheme: 'auto',     // Auto-detect light/dark mode (default)
  defaultVersion: 'NIV',   // Default Bible translation (default)
  autoScan: true           // Automatically scan page on load (default)
});
```

That's it! VerseTagger will now automatically detect and enhance scripture references on your page.

## Your First Scripture References

VerseTagger automatically detects various scripture reference formats:

```html
<article>
  <h2>My Testimony</h2>

  <p>
    I was reminded of John 3:16 today. It reminded me of God's love
    shown in Romans 5:8 and the promise in Jeremiah 29:11.
  </p>

  <p>
    I also love reading Psalm 23:1-6, especially verses 1-3. The passage
    in Matthew 5:1-12 ESV is powerful too.
  </p>
</article>
```

VerseTagger will detect:
- Simple references: `John 3:16`, `Romans 5:8`
- Verse ranges: `Romans 8:28-30`, `Genesis 1:1-3`
- Multiple verses: `Psalm 23:1-6`, `Matthew 5:1-12`
- Version suffixes: `Matthew 6:33 NIV`, `John 1:1 ESV`
- Books with numbers: `1 John 2:1`, `2 Corinthians 5:17`
- Abbreviations: `Matt 5:5`, `Gen 1:1`, `Ps 119:105`

## Customizing Behavior

### Disable Auto-Scanning

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev',
  autoScan: false  // Don't scan automatically
});

// Scan manually when ready
document.addEventListener('DOMContentLoaded', () => {
  versetagger.scan();
});
```

### Exclude Certain Elements

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev',
  excludeSelectors: 'code, pre, .no-verses, #comments'
});
```

## Working with Dynamic Content

If you load content dynamically (AJAX, SPA, etc.), you can manually trigger scanning:

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev',
  autoScan: false
});

// Initial scan
versetagger.scan();

// After loading new content
function loadNewArticle(articleId) {
  fetch(`/api/articles/${articleId}`)
    .then(res => res.text())
    .then(html => {
      document.querySelector('#article').innerHTML = html;

      // Scan only the new content
      const article = document.querySelector('#article');
      versetagger.scan(article);
    });
}
```

### For Single Page Applications

```javascript
// React example
useEffect(() => {
  versetagger.scan(articleRef.current);
}, [articleContent]);

// Vue example
watch(articleContent, () => {
  versetagger.scan(this.$refs.article);
});

// Vanilla JS with router
router.on('route-change', () => {
  versetagger.rescan();  // Re-scan entire page
});
```

## Theming

VerseTagger includes built-in light and dark themes that automatically adapt to user preferences.

### Auto-Detect Theme

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev',
  colorScheme: 'auto'  // Respects system preference (default)
});
```

### Force Light or Dark Theme

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev',
  colorScheme: 'dark'  // Always use dark theme
});
```

### Change Theme at Runtime

```javascript
// Add a theme toggle button
document.querySelector('#theme-toggle').addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  versetagger.setTheme(isDark ? 'dark' : 'light');
});
```

For custom themes, see the [Theming Guide](./theming.md).

## Debugging

Enable debug logging to troubleshoot issues:

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://your-proxy.workers.dev',
  debug: true
});
```

This will log:
- Initialization details
- Scanned references
- API requests and responses
- Cache hits/misses
- Errors

## Common Issues

### No References Detected

**Problem**: VerseTagger isn't finding any scripture references.

**Solutions**:
- Check that your HTML contains valid scripture references
- Verify `autoScan` is enabled (default)
- Check that references aren't inside excluded elements (`code`, `pre`, etc.)
- Enable debug mode to see what's being scanned

### Modal Not Showing

**Problem**: References are highlighted but modal doesn't appear.

**Solutions**:
- Verify your proxy URL is correct and accessible
- Check browser console for CORS errors
- Test your proxy directly with curl
- Enable debug mode to see API requests

### CORS Errors

**Problem**: Browser shows CORS policy errors.

**Solutions**:
- Ensure your proxy includes CORS headers
- Check that the proxy URL matches exactly (trailing slash, protocol)
- Verify proxy is deployed and accessible

### Styling Conflicts

**Problem**: Modal looks broken or oddly styled.

**Solutions**:
- Check for CSS conflicts with existing styles
- Inspect modal in DevTools to see what styles are being applied
- Use a custom theme to override conflicting styles
- Add higher specificity to VerseTagger styles if needed

## Next Steps

Now that you have VerseTagger up and running, explore these guides:

- [Configuration Guide](./configuration.md) - All available configuration options
- [Theming Guide](./theming.md) - Customize the appearance
- [API Reference](./api-reference.md) - Complete API documentation
- [Cloudflare Proxy Guide](./cloudflare-proxy.md) - Advanced proxy setup

## Need Help?

- Check the [examples](../examples/) for working code samples
- Open an issue on [GitHub](https://github.com/yourusername/versetagger/issues)
- Read the [full documentation](./README.md)
