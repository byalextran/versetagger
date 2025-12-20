import { describe, it, expect, beforeEach } from 'vitest';
import { DOMScanner } from '@/core/scanner';
import { createConfig } from '@/core/config';
import { createTestElement, countVerseLinks, getVerseLinks } from '../helpers/dom-helpers';

describe('DOM Scanner - Exclusions', () => {
  let scanner: DOMScanner;

  beforeEach(() => {
    const config = createConfig({});
    scanner = new DOMScanner(config);
  });

  describe('HTML Element Exclusions - Default 17 Elements', () => {
    it('should not scan <code> elements', () => {
      const element = createTestElement(
        '<p>Normal John 3:16 and <code>code John 3:16</code>.</p>'
      );
      scanner.scan(element);

      const links = getVerseLinks(element);
      expect(links).toHaveLength(1);
      expect(links[0].previousSibling?.textContent).toBe('Normal ');
    });

    it('should not scan <pre> elements', () => {
      const element = createTestElement(`
        <div>
          <p>Outside: John 3:16</p>
          <pre>Inside pre: Romans 8:28</pre>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not scan <script> elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <script>const verse = "Romans 8:28";</script>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not scan <style> elements', () => {
      const element = createTestElement(`
        <div>
          <p>Psalm 23:1 is visible</p>
          <style>.verse { content: "John 3:16"; }</style>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('Psalm 23:1');
    });

    it('should not scan <head> elements', () => {
      const element = createTestElement(`
        <div>
          <head><title>John 3:16</title></head>
          <p>Romans 8:28</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('Romans 8:28');
    });

    it('should not scan <meta> elements', () => {
      const element = createTestElement(`
        <div>
          <meta name="description" content="John 3:16" />
          <p>Romans 8:28</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('Romans 8:28');
    });

    it('should not scan <title> elements', () => {
      const element = createTestElement(`
        <div>
          <title>John 3:16 - Bible Verse</title>
          <p>Romans 8:28</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('Romans 8:28');
    });

    it('should not scan <link> elements', () => {
      const element = createTestElement(`
        <div>
          <link rel="canonical" href="/john-3-16" />
          <p>Romans 8:28</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('Romans 8:28');
    });

    it('should not scan <noscript> elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <noscript>Romans 8:28 inside noscript</noscript>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not scan <svg> elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <svg xmlns="http://www.w3.org/2000/svg"><text>Romans 8:28 inside svg</text></svg>
        </div>
      `);
      scanner.scan(element);

      const links = getVerseLinks(element);
      expect(links).toHaveLength(1);
      expect(links[0].textContent).toBe('John 3:16');
    });

    it('should not scan <canvas> elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <canvas>Romans 8:28</canvas>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not scan <iframe> elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <iframe>Romans 8:28 inside iframe</iframe>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not scan <video> elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <video>Romans 8:28</video>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not scan <select> elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <select><option>Romans 8:28</option></select>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not scan <option> elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <select>
            <option>Romans 8:28</option>
            <option>Psalm 23:1</option>
          </select>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not scan <button> elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <button>Romans 8:28</button>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not scan existing <a> links (prevents double-wrapping)', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <a href="https://example.com">Romans 8:28</a>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should exclude all default body-valid elements', () => {
      // Note: This tests the 11 elements that make sense in body context
      // head, meta, title, link are tested separately as they're typically in <head>
      // SVG is skipped due to JSDOM namespace limitations
      const element = createTestElement(`
        <div>
          <p>Valid: John 3:16</p>
          <code>John 3:17</code>
          <pre>John 3:18</pre>
          <script>John 3:19</script>
          <style>John 3:20</style>
          <noscript>John 3:25</noscript>
          <canvas>John 3:27</canvas>
          <iframe>John 3:28</iframe>
          <video>John 3:29</video>
          <select><option>John 3:30</option></select>
          <button>John 3:32</button>
          <a href="#">John 3:33</a>
        </div>
      `);
      scanner.scan(element);

      const links = getVerseLinks(element);
      expect(links).toHaveLength(1);
      expect(links[0].textContent).toBe('John 3:16');
    });
  });

  describe('CSS Class Exclusions', () => {
    it('should exclude elements with .no-verse-tagging class', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 should be tagged</p>
          <p class="no-verse-tagging">Romans 8:28 should not</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should exclude nested children of .no-verse-tagging elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 outside</p>
          <div class="no-verse-tagging">
            <p>Romans 8:28 inside</p>
            <div>
              <span>Psalm 23:1 deeply nested</span>
            </div>
          </div>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should handle multiple exclusion classes', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 valid</p>
          <p class="no-verse-tagging">Romans 8:28 excluded</p>
          <div class="no-verse-tagging">
            <p>Psalm 23:1 also excluded</p>
          </div>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should work with custom exclude classes if configured', () => {
      const customConfig = createConfig({
        excludeSelectors: '.custom-exclude',
      });
      const customScanner = new DOMScanner(customConfig);

      const element = createTestElement(`
        <div>
          <p>John 3:16 valid</p>
          <p class="custom-exclude">Romans 8:28 excluded</p>
        </div>
      `);
      customScanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });
  });

  describe('Runtime Exclusions', () => {
    it('should exclude elements with display:none', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 visible</p>
          <p style="display: none;">Romans 8:28 hidden</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should exclude elements with visibility:hidden', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 visible</p>
          <p style="visibility: hidden;">Romans 8:28 hidden</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should exclude contenteditable elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 not editable</p>
          <p contenteditable="true">Romans 8:28 editable</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should exclude aria-hidden elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 visible</p>
          <p aria-hidden="true">Romans 8:28 hidden from screen readers</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not tag existing verse-reference elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 new</p>
          <a class="verse-reference">Romans 8:28 already tagged</a>
        </div>
      `);
      scanner.scan(element);

      const links = getVerseLinks(element);
      expect(links).toHaveLength(2);
      expect(links[0].textContent).toBe('John 3:16');
      expect(links[1].textContent).toBe('Romans 8:28 already tagged');
    });

    it('should exclude children of hidden elements', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 visible</p>
          <div style="display: none;">
            <p>Romans 8:28 in hidden parent</p>
            <span>Psalm 23:1 also hidden</span>
          </div>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should handle multiple runtime exclusion types', () => {
      const element = createTestElement(`
        <div>
          <p>John 3:16 valid</p>
          <p style="display: none;">Romans 8:28</p>
          <p style="visibility: hidden;">Psalm 23:1</p>
          <p contenteditable="true">Genesis 1:1</p>
          <p aria-hidden="true">Matthew 5:16</p>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });
  });

  describe('Complex Exclusion Scenarios', () => {
    it('should handle nested exclusions (code within paragraph)', () => {
      const element = createTestElement(`
        <p>
          Before John 3:16 middle <code>Romans 8:28</code> after Psalm 23:1.
        </p>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(2);
      const links = getVerseLinks(element);
      expect(links[0].textContent).toBe('John 3:16');
      expect(links[1].textContent).toBe('Psalm 23:1');
    });

    it('should handle multiple exclusion types in same document', () => {
      const element = createTestElement(`
        <div>
          <p>Valid: John 3:16</p>
          <code>Code: Romans 8:28</code>
          <p class="no-verse-tagging">Class: Psalm 23:1</p>
          <p style="display: none;">Hidden: Genesis 1:1</p>
          <button>Button: Matthew 5:16</button>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should handle custom exclude selectors with multiple types', () => {
      const customConfig = createConfig({
        excludeSelectors: 'code, pre, .custom-class, #custom-id',
      });
      const customScanner = new DOMScanner(customConfig);

      const element = createTestElement(`
        <div>
          <p>Valid: John 3:16</p>
          <code>Code: Romans 8:28</code>
          <p class="custom-class">Custom class: Psalm 23:1</p>
          <div id="custom-id">Custom ID: Genesis 1:1</div>
        </div>
      `);
      customScanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should handle deeply nested excluded elements', () => {
      const element = createTestElement(`
        <div>
          <p>Outer: John 3:16</p>
          <div class="no-verse-tagging">
            <div>
              <div>
                <code>
                  <span>Deep: Romans 8:28</span>
                </code>
              </div>
            </div>
          </div>
        </div>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should handle mixed valid and excluded elements in complex structure', () => {
      const element = createTestElement(`
        <article>
          <h1>Title: Matthew 5:16</h1>
          <p>Intro: John 3:16 is important.</p>
          <blockquote>
            Quote: Romans 8:28 is great.
            <code>Code: Psalm 23:1</code>
          </blockquote>
          <div class="no-verse-tagging">
            <p>Excluded: Genesis 1:1</p>
          </div>
          <p>Conclusion: Philippians 4:13 is powerful.</p>
        </article>
      `);
      scanner.scan(element);

      expect(countVerseLinks(element)).toBe(4);
      const links = getVerseLinks(element);
      expect(links[0].textContent).toBe('Matthew 5:16');
      expect(links[1].textContent).toBe('John 3:16');
      expect(links[2].textContent).toBe('Romans 8:28');
      expect(links[3].textContent).toBe('Philippians 4:13');
    });

    it('should exclude elements matching complex selectors', () => {
      const customConfig = createConfig({
        excludeSelectors: 'div.sidebar, article[data-exclude="true"]',
      });
      const customScanner = new DOMScanner(customConfig);

      const element = createTestElement(`
        <div>
          <p>Valid: John 3:16</p>
          <div class="sidebar">Sidebar: Romans 8:28</div>
          <article data-exclude="true">Article: Psalm 23:1</article>
        </div>
      `);
      customScanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should handle exclusions with ID selectors', () => {
      const customConfig = createConfig({
        excludeSelectors: '#sidebar, #footer',
      });
      const customScanner = new DOMScanner(customConfig);

      const element = createTestElement(`
        <div>
          <p>Main: John 3:16</p>
          <div id="sidebar">Sidebar: Romans 8:28</div>
          <div id="footer">Footer: Psalm 23:1</div>
        </div>
      `);
      customScanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should preserve structure when scanning around excluded elements', () => {
      const element = createTestElement(`
        <p>
          Start John 3:16 <code>excluded Romans 8:28</code> end Psalm 23:1.
        </p>
      `);

      scanner.scan(element);

      const paragraph = element.querySelector('p')!;
      expect(paragraph.querySelector('code')).toBeTruthy();
      expect(paragraph.querySelector('code')!.textContent).toBe('excluded Romans 8:28');

      const links = getVerseLinks(element);
      expect(links).toHaveLength(2);
      expect(links[0].textContent).toBe('John 3:16');
      expect(links[1].textContent).toBe('Psalm 23:1');
    });
  });

  describe('Exclusion Edge Cases', () => {
    it('should handle empty exclude selectors', () => {
      const customConfig = createConfig({
        excludeSelectors: '',
      });
      const customScanner = new DOMScanner(customConfig);

      const element = createTestElement(`
        <div>
          <p>John 3:16</p>
          <code>Romans 8:28</code>
        </div>
      `);
      customScanner.scan(element);

      expect(countVerseLinks(element)).toBe(2);
    });

    it('should handle whitespace in exclude selectors', () => {
      const customConfig = createConfig({
        excludeSelectors: '  code  ,  pre  ,  .test  ',
      });
      const customScanner = new DOMScanner(customConfig);

      const element = createTestElement(`
        <div>
          <p>John 3:16</p>
          <code>Romans 8:28</code>
          <pre>Psalm 23:1</pre>
          <p class="test">Genesis 1:1</p>
        </div>
      `);
      customScanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('John 3:16');
    });

    it('should not exclude elements that only partially match selector', () => {
      const customConfig = createConfig({
        excludeSelectors: '.no-tagging',
      });
      const customScanner = new DOMScanner(customConfig);

      const element = createTestElement(`
        <div>
          <p class="no-tagging">Excluded: John 3:16</p>
          <p class="some-tagging">Included: Romans 8:28</p>
        </div>
      `);
      customScanner.scan(element);

      expect(countVerseLinks(element)).toBe(1);
      expect(getVerseLinks(element)[0].textContent).toBe('Romans 8:28');
    });
  });
});
