import { describe, it, expect, beforeEach } from 'vitest';
import { DOMScanner } from '@/core/scanner';
import { createConfig } from '@/core/config';
import { createTestElement, countVerseLinks, getVerseLinks } from '../helpers/dom-helpers';

describe('Edge Cases - Real-World Content', () => {
  let scanner: DOMScanner;

  beforeEach(() => {
    const config = createConfig({});
    scanner = new DOMScanner(config);
  });

  describe('Multiple References in One Paragraph', () => {
    it('should handle many references in one paragraph (5+)', () => {
      const element = createTestElement(`
        <p>
          The Bible has many great verses like John 3:16, Romans 8:28,
          Philippians 4:13, Jeremiah 29:11, Psalm 23:1, and Proverbs 3:5-6.
        </p>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(6);
      expect(countVerseLinks(element)).toBe(6);
    });

    it('should maintain correct DOM structure with many references', () => {
      const element = createTestElement(`
        <p>
          Read John 3:16, Romans 8:28, Psalm 23:1, Genesis 1:1, and Revelation 21:4.
        </p>
      `);

      scanner.scan(element);
      const paragraph = element.querySelector('p')!;
      const childNodes = Array.from(paragraph.childNodes);

      // Should have: text, link, text, link, text, link, text, link, text, link, text
      expect(childNodes.length).toBeGreaterThan(5);

      const links = getVerseLinks(element);
      expect(links[0].textContent).toBe('John 3:16');
      expect(links[1].textContent).toBe('Romans 8:28');
      expect(links[2].textContent).toBe('Psalm 23:1');
      expect(links[3].textContent).toBe('Genesis 1:1');
      expect(links[4].textContent).toBe('Revelation 21:4');
    });

    it('should handle 10+ references without breaking', () => {
      const element = createTestElement(`
        <p>
          John 3:16, Romans 8:28, Psalm 23:1, Genesis 1:1, Exodus 20:3,
          Matthew 5:16, Luke 10:27, Acts 1:8, Galatians 5:22, Ephesians 6:10,
          and James 1:2.
        </p>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(11);
      expect(countVerseLinks(element)).toBe(11);
    });
  });

  describe('HTML Contexts', () => {
    it('should handle references in blockquotes', () => {
      const element = createTestElement(`
        <blockquote>
          For God so loved the world - John 3:16
        </blockquote>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');

      const link = element.querySelector('blockquote a.verse-reference');
      expect(link).toBeTruthy();
    });

    it('should handle references in unordered lists', () => {
      const element = createTestElement(`
        <ul>
          <li>John 3:16 - God's love</li>
          <li>Romans 8:28 - God's plan</li>
          <li>Philippians 4:13 - Strength in Christ</li>
        </ul>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(3);
      expect(countVerseLinks(element)).toBe(3);
    });

    it('should handle references in ordered lists', () => {
      const element = createTestElement(`
        <ol>
          <li>First, read Genesis 1:1</li>
          <li>Then, study John 1:1</li>
          <li>Finally, meditate on Psalm 119:105</li>
        </ol>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(3);
      expect(countVerseLinks(element)).toBe(3);
    });

    it('should handle references in definition lists', () => {
      const element = createTestElement(`
        <dl>
          <dt>Love</dt>
          <dd>See 1 Corinthians 13:4-7 for definition</dd>
          <dt>Faith</dt>
          <dd>Hebrews 11:1 defines it</dd>
        </dl>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(2);
      expect(results[0].text).toBe('1 Corinthians 13:4-7');
      expect(results[1].text).toBe('Hebrews 11:1');
    });

    it('should handle references in table cells (td)', () => {
      const element = createTestElement(`
        <table>
          <tr>
            <td>John 3:16</td>
            <td>God's love for the world</td>
          </tr>
          <tr>
            <td>Romans 8:28</td>
            <td>All things work together for good</td>
          </tr>
        </table>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(2);
      expect(countVerseLinks(element)).toBe(2);
    });

    it('should handle references in table headers (th)', () => {
      const element = createTestElement(`
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Theme</th>
            </tr>
            <tr>
              <th>Psalm 23:1</th>
              <th>Shepherd</th>
            </tr>
          </thead>
        </table>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Psalm 23:1');
    });

    it('should handle references in h1 headings', () => {
      const element = createTestElement('<h1>Study of John 3:16</h1>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(element.querySelector('h1 a.verse-reference')).toBeTruthy();
    });

    it('should handle references in h2 headings', () => {
      const element = createTestElement('<h2>Romans 8:28 - God\'s Providence</h2>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
    });

    it('should handle references in h3-h6 headings', () => {
      const element = createTestElement(`
        <div>
          <h3>Psalm 23:1</h3>
          <h4>Proverbs 3:5-6</h4>
          <h5>Matthew 28:19-20</h5>
          <h6>Ephesians 2:8-9</h6>
        </div>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(4);
    });
  });

  describe('Complex Text - Surrounding Punctuation', () => {
    it('should handle references in parentheses', () => {
      const element = createTestElement('<p>God loves us (John 3:16) so much.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');
    });

    it('should handle references in square brackets', () => {
      const element = createTestElement('<p>See reference [Romans 8:28] for details.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Romans 8:28');
    });

    it('should handle references in double quotes', () => {
      const element = createTestElement('<p>The verse "Psalm 23:1" is beautiful.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Psalm 23:1');
    });

    it('should handle references in single quotes', () => {
      const element = createTestElement("<p>Read 'Genesis 1:1' first.</p>");
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Genesis 1:1');
    });

    it('should handle references with curly quotes', () => {
      const element = createTestElement(`<p>"John 3:16" and 'Romans 8:28'</p>`);
      const results = scanner.scan(element);
      expect(results).toHaveLength(2);
    });

    it('should handle references followed by various punctuation', () => {
      const element = createTestElement(`
        <p>
          Check John 3:16! Also Romans 8:28? And Psalm 23:1.
          Don't forget Philippians 4:13; Finally Jeremiah 29:11:
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(5);
    });
  });

  describe('Complex Text - Unicode Characters', () => {
    it('should handle references with arrow symbols', () => {
      const element = createTestElement('<p>→ John 3:16 ←</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');
    });

    it('should handle references with emoji', () => {
      const element = createTestElement('<p>❤️ Romans 8:28 🙏</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Romans 8:28');
    });

    it('should handle references with various unicode symbols', () => {
      const element = createTestElement('<p>★ Psalm 23:1 • Genesis 1:1 ♦ Revelation 21:4</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(3);
    });

    it('should handle references with accented characters nearby', () => {
      const element = createTestElement('<p>Café discussion about John 3:16 naïve</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
    });
  });

  describe('Complex Text - Newlines and Whitespace', () => {
    it('should handle references with newlines', () => {
      const element = createTestElement(`
        <p>
          Before
          John 3:16
          After
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');
    });

    it('should handle references with multiple spaces', () => {
      const element = createTestElement('<p>Check    John 3:16    today</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
    });

    it('should handle references with tabs', () => {
      const element = createTestElement('<p>Reference:\t\tJohn 3:16\t\tend</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
    });

    it('should handle references in very long paragraphs (500+ words)', () => {
      const longParagraph = 'word '.repeat(250) + 'John 3:16 ' + 'word '.repeat(250);
      const element = createTestElement(`<p>${longParagraph}</p>`);
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');
    });

    it('should handle multiple references in very long paragraphs', () => {
      const longParagraph =
        'word '.repeat(100) + 'John 3:16 ' +
        'word '.repeat(100) + 'Romans 8:28 ' +
        'word '.repeat(100) + 'Psalm 23:1 ' +
        'word '.repeat(100);
      const element = createTestElement(`<p>${longParagraph}</p>`);
      const results = scanner.scan(element);
      expect(results).toHaveLength(3);
    });
  });

  describe('Dash Type Handling', () => {
    it('should handle ranges with hyphen-minus (U+002D)', () => {
      const element = createTestElement('<p>Read Matthew 5:3-12 today.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Matthew 5:3-12');
      expect(results[0].verses).toBe('3-12');
    });

    it('should handle ranges with en-dash (U+2013)', () => {
      const element = createTestElement('<p>Read Matthew 5:3–12 today.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Matthew 5:3–12');
      expect(results[0].verses).toMatch(/3[-–]12/);
    });

    it('should handle ranges with em-dash (U+2014)', () => {
      const element = createTestElement('<p>Read Matthew 5:3—12 today.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Matthew 5:3—12');
      expect(results[0].verses).toMatch(/3[-–—]12/);
    });

    it('should handle all three dash types in same text', () => {
      const element = createTestElement(`
        <p>
          Compare Matthew 5:3-12, Luke 6:20–23, and Romans 12:9—21.
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(3);
    });

    it('should handle complex ranges with different dashes', () => {
      const element = createTestElement('<p>Study Psalm 1:1-3, Psalm 2:1–6, and Psalm 3:1—4.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(3);
      expect(results[2].book).toBe('PSA');
      expect(results[1].book).toBe('PSA');
      expect(results[0].book).toBe('PSA');
    });
  });

  describe('Real-World Blog Content', () => {
    it('should handle articles with mixed content', () => {
      const element = createTestElement(`
        <article>
          <h1>Understanding God's Love</h1>
          <p>The Bible teaches us in John 3:16 that God loves the world.</p>
          <blockquote>
            For God so loved the world...
          </blockquote>
          <ul>
            <li>See also Romans 8:28</li>
            <li>Read 1 John 4:8</li>
          </ul>
          <pre><code>// This is code, not John 3:16</code></pre>
          <p>Finally, remember Jeremiah 29:11 for hope.</p>
        </article>
      `);

      const results = scanner.scan(element);
      // Should find: John 3:16, Romans 8:28, 1 John 4:8, Jeremiah 29:11
      // Should NOT find the one in <code>
      expect(results).toHaveLength(4);

      const foundTexts = results.map(r => r.text);
      expect(foundTexts).toContain('John 3:16');
      expect(foundTexts).toContain('Romans 8:28');
      expect(foundTexts).toContain('1 John 4:8');
      expect(foundTexts).toContain('Jeremiah 29:11');
    });

    it('should handle comment sections', () => {
      const element = createTestElement(`
        <div class="comments">
          <div class="comment">
            <p>Great article! John 3:16 is my favorite.</p>
          </div>
          <div class="comment">
            <p>Don't forget Romans 8:28!</p>
          </div>
        </div>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(2);
    });

    it('should handle HTML entities - ldquo and rdquo', () => {
      const element = createTestElement('<p>&ldquo;John 3:16&rdquo; is amazing.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');
    });

    it('should handle HTML entities - nbsp', () => {
      const element = createTestElement('<p>Read&nbsp;John&nbsp;3:16&nbsp;today.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toContain('John');
      expect(results[0].text).toContain('3:16');
    });

    it('should handle multiple HTML entities together', () => {
      const element = createTestElement(`
        <p>
          &ldquo;For God so loved&rdquo;&nbsp;&mdash;&nbsp;John&nbsp;3:16
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
    });

    it('should handle complex blog post structure', () => {
      const element = createTestElement(`
        <article class="blog-post">
          <header>
            <h1>Top 5 Bible Verses</h1>
            <p class="meta">Posted on 2024-01-01</p>
          </header>
          <section>
            <h2>1. God's Love</h2>
            <p>John 3:16 shows God's love.</p>

            <h2>2. God's Plan</h2>
            <p>Romans 8:28 reveals His plan.</p>

            <h2>3. Strength</h2>
            <p>Philippians 4:13 gives strength.</p>
          </section>
          <footer>
            <p>Also see Jeremiah 29:11 and Psalm 23:1</p>
          </footer>
        </article>
      `);

      const results = scanner.scan(element);
      expect(results).toHaveLength(5);
    });
  });

  describe('False Positives in Context', () => {
    it('should not match email addresses in paragraphs', () => {
      const element = createTestElement(`
        <p>
          Contact us at john3:16@example.com for more info.
          Also try admin@psalm23:1.org for questions.
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(0);
    });

    it('should not match URLs in text', () => {
      const element = createTestElement(`
        <p>
          Visit https://example.com/john3:16 for details.
          Or check http://site.org/psalm23:1/page
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(0);
    });

    it('should not match file paths', () => {
      const element = createTestElement(`
        <p>
          Check the file at /path/to/john3:16.txt
          Or C:\\Users\\psalm23:1.doc
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(0);
    });

    it('should not match verse-like patterns in code blocks', () => {
      const element = createTestElement(`
        <p>The code below shows an example:</p>
        <code>
          const verse = "John 3:16";
          const ref = "Romans 8:28";
        </code>
        <p>But this John 3:16 should be tagged.</p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');
    });

    it('should not match in pre blocks', () => {
      const element = createTestElement(`
        <p>See this example:</p>
        <pre>
          Reference: John 3:16
          Another: Romans 8:28
        </pre>
        <p>Outside pre: Psalm 23:1</p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Psalm 23:1');
    });

    it('should handle mixed content with potential false positives', () => {
      const element = createTestElement(`
        <div>
          <p>Email me at john3:16@test.com but read John 3:16 from the Bible.</p>
          <p>Visit https://bible.com/john3:16 or read Romans 8:28 directly.</p>
        </div>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(2);
      expect(results[0].text).toBe('John 3:16');
      expect(results[1].text).toBe('Romans 8:28');
    });
  });

  describe('Additional Edge Cases', () => {
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

    it('should handle multiple versions for same verse', () => {
      const element = createTestElement(`
        <p>
          Compare John 3:16 NIV with John 3:16 ESV and John 3:16 KJV.
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(3);
      expect(results[2].version).toBe('NIV');
      expect(results[1].version).toBe('ESV');
      expect(results[0].version).toBe('KJV');
    });

    it('should handle references with non-breaking spaces', () => {
      // \u00A0 is non-breaking space
      const element = createTestElement('<p>Read\u00A0John\u00A03:16\u00A0today.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].book).toBe('JHN');
    });

    it('should handle references with mixed regular and non-breaking spaces', () => {
      const element = createTestElement('<p>Check John\u00A03:16 and Romans 8:28 out.</p>');
      const results = scanner.scan(element);
      expect(results).toHaveLength(2);
    });

    it('should handle nested HTML with complex structure', () => {
      const element = createTestElement(`
        <div>
          <section>
            <article>
              <div>
                <p>Deep nested <strong>John 3:16 reference</strong> here.</p>
              </div>
            </article>
          </section>
        </div>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');
    });

    it('should handle references split across inline elements', () => {
      const element = createTestElement(`
        <p>Read <strong>John</strong> <em>3:16</em> today.</p>
      `);
      // Note: This is a known limitation - references split across elements won't be detected
      // because we process text nodes individually
      const results = scanner.scan(element);
      // Each text node is separate: "Read ", "John", " ", "3:16", " today."
      // So this should not match (which is expected behavior)
      expect(results).toHaveLength(0);
    });

    it('should handle special characters in various combinations', () => {
      const element = createTestElement(`
        <p>
          [John 3:16], (Romans 8:28), "Psalm 23:1", 'Genesis 1:1',
          «Matthew 5:16», ‹Luke 10:27›, {Acts 1:8}
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(7);
    });

    it('should handle verse references in different languages contexts', () => {
      const element = createTestElement(`
        <p>
          En español: Juan 3:16 dice...
          En français: Jean 3:16 déclare...
          In English: John 3:16 states...
        </p>
      `);
      const results = scanner.scan(element);
      // Should only match the English "John 3:16" since our book mappings are English
      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('John 3:16');
    });

    it('should handle references with line breaks in middle of text', () => {
      const element = createTestElement(`
        <p>The verse John 3:16 is
        split across lines but
        should still work fine.</p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(1);
    });

    it('should handle multiple references with various separators', () => {
      const element = createTestElement(`
        <p>
          John 3:16; Romans 8:28; Psalm 23:1 | Genesis 1:1 & Revelation 21:4
        </p>
      `);
      const results = scanner.scan(element);
      expect(results).toHaveLength(5);
    });
  });
});
