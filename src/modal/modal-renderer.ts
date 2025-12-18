/**
 * Modal Renderer
 * Renders verse content in the modal with proper formatting and safety
 */

import type { VerseContent } from '../api/youversion-client';
import type { VersetaggerConfig } from '../core/config';
import { createSafeLink, createTextNode } from '../utils/sanitizer';

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

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'versetagger-modal-content';

  // Render verse content
  const contentText = document.createElement('p');
  contentText.className = 'versetagger-content-text';

  // Set plain text content directly (API returns plain text, not HTML)
  contentText.textContent = content.content;

  contentContainer.appendChild(contentText);
  container.appendChild(contentContainer);

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

  // Replace placeholders
  url = url
    .replace('{version}', versionId)
    .replace('{book}', content.book)
    .replace('{chapter}', content.chapter.toString())
    .replace('{verses}', content.verses);

  // Create safe link
  const link = createSafeLink(
    'Read on Bible.com',
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


