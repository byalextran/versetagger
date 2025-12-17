/**
 * DOM Scanner
 * Scans the DOM for scripture references and wraps them in interactive elements
 */

import type { VersetaggerConfig } from './config';
import { parseReferences, type ScriptureReference } from '../parser/reference-parser';

export interface ScannedReference extends ScriptureReference {
  /** The DOM element wrapping the reference */
  element: HTMLElement;
}

/**
 * Scanner class for finding and tagging scripture references in the DOM
 */
export class DOMScanner {
  private config: Required<VersetaggerConfig>;
  private scannedNodes: WeakSet<Node>;

  constructor(config: Required<VersetaggerConfig>) {
    this.config = config;
    this.scannedNodes = new WeakSet();
  }

  /**
   * Scan a specific element or the entire document
   * Returns an array of scanned references with their DOM elements
   */
  scan(rootElement: HTMLElement | Document = document): ScannedReference[] {
    const references: ScannedReference[] = [];
    const root = rootElement === document ? document.body : rootElement;

    if (!root) {
      if (this.config.debug) {
        console.warn('VerseTagger: No root element found for scanning');
      }
      return references;
    }

    // Use TreeWalker to find all text nodes
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => this.shouldScanNode(node)
      }
    );

    const textNodesToProcess: Text[] = [];
    let currentNode: Node | null;

    // Collect all text nodes first to avoid DOM modification during traversal
    while ((currentNode = walker.nextNode())) {
      textNodesToProcess.push(currentNode as Text);
    }

    // Process each text node
    for (const textNode of textNodesToProcess) {
      const scanned = this.processTextNode(textNode);
      references.push(...scanned);
    }

    if (this.config.debug) {
      console.log(`VerseTagger: Found ${references.length} references`);
    }

    return references;
  }

  /**
   * Determine if a node should be scanned
   */
  private shouldScanNode(node: Node): number {
    // Skip if already scanned
    if (this.scannedNodes.has(node)) {
      return NodeFilter.FILTER_REJECT;
    }

    // Skip if the text is empty or only whitespace
    if (!node.textContent || node.textContent.trim().length === 0) {
      return NodeFilter.FILTER_REJECT;
    }

    // Check if parent matches exclude selectors
    const parent = node.parentElement;
    if (!parent) {
      return NodeFilter.FILTER_REJECT;
    }

    // Parse exclude selectors and check
    if (this.config.excludeSelectors) {
      try {
        if (parent.matches(this.config.excludeSelectors)) {
          return NodeFilter.FILTER_REJECT;
        }
        // Also check if any ancestor matches
        if (parent.closest(this.config.excludeSelectors)) {
          return NodeFilter.FILTER_REJECT;
        }
      } catch (e) {
        if (this.config.debug) {
          console.warn('VerseTagger: Invalid excludeSelectors', e);
        }
      }
    }

    // Skip if already inside a verse reference element
    if (parent.closest(`.${this.config.referenceClass}`)) {
      return NodeFilter.FILTER_REJECT;
    }

    return NodeFilter.FILTER_ACCEPT;
  }

  /**
   * Process a single text node and wrap any references found
   */
  private processTextNode(textNode: Text): ScannedReference[] {
    const text = textNode.textContent || '';
    const references = parseReferences(text);

    if (references.length === 0) {
      // Mark as scanned even if no references found
      this.scannedNodes.add(textNode);
      return [];
    }

    const scannedRefs: ScannedReference[] = [];
    const parent = textNode.parentNode;

    if (!parent) {
      return [];
    }

    // Process references in reverse order to maintain correct indices
    const sortedRefs = [...references].sort((a, b) => b.startIndex - a.startIndex);

    for (const ref of sortedRefs) {
      const beforeText = text.substring(0, ref.startIndex);
      const refText = text.substring(ref.startIndex, ref.endIndex);
      const afterText = text.substring(ref.endIndex);

      // Create the wrapper element for the reference
      const element = this.createReferenceElement(ref);

      // Split the text node and insert the wrapper
      if (ref.startIndex === 0) {
        // Reference is at the start
        const afterNode = document.createTextNode(afterText);
        parent.insertBefore(element, textNode);
        parent.insertBefore(afterNode, textNode);
        parent.removeChild(textNode);

        // Mark new nodes as scanned
        this.scannedNodes.add(afterNode);
      } else if (ref.endIndex === text.length) {
        // Reference is at the end
        const beforeNode = document.createTextNode(beforeText);
        parent.insertBefore(beforeNode, textNode);
        parent.insertBefore(element, textNode);
        parent.removeChild(textNode);

        // Mark new nodes as scanned
        this.scannedNodes.add(beforeNode);
      } else {
        // Reference is in the middle
        const beforeNode = document.createTextNode(beforeText);
        const afterNode = document.createTextNode(afterText);
        parent.insertBefore(beforeNode, textNode);
        parent.insertBefore(element, textNode);
        parent.insertBefore(afterNode, textNode);
        parent.removeChild(textNode);

        // Mark new nodes as scanned
        this.scannedNodes.add(beforeNode);
        this.scannedNodes.add(afterNode);
      }

      scannedRefs.push({
        ...ref,
        element
      });
    }

    // Mark the wrapper elements as scanned
    scannedRefs.forEach(ref => this.scannedNodes.add(ref.element));

    return scannedRefs;
  }

  /**
   * Create a wrapper element for a scripture reference
   */
  private createReferenceElement(ref: ScriptureReference): HTMLElement {
    const behavior = this.config.behavior;
    const shouldBeLink = behavior === 'link-only' || behavior === 'both';
    const shouldShowModal = behavior === 'modal-only' || behavior === 'both';

    // Create element (link or span based on behavior)
    const element = document.createElement(shouldBeLink ? 'a' : 'span') as HTMLElement;

    // Set the text content
    element.textContent = ref.text;

    // Add CSS class
    element.className = this.config.referenceClass;

    // Store reference data as data attributes for event handlers
    element.dataset.book = ref.book;
    element.dataset.chapter = ref.chapter.toString();
    element.dataset.verses = ref.verses.join(',');
    if (ref.version) {
      element.dataset.version = ref.version;
    }

    // If it's a link, set href
    if (shouldBeLink && element instanceof HTMLAnchorElement) {
      element.href = this.buildReferenceUrl(ref);
      if (this.config.openLinksInNewTab) {
        element.target = '_blank';
        element.rel = 'noopener noreferrer';
      }
    }

    // Add ARIA attributes for accessibility
    if (shouldShowModal) {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
      element.setAttribute('aria-label', `Show verse: ${ref.text}`);

      if (this.config.accessibility.keyboardNav) {
        element.setAttribute('aria-haspopup', 'dialog');
      }
    }

    // Add data attribute to indicate modal support
    if (shouldShowModal) {
      element.dataset.hasModal = 'true';
    }

    return element;
  }

  /**
   * Build a URL for a scripture reference
   */
  private buildReferenceUrl(ref: ScriptureReference): string {
    const version = ref.version || this.config.defaultVersion;
    const versesStr = ref.verses.length > 0
      ? ref.verses.join(',')
      : '';

    return this.config.linkFormat
      .replace('{book}', ref.book)
      .replace('{chapter}', ref.chapter.toString())
      .replace('{verses}', versesStr)
      .replace('{version}', version);
  }

  /**
   * Clear the scanned nodes cache
   * Useful when re-scanning the same content
   */
  clearCache(): void {
    this.scannedNodes = new WeakSet();
  }
}
