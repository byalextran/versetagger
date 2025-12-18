/**
 * DOM Scanner
 * Scans the DOM for scripture references and wraps them in interactive elements
 */

import type { VersetaggerConfig } from './config';
import { parseReferences, type ScriptureReference } from '../parser/reference-parser';
import { findVersion } from '../parser/bible-versions';

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
      if (this.config.debug) {
        const preview = (currentNode.textContent || '').substring(0, 50).replace(/\n/g, ' ');
        const parentTag = (currentNode.parentElement?.tagName || 'none').toLowerCase();
        console.log(`VerseTagger: [TreeWalker] Found text node in <${parentTag}>: "${preview}${preview.length >= 50 ? '...' : ''}"`);
      }
    }

    if (this.config.debug) {
      console.log(`VerseTagger: [TreeWalker] Collected ${textNodesToProcess.length} text nodes to process`);
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
    const debugPrefix = 'VerseTagger: [shouldScanNode]';

    // Skip if already scanned
    if (this.scannedNodes.has(node)) {
      if (this.config.debug) {
        console.log(`${debugPrefix} REJECT - Already scanned`);
      }
      return NodeFilter.FILTER_REJECT;
    }

    // Skip if the text is empty or only whitespace
    if (!node.textContent || node.textContent.trim().length === 0) {
      if (this.config.debug) {
        console.log(`${debugPrefix} REJECT - Empty or whitespace only`);
      }
      return NodeFilter.FILTER_REJECT;
    }

    // Check if parent matches exclude selectors
    const parent = node.parentElement;
    if (!parent) {
      if (this.config.debug) {
        console.log(`${debugPrefix} REJECT - No parent element`);
      }
      return NodeFilter.FILTER_REJECT;
    }

    // Parse exclude selectors and check
    if (this.config.excludeSelectors) {
      try {
        if (parent.matches(this.config.excludeSelectors)) {
          if (this.config.debug) {
            console.log(`${debugPrefix} REJECT - Parent matches excludeSelectors`);
          }
          return NodeFilter.FILTER_REJECT;
        }
        // Also check if any ancestor matches
        if (parent.closest(this.config.excludeSelectors)) {
          if (this.config.debug) {
            console.log(`${debugPrefix} REJECT - Ancestor matches excludeSelectors`);
          }
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
      if (this.config.debug) {
        console.log(`${debugPrefix} REJECT - Inside existing verse reference`);
      }
      return NodeFilter.FILTER_REJECT;
    }

    if (this.config.debug) {
      console.log(`${debugPrefix} ACCEPT`);
    }
    return NodeFilter.FILTER_ACCEPT;
  }

  /**
   * Process a single text node and wrap any references found
   */
  private processTextNode(textNode: Text): ScannedReference[] {
    const text = textNode.textContent || '';

    if (this.config.debug) {
      const preview = text.substring(0, 100).replace(/\n/g, ' ');
      console.log(`VerseTagger: [ProcessNode] Text: "${preview}${text.length > 100 ? '...' : ''}"`);
    }

    const references = parseReferences(text);

    if (this.config.debug) {
      console.log(`VerseTagger: [Regex] Found ${references.length} match(es)`);
      references.forEach((ref, idx) => {
        console.log(`VerseTagger: [Match ${idx + 1}] "${ref.text}" -> ${ref.book} ${ref.chapter}:${ref.verses.join(',')}${ref.version ? ' ' + ref.version : ''}`);
      });
    }

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

    if (this.config.debug) {
      console.log(`VerseTagger: [ProcessNode] Processing ${sortedRefs.length} references in reverse order`);
    }

    // Keep track of the current text node as we split it
    let currentTextNode: Text = textNode;
    let currentText = text;

    for (let i = 0; i < sortedRefs.length; i++) {
      const ref = sortedRefs[i];

      if (this.config.debug) {
        console.log(`VerseTagger: [ProcessNode] Processing reference ${i + 1}/${sortedRefs.length}: "${ref.text}" at index ${ref.startIndex}-${ref.endIndex}`);
      }

      const beforeText = currentText.substring(0, ref.startIndex);
      const refText = currentText.substring(ref.startIndex, ref.endIndex);
      const afterText = currentText.substring(ref.endIndex);

      // Create the wrapper element for the reference
      const element = this.createReferenceElement(ref);

      // Split the text node and insert the wrapper
      if (ref.startIndex === 0) {
        // Reference is at the start
        const afterNode = document.createTextNode(afterText);
        parent.insertBefore(element, currentTextNode);
        parent.insertBefore(afterNode, currentTextNode);
        parent.removeChild(currentTextNode);

        // Mark new nodes as scanned
        this.scannedNodes.add(afterNode);

        // Update current node for next iteration (if processing more refs)
        currentTextNode = afterNode;
        currentText = afterText;
      } else if (ref.endIndex === currentText.length) {
        // Reference is at the end
        const beforeNode = document.createTextNode(beforeText);
        parent.insertBefore(beforeNode, currentTextNode);
        parent.insertBefore(element, currentTextNode);
        parent.removeChild(currentTextNode);

        // Mark new nodes as scanned
        this.scannedNodes.add(beforeNode);

        // Update current node for next iteration (if processing more refs)
        currentTextNode = beforeNode;
        currentText = beforeText;
      } else {
        // Reference is in the middle
        const beforeNode = document.createTextNode(beforeText);
        const afterNode = document.createTextNode(afterText);
        parent.insertBefore(beforeNode, currentTextNode);
        parent.insertBefore(element, currentTextNode);
        parent.insertBefore(afterNode, currentTextNode);
        parent.removeChild(currentTextNode);

        // Mark new nodes as scanned
        this.scannedNodes.add(beforeNode);
        this.scannedNodes.add(afterNode);

        // Update current node for next iteration (continue with the before node since we're going in reverse)
        currentTextNode = beforeNode;
        currentText = beforeText;
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
    const versionAbbr = ref.version || this.config.defaultVersion;
    const versesStr = ref.verses.length > 0
      ? ref.verses.join(',')
      : '';

    // Look up the Bible ID from the version abbreviation
    const bibleVersion = findVersion(versionAbbr);
    const bibleId = bibleVersion ? bibleVersion.id.toString() : '111'; // Default to NIV (111) if not found

    return this.config.linkFormat
      .replace('{book}', ref.book)
      .replace('{chapter}', ref.chapter.toString())
      .replace('{verses}', versesStr)
      .replace('{version}', bibleId);
  }

  /**
   * Clear the scanned nodes cache
   * Useful when re-scanning the same content
   */
  clearCache(): void {
    this.scannedNodes = new WeakSet();
  }
}
