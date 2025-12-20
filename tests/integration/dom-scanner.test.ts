import { describe, it, expect, beforeEach } from 'vitest';
import { DOMScanner } from '@/core/scanner';
import { createConfig } from '@/core/config';
import { createTestElement, countVerseLinks, getVerseLinks, assertValidVerseLink } from '../helpers/dom-helpers';

describe('DOM Scanner - Basic Scanning', () => {
  let scanner: DOMScanner;

  beforeEach(() => {
    const config = createConfig({});
    scanner = new DOMScanner(config);
  });

  describe('Basic Reference Detection', () => {
    it('should find reference in simple paragraph', () => {
      const element = createTestElement('<p>Check out John 3:16 for more info.</p>');
      const results = scanner.scan(element);

      expect(results).toHaveLength(1);
      expect(results[0].book).toBe('JHN');
      expect(results[0].chapter).toBe(3);
      expect(results[0].verses).toBe('16');
      expect(results[0].text).toBe('John 3:16');
    });

    it('should create link elements with correct attributes', () => {
      const element = createTestElement('<p>Read Romans 8:28 today.</p>');
      scanner.scan(element);

      const links = getVerseLinks(element);
      expect(links).toHaveLength(1);

      const link = links[0];
      assertValidVerseLink(link);
      expect(link.dataset.book).toBe('ROM');
      expect(link.dataset.chapter).toBe('8');
      expect(link.dataset.verses).toBe('28');
      expect(link.textContent).toBe('Romans 8:28');
    });

    it('should find multiple references in one paragraph', () => {
      const element = createTestElement(
        '<p>Compare John 3:16 with Romans 8:28 and Philippians 4:13.</p>'
      );
      const results = scanner.scan(element);

      expect(results).toHaveLength(3);
      expect(results[2].text).toBe('John 3:16');
      expect(results[1].text).toBe('Romans 8:28');
      expect(results[0].text).toBe('Philippians 4:13');
    });

    it('should handle adjacent references', () => {
      const element = createTestElement(
        '<p>See John 3:16, Romans 8:28, and Psalm 23:1.</p>'
      );
      const results = scanner.scan(element);

      expect(results).toHaveLength(3);
      expect(countVerseLinks(element)).toBe(3);
    });

    it('should handle references with Bible versions', () => {
      const element = createTestElement('<p>Read John 3:16 ESV and Romans 8:28 NIV.</p>');
      const results = scanner.scan(element);

      expect(results).toHaveLength(2);
      expect(results[1].version).toBe('ESV');
      expect(results[0].version).toBe('NIV');
    });
  });

  describe('Link Creation', () => {
    it('should create links with correct href pointing to Bible.com', () => {
      const element = createTestElement('<p>John 3:16 is amazing.</p>');
      scanner.scan(element);

      const links = getVerseLinks(element);
      expect(links[0].href).toContain('bible.com');
      expect(links[0].href).toContain('JHN.3.16');
    });

    it('should set target and rel attributes when openLinksInNewTab is true', () => {
      const element = createTestElement('<p>Check Romans 8:28.</p>');
      scanner.scan(element);

      const links = getVerseLinks(element);
      expect(links[0].target).toBe('_blank');
      expect(links[0].rel).toBe('noopener noreferrer');
    });

    it('should add ARIA attributes for accessibility', () => {
      const element = createTestElement('<p>Psalm 23:1 is beautiful.</p>');
      scanner.scan(element);

      const links = getVerseLinks(element);
      expect(links[0].getAttribute('role')).toBe('button');
      expect(links[0].getAttribute('tabindex')).toBe('0');
      expect(links[0].getAttribute('aria-label')).toContain('Show verse');
    });

    it('should add verse-reference class to links', () => {
      const element = createTestElement('<p>Genesis 1:1 is the beginning.</p>');
      scanner.scan(element);

      const links = getVerseLinks(element);
      expect(links[0].classList.contains('verse-reference')).toBe(true);
    });
  });

  describe('DOM Manipulation - Text Node Splitting', () => {
    it('should split text node when reference is in the middle', () => {
      const element = createTestElement('<p>Before John 3:16 after.</p>');
      const paragraph = element.querySelector('p')!;
      const initialTextNodes = Array.from(paragraph.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
      expect(initialTextNodes).toHaveLength(1);

      scanner.scan(element);

      const childNodes = Array.from(paragraph.childNodes);
      expect(childNodes).toHaveLength(3);
      expect(childNodes[0].textContent).toBe('Before ');
      expect(childNodes[1].nodeName).toBe('A');
      expect(childNodes[1].textContent).toBe('John 3:16');
      expect(childNodes[2].textContent).toBe(' after.');
    });

    it('should handle reference at start of text', () => {
      const element = createTestElement('<p>John 3:16 is at the start.</p>');
      const paragraph = element.querySelector('p')!;

      scanner.scan(element);

      const childNodes = Array.from(paragraph.childNodes);
      expect(childNodes[0].nodeName).toBe('A');
      expect(childNodes[0].textContent).toBe('John 3:16');
      expect(childNodes[1].textContent).toBe(' is at the start.');
    });

    it('should handle reference at end of text', () => {
      const element = createTestElement('<p>Check out John 3:16</p>');
      const paragraph = element.querySelector('p')!;

      scanner.scan(element);

      const childNodes = Array.from(paragraph.childNodes);
      expect(childNodes[0].textContent).toBe('Check out ');
      expect(childNodes[1].nodeName).toBe('A');
      expect(childNodes[1].textContent).toBe('John 3:16');
    });

    it('should maintain DOM structure with nested elements', () => {
      const element = createTestElement(
        '<div><p>Read <strong>John 3:16</strong> today.</p></div>'
      );

      scanner.scan(element);

      const strong = element.querySelector('strong')!;
      const link = strong.querySelector('a.verse-reference');
      expect(link).toBeTruthy();
      expect(link?.textContent).toBe('John 3:16');
    });

    it('should handle multiple references in correct order', () => {
      const element = createTestElement('<p>Start John 3:16 middle Romans 8:28 end.</p>');

      scanner.scan(element);

      const paragraph = element.querySelector('p')!;
      const text = paragraph.textContent!;
      expect(text).toContain('John 3:16');
      expect(text).toContain('Romans 8:28');

      const links = getVerseLinks(element);
      expect(links[0].textContent).toBe('John 3:16');
      expect(links[1].textContent).toBe('Romans 8:28');
    });
  });

  describe('Scoped Scanning', () => {
    it('should scan only within specified element', () => {
      const element = createTestElement(`
        <div>
          <div id="scope">John 3:16 is here.</div>
          <div id="outside">Romans 8:28 is outside.</div>
        </div>
      `);

      const scopedElement = element.querySelector('#scope') as HTMLElement;
      const results = scanner.scan(scopedElement);

      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');

      const outsideLinks = element.querySelector('#outside .verse-reference');
      expect(outsideLinks).toBeNull();
    });

    it('should ignore elements outside scope', () => {
      const element = createTestElement(`
        <div>
          <article id="main">
            <p>Read Psalm 23:1.</p>
          </article>
          <aside id="sidebar">
            <p>Also check John 3:16.</p>
          </aside>
        </div>
      `);

      const article = element.querySelector('#main') as HTMLElement;
      scanner.scan(article);

      expect(countVerseLinks(article)).toBe(1);
      expect(countVerseLinks(element.querySelector('#sidebar')!)).toBe(0);
    });

    it('should handle nested scoped elements correctly', () => {
      const element = createTestElement(`
        <div>
          <div class="outer">
            <div class="inner">Genesis 1:1 is nested.</div>
          </div>
        </div>
      `);

      const inner = element.querySelector('.inner') as HTMLElement;
      const results = scanner.scan(inner);

      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Genesis 1:1');
    });
  });

  describe('Cache Management', () => {
    it('should prevent re-scanning tagged nodes', () => {
      const element = createTestElement('<p>John 3:16 is great.</p>');

      const results1 = scanner.scan(element);
      expect(results1).toHaveLength(1);

      const results2 = scanner.scan(element);
      expect(results2).toHaveLength(0);
      expect(countVerseLinks(element)).toBe(1);
    });

    it('should clear cache when clearCache is called', () => {
      const element = createTestElement('<p>John 3:16 is great.</p>');

      scanner.scan(element);
      expect(countVerseLinks(element)).toBe(1);

      scanner.clearCache();

      const element2 = createTestElement('<p>Romans 8:28 is wonderful.</p>');
      const results = scanner.scan(element2);
      expect(results).toHaveLength(1);
    });

    it('should not re-tag already tagged references', () => {
      const element = createTestElement('<p>John 3:16 and Romans 8:28.</p>');

      scanner.scan(element);
      const firstCount = countVerseLinks(element);
      expect(firstCount).toBe(2);

      scanner.scan(element);
      expect(countVerseLinks(element)).toBe(2);
    });

    it('should handle cache correctly with multiple scans on different elements', () => {
      const element1 = createTestElement('<p>John 3:16 here.</p>');
      const element2 = createTestElement('<p>Romans 8:28 there.</p>');

      const results1 = scanner.scan(element1);
      expect(results1).toHaveLength(1);

      const results2 = scanner.scan(element2);
      expect(results2).toHaveLength(1);

      expect(countVerseLinks(element1)).toBe(1);
      expect(countVerseLinks(element2)).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty elements', () => {
      const element = createTestElement('<p></p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(0);
    });

    it('should handle whitespace-only elements', () => {
      const element = createTestElement('<p>   \n\t   </p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(0);
    });

    it('should handle elements with no parent gracefully', () => {
      const element = createTestElement('<p>John 3:16</p>');
      const paragraph = element.querySelector('p')!;

      const results = scanner.scan(paragraph);
      expect(results).toHaveLength(1);

      element.removeChild(paragraph);

      const resultsAfterRemoval = scanner.scan(paragraph);
      expect(resultsAfterRemoval).toHaveLength(0);
    });

    it('should handle very long text with single reference', () => {
      const longText = 'a'.repeat(1000) + ' John 3:16 ' + 'b'.repeat(1000);
      const element = createTestElement(`<p>${longText}</p>`);

      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');
    });
  });
});
