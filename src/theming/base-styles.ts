/**
 * Base CSS styles for VerseTagger modals
 * Uses CSS custom properties (variables) for all themeable values
 */

export const baseStyles = `
/* VerseTagger Modal Container */
.versetagger-modal {
  position: absolute;
  z-index: 10000;
  background: var(--vt-modalBackground);
  border: 1px solid var(--vt-modalBorder);
  border-radius: var(--vt-modalBorderRadius);
  padding: var(--vt-modalPadding);
  max-width: var(--vt-modalMaxWidth);
  box-shadow: 0 4px 6px -1px var(--vt-modalShadow), 0 2px 4px -1px var(--vt-modalShadow);
  font-family: var(--vt-fontFamily);
  font-size: var(--vt-fontSize);
  line-height: var(--vt-lineHeight);
  color: var(--vt-textPrimary);
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

.versetagger-modal.versetagger-modal--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Modal Header */
.versetagger-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vt-modalBorder);
}

.versetagger-modal__title {
  font-weight: 600;
  color: var(--vt-textPrimary);
  margin: 0;
  font-size: var(--vt-fontSize);
}

.versetagger-modal__close {
  background: var(--vt-closeButtonBackground);
  border: none;
  color: var(--vt-closeButtonColor);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 18px;
  line-height: 1;
  transition: background-color 0.15s ease, color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.versetagger-modal__close:hover {
  background: var(--vt-closeButtonHoverBackground);
  color: var(--vt-closeButtonHoverColor);
}

.versetagger-modal__close:focus {
  outline: 2px solid var(--vt-linkColor);
  outline-offset: 2px;
}

/* Modal Content */
.versetagger-modal__content {
  color: var(--vt-textSecondary);
}

.versetagger-modal__verse {
  padding: var(--vt-versePadding);
  margin: 0;
}

.versetagger-modal__verse + .versetagger-modal__verse {
  margin-top: var(--vt-verseGap);
}

.versetagger-modal__verse-number {
  color: var(--vt-verseNumberColor);
  font-size: var(--vt-verseNumberSize);
  font-weight: 600;
  margin-right: 6px;
  user-select: none;
}

/* Modal Footer */
.versetagger-modal__footer {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--vt-modalBorder);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.versetagger-modal__version {
  color: var(--vt-textMuted);
  font-weight: 500;
}

.versetagger-modal__link {
  color: var(--vt-linkColor);
  text-decoration: none;
  transition: color 0.15s ease;
}

.versetagger-modal__link:hover {
  color: var(--vt-linkHoverColor);
  text-decoration: underline;
}

.versetagger-modal__link:focus {
  outline: 2px solid var(--vt-linkColor);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Loading State */
.versetagger-modal__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--vt-loadingColor);
}

.versetagger-modal__spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--vt-modalBorder);
  border-top-color: var(--vt-loadingColor);
  border-radius: 50%;
  animation: versetagger-spin 0.6s linear infinite;
}

@keyframes versetagger-spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.versetagger-modal__error {
  background: var(--vt-errorBackground);
  color: var(--vt-errorText);
  padding: 12px;
  border-radius: 4px;
  font-size: 13px;
}

/* Scripture Reference Links (in page content) */
.versetagger-ref {
  color: var(--vt-linkColor);
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--vt-linkColor);
  transition: color 0.15s ease;
}

.versetagger-ref:hover {
  color: var(--vt-linkHoverColor);
  text-decoration-style: solid;
}

.versetagger-ref:focus {
  outline: 2px solid var(--vt-linkColor);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .versetagger-modal {
    max-width: calc(100vw - 32px);
    left: 16px !important;
    right: 16px !important;
  }
}

/* Positioning Utility Classes */
.versetagger-modal--below {
  /* Positioned below the reference */
}

.versetagger-modal--above {
  /* Positioned above the reference */
}

/* Accessibility: Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .versetagger-modal {
    transition: opacity 0.01ms, transform 0.01ms;
  }

  .versetagger-modal__spinner {
    animation: none;
    border-top-color: var(--vt-loadingColor);
  }
}
`;
