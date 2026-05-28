import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let isInitialized = false;

// Simpan referensi ke wrapper agar bisa diremove
const gsapTickerWrapper = (time: number) => {
  lenisInstance?.raf(time * 1000);
};

interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  lerp?: number;
}

const DEFAULT_OPTIONS: SmoothScrollOptions = {
  duration: 1.5,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 1024;
}

export function initSmoothScroll(options: SmoothScrollOptions = {}): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (prefersReducedMotion()) return null;
  if (isMobile()) return null;
  if (lenisInstance) return lenisInstance;

  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    lenisInstance = new Lenis({
      duration: opts.duration,
      easing: opts.easing,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: opts.wheelMultiplier,
      touchMultiplier: 0,
      infinite: false,
      autoResize: true,
    });

    document.documentElement.classList.add('lenis');

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(gsapTickerWrapper);

    gsap.ticker.lagSmoothing(0);

    isInitialized = true;

    return lenisInstance;
  } catch (err) {
    console.warn('[smooth-scroll] Lenis init failed, falling back to native scroll', err);
    document.documentElement.classList.remove('lenis');
    return null;
  }
}

export function destroySmoothScroll() {
  if (lenisInstance) {
    gsap.ticker.remove(gsapTickerWrapper);
    lenisInstance.destroy();
    lenisInstance = null;
    isInitialized = false;
    document.documentElement.classList.remove('lenis');
  }
}

export function refreshSmoothScroll() {
  ScrollTrigger.refresh();
  lenisInstance?.resize();
}

export function getSmoothScroll(): Lenis | null {
  return lenisInstance;
}

export function isSmoothScrollActive(): boolean {
  return isInitialized && lenisInstance !== null;
}

export function scrollTo(target: string | HTMLElement | number, options?: { offset?: number; immediate?: boolean; duration?: number }) {
  lenisInstance?.scrollTo(target, options);
}
