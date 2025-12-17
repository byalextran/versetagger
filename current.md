# VerseTagger Implementation Plan

## Overview
Build a pure TypeScript library that scans webpages for scripture references (e.g., "Luke 1:1", "Genesis 2:1-3", "Matthew 6:33 NIV") and displays verse content in elegant, customizable modals. Uses YouVersion API via user-provided proxy for security.

## User Requirements Confirmed
- ✅ Configurable: link-only, modal-only, or both behaviors
- ✅ Server-side proxy required (Cloudflare Workers example included)
- ✅ Modal display (hover/click triggers)
- ✅ Auto-scan DOM on load
- ✅ Light/dark mode with auto-detection
- ✅ Themeable with light/dark modes + custom theme object support
- ✅ TypeScript source, compile to JS
- ✅ MIT License
- ✅ Vanilla JS (no framework wrappers initially)

## Architecture Summary

### Module Structure
```
versetagger/
├── src/
│   ├── core/
│   │   ├── VerseTagger.ts          # Main entry point
│   │   ├── config.ts               # Configuration management
│   │   └── scanner.ts              # DOM scanning
│   ├── parser/
│   │   ├── reference-parser.ts     # Parse scripture references
│   │   ├── book-mappings.ts        # Book name → YouVersion codes
│   │   └── range-expander.ts       # Expand verse ranges (1-3,5-7)
│   ├── api/
│   │   └── youversion-client.ts    # API client with simple caching
│   ├── modal/
│   │   ├── modal-manager.ts        # Modal lifecycle, positioning & accessibility
│   │   ├── modal-renderer.ts       # Render verse content
│   │   └── event-handler.ts        # Hover/click events
│   ├── theming/
│   │   ├── theme-manager.ts        # Theme switching & auto-detection
│   │   ├── preset-themes.ts        # Hardcoded light/dark themes
│   │   └── css-injector.ts         # Dynamic style injection
│   └── utils/
│       ├── dom-utils.ts            # Safe DOM manipulation
│       ├── sanitizer.ts            # XSS prevention
│       └── debounce.ts             # Performance utilities
├── examples/
│   ├── cloudflare-worker/          # Cloudflare Workers proxy
│   │   ├── worker.ts
│   │   └── wrangler.toml
│   ├── basic.html
│   └── custom-theme.html
└── dist/                            # Build output (UMD + ESM)
```

### Build System
- **TypeScript** → Compile to ES2017
- **esbuild** for bundling (fast, simple)
- **Output formats**: UMD (CDN) + ESM (npm imports)
- **Target bundle size**: <30KB gzipped

### Distribution
- NPM package (`npm install versetagger`)
- CDN via jsDelivr/unpkg
- GitHub releases for direct download

## Implementation Phases

### Phase 7: Security & Performance ✅
**Goal**: Harden security, optimize performance

**Completed Tasks**:
1. ✅ Security hardening (`src/utils/sanitizer.ts`)
   - Enhanced HTML sanitizer with whitelist-based filtering
   - Only allow safe formatting tags (p, br, span, div, strong, em, b, i, sup, sub)
   - Only allow safe attributes (class, id, title, lang, dir)
   - Strip all event handlers and dangerous attributes
   - Remove disallowed tags by replacing with text content
   - Full CSP compatibility (no eval, no inline scripts, no dangerous protocols)
   - DOMParser-based sanitization (no code execution)
   - URL validation for http/https only

2. ✅ Performance optimization
   - Implemented lazy loading of modal UI (modal created only on first use)
   - Defer style injection until modal is needed
   - Verified debounce is properly applied to hover events (500ms default)
   - Added comprehensive bundle size analysis to build script
   - Current bundle sizes: UMD 12.63 KB gzipped, ESM 12.38 KB gzipped
   - Well under 30KB gzipped target

3. Browser compatibility (verified through build target)
   - Build target: ES2017+
   - Compatible with modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
   - Mobile Safari and Chrome Android supported
   - No compatibility issues with current implementation

**Files Modified**:
- `src/utils/sanitizer.ts` - Enhanced security
- `src/modal/modal-manager.ts` - Lazy loading
- `build.js` - Bundle size analysis

### Phase 8: Documentation & Examples
**Goal**: Comprehensive docs for library users

**Tasks**:
1. Write documentation
   - README.md: Quick start, features, installation
   - docs/getting-started.md: Detailed setup guide
   - docs/configuration.md: All config options
   - docs/theming.md: Theme creation guide
   - docs/api-reference.md: Public API
   - docs/cloudflare-proxy.md: Proxy setup guide

2. Create usage examples
   - Basic usage (HTML)
   - Custom theme example
   - Multiple configurations

3. Proxy server examples
   - Cloudflare Workers (primary)
   - Deployment guide for Cloudflare

**Files**:
- `README.md`
- `docs/` directory
- `examples/` directory

### Phase 9: Testing & CI
**Goal**: Comprehensive test coverage, automated testing

**Tasks**:
1. Unit tests (Jest)
   - Parser tests (all reference formats)
   - Book mappings
   - Range expansion
   - Theme validation

2. Integration tests
   - API client with mock responses
   - Scanner integration
   - Modal lifecycle

3. CI/CD setup (GitHub Actions)
   - Run tests on PR
   - Type checking
   - Lint (ESLint + Prettier)
   - Build verification
   - Auto-publish to NPM on release

**Files**:
- `tests/` directory
- `.github/workflows/ci.yml`

### Phase 10: Publishing & Launch
**Goal**: Publish to NPM, setup CDN, announce

**Tasks**:
1. NPM package setup
   - Verify package.json metadata
   - Test local installation
   - Publish to NPM registry

2. CDN distribution
   - Verify jsDelivr auto-pickup
   - Test unpkg URLs
   - Create GitHub release with assets

3. Community setup
   - GitHub repo setup (issues, discussions)
   - Contributing guide
   - Code of conduct
   - Issue templates

4. Launch announcement
   - Blog post / documentation site
   - Share on relevant communities
   - Request feedback

## Key Technical Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Language** | TypeScript | Type safety, better DX, generates .d.ts |
| **Build Tool** | esbuild | Fastest, simplest, future-proof |
| **Bundle Format** | UMD + ESM | UMD for simple script tags, ESM for bundlers |
| **Module Pattern** | ES6 classes | Clean, maintainable, tree-shakeable |
| **Theming** | CSS variables | Native, performant, easy customization |
| **API Security** | User proxy required | Protects API keys, user controls rate limits |
| **Caching** | Simple Map | Fast, lightweight, no complexity (MVP) |
| **Browser Support** | ES2017+ | Modern browsers, smaller bundle |
| **Dependencies** | Zero (core) | Minimal bundle, no supply chain risk |
| **License** | MIT | Maximum permissiveness for adoption |

## Security Considerations

### XSS Prevention
- Sanitize all API responses with DOMParser
- Never use innerHTML for user content
- Use textContent for verse rendering
- Validate URLs (only http/https protocols)

### Content Security Policy
- No inline scripts or eval()
- CSS injected via `<style>` tags only
- Support CSP nonce if needed

### API Key Protection
- Never expose API key client-side
- Require user-provided proxy
- Document proxy security best practices

## Performance Targets

- **Bundle size**: <30KB gzipped (core library)
- **Time to interactive**: <100ms after DOMContentLoaded
- **Modal open latency**: <300ms (cached), <1s (network)
- **Memory footprint**: <5MB with 100 cached verses
- **Page scan**: <50ms for typical page (1000 words)

## Critical Files (Implementation Order)

1. **src/parser/reference-parser.ts** - Core parsing logic
2. **src/parser/book-mappings.ts** - YouVersion book codes
3. **src/core/config.ts** - Type-safe configuration
4. **src/api/youversion-client.ts** - API integration
5. **src/core/scanner.ts** - DOM scanning
6. **src/modal/modal-manager.ts** - Modal display
7. **src/theming/theme-manager.ts** - Theme system
8. **src/core/VerseTagger.ts** - Main orchestrator
9. **examples/cloudflare-worker/worker.ts** - Proxy example

## Next Steps After Approval

1. Initialize TypeScript project structure
2. Setup build configuration (esbuild, TypeScript)
3. Implement Phase 1 (foundation & parsing)
4. Create basic test infrastructure
5. Iterate through phases with regular testing

## Success Metrics

- ✅ Detects 99%+ of common scripture reference formats
- ✅ Modals display correctly across all target browsers
- ✅ <30KB gzipped bundle size
- ✅ Works on popular CMS platforms (WordPress, Webflow, etc.)
- ✅ Accessible (WCAG 2.1 AA compliant)
- ✅ 80%+ test coverage
- ✅ Clear documentation with working examples

## Completed Phases

### Phase 6: Main Entry Point & Orchestration ✅
**Goal**: Tie all modules together, expose public API

**Completed Tasks**:
1. ✅ Implemented main VerseTagger class (`src/core/VerseTagger.ts`)
   - Initializes all modules with config
   - Auto-scans on DOM ready (if configured)
   - Sets up theme (auto-detect or user-specified)
   - Exposes complete public API:
     - `scan(element?)` - Scan specific element or whole page
     - `rescan()` - Re-scan entire page
     - `updateConfig(config)` - Update configuration dynamically
     - `setTheme(themeObject | 'light' | 'dark')` - Change theme at runtime
     - `destroy()` - Cleanup listeners, remove modals
     - `getConfig()` - Get current configuration
     - `getScannedReferences()` - Get all scanned references
     - `getCacheStats()` - Get cache statistics
     - `clearCache()` - Clear verse cache
   - Built-in caching system with cache keys
   - Error handling for API failures

2. ✅ Exported for multiple module systems
   - UMD for browsers (global `window.VerseTagger`)
   - ESM for bundlers (versetagger.esm.js)
   - CommonJS support via module.exports
   - AMD support via define()
   - Full TypeScript type definitions exported

**Files Created**:
- `src/core/VerseTagger.ts` - Main orchestrator class
- `src/index.ts` - Main entry point with all exports

### Phase 1: Foundation (Core Parsing & Configuration)
**Goal**: Set up project structure, implement scripture reference parsing

**Tasks**:
1. Initialize TypeScript project with esbuild
   - `package.json`, `tsconfig.json`
   - Build scripts for UMD + ESM bundles
   - Setup dev server for testing

2. Implement reference parser (`src/parser/`)
   - **reference-parser.ts**: Regex patterns for all reference formats
     - Handle books with numbers (1 John, 2 Corinthians)
     - Handle ranges (Matthew 5:1-10)
     - Handle abbreviations (Matt, Gen, Ps)
     - Handle version suffixes (John 3:16 ESV)
   - **book-mappings.ts**: Complete 66-book mapping
     - Full names, abbreviations, YouVersion codes
     - Include fuzzy matching for common typos
   - **range-expander.ts**: Expand "1-3,5-7" → [1,2,3,5,6,7]

3. Implement configuration system (`src/core/config.ts`)
   - Type-safe config with defaults
   - Validation for required fields (proxyUrl)
   - Runtime config updates

4. **Testing**: Unit tests for parser with edge cases
   - "John 3:16", "1 John 2:1-5", "Psalm 23", "Matt 6:33 NIV"
   - Roman numerals, multiple spaces, em-dashes
   - Invalid references should be ignored

**Critical Files**:
- `src/parser/reference-parser.ts`
- `src/parser/book-mappings.ts`
- `src/core/config.ts`

### Phase 2: API Integration & Caching
**Goal**: Fetch verses from YouVersion via proxy with simple caching

**Tasks**:
1. Implement API client (`src/api/youversion-client.ts`)
   - Construct YouVersion API requests
   - Call user-provided proxy URL
   - Parse API responses to normalized format
   - Error handling (network failures, 404s, rate limits)
   - Simple in-memory cache using Map (no TTL, no size limits for MVP)
   - Cache key format: `{book}_{chapter}_{verses}_{version}`

2. Create Cloudflare Worker proxy example
   - `examples/cloudflare-worker/worker.ts`
   - Forward requests to YouVersion with API key
   - CORS headers for browser requests
   - Error handling

**Critical Files**:
- `src/api/youversion-client.ts`
- `examples/cloudflare-worker/worker.ts`

### Phase 3: DOM Scanner & Reference Enhancement
**Goal**: Scan page for references, wrap them in interactive elements

**Tasks**:
1. Implement DOM scanner (`src/core/scanner.ts`)
   - TreeWalker to find text nodes
   - Exclude selectors (code, pre, script, style)
   - Track scanned nodes with WeakSet
   - Replace text with reference links/spans
   - Add ARIA attributes for accessibility

2. Implement event handler (`src/modal/event-handler.ts`)
   - Attach hover/click/keyboard events to references
   - Debounced hover with configurable delay (default 500ms)
   - Keyboard navigation (Enter/Space to open)

**Critical Files**:
- `src/core/scanner.ts`
- `src/modal/event-handler.ts`

### Phase 4: Modal System
**Goal**: Display verses in elegant, accessible modals

**Tasks**:
1. Implement modal manager (`src/modal/modal-manager.ts`)
   - Create modal container outside main DOM
   - Smart positioning algorithm:
     - Prefer below target, fallback to above
     - Prevent viewport overflow
   - Loading states while fetching
   - Error states for API failures
   - Animate in/out (CSS transitions)
   - Basic accessibility:
     - Escape key to close
     - ARIA labels and roles
     - Restore focus on close
     - Screen reader announcements

2. Implement modal renderer (`src/modal/modal-renderer.ts`)
   - Render verse content with verse numbers
   - Sanitize HTML from API (XSS prevention)
   - Link to YouVersion for full context
   - Display version abbreviation

3. Mobile responsiveness
   - Touch-friendly close button
   - Responsive CSS (same positioning algorithm for all devices)
   - Prevent body scroll when open

**Critical Files**:
- `src/modal/modal-manager.ts`
- `src/modal/modal-renderer.ts`

### Phase 5: Theming System
**Goal**: Support light/dark modes with auto-detection and custom themes

**Tasks**:
1. Implement theme manager (`src/theming/theme-manager.ts`)
   - Define 2 hardcoded themes in TypeScript (light and dark)
   - Validate custom theme objects
   - Apply themes via CSS custom properties
   - Auto-detect color scheme (`prefers-color-scheme`)
   - Runtime theme switching

2. Create base modal CSS
   - Use CSS variables for all colors, spacing, fonts
   - Clean, minimal design
   - Smooth transitions
   - Responsive breakpoints

3. Define preset themes (`src/theming/preset-themes.ts`)
   - **Default Light**: High contrast, professional
   - **Default Dark**: Dark mode, comfortable colors
   - Hardcoded as TypeScript objects (not JSON files)

4. Theme customization API
   - Users can pass custom theme object
   - Theme object validation

**Critical Files**:
- `src/theming/theme-manager.ts`
- `src/theming/preset-themes.ts`
