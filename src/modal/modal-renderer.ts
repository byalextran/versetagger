/**
 * Modal Renderer
 * Renders verse content in the modal with proper formatting and safety
 */

import type { VerseContent } from '../api/youversion-client';
import type { VersetaggerConfig } from '../core/config';
import { sanitizeHtml, createSafeLink, createTextNode } from '../utils/sanitizer';

/**
 * Render verse content into modal container
 */
export function renderVerseContent(
  container: HTMLElement,
  content: VerseContent,
  config: Required<VersetaggerConfig>
): void {
  // Clear container
  container.innerHTML = '';

  // Create header with reference and version
  const header = document.createElement('div');
  header.className = 'versetagger-modal-header';

  const referenceTitle = document.createElement('h3');
  referenceTitle.className = 'versetagger-modal-reference';
  referenceTitle.appendChild(createTextNode(content.reference));
  header.appendChild(referenceTitle);

  const versionBadge = document.createElement('span');
  versionBadge.className = 'versetagger-modal-version';
  versionBadge.appendChild(createTextNode(content.version));
  header.appendChild(versionBadge);

  container.appendChild(header);

  // Create verse container
  const versesContainer = document.createElement('div');
  versesContainer.className = 'versetagger-modal-verses';

  // Render each verse
  content.verses.forEach(verse => {
    const verseEl = document.createElement('div');
    verseEl.className = 'versetagger-modal-verse';

    // Verse number
    const verseNumber = document.createElement('span');
    verseNumber.className = 'versetagger-verse-number';
    verseNumber.appendChild(createTextNode(verse.number.toString()));
    verseEl.appendChild(verseNumber);

    // Verse text - sanitize HTML from API
    const verseText = document.createElement('span');
    verseText.className = 'versetagger-verse-text';

    // Sanitize the text to prevent XSS
    const sanitizedText = sanitizeHtml(verse.text);
    verseText.innerHTML = sanitizedText;

    verseEl.appendChild(verseText);
    versesContainer.appendChild(verseEl);
  });

  container.appendChild(versesContainer);

  // Create footer with link to YouVersion
  const footer = document.createElement('div');
  footer.className = 'versetagger-modal-footer';

  const youversionLink = createYouVersionLink(content, config);
  footer.appendChild(youversionLink);

  container.appendChild(footer);
}

/**
 * Create link to YouVersion for full context
 */
function createYouVersionLink(
  content: VerseContent,
  config: Required<VersetaggerConfig>
): HTMLAnchorElement {
  // Build URL using link format from config
  let url = config.linkFormat;

  // Get version ID for YouVersion URL
  const versionId = getVersionId(content.version);

  // Get book ID for YouVersion URL
  const bookId = getBookId(content.book);

  // Format verses for URL
  const versesParam = formatVersesForUrl(content.verses.map(v => v.number));

  // Replace placeholders
  url = url
    .replace('{version}', versionId)
    .replace('{book}', bookId)
    .replace('{chapter}', content.chapter.toString())
    .replace('{verses}', versesParam);

  // Create safe link
  const link = createSafeLink(
    'Read on YouVersion',
    url,
    {
      className: 'versetagger-youversion-link',
      target: config.openLinksInNewTab ? '_blank' : undefined,
      rel: 'noopener noreferrer'
    }
  );

  // Add icon
  const icon = document.createElement('span');
  icon.className = 'versetagger-external-icon';
  icon.innerHTML = '&nbsp;↗';
  link.appendChild(icon);

  return link;
}

/**
 * Get YouVersion version ID from version abbreviation
 */
function getVersionId(version: string): string {
  // Map common versions to YouVersion IDs
  const versionMap: Record<string, string> = {
    'NIV': '111',
    'ESV': '59',
    'NLT': '116',
    'KJV': '1',
    'NKJV': '114',
    'NASB': '100',
    'CSB': '1713',
    'AMP': '1588',
    'MSG': '97',
    'NRSV': '2016'
  };

  return versionMap[version.toUpperCase()] || version;
}

/**
 * Get YouVersion book ID from book code
 */
function getBookId(bookCode: string): string {
  // Map book codes to YouVersion book IDs
  const bookMap: Record<string, string> = {
    // Old Testament
    'GEN': '1', 'EXO': '2', 'LEV': '3', 'NUM': '4', 'DEU': '5',
    'JOS': '6', 'JDG': '7', 'RUT': '8', '1SA': '9', '2SA': '10',
    '1KI': '11', '2KI': '12', '1CH': '13', '2CH': '14', 'EZR': '15',
    'NEH': '16', 'EST': '17', 'JOB': '18', 'PSA': '19', 'PRO': '20',
    'ECC': '21', 'SNG': '22', 'ISA': '23', 'JER': '24', 'LAM': '25',
    'EZK': '26', 'DAN': '27', 'HOS': '28', 'JOL': '29', 'AMO': '30',
    'OBA': '31', 'JON': '32', 'MIC': '33', 'NAM': '34', 'HAB': '35',
    'ZEP': '36', 'HAG': '37', 'ZEC': '38', 'MAL': '39',

    // New Testament
    'MAT': '40', 'MRK': '41', 'LUK': '42', 'JHN': '43', 'ACT': '44',
    'ROM': '45', '1CO': '46', '2CO': '47', 'GAL': '48', 'EPH': '49',
    'PHP': '50', 'COL': '51', '1TH': '52', '2TH': '53', '1TI': '54',
    '2TI': '55', 'TIT': '56', 'PHM': '57', 'HEB': '58', 'JAS': '59',
    '1PE': '60', '2PE': '61', '1JN': '62', '2JN': '63', '3JN': '64',
    'JUD': '65', 'REV': '66'
  };

  return bookMap[bookCode.toUpperCase()] || bookCode;
}

/**
 * Format verse numbers for URL
 */
function formatVersesForUrl(verses: number[]): string {
  if (verses.length === 0) {
    return '';
  }

  if (verses.length === 1) {
    return verses[0].toString();
  }

  // Check if it's a continuous range
  const sorted = [...verses].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // If continuous, format as range
  if (max - min === sorted.length - 1) {
    return `${min}-${max}`;
  }

  // Otherwise, use comma-separated list
  return sorted.join(',');
}
