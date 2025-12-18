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
  private bridgeElement: HTMLElement | null = null;
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

    // Append modal to body
    document.body.appendChild(this.modalElement);

    // Create invisible bridge element as a sibling (separate element)
    this.bridgeElement = document.createElement('div');
    this.bridgeElement.className = 'versetagger-modal-bridge';
    this.bridgeElement.style.display = 'none';
    document.body.appendChild(this.bridgeElement);

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

    // Handle hover on modal to prevent premature closing
    // This works with EventHandler's mouseLeaveTimeout
    if (this.modalElement) {
      this.modalElement.addEventListener('mouseenter', () => {
        // Modal is being hovered - signal we're in the modal region
        this.modalElement?.setAttribute('data-modal-hovered', 'true');
      });

      this.modalElement.addEventListener('mouseleave', () => {
        // Left the modal
        this.modalElement?.removeAttribute('data-modal-hovered');

        // Close after small delay if trigger and bridge are also not hovered
        setTimeout(() => {
          if (
            this.modalElement?.getAttribute('data-modal-hovered') !== 'true' &&
            this.bridgeElement?.getAttribute('data-bridge-hovered') !== 'true' &&
            this.currentTarget &&
            !this.currentTarget.matches(':hover')
          ) {
            this.hide();
          }
        }, 100);
      });
    }

    // Handle hover on bridge to prevent premature closing
    if (this.bridgeElement) {
      this.bridgeElement.addEventListener('mouseenter', () => {
        // Bridge is being hovered - signal we're in the bridge region
        this.bridgeElement?.setAttribute('data-bridge-hovered', 'true');
        // Also set modal hovered so EventHandler doesn't close
        this.modalElement?.setAttribute('data-modal-hovered', 'true');
      });

      this.bridgeElement.addEventListener('mouseleave', () => {
        // Left the bridge
        this.bridgeElement?.removeAttribute('data-bridge-hovered');
        this.modalElement?.removeAttribute('data-modal-hovered');

        // Close after small delay if modal and trigger are also not hovered
        setTimeout(() => {
          if (
            this.modalElement?.getAttribute('data-modal-hovered') !== 'true' &&
            this.bridgeElement?.getAttribute('data-bridge-hovered') !== 'true' &&
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

    // Add modal open class (currently unused, but may be needed for future features)
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

    // Show and position bridge
    if (this.bridgeElement) {
      this.bridgeElement.style.display = 'block';
      this.positionBridge(targetElement);
    }

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

    // Reposition modal now that actual content is rendered (height may have changed)
    if (this.currentTarget) {
      this.position(this.currentTarget);
      // Update bridge position as well
      if (this.bridgeElement && this.bridgeElement.style.display === 'block') {
        this.positionBridge(this.currentTarget);
      }
    }

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
      <p class="versetagger-error-message">${this.escapeHtml(message)}</p>
    `;
    this.containerElement.appendChild(errorEl);

    // Reposition modal now that error content is rendered
    if (this.currentTarget) {
      this.position(this.currentTarget);
      // Update bridge position as well
      if (this.bridgeElement && this.bridgeElement.style.display === 'block') {
        this.positionBridge(this.currentTarget);
      }
    }

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

    // Hide bridge
    if (this.bridgeElement) {
      this.bridgeElement.style.display = 'none';
    }

    // Remove modal open class
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
    const verticalPadding = 16; // Minimum padding from viewport edge

    let placement: 'above' | 'below' = 'below';
    let top = 0;
    let left = 0;

    // Calculate vertical position with viewport padding
    const spaceBelow = viewportHeight - targetRect.bottom - verticalPadding;
    const spaceAbove = targetRect.top - verticalPadding;
    const modalWithSpacing = modalRect.height + spacing;

    // Determine placement based on where modal actually fits
    if (spaceBelow >= modalWithSpacing) {
      // Fits comfortably below
      placement = 'below';
      top = targetRect.bottom + spacing + window.scrollY;
    } else if (spaceAbove >= modalWithSpacing) {
      // Fits comfortably above
      placement = 'above';
      top = targetRect.top - modalRect.height - spacing + window.scrollY;
    } else if (spaceBelow > spaceAbove) {
      // Doesn't fit either place, but more space below
      placement = 'below';
      top = targetRect.bottom + spacing + window.scrollY;
    } else {
      // Doesn't fit either place, but more space above
      placement = 'above';
      top = targetRect.top - modalRect.height - spacing + window.scrollY;
    }

    // Constrain modal to viewport bounds (prevent bottom overflow)
    const modalBottom = top - window.scrollY + modalRect.height;
    const maxBottom = viewportHeight - verticalPadding;

    if (modalBottom > maxBottom) {
      // Modal overflows bottom - shift it up
      const overflow = modalBottom - maxBottom;
      top -= overflow;

      // Ensure we don't push it above viewport top
      const minTop = verticalPadding + window.scrollY;
      if (top < minTop) {
        top = minTop;
        // CSS max-height: 80vh and overflow-y: auto will handle scrolling
      }
    }

    // Ensure target element remains visible after constraining
    const modalTop = top - window.scrollY;
    const modalBottomViewport = modalTop + modalRect.height;

    if (placement === 'above' && modalBottomViewport > targetRect.top - spacing) {
      // Modal was pushed down and now covers the target
      // Shift it up to maintain spacing, even if it clips top
      const targetTop = targetRect.top - spacing;
      top = targetTop - modalRect.height + window.scrollY;
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

    // Update bridge position if visible
    if (this.bridgeElement && this.bridgeElement.style.display === 'block' && this.currentTarget) {
      this.positionBridge(this.currentTarget);
    }
  }

  /**
   * Position the invisible bridge between trigger and modal
   */
  private positionBridge(targetElement: HTMLElement): void {
    if (!this.bridgeElement || !this.modalElement) {
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const modalRect = this.modalElement.getBoundingClientRect();
    const placement = this.modalElement.getAttribute('data-placement');

    if (placement === 'below') {
      // Modal is below trigger - bridge covers ONLY the gap between trigger bottom and modal top
      const bridgeTop = targetRect.bottom + window.scrollY;
      const bridgeHeight = (modalRect.top + window.scrollY) - bridgeTop;
      const bridgeLeft = Math.min(targetRect.left, modalRect.left);
      const bridgeWidth = Math.max(targetRect.right, modalRect.right) - bridgeLeft;

      this.bridgeElement.style.top = `${bridgeTop}px`;
      this.bridgeElement.style.left = `${bridgeLeft + window.scrollX}px`;
      this.bridgeElement.style.width = `${bridgeWidth}px`;
      this.bridgeElement.style.height = `${bridgeHeight}px`;
    } else {
      // Modal is above trigger - bridge covers ONLY the gap between modal bottom and trigger top
      const bridgeTop = modalRect.bottom + window.scrollY;
      const bridgeHeight = (targetRect.top + window.scrollY) - bridgeTop;
      const bridgeLeft = Math.min(targetRect.left, modalRect.left);
      const bridgeWidth = Math.max(targetRect.right, modalRect.right) - bridgeLeft;

      this.bridgeElement.style.top = `${bridgeTop}px`;
      this.bridgeElement.style.left = `${bridgeLeft + window.scrollX}px`;
      this.bridgeElement.style.width = `${bridgeWidth}px`;
      this.bridgeElement.style.height = `${bridgeHeight}px`;
    }
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
      this.bridgeElement = null;
    }
    // Remove modal open class
    document.body.classList.remove('versetagger-modal-open');
    // Remove injected styles
    removeModalStyles();
    this.currentTarget = null;
    this.currentState = 'hidden';
    this.renderCallback = null;
  }
}
