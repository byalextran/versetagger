/**
 * HTML Sanitizer
 * XSS prevention utilities for safe rendering of API content
 */

/**
 * Sanitize HTML content using DOMParser
 * Removes potentially dangerous elements and attributes
 */
export function sanitizeHtml(html: string): string {
  // Use DOMParser to parse HTML safely
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove all script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // Remove potentially dangerous elements
  const dangerousElements = doc.querySelectorAll(
    'iframe, object, embed, link, style, base, meta, form'
  );
  dangerousElements.forEach(el => el.remove());

  // Remove event handler attributes from all elements
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    // Remove all on* attributes (onclick, onerror, etc.)
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });

    // Remove dangerous attributes
    el.removeAttribute('formaction');
    el.removeAttribute('action');
    el.removeAttribute('data');
    el.removeAttribute('srcdoc');
  });

  // Validate and sanitize URLs in href and src attributes
  const elementsWithUrls = doc.querySelectorAll('[href], [src]');
  elementsWithUrls.forEach(el => {
    const href = el.getAttribute('href');
    const src = el.getAttribute('src');

    if (href && !isValidUrl(href)) {
      el.removeAttribute('href');
    }

    if (src && !isValidUrl(src)) {
      el.removeAttribute('src');
    }
  });

  return doc.body.innerHTML;
}

/**
 * Validate URL to prevent javascript: and data: URIs
 */
function isValidUrl(url: string): boolean {
  // Remove whitespace and convert to lowercase for checking
  const normalized = url.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (dangerousProtocols.some(protocol => normalized.startsWith(protocol))) {
    return false;
  }

  // Allow http, https, mailto, and relative URLs
  if (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('mailto:') ||
    normalized.startsWith('//') ||
    normalized.startsWith('/') ||
    normalized.startsWith('#')
  ) {
    return true;
  }

  // If it doesn't have a protocol, it's a relative URL - allow it
  if (!normalized.includes(':')) {
    return true;
  }

  // Block everything else
  return false;
}

/**
 * Escape HTML special characters
 * Use this for rendering user-provided text content
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Create a safe text node
 * Safest way to add user content to the DOM
 */
export function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

/**
 * Sanitize URL for use in href/src attributes
 */
export function sanitizeUrl(url: string): string {
  if (!isValidUrl(url)) {
    return '#';
  }
  return url;
}

/**
 * Create a safe link element
 */
export function createSafeLink(
  text: string,
  href: string,
  options?: {
    className?: string;
    target?: string;
    rel?: string;
  }
): HTMLAnchorElement {
  const link = document.createElement('a');
  link.textContent = text; // Use textContent for safety
  link.href = sanitizeUrl(href);

  if (options?.className) {
    link.className = options.className;
  }

  if (options?.target) {
    link.target = options.target;
    // Always add rel="noopener noreferrer" for external links
    if (options.target === '_blank') {
      link.rel = 'noopener noreferrer';
    }
  }

  if (options?.rel) {
    link.rel = options.rel;
  }

  return link;
}
