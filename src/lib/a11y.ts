

let focusTrapElement: HTMLElement | null = null;
let previousFocus: HTMLElement | null = null;

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
].join(', ');

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
    el => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

export function focusTrap(container: HTMLElement) {
  focusTrapElement = container;
  previousFocus = document.activeElement as HTMLElement;

  const focusable = getFocusableElements(container);
  if (focusable.length > 0) {
    focusable[0].focus();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !focusTrapElement) return;

    const focusable = getFocusableElements(focusTrapElement);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    focusTrapElement = null;
    if (previousFocus) {
      previousFocus.focus();
      previousFocus = null;
    }
  };
}

export function releaseFocusTrap() {
  if (focusTrapElement) {
    focusTrapElement = null;
  }
  if (previousFocus) {
    previousFocus.focus();
    previousFocus = null;
  }
}

export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  let announcer = document.getElementById('aria-live-announcer');

  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'aria-live-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }

  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  requestAnimationFrame(() => {
    announcer!.textContent = message;
  });
}