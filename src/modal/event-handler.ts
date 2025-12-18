/**
 * Event Handler
 * Manages hover, click, and keyboard events for scripture references
 */

import type { VersetaggerConfig } from '../core/config';
import { debounce } from '../utils/debounce';

export type EventCallback = (element: HTMLElement, event: Event) => void;

/**
 * Event handler for scripture reference interactions
 */
export class EventHandler {
  private config: Required<VersetaggerConfig>;
  private onOpen: EventCallback;
  private onClose: EventCallback;
  private debouncedMouseEnter: ((element: HTMLElement, event: MouseEvent) => void) & { cancel: () => void };
  private activeElement: HTMLElement | null = null;
  private mouseLeaveTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    config: Required<VersetaggerConfig>,
    onOpen: EventCallback,
    onClose: EventCallback
  ) {
    this.config = config;
    this.onOpen = onOpen;
    this.onClose = onClose;

    // Create debounced hover handler
    this.debouncedMouseEnter = debounce(
      this.handleDebouncedMouseEnter.bind(this),
      config.hoverDelay
    );
  }

  /**
   * Attach event listeners to a scripture reference element
   */
  attach(element: HTMLElement): void {
    const hasModal = element.dataset.hasModal === 'true';
    if (!hasModal) {
      return; // No modal to show
    }

    const trigger = this.config.trigger;

    // Attach hover events
    if (trigger === 'hover' || trigger === 'both') {
      element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
      element.addEventListener('focus', this.handleFocus.bind(this));
      element.addEventListener('blur', this.handleBlur.bind(this));
    }

    // Attach click events
    if (trigger === 'click' || trigger === 'both') {
      element.addEventListener('click', this.handleClick.bind(this));
    }

    // Attach keyboard events for accessibility
    if (this.config.accessibility.keyboardNav) {
      element.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  /**
   * Remove all event listeners from an element
   */
  detach(element: HTMLElement): void {
    const hasModal = element.dataset.hasModal === 'true';
    if (!hasModal) {
      return;
    }

    const trigger = this.config.trigger;

    if (trigger === 'hover' || trigger === 'both') {
      element.removeEventListener('mouseenter', this.handleMouseEnter.bind(this));
      element.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
      element.removeEventListener('focus', this.handleFocus.bind(this));
      element.removeEventListener('blur', this.handleBlur.bind(this));
    }

    if (trigger === 'click' || trigger === 'both') {
      element.removeEventListener('click', this.handleClick.bind(this));
    }

    if (this.config.accessibility.keyboardNav) {
      element.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  /**
   * Handle mouse enter event (start debounce timer)
   */
  private handleMouseEnter(event: Event): void {
    const element = event.currentTarget as HTMLElement;

    // Cancel any pending close
    if (this.mouseLeaveTimeout) {
      clearTimeout(this.mouseLeaveTimeout);
      this.mouseLeaveTimeout = null;
    }

    // Start debounced open
    this.debouncedMouseEnter(element, event as MouseEvent);
  }

  /**
   * Handle debounced mouse enter (actually open the modal)
   */
  private handleDebouncedMouseEnter(element: HTMLElement, event: MouseEvent): void {
    this.activeElement = element;
    this.onOpen(element, event);
  }

  /**
   * Handle mouse leave event (close after delay)
   */
  private handleMouseLeave(event: Event): void {
    const element = event.currentTarget as HTMLElement;

    // Cancel pending open
    this.debouncedMouseEnter.cancel();

    // Only close if this is the active element
    if (this.activeElement === element) {
      // Add delay before closing to allow moving to modal
      // 200ms provides smooth experience with the invisible bridge
      this.mouseLeaveTimeout = setTimeout(() => {
        if (this.activeElement === element) {
          this.onClose(element, event);
          this.activeElement = null;
        }
      }, 200);
    }
  }

  /**
   * Handle focus event (for keyboard navigation)
   */
  private handleFocus(event: Event): void {
    const trigger = this.config.trigger;
    if (trigger === 'hover' || trigger === 'both') {
      const element = event.currentTarget as HTMLElement;
      this.activeElement = element;
      this.onOpen(element, event);
    }
  }

  /**
   * Handle blur event
   */
  private handleBlur(event: Event): void {
    const trigger = this.config.trigger;
    if (trigger === 'hover' || trigger === 'both') {
      const element = event.currentTarget as HTMLElement;
      if (this.activeElement === element) {
        // Small delay to allow focus to move to modal
        setTimeout(() => {
          if (this.activeElement === element) {
            this.onClose(element, event);
            this.activeElement = null;
          }
        }, 200);
      }
    }
  }

  /**
   * Handle click event
   */
  private handleClick(event: Event): void {
    const element = event.currentTarget as HTMLElement;

    // If element is a link in 'both' mode, don't prevent default
    // but still show modal
    if (element instanceof HTMLAnchorElement && this.config.behavior === 'both') {
      // Let the link work, but also show modal
      this.activeElement = element;
      this.onOpen(element, event);
      return;
    }

    // For modal-only or if not a link, prevent default and show modal
    if (this.config.behavior === 'modal-only' || !(element instanceof HTMLAnchorElement)) {
      event.preventDefault();
    }

    // Toggle modal
    if (this.activeElement === element) {
      this.onClose(element, event);
      this.activeElement = null;
    } else {
      this.activeElement = element;
      this.onOpen(element, event);
    }
  }

  /**
   * Handle keyboard events (Enter/Space to open)
   */
  private handleKeyDown(event: Event): void {
    const keyEvent = event as KeyboardEvent;
    const element = event.currentTarget as HTMLElement;

    // Enter or Space to open/toggle modal
    if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
      // Prevent default scroll on Space
      if (keyEvent.key === ' ') {
        keyEvent.preventDefault();
      }

      // Don't interfere with link behavior if it's a link element
      if (element instanceof HTMLAnchorElement && keyEvent.key === 'Enter') {
        // Let Enter work naturally on links, but also show modal
        this.activeElement = element;
        this.onOpen(element, event);
        return;
      }

      // Toggle modal for non-links or Space key
      if (this.activeElement === element) {
        this.onClose(element, event);
        this.activeElement = null;
      } else {
        this.activeElement = element;
        this.onOpen(element, event);
      }
    }
  }

  /**
   * Get the currently active element
   */
  getActiveElement(): HTMLElement | null {
    return this.activeElement;
  }

  /**
   * Clear the active element
   */
  clearActive(): void {
    this.activeElement = null;
    this.debouncedMouseEnter.cancel();
    if (this.mouseLeaveTimeout) {
      clearTimeout(this.mouseLeaveTimeout);
      this.mouseLeaveTimeout = null;
    }
  }

  /**
   * Close the modal for the active element
   */
  closeActive(): void {
    if (this.activeElement) {
      this.onClose(this.activeElement, new Event('close'));
      this.activeElement = null;
    }
  }
}
