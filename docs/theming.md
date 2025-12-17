# Theming Guide

VerseTagger includes beautiful, accessible themes and supports full customization to match your website's design.

## Built-in Themes

VerseTagger includes two professionally designed themes:

### Light Theme (Default)

Clean, high-contrast theme suitable for most websites.

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  colorScheme: 'light'
});
```

### Dark Theme

Comfortable dark mode with reduced eye strain.

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  colorScheme: 'dark'
});
```

### Auto Theme (Recommended)

Automatically adapts to user's system preference using `prefers-color-scheme` media query.

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  colorScheme: 'auto'  // Default
});
```

## Changing Themes at Runtime

You can change themes dynamically after initialization:

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev'
});

// Switch to dark theme
versetagger.setTheme('dark');

// Switch to light theme
versetagger.setTheme('light');
```

### Theme Toggle Example

```html
<button id="theme-toggle">Toggle Dark Mode</button>

<script>
  const versetagger = new VerseTagger({
    proxyUrl: 'https://my-proxy.workers.dev',
    colorScheme: 'light'
  });

  let isDark = false;
  document.querySelector('#theme-toggle').addEventListener('click', () => {
    isDark = !isDark;
    versetagger.setTheme(isDark ? 'dark' : 'light');
  });
</script>
```

### Sync with Site Theme

```javascript
// Listen for your site's theme changes
document.addEventListener('theme-changed', (event) => {
  versetagger.setTheme(event.detail.theme);
});

// Or use a media query listener
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addEventListener('change', (e) => {
  versetagger.setTheme(e.matches ? 'dark' : 'light');
});
```

## Custom Themes

Create a custom theme by providing a theme object with colors, spacing, and fonts.

### Theme Object Structure

```typescript
interface Theme {
  name: string;
  colors: {
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
  };
  spacing: {
    modalPadding: string;
    modalBorderRadius: string;
    modalMaxWidth: string;
    versePadding: string;
    verseGap: string;
  };
  fonts: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    verseNumberSize: string;
  };
}
```

### Basic Custom Theme

You don't need to provide all properties - only override what you want to change:

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  theme: {
    colors: {
      modalBackground: '#f8f9fa',
      textPrimary: '#212529',
      linkColor: '#0066cc'
    }
  }
});
```

### Complete Custom Theme Example

```javascript
const customTheme = {
  name: 'custom',
  colors: {
    // Modal container
    modalBackground: '#ffffff',
    modalBorder: '#e5e7eb',
    modalShadow: 'rgba(0, 0, 0, 0.15)',

    // Text colors
    textPrimary: '#1a1a1a',
    textSecondary: '#4a4a4a',
    textMuted: '#888888',

    // Interactive elements
    linkColor: '#0066cc',
    linkHoverColor: '#0052a3',

    // Verse numbers
    verseNumberColor: '#999999',

    // Loading/error states
    loadingColor: '#666666',
    errorBackground: '#fff5f5',
    errorText: '#c53030',

    // Close button
    closeButtonColor: '#666666',
    closeButtonHoverColor: '#1a1a1a',
    closeButtonBackground: 'transparent',
    closeButtonHoverBackground: '#f0f0f0',
  },
  spacing: {
    modalPadding: '20px',
    modalBorderRadius: '12px',
    modalMaxWidth: '450px',
    versePadding: '10px 0',
    verseGap: '8px',
  },
  fonts: {
    fontFamily: 'Georgia, serif',
    fontSize: '16px',
    lineHeight: '1.7',
    verseNumberSize: '13px',
  }
};

const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  theme: customTheme
});
```

## Theme Examples

### Minimal Theme

```javascript
{
  theme: {
    colors: {
      modalBackground: '#ffffff',
      textPrimary: '#000000',
      linkColor: '#0000ee'
    },
    spacing: {
      modalPadding: '12px',
      modalBorderRadius: '4px'
    },
    fonts: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px'
    }
  }
}
```

### High Contrast Theme

```javascript
{
  theme: {
    colors: {
      modalBackground: '#000000',
      modalBorder: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#ffffff',
      linkColor: '#ffff00',
      linkHoverColor: '#ffff99',
      closeButtonColor: '#ffffff',
      closeButtonHoverBackground: '#333333'
    }
  }
}
```

### Warm Theme

```javascript
{
  theme: {
    colors: {
      modalBackground: '#fef3e2',
      modalBorder: '#e8d4b0',
      textPrimary: '#3d2817',
      textSecondary: '#5c4028',
      linkColor: '#b8651b',
      linkHoverColor: '#8f4e15',
      verseNumberColor: '#a89580'
    },
    fonts: {
      fontFamily: 'Merriweather, Georgia, serif',
      fontSize: '15px',
      lineHeight: '1.8'
    }
  }
}
```

### Cool/Blue Theme

```javascript
{
  theme: {
    colors: {
      modalBackground: '#e3f2fd',
      modalBorder: '#90caf9',
      textPrimary: '#0d47a1',
      textSecondary: '#1565c0',
      linkColor: '#1976d2',
      linkHoverColor: '#0d47a1',
      verseNumberColor: '#64b5f6'
    }
  }
}
```

### Sepia/Reading Theme

```javascript
{
  theme: {
    colors: {
      modalBackground: '#f4ecd8',
      modalBorder: '#d9c7a8',
      textPrimary: '#3b2f1f',
      textSecondary: '#5c4a36',
      linkColor: '#7d5a2c',
      verseNumberColor: '#9a8061'
    },
    fonts: {
      fontFamily: 'Charter, Georgia, serif',
      fontSize: '17px',
      lineHeight: '1.9'
    }
  }
}
```

## Responsive Theming

VerseTagger modals are responsive by default. You can customize spacing for different screen sizes:

```javascript
{
  theme: {
    spacing: {
      // On mobile, these will automatically adjust
      modalPadding: '16px',
      modalMaxWidth: '400px'  // Will be '95vw' on mobile
    }
  }
}
```

The modal system automatically:
- Uses `95vw` max width on mobile (overrides `modalMaxWidth`)
- Adjusts positioning to stay within viewport
- Ensures touch-friendly close button

## CSS Variables

VerseTagger applies themes using CSS custom properties. You can also override these in your own CSS:

```css
:root {
  --vt-modal-background: #ffffff;
  --vt-modal-border: #e5e7eb;
  --vt-text-primary: #111827;
  --vt-link-color: #2563eb;
  /* ... and more */
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --vt-modal-background: #1f2937;
    --vt-text-primary: #f9fafb;
  }
}
```

### Available CSS Variables

VerseTagger creates these CSS variables:

```css
/* Colors */
--vt-modal-background
--vt-modal-border
--vt-modal-shadow
--vt-text-primary
--vt-text-secondary
--vt-text-muted
--vt-link-color
--vt-link-hover-color
--vt-verse-number-color
--vt-loading-color
--vt-error-background
--vt-error-text
--vt-close-button-color
--vt-close-button-hover-color
--vt-close-button-background
--vt-close-button-hover-background

/* Spacing */
--vt-modal-padding
--vt-modal-border-radius
--vt-modal-max-width
--vt-verse-padding
--vt-verse-gap

/* Fonts */
--vt-font-family
--vt-font-size
--vt-line-height
--vt-verse-number-size
```

## Additional Styling

You can add extra CSS to further customize the modal appearance:

```css
/* Target the modal container */
.versetagger-modal {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
}

/* Target verse text */
.versetagger-modal .verse-text {
  font-style: italic;
}

/* Target verse numbers */
.versetagger-modal .verse-number {
  font-weight: bold;
}

/* Target the reference link */
.versetagger-modal .verse-reference-link {
  font-size: 12px;
  text-transform: uppercase;
}

/* Add animations */
.versetagger-modal {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Styling Tagged References

Customize how scripture references appear in your content:

```css
/* Default class */
.verse-reference {
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
}

.verse-reference:hover {
  color: #0052a3;
  text-decoration: none;
}

/* Or use a custom class */
```

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  referenceClass: 'bible-verse'
});
```

```css
.bible-verse {
  background: linear-gradient(transparent 60%, #ffeb3b 60%);
  font-weight: 500;
  cursor: help;
}
```

## Theme Best Practices

### Accessibility

Ensure sufficient color contrast:

- Text on background: at least 4.5:1 ratio (WCAG AA)
- Large text (18px+): at least 3:1 ratio
- Interactive elements: clear hover states

```javascript
{
  theme: {
    colors: {
      // Good contrast
      modalBackground: '#ffffff',
      textPrimary: '#1a1a1a',  // 15:1 ratio

      // Clear hover states
      linkColor: '#0066cc',
      linkHoverColor: '#0052a3'
    }
  }
}
```

### Readability

Choose readable fonts and spacing:

```javascript
{
  theme: {
    fonts: {
      fontFamily: 'system-ui, -apple-system, sans-serif',  // Native fonts
      fontSize: '15px',      // Minimum 14px recommended
      lineHeight: '1.6'      // 1.5-1.8 is ideal for reading
    },
    spacing: {
      modalPadding: '16px',  // Adequate breathing room
      verseGap: '4px'        // Space between verses
    }
  }
}
```

### Performance

Use simple colors to minimize CSS complexity:

```javascript
// Good - simple colors
{
  colors: {
    modalBackground: '#ffffff',
    modalShadow: 'rgba(0, 0, 0, 0.1)'
  }
}

// Avoid - complex gradients or multiple shadows
{
  colors: {
    modalBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    modalShadow: '0 0 10px #000, 0 0 20px #000, 0 0 30px #000'
  }
}
```

## TypeScript Support

Full type definitions are included for themes:

```typescript
import { type Theme } from 'versetagger';

const myTheme: Partial<Theme> = {
  colors: {
    modalBackground: '#ffffff',
    textPrimary: '#000000'
  }
};

const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  theme: myTheme
});
```

## Debugging Themes

Enable debug mode to see theme application:

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  debug: true,
  theme: myCustomTheme
});
```

Inspect the modal in DevTools to see applied CSS variables:

```javascript
// In browser console
const modal = document.querySelector('.versetagger-modal');
console.log(getComputedStyle(modal).getPropertyValue('--vt-modal-background'));
```

## Example: Matching Your Site's Theme

```javascript
// Read CSS variables from your site
const rootStyles = getComputedStyle(document.documentElement);

const versetagger = new VerseTagger({
  proxyUrl: 'https://my-proxy.workers.dev',
  theme: {
    colors: {
      modalBackground: rootStyles.getPropertyValue('--background-color'),
      textPrimary: rootStyles.getPropertyValue('--text-color'),
      linkColor: rootStyles.getPropertyValue('--link-color')
    },
    fonts: {
      fontFamily: rootStyles.getPropertyValue('--font-family'),
      fontSize: rootStyles.getPropertyValue('--font-size')
    }
  }
});
```

## Next Steps

- [Configuration Guide](./configuration.md) - All config options
- [API Reference](./api-reference.md) - Runtime theme changes
- [Examples](../examples/custom-theme.html) - See custom themes in action
