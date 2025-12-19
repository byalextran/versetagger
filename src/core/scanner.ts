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
  private excludedTags: Set<string>;
  private excludedClasses: Set<string>;
  private excludedIds: Set<string>;
  private complexExcludeSelectors: string | null;

  constructor(config: Required<VersetaggerConfig>) {
    this.config = config;
    this.scannedNodes = new WeakSet();

    // Parse excludeSelectors into optimized lookup structures
    const { tags, classes, ids, complex } = this.parseExcludeSelectors(config.excludeSelectors);
    this.excludedTags = tags;
    this.excludedClasses = classes;
    this.excludedIds = ids;
    this.complexExcludeSelectors = complex;
  }

  /**
   * Parse excludeSelectors string into optimized lookup structures
   * Separates simple selectors (tags, classes, IDs) from complex selectors
   */
  private parseExcludeSelectors(selectors: string): {
    tags: Set<string>;
    classes: Set<string>;
    ids: Set<string>;
    complex: string | null;
  } {
    const tags = new Set<string>();
    const classes = new Set<string>();
    const ids = new Set<string>();
    const complexSelectors: string[] = [];

    // Split by comma and process each selector
    const selectorList = selectors.split(',').map(s => s.trim()).filter(s => s);

    for (const selector of selectorList) {
      // Simple tag selector (e.g., "code", "pre")
      if (/^[a-z][a-z0-9]*$/i.test(selector)) {
        tags.add(selector.toUpperCase());
      }
      // Simple class selector (e.g., ".no-verse-tagging")
      else if (/^\.[a-z_-][a-z0-9_-]*$/i.test(selector)) {
        classes.add(selector.substring(1));
      }
      // Simple ID selector (e.g., "#sidebar")
      else if (/^#[a-z_-][a-z0-9_-]*$/i.test(selector)) {
        ids.add(selector.substring(1));
      }
      // Complex selector (e.g., "div.comment", "[data-foo]", "div > p")
      else {
        complexSelectors.push(selector);
      }
    }

    return {
      tags,
      classes,
      ids,
      complex: complexSelectors.length > 0 ? complexSelectors.join(', ') : null
    };
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

    // Use TreeWalker to find text nodes within element nodes
    // Element nodes allow us to skip entire subtrees efficiently
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => this.shouldScanNode(node)
      }
    );

    const textNodesToProcess: Text[] = [];
    let currentNode: Node | null;

    // Collect all text nodes first to avoid DOM modification during traversal
    while ((currentNode = walker.nextNode())) {
      // Only collect text nodes (elements are filtered to skip excluded subtrees)
      if (currentNode.nodeType === Node.TEXT_NODE) {
        textNodesToProcess.push(currentNode as Text);
        if (this.config.debug) {
          const preview = (currentNode.textContent || '').substring(0, 50).replace(/\n/g, ' ');
          const parentTag = (currentNode.parentElement?.tagName || 'none').toLowerCase();
          console.log(`VerseTagger: [TreeWalker] Found text node in <${parentTag}>: "${preview}${preview.length >= 50 ? '...' : ''}"`);
        }
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
   * For element nodes: returns FILTER_REJECT to skip excluded subtrees
   * For text nodes: returns FILTER_ACCEPT or FILTER_REJECT
   */
  private shouldScanNode(node: Node): number {
    const debugPrefix = 'VerseTagger: [shouldScanNode]';

    // Handle element nodes - check if they should be excluded
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      // Check if this element matches exclude selectors
      // Optimized: Check Sets first (O(1)), then fall back to matches() for complex selectors

      // Fast path: Check tag name
      if (this.excludedTags.has(element.tagName)) {
        if (this.config.debug) {
          console.log(`${debugPrefix} REJECT - Element tag excluded: <${element.tagName.toLowerCase()}>`);
        }
        return NodeFilter.FILTER_REJECT;
      }

      // Fast path: Check ID
      if (element.id && this.excludedIds.has(element.id)) {
        if (this.config.debug) {
          console.log(`${debugPrefix} REJECT - Element ID excluded: #${element.id}`);
        }
        return NodeFilter.FILTER_REJECT;
      }

      // Fast path: Check classes
      if (element.classList.length > 0) {
        for (const className of element.classList) {
          if (this.excludedClasses.has(className)) {
            if (this.config.debug) {
              console.log(`${debugPrefix} REJECT - Element class excluded: .${className}`);
            }
            return NodeFilter.FILTER_REJECT;
          }
        }
      }

      // Slow path: Check complex selectors (only if they exist)
      if (this.complexExcludeSelectors) {
        try {
          if (element.matches(this.complexExcludeSelectors)) {
            if (this.config.debug) {
              console.log(`${debugPrefix} REJECT - Element matches complex excludeSelectors: <${element.tagName.toLowerCase()}>`);
            }
            return NodeFilter.FILTER_REJECT;
          }
        } catch (e) {
          if (this.config.debug) {
            console.warn('VerseTagger: Invalid excludeSelectors', e);
          }
        }
      }

      // Check if this element is already a verse reference (skip its subtree)
      if (element.classList.contains(this.config.referenceClass)) {
        if (this.config.debug) {
          console.log(`${debugPrefix} REJECT - Element is existing verse reference`);
        }
        return NodeFilter.FILTER_REJECT;
      }

      // Check if element is hidden (skip its entire subtree for better performance)
      if (element instanceof HTMLElement) {
        const style = window.getComputedStyle(element);

        // Skip if display is none
        if (style.display === 'none') {
          if (this.config.debug) {
            console.log(`${debugPrefix} REJECT - Element has display:none: <${element.tagName.toLowerCase()}>`);
          }
          return NodeFilter.FILTER_REJECT;
        }

        // Skip if visibility is hidden
        if (style.visibility === 'hidden') {
          if (this.config.debug) {
            console.log(`${debugPrefix} REJECT - Element has visibility:hidden: <${element.tagName.toLowerCase()}>`);
          }
          return NodeFilter.FILTER_REJECT;
        }

        // Skip contenteditable elements
        if (element.getAttribute('contenteditable') === 'true') {
          if (this.config.debug) {
            console.log(`${debugPrefix} REJECT - Element has contenteditable="true": <${element.tagName.toLowerCase()}>`);
          }
          return NodeFilter.FILTER_REJECT;
        }

        // Skip aria-hidden elements
        if (element.getAttribute('aria-hidden') === 'true') {
          if (this.config.debug) {
            console.log(`${debugPrefix} REJECT - Element has aria-hidden="true": <${element.tagName.toLowerCase()}>`);
          }
          return NodeFilter.FILTER_REJECT;
        }
      }

      // Skip element nodes themselves but continue traversing their children
      // We don't need to collect element nodes, only text nodes
      return NodeFilter.FILTER_SKIP;
    }

    // Handle text nodes
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

    // Check if parent exists
    const parent = node.parentElement;
    if (!parent) {
      if (this.config.debug) {
        console.log(`${debugPrefix} REJECT - No parent element`);
      }
      return NodeFilter.FILTER_REJECT;
    }

    // At this point, we know the parent is not excluded (because excluded elements
    // would have returned FILTER_SKIP above, preventing us from reaching their text nodes)
    // So we don't need to check parent.matches() or parent.closest() here

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
        console.log(`VerseTagger: [Match ${idx + 1}] "${ref.text}" -> ${ref.book} ${ref.chapter}:${ref.verses}${ref.version ? ' ' + ref.version : ''}`);
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
    // Always create links with modal support
    const element = document.createElement('a') as HTMLAnchorElement;

    // Set the text content
    element.textContent = ref.text;

    // Add CSS class
    element.className = this.config.referenceClass;

    // Store reference data as data attributes for event handlers
    element.dataset.book = ref.book;
    element.dataset.chapter = ref.chapter.toString();
    element.dataset.verses = ref.verses;
    if (ref.version) {
      element.dataset.version = ref.version;
    }

    // Set href for link
    element.href = this.buildReferenceUrl(ref);
    if (this.config.openLinksInNewTab) {
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
    }

    // Add ARIA attributes for accessibility
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.setAttribute('aria-label', `Show verse: ${ref.text}`);

    if (this.config.accessibility.keyboardNav) {
      element.setAttribute('aria-haspopup', 'dialog');
    }

    // Add data attribute to indicate modal support
    element.dataset.hasModal = 'true';

    return element;
  }

  /**
   * Build a URL for a scripture reference
   */
  private buildReferenceUrl(ref: ScriptureReference): string {
    const versionAbbr = ref.version || this.config.defaultVersion;
    const versesStr = ref.verses || '';

    // Look up the Bible ID from the version abbreviation
    const bibleVersion = findVersion(versionAbbr);
    const bibleId = bibleVersion ? bibleVersion.id.toString() : '111'; // Default to NIV (111) if not found

    return `https://www.bible.com/bible/${bibleId}/${ref.book}.${ref.chapter}.${versesStr}`;
  }

  /**
   * Clear the scanned nodes cache
   * Useful when re-scanning the same content
   */
  clearCache(): void {
    this.scannedNodes = new WeakSet();
  }
}
