/**
 * Modal Styles
 * Base CSS for modal system with mobile responsiveness
 * Uses CSS variables from the theming system (--vt-* prefix)
 */

export const MODAL_BASE_STYLES = `
/* Modal Container */
.versetagger-modal {
  position: absolute;
  z-index: 999999;
  background: var(--vt-modalBackground);
  border: 1px solid var(--vt-modalBorder);
  border-radius: var(--vt-modalBorderRadius);
  box-shadow: 0 4px 6px -1px var(--vt-modalShadow), 0 2px 4px -1px var(--vt-modalShadow);
  max-width: var(--vt-modalMaxWidth);
  min-width: 280px;
  width: 90vw;
  /* Constrain to 80vh or full viewport minus padding, whichever is smaller (JS+CSS dual constraint) */
  max-height: min(80vh, calc(100vh - 32px));
  overflow-y: auto;
  overflow-x: visible; /* Allow bridge to extend outside */
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  font-family: var(--vt-fontFamily);
  font-size: var(--vt-fontSize);
  line-height: var(--vt-lineHeight);
  color: var(--vt-textPrimary);
  padding: var(--vt-modalPadding);
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

/* Invisible bridge that connects trigger to modal */
.versetagger-modal-bridge {
  position: absolute;
  pointer-events: auto;
  z-index: 999998; /* Just below modal (999999) but above page content */
  /* Dimensions set via JS based on modal position */
}

/* Close Button */
.versetagger-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--vt-closeButtonBackground);
  border: none;
  font-size: 28px;
  line-height: 1;
  color: var(--vt-closeButtonColor);
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
  background-color: var(--vt-closeButtonHoverBackground);
  color: var(--vt-closeButtonHoverColor);
}

.versetagger-modal-close:focus {
  outline: 2px solid var(--vt-linkColor);
  outline-offset: 2px;
}

/* Header */
.versetagger-modal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-right: 32px; /* Make room for close button */
  flex-wrap: nowrap;
}

.versetagger-modal-reference {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vt-textPrimary);
  flex-shrink: 1;
  min-width: 0;
}

.versetagger-modal-version {
  display: inline-block;
  padding: 4px 10px;
  background: var(--vt-modalBorder);
  color: var(--vt-textMuted);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
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
  font-weight: 700;
  color: var(--vt-verseNumberColor);
  font-size: var(--vt-verseNumberSize);
  min-width: 24px;
  text-align: right;
  line-height: inherit;
}

.versetagger-verse-text {
  flex: 1;
  color: var(--vt-textSecondary);
}

/* Content Text (for plain text display) */
.versetagger-content-text {
  margin: 0 0 16px 0;
  color: var(--vt-textSecondary);
  font-size: 14px;
  line-height: 1.6;
}

/* Content Text (error state) */
.versetagger-content-text.versetagger-content-error {
  color: var(--vt-errorText);
}

/* Footer */
.versetagger-modal-footer {
  padding-top: 12px;
  border-top: 1px solid var(--vt-modalBorder);
  display: flex;
  justify-content: flex-end;
}

.versetagger-youversion-link {
  display: inline-flex;
  align-items: center;
  color: var(--vt-linkColor);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.versetagger-youversion-link:hover {
  color: var(--vt-linkHoverColor);
}

.versetagger-youversion-link:focus {
  outline: 2px solid var(--vt-linkColor);
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
  border: 3px solid var(--vt-modalBorder);
  border-top-color: var(--vt-loadingColor);
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
}

.versetagger-error-icon {
  font-size: 20px;
  flex-shrink: 0;
  color: var(--vt-errorText);
}

.versetagger-error-message {
  margin: 0;
  color: var(--vt-errorText);
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

/* Modal open class - reserved for future use if needed */
body.versetagger-modal-open {
  /* No styles needed - modal scrolls naturally with page content */
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
    border-top-color: var(--vt-modalBorder);
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
