import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface UseGSAPOptions {
  scope?: React.RefObject<HTMLElement | null>;
  deps?: unknown[];
}

export function useGSAP(
  callback: (ctx: gsap.Context) => void,
  options: UseGSAPOptions = {}
) {
  const { scope, deps = [] } = options;
  const scopeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      callback(ctx);
    }, scope?.current || scopeRef.current || undefined);

    return () => {
      ctx.revert();
    };
  }, deps);

  return scopeRef;
}

export function cleanupAllGSAP() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  gsap.killTweensOf('*');
  gsap.globalTimeline.clear();
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
