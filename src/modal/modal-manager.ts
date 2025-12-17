/**
 * Modal Manager
 * Manages modal lifecycle, positioning, and accessibility
 */

import type { VersetaggerConfig } from '../core/config';
import type { VerseContent } from '../api/youversion-client';
import { injectModalStyles, removeModalStyles } from './modal-styles';

export type ModalState = 'hidden' | 'loading' | 'loaded' | 'error';

export interface ModalPosition {
  top: number;
  left: number;
  placement: 'above' | 'below';
}

/**
 * Modal manager for scripture verse display
 */
export class ModalManager {
  private config: Required<VersetaggerConfig>;
  private modalElement: HTMLElement | null = null;
  private containerElement: HTMLElement | null = null;
  private currentTarget: HTMLElement | null = null;
  private currentState: ModalState = 'hidden';
  private renderCallback: ((container: HTMLElement, content: VerseContent) => void) | null = null;
  private focusBeforeModal: HTMLElement | null = null;

  constructor(config: Required<VersetaggerConfig>) {
    this.config = config;
  }

  /**
   * Initialize the modal system (lazy - modal created on first use)
   */
  initialize(renderCallback: (container: HTMLElement, content: VerseContent) => void): void {
    this.renderCallback = renderCallback;
    // Note: Modal container and styles are created lazily on first show
    // This reduces initial page load impact
  }

  /**
   * Ensure modal is created (lazy initialization)
   * This is called on first use to minimize initial page load impact
   */
  private ensureModalCreated(): void {
    if (this.modalElement) {
      return; // Already created
    }

    // Inject styles on first use
    injectModalStyles();

    // Create container outside main DOM
    this.modalElement = document.createElement('div');
    this.modalElement.id = 'versetagger-modal';
    this.modalElement.className = 'versetagger-modal';
    this.modalElement.setAttribute('role', 'dialog');
    this.modalElement.setAttribute('aria-modal', 'true');
    this.modalElement.setAttribute('aria-label', 'Scripture verse content');
    this.modalElement.style.display = 'none';

    // Create inner container for content
    this.containerElement = document.createElement('div');
    this.containerElement.className = 'versetagger-modal-content';
    this.modalElement.appendChild(this.containerElement);

    // Add close button for accessibility and mobile
    const closeButton = document.createElement('button');
    closeButton.className = 'versetagger-modal-close';
    closeButton.setAttribute('aria-label', 'Close modal');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => this.hide());
    this.modalElement.appendChild(closeButton);

    // Append to body
    document.body.appendChild(this.modalElement);

    // Attach global listeners (only once)
    this.attachGlobalListeners();
  }

  /**
   * Attach global event listeners
   */
  private attachGlobalListeners(): void {
    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.currentState !== 'hidden') {
        this.hide();
      }
    });

    // Close when clicking outside modal
    document.addEventListener('click', (event) => {
      if (this.currentState !== 'hidden' && this.modalElement) {
        const target = event.target as Node;
        // Don't close if clicking on the modal itself or the trigger element
        if (
          !this.modalElement.contains(target) &&
          this.currentTarget &&
          !this.currentTarget.contains(target)
        ) {
          this.hide();
        }
      }
    });

    // Keep modal open when hovering over it
    if (this.modalElement) {
      this.modalElement.addEventListener('mouseenter', () => {
        // Modal is being hovered, don't close
        this.modalElement?.setAttribute('data-hover', 'true');
      });

      this.modalElement.addEventListener('mouseleave', () => {
        this.modalElement?.removeAttribute('data-hover');
        // Close after a small delay if trigger is also not hovered
        setTimeout(() => {
          if (
            this.modalElement?.getAttribute('data-hover') !== 'true' &&
            this.currentTarget &&
            !this.currentTarget.matches(':hover')
          ) {
            this.hide();
          }
        }, 100);
      });
    }

    // Handle window resize - reposition modal
    window.addEventListener('resize', () => {
      if (this.currentState !== 'hidden' && this.currentTarget) {
        this.position(this.currentTarget);
      }
    });

    // Handle scroll - reposition modal
    window.addEventListener('scroll', () => {
      if (this.currentState !== 'hidden' && this.currentTarget) {
        this.position(this.currentTarget);
      }
    }, { passive: true });
  }

  /**
   * Show modal in loading state
   */
  showLoading(targetElement: HTMLElement): void {
    // Ensure modal is created (lazy initialization)
    this.ensureModalCreated();

    if (!this.modalElement || !this.containerElement) {
      return;
    }

    // Store focus before opening modal
    this.focusBeforeModal = document.activeElement as HTMLElement;

    // Prevent body scroll on mobile
    document.body.classList.add('versetagger-modal-open');

    this.currentTarget = targetElement;
    this.currentState = 'loading';

    // Clear previous content
    this.containerElement.innerHTML = '';

    // Show loading spinner
    const loadingEl = document.createElement('div');
    loadingEl.className = 'versetagger-modal-loading';
    loadingEl.setAttribute('role', 'status');
    loadingEl.setAttribute('aria-live', 'polite');
    loadingEl.innerHTML = `
      <div class="versetagger-spinner"></div>
      <span class="versetagger-sr-only">Loading verse content...</span>
    `;
    this.containerElement.appendChild(loadingEl);

    // Position and show modal
    this.position(targetElement);
    this.modalElement.style.display = 'block';
    this.modalElement.classList.add('versetagger-modal-visible');

    // Announce to screen readers
    if (this.config.accessibility.announceToScreenReaders) {
      this.announce('Loading verse content');
    }
  }

  /**
   * Show modal with verse content
   */
  showContent(content: VerseContent): void {
    if (!this.modalElement || !this.containerElement || !this.renderCallback) {
      return;
    }

    this.currentState = 'loaded';

    // Clear loading state
    this.containerElement.innerHTML = '';

    // Render content using callback
    this.renderCallback(this.containerElement, content);

    // Announce to screen readers
    if (this.config.accessibility.announceToScreenReaders) {
      this.announce(`Loaded ${content.reference}`);
    }
  }

  /**
   * Show modal with error message
   */
  showError(message: string): void {
    if (!this.modalElement || !this.containerElement) {
      return;
    }

    this.currentState = 'error';

    // Clear previous content
    this.containerElement.innerHTML = '';

    // Show error message
    const errorEl = document.createElement('div');
    errorEl.className = 'versetagger-modal-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.innerHTML = `
      <span class="versetagger-error-icon">⚠️</span>
      <p class="versetagger-error-message">${this.escapeHtml(message)}</p>
    `;
    this.containerElement.appendChild(errorEl);

    // Announce to screen readers
    if (this.config.accessibility.announceToScreenReaders) {
      this.announce(`Error: ${message}`);
    }
  }

  /**
   * Hide modal
   */
  hide(): void {
    if (!this.modalElement) {
      return;
    }

    this.currentState = 'hidden';
    this.modalElement.classList.remove('versetagger-modal-visible');

    // Re-enable body scroll
    document.body.classList.remove('versetagger-modal-open');

    // Wait for transition to complete before hiding
    setTimeout(() => {
      if (this.modalElement && this.currentState === 'hidden') {
        this.modalElement.style.display = 'none';
      }
    }, 200); // Match CSS transition duration

    // Restore focus
    if (this.focusBeforeModal && this.config.accessibility.keyboardNav) {
      this.focusBeforeModal.focus();
      this.focusBeforeModal = null;
    }

    this.currentTarget = null;
  }

  /**
   * Position modal relative to target element
   * Smart positioning algorithm: prefer below, fallback to above, prevent viewport overflow
   */
  private position(targetElement: HTMLElement): void {
    if (!this.modalElement) {
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const modalRect = this.modalElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spacing = 8; // Pixels between target and modal
    const horizontalPadding = 16; // Minimum padding from viewport edge

    let placement: 'above' | 'below' = 'below';
    let top = 0;
    let left = 0;

    // Calculate vertical position
    const spaceBelow = viewportHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;

    // Prefer below, but use above if not enough space below
    if (spaceBelow >= modalRect.height + spacing || spaceBelow >= spaceAbove) {
      // Position below
      placement = 'below';
      top = targetRect.bottom + spacing + window.scrollY;
    } else {
      // Position above
      placement = 'above';
      top = targetRect.top - modalRect.height - spacing + window.scrollY;
    }

    // Calculate horizontal position (center on target, but prevent overflow)
    const targetCenter = targetRect.left + targetRect.width / 2;
    const modalHalfWidth = modalRect.width / 2;

    left = targetCenter - modalHalfWidth;

    // Prevent overflow on left edge
    if (left < horizontalPadding) {
      left = horizontalPadding;
    }

    // Prevent overflow on right edge
    if (left + modalRect.width > viewportWidth - horizontalPadding) {
      left = viewportWidth - modalRect.width - horizontalPadding;
    }

    // Apply position
    this.modalElement.style.top = `${top}px`;
    this.modalElement.style.left = `${left + window.scrollX}px`;
    this.modalElement.setAttribute('data-placement', placement);
  }

  /**
   * Get current modal state
   */
  getState(): ModalState {
    return this.currentState;
  }

  /**
   * Get current target element
   */
  getCurrentTarget(): HTMLElement | null {
    return this.currentTarget;
  }

  /**
   * Check if modal is visible
   */
  isVisible(): boolean {
    return this.currentState !== 'hidden';
  }

  /**
   * Announce message to screen readers
   */
  private announce(message: string): void {
    const announcer = document.createElement('div');
    announcer.className = 'versetagger-sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.textContent = message;

    document.body.appendChild(announcer);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Required<VersetaggerConfig>): void {
    this.config = config;
  }

  /**
   * Destroy modal and cleanup
   */
  destroy(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
      this.containerElement = null;
    }
    // Re-enable body scroll
    document.body.classList.remove('versetagger-modal-open');
    // Remove injected styles
    removeModalStyles();
    this.currentTarget = null;
    this.currentState = 'hidden';
    this.renderCallback = null;
  }
}
