import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from '../animations/scroll-smoother';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = initSmoothScroll();
    lenisRef.current = lenis;

    return () => {
      // Don't destroy on unmount - let the global manager handle it
    };
  }, []);

  return lenisRef;
}
