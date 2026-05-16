import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export function useGSAP(
  scope: React.RefObject<HTMLElement | null>,
  callback: (ctx: gsap.Context) => void,
  deps: unknown[] = []
) {
  useEffect(() => {
    if (!scope.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      callback(ctx);
    }, scope);

    return () => ctx.revert();
  }, deps);
}
