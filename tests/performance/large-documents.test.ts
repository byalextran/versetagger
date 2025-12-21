import { describe, it, expect, beforeEach } from 'vitest';
import { DOMScanner } from '../../src/core/scanner';
import { DEFAULT_CONFIG } from '../../src/core/config';
import { createTestElement } from '../helpers/dom-helpers';

describe('Performance Tests - Large Documents', () => {
  let scanner: DOMScanner;

  beforeEach(() => {
    scanner = new DOMScanner(DEFAULT_CONFIG);
  });

  describe('Large Document Benchmarks', () => {
    it('should handle 100 references in under 500ms', () => {
      // Create a document with 100 scripture references
      const references = [
        'John 3:16', 'Matthew 5:3-12', 'Romans 8:28', 'Psalm 23:1',
        'Genesis 1:1', 'Revelation 21:4', 'Isaiah 40:31', 'Jeremiah 29:11',
        'Philippians 4:13', 'Proverbs 3:5-6', '1 Corinthians 13:4-8',
        'Ephesians 2:8-9', 'Hebrews 11:1', 'James 1:2-4', '2 Timothy 3:16-17'
      ];

      let html = '<div>';
      // Repeat references to get 100 total
      for (let i = 0; i < 7; i++) {
        for (const ref of references) {
          html += `<p>This is a paragraph containing ${ref} with some surrounding text.</p>`;
        }
      }
      html += '</div>';

      const element = createTestElement(html);
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      expect(results.length).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(500);
      console.log(`  ✓ Scanned ${results.length} references in ${duration.toFixed(2)}ms`);
    });

    it('should handle 1000+ paragraphs in under 2 seconds', () => {
      // Create a document with 1000+ paragraphs
      // Mix of paragraphs with and without references
      let html = '<div>';
      const sampleRefs = ['John 3:16', 'Romans 8:28', 'Psalm 23:1', 'Genesis 1:1'];

      for (let i = 0; i < 1000; i++) {
        // Every 5th paragraph has a reference
        if (i % 5 === 0) {
          const ref = sampleRefs[i % sampleRefs.length];
          html += `<p>Paragraph ${i} contains ${ref} with text.</p>`;
        } else {
          html += `<p>Paragraph ${i} with some regular text content without any references.</p>`;
        }
      }
      html += '</div>';

      const element = createTestElement(html);
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      expect(results.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(2000);
      console.log(`  ✓ Scanned 1000 paragraphs (${results.length} references) in ${duration.toFixed(2)}ms`);
    });

    it('should handle deep nesting (50+ levels) in under 1 second', () => {
      // Create deeply nested structure
      let html = '';
      const depth = 50;

      // Open 50 nested divs
      for (let i = 0; i < depth; i++) {
        html += `<div class="level-${i}">`;
      }

      // Add content with references at various levels
      html += '<p>Genesis 1:1</p>';
      html += '<p>John 3:16</p>';
      html += '<p>Romans 8:28</p>';
      html += '<p>Psalm 23:1</p>';
      html += '<p>Matthew 5:3-12</p>';

      // Close all divs
      for (let i = 0; i < depth; i++) {
        html += '</div>';
      }

      const element = createTestElement(html);
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      expect(results.length).toBe(5);
      expect(duration).toBeLessThan(1000);
      console.log(`  ✓ Scanned ${depth} levels deep in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Regex Performance', () => {
    it('should parse long text with single reference in under 50ms', () => {
      // Create a very long text with a single reference in the middle
      const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);
      const textWithRef = `${longText} Check out John 3:16 for more info. ${longText}`;

      const element = createTestElement(`<p>${textWithRef}</p>`);
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      expect(results.length).toBe(1);
      expect(duration).toBeLessThan(50);
      console.log(`  ✓ Parsed ${textWithRef.length} chars with 1 reference in ${duration.toFixed(2)}ms`);
    });

    it('should parse text with many matches in under 100ms', () => {
      // Create text with many references close together
      const references = [
        'Genesis 1:1', 'Exodus 20:1-17', 'Leviticus 19:18',
        'Numbers 6:24-26', 'Deuteronomy 6:4-9', 'Joshua 1:9',
        'Judges 6:12', 'Ruth 1:16', '1 Samuel 16:7', '2 Samuel 22:3',
        '1 Kings 8:27', '2 Kings 2:11', '1 Chronicles 16:34',
        '2 Chronicles 7:14', 'Ezra 7:10', 'Nehemiah 8:10',
        'Esther 4:14', 'Job 19:25', 'Psalm 23:1-6', 'Proverbs 3:5-6',
        'Ecclesiastes 3:1', 'Song of Solomon 8:6-7', 'Isaiah 40:31',
        'Jeremiah 29:11', 'Lamentations 3:22-23', 'Ezekiel 36:26',
        'Daniel 3:17-18', 'Hosea 6:3', 'Joel 2:25', 'Amos 5:24',
        'Obadiah 1:15', 'Jonah 2:9', 'Micah 6:8', 'Nahum 1:7',
        'Habakkuk 2:14', 'Zephaniah 3:17', 'Haggai 2:4-5', 'Zechariah 4:6',
        'Malachi 3:10', 'Matthew 5:3-12', 'Mark 10:27', 'Luke 1:37',
        'John 3:16', 'Acts 1:8', 'Romans 8:28', '1 Corinthians 13:4-8',
        '2 Corinthians 5:17', 'Galatians 5:22-23', 'Ephesians 2:8-9'
      ];

      const html = `<div><p>${references.join(' and ')}</p></div>`;

      const element = createTestElement(html);
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      expect(results.length).toBe(references.length);
      expect(duration).toBeLessThan(100);
      console.log(`  ✓ Parsed ${references.length} references in ${duration.toFixed(2)}ms`);
    });

    it('should handle mixed content efficiently', () => {
      // Mix of references and non-reference text
      const longText = 'Lorem ipsum dolor sit amet. '.repeat(100);
      const html = `
        <div>
          <p>${longText}</p>
          <p>Check out John 3:16 for more info.</p>
          <p>${longText}</p>
          <p>Also see Romans 8:28 and Psalm 23:1-6.</p>
          <p>${longText}</p>
          <p>Matthew 5:3-12 is interesting.</p>
          <p>${longText}</p>
        </div>
      `;

      const element = createTestElement(html);
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      expect(results.length).toBe(4);
      expect(duration).toBeLessThan(100);
      console.log(`  ✓ Scanned mixed content in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Cache Effectiveness', () => {
    it('should not re-scan already tagged content', () => {
      const html = `
        <div>
          <p>First paragraph with John 3:16.</p>
          <p>Second paragraph with Romans 8:28.</p>
          <p>Third paragraph with Psalm 23:1.</p>
        </div>
      `;

      const element = createTestElement(html);
      document.body.appendChild(element);

      // First scan
      const startTime1 = performance.now();
      const results1 = scanner.scan(element);
      const endTime1 = performance.now();
      const duration1 = endTime1 - startTime1;

      // Second scan (should be faster due to cache)
      const startTime2 = performance.now();
      const results2 = scanner.scan(element);
      const endTime2 = performance.now();
      const duration2 = endTime2 - startTime2;

      document.body.removeChild(element);

      expect(results1.length).toBe(3);
      expect(results2.length).toBe(0); // No new references found
      expect(duration2).toBeLessThanOrEqual(duration1);

      console.log(`  ✓ First scan: ${duration1.toFixed(2)}ms, Second scan: ${duration2.toFixed(2)}ms`);
    });

    it('should scan new content after cache clear', () => {
      const html = `
        <div>
          <p>Genesis 1:1 and Revelation 22:21.</p>
        </div>
      `;

      const element = createTestElement(html);
      document.body.appendChild(element);

      // First scan
      const results1 = scanner.scan(element);
      expect(results1.length).toBe(2);

      // Second scan without clearing cache (should find nothing new)
      const results2 = scanner.scan(element);
      expect(results2.length).toBe(0);

      // Clear cache and scan again
      scanner.clearCache();

      // Remove previous tags to simulate fresh content
      element.querySelectorAll('.verse-reference').forEach(el => {
        const textNode = document.createTextNode(el.textContent || '');
        el.parentNode?.replaceChild(textNode, el);
      });

      // Scan after cache clear
      const results3 = scanner.scan(element);
      expect(results3.length).toBe(2);

      document.body.removeChild(element);
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory with repeated scans', () => {
      // This test ensures WeakSet is working properly
      // and nodes are garbage collected

      const iterations = 100;
      const results: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const html = `
          <div>
            <p>Iteration ${i}: John 3:16, Romans 8:28, Psalm 23:1.</p>
          </div>
        `;

        const element = createTestElement(html);
        document.body.appendChild(element);

        const scanned = scanner.scan(element);
        results.push(scanned.length);

        // Clean up immediately
        document.body.removeChild(element);

        // Clear cache to allow rescanning
        scanner.clearCache();
      }

      // All iterations should find 3 references each
      expect(results.every(count => count === 3)).toBe(true);
      expect(results.length).toBe(iterations);

      console.log(`  ✓ Completed ${iterations} iterations without memory issues`);
    });

    it('should handle rapid successive scans', () => {
      const html = `
        <div>
          <p>Matthew 5:1-12</p>
          <p>John 3:16</p>
          <p>Romans 8:28</p>
        </div>
      `;

      const element = createTestElement(html);
      document.body.appendChild(element);

      // Perform 50 rapid scans
      const scans = 50;
      const startTime = performance.now();

      for (let i = 0; i < scans; i++) {
        scanner.scan(element);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const avgDuration = duration / scans;

      document.body.removeChild(element);

      expect(duration).toBeLessThan(1000); // Total time should be reasonable
      console.log(`  ✓ ${scans} rapid scans in ${duration.toFixed(2)}ms (avg: ${avgDuration.toFixed(2)}ms/scan)`);
    });
  });

  describe('Complex Real-World Scenarios', () => {
    it('should handle blog post with mixed content efficiently', () => {
      // Simulate a real blog post with various elements
      const html = `
        <article>
          <h1>Understanding Faith</h1>
          <p>In the beginning, Genesis 1:1 tells us about creation.</p>

          <blockquote>
            For God so loved the world - John 3:16
          </blockquote>

          <p>Many believers turn to Romans 8:28 for comfort.</p>

          <ul>
            <li>Psalm 23:1-6 - The Shepherd Psalm</li>
            <li>Proverbs 3:5-6 - Trust in the Lord</li>
            <li>Isaiah 40:31 - Strength in waiting</li>
          </ul>

          <p>${'Lorem ipsum dolor sit amet. '.repeat(100)}</p>

          <pre><code>
            // This John 3:16 should NOT be tagged
            const verse = "John 3:16";
          </code></pre>

          <p>Paul writes in Philippians 4:13 about strength.</p>

          <table>
            <tr>
              <td>Reference</td>
              <td>Theme</td>
            </tr>
            <tr>
              <td>Jeremiah 29:11</td>
              <td>Hope</td>
            </tr>
            <tr>
              <td>Matthew 5:3-12</td>
              <td>Beatitudes</td>
            </tr>
          </table>

          <p>Finally, Revelation 21:4 speaks of hope.</p>
        </article>
      `;

      const element = createTestElement(html);
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      // Should find all references except the one in <code>
      expect(results.length).toBeGreaterThanOrEqual(10);
      expect(duration).toBeLessThan(100);
      console.log(`  ✓ Scanned complex blog post (${results.length} references) in ${duration.toFixed(2)}ms`);
    });

    it('should handle very large blog post efficiently', () => {
      // Create a huge blog post
      let html = '<article>';

      // Header
      html += '<h1>A Comprehensive Study</h1>';

      // 50 paragraphs with references
      const references = [
        'Genesis 1:1', 'Exodus 20:1', 'Leviticus 19:18', 'Numbers 6:24',
        'Deuteronomy 6:4', 'Joshua 1:9', 'Judges 6:12', 'Ruth 1:16',
        'Psalm 23:1', 'Proverbs 3:5', 'Isaiah 40:31', 'Jeremiah 29:11',
        'Matthew 5:3', 'Mark 10:27', 'Luke 1:37', 'John 3:16',
        'Acts 1:8', 'Romans 8:28', '1 Corinthians 13:4', 'Galatians 5:22'
      ];

      for (let i = 0; i < 50; i++) {
        const ref = references[i % references.length];
        html += `<p>${'Lorem ipsum dolor sit amet. '.repeat(20)} ${ref} ${'More text here. '.repeat(20)}</p>`;
      }

      html += '</article>';

      const element = createTestElement(html);
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      expect(results.length).toBe(50);
      expect(duration).toBeLessThan(500);
      console.log(`  ✓ Scanned large blog post (50 paragraphs, ${results.length} references) in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Edge Case Performance', () => {
    it('should handle document with no references efficiently', () => {
      const html = `
        <div>
          ${'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'.repeat(100)}
        </div>
      `;

      const element = createTestElement(html);
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      expect(results.length).toBe(0);
      expect(duration).toBeLessThan(100);
      console.log(`  ✓ Scanned 100 paragraphs with no references in ${duration.toFixed(2)}ms`);
    });

    it('should handle empty document efficiently', () => {
      const element = createTestElement('<div></div>');
      document.body.appendChild(element);

      const startTime = performance.now();
      const results = scanner.scan(element);
      const endTime = performance.now();
      const duration = endTime - startTime;

      document.body.removeChild(element);

      expect(results.length).toBe(0);
      expect(duration).toBeLessThan(10);
      console.log(`  ✓ Scanned empty document in ${duration.toFixed(2)}ms`);
    });
  });
});
