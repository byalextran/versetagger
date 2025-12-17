/**
 * Modal Styles
 * Base CSS for modal system with mobile responsiveness
 */

export const MODAL_BASE_STYLES = `
/* Modal Container */
.versetagger-modal {
  position: absolute;
  z-index: 999999;
  background: var(--versetagger-modal-bg, #ffffff);
  border: 1px solid var(--versetagger-modal-border, #e0e0e0);
  border-radius: var(--versetagger-modal-radius, 8px);
  box-shadow: var(--versetagger-modal-shadow, 0 4px 20px rgba(0, 0, 0, 0.15));
  max-width: var(--versetagger-modal-max-width, 500px);
  min-width: var(--versetagger-modal-min-width, 280px);
  width: var(--versetagger-modal-width, 90vw);
  max-height: var(--versetagger-modal-max-height, 80vh);
  overflow-y: auto;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  font-family: var(--versetagger-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  font-size: var(--versetagger-font-size, 16px);
  line-height: var(--versetagger-line-height, 1.6);
  color: var(--versetagger-text-color, #333333);
}

/* Modal visible state */
.versetagger-modal-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Modal placement variants */
.versetagger-modal[data-placement="below"] {
  transform-origin: top center;
}

.versetagger-modal[data-placement="above"] {
  transform-origin: bottom center;
}

/* Modal Content Container */
.versetagger-modal-content {
  padding: var(--versetagger-modal-padding, 20px);
}

/* Close Button */
.versetagger-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 28px;
  line-height: 1;
  color: var(--versetagger-close-color, #666666);
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
  z-index: 10;
}

.versetagger-modal-close:hover {
  background-color: var(--versetagger-close-hover-bg, #f0f0f0);
  color: var(--versetagger-close-hover-color, #333333);
}

.versetagger-modal-close:focus {
  outline: 2px solid var(--versetagger-focus-color, #0066cc);
  outline-offset: 2px;
}

/* Header */
.versetagger-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-right: 32px; /* Make room for close button */
  gap: 12px;
  flex-wrap: wrap;
}

.versetagger-modal-reference {
  margin: 0;
  font-size: var(--versetagger-reference-font-size, 18px);
  font-weight: var(--versetagger-reference-font-weight, 600);
  color: var(--versetagger-reference-color, #1a1a1a);
  flex: 1;
  min-width: 0;
}

.versetagger-modal-version {
  display: inline-block;
  padding: 4px 10px;
  background: var(--versetagger-version-bg, #f5f5f5);
  color: var(--versetagger-version-color, #666666);
  border-radius: var(--versetagger-version-radius, 4px);
  font-size: var(--versetagger-version-font-size, 13px);
  font-weight: var(--versetagger-version-font-weight, 500);
  white-space: nowrap;
}

/* Verses Container */
.versetagger-modal-verses {
  margin-bottom: 16px;
}

.versetagger-modal-verse {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: flex-start;
}

.versetagger-modal-verse:last-child {
  margin-bottom: 0;
}

.versetagger-verse-number {
  flex-shrink: 0;
  font-weight: var(--versetagger-verse-number-weight, 700);
  color: var(--versetagger-verse-number-color, #0066cc);
  font-size: var(--versetagger-verse-number-size, 14px);
  min-width: 24px;
  text-align: right;
  line-height: inherit;
}

.versetagger-verse-text {
  flex: 1;
  color: var(--versetagger-verse-text-color, #333333);
}

/* Footer */
.versetagger-modal-footer {
  padding-top: 12px;
  border-top: 1px solid var(--versetagger-footer-border, #e0e0e0);
  display: flex;
  justify-content: flex-end;
}

.versetagger-youversion-link {
  display: inline-flex;
  align-items: center;
  color: var(--versetagger-link-color, #0066cc);
  text-decoration: none;
  font-size: var(--versetagger-link-font-size, 14px);
  font-weight: var(--versetagger-link-font-weight, 500);
  transition: color 0.2s ease;
}

.versetagger-youversion-link:hover {
  color: var(--versetagger-link-hover-color, #0052a3);
  text-decoration: underline;
}

.versetagger-youversion-link:focus {
  outline: 2px solid var(--versetagger-focus-color, #0066cc);
  outline-offset: 2px;
  border-radius: 2px;
}

.versetagger-external-icon {
  font-size: 12px;
  opacity: 0.7;
}

/* Loading State */
.versetagger-modal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  gap: 12px;
}

.versetagger-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--versetagger-spinner-bg, #e0e0e0);
  border-top-color: var(--versetagger-spinner-color, #0066cc);
  border-radius: 50%;
  animation: versetagger-spin 0.8s linear infinite;
}

@keyframes versetagger-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.versetagger-modal-error {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--versetagger-error-bg, #fff3f3);
  border: 1px solid var(--versetagger-error-border, #ffcccc);
  border-radius: 6px;
}

.versetagger-error-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.versetagger-error-message {
  margin: 0;
  color: var(--versetagger-error-color, #cc0000);
  font-size: 14px;
  line-height: 1.5;
}

/* Screen Reader Only */
.versetagger-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .versetagger-modal {
    max-width: calc(100vw - 32px);
    width: calc(100vw - 32px);
    max-height: 85vh;
    font-size: 15px;
  }

  .versetagger-modal-content {
    padding: 16px;
  }

  .versetagger-modal-close {
    top: 8px;
    right: 8px;
    font-size: 24px;
    width: 28px;
    height: 28px;
  }

  .versetagger-modal-header {
    padding-right: 28px;
    margin-bottom: 12px;
  }

  .versetagger-modal-reference {
    font-size: 16px;
  }

  .versetagger-modal-version {
    font-size: 12px;
    padding: 3px 8px;
  }

  .versetagger-verse-number {
    font-size: 13px;
    min-width: 20px;
  }

  .versetagger-modal-verse {
    gap: 6px;
    margin-bottom: 10px;
  }
}

/* Touch-friendly interactions on mobile */
@media (hover: none) and (pointer: coarse) {
  .versetagger-modal-close {
    min-width: 44px;
    min-height: 44px;
  }

  .versetagger-youversion-link {
    padding: 8px 0;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}

/* Prevent body scroll when modal is open (will be toggled by JS) */
body.versetagger-modal-open {
  overflow: hidden;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .versetagger-modal {
    border-width: 2px;
  }

  .versetagger-modal-close:focus,
  .versetagger-youversion-link:focus {
    outline-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .versetagger-modal,
  .versetagger-modal-close,
  .versetagger-youversion-link {
    transition: none;
  }

  .versetagger-spinner {
    animation: none;
    border-top-color: var(--versetagger-spinner-bg, #e0e0e0);
  }
}

/* Dark mode support (will be enhanced by theme system in Phase 5) */
@media (prefers-color-scheme: dark) {
  .versetagger-modal {
    --versetagger-modal-bg: #1e1e1e;
    --versetagger-modal-border: #404040;
    --versetagger-modal-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    --versetagger-text-color: #e0e0e0;
    --versetagger-reference-color: #ffffff;
    --versetagger-version-bg: #2a2a2a;
    --versetagger-version-color: #b0b0b0;
    --versetagger-verse-number-color: #4da6ff;
    --versetagger-verse-text-color: #e0e0e0;
    --versetagger-footer-border: #404040;
    --versetagger-link-color: #4da6ff;
    --versetagger-link-hover-color: #80c1ff;
    --versetagger-close-color: #b0b0b0;
    --versetagger-close-hover-bg: #2a2a2a;
    --versetagger-close-hover-color: #ffffff;
    --versetagger-spinner-bg: #404040;
    --versetagger-spinner-color: #4da6ff;
    --versetagger-error-bg: #2a1a1a;
    --versetagger-error-border: #663333;
    --versetagger-error-color: #ff6b6b;
  }
}
`;

/**
 * Inject modal styles into the document
 */
export function injectModalStyles(): void {
  // Check if styles already injected
  if (document.getElementById('versetagger-modal-styles')) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = 'versetagger-modal-styles';
  styleEl.textContent = MODAL_BASE_STYLES;
  document.head.appendChild(styleEl);
}

/**
 * Remove modal styles from the document
 */
export function removeModalStyles(): void {
  const styleEl = document.getElementById('versetagger-modal-styles');
  if (styleEl) {
    styleEl.remove();
  }
}
