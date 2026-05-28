import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  scrollTrigger?: boolean | ScrollTrigger.Vars;
}

function getTriggerConfig(target: string | HTMLElement | HTMLElement[], opts: AnimationOptions) {
  if (!opts.scrollTrigger) return undefined;
  if (typeof opts.scrollTrigger === 'object') return opts.scrollTrigger;
  return {
    trigger: target,
    start: 'top 85%',
    toggleActions: 'play none none none',
  };
}

export function animatePageEntrance(container: HTMLElement | null, options: AnimationOptions = {}) {
  if (!container) return;
  const { duration = 0.8, stagger = 0.08, ease = 'power4.out' } = options;
  const elements = container.querySelectorAll('.anim-enter');
  if (elements.length === 0) return;

  gsap.fromTo(elements,
    { opacity: 0, y: 40, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration, stagger, ease }
  );
}

export function scrollReveal(
  target: string | HTMLElement | HTMLElement[],
  animation: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scaleIn' | 'rotateIn' | 'clipReveal' = 'fadeUp',
  options: AnimationOptions = {}
) {
  const { duration = 1, delay = 0, ease = 'power4.out' } = options;

  const animations: Record<string, { from: any }> = {
    fadeUp: { from: { opacity: 0, y: 60 } },
    fadeDown: { from: { opacity: 0, y: -40 } },
    fadeLeft: { from: { opacity: 0, x: -60 } },
    fadeRight: { from: { opacity: 0, x: 60 } },
    scaleIn: { from: { opacity: 0, scale: 0.88 } },
    rotateIn: { from: { opacity: 0, rotation: -5, scale: 0.92 } },
    clipReveal: { from: { clipPath: 'inset(0 100% 0 0)', opacity: 0 } },
  };

  const anim = animations[animation] || animations.fadeUp;

  return gsap.fromTo(target, anim.from, {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotation: 0,
    clipPath: 'inset(0 0% 0 0)',
    duration,
    delay,
    ease,
    scrollTrigger: getTriggerConfig(target, options),
  });
}

export function staggerChildren(
  parent: string | HTMLElement,
  options: AnimationOptions = {}
) {
  const { duration = 0.8, stagger = 0.1, delay = 0, ease = 'power4.out' } = options;

  const parentEl = typeof parent === 'string' ? document.querySelector(parent) : parent;
  if (!parentEl) return;

  const children = parentEl.children;

  return gsap.fromTo(children,
    { opacity: 0, y: 40, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      stagger,
      delay,
      ease,
      scrollTrigger: getTriggerConfig(parent, options),
    }
  );
}

export function parallaxItem(
  target: string | HTMLElement,
  speed: number = 0.5
) {
  return gsap.to(target, {
    y: () => -100 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: target,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

export function pinSection(
  target: string | HTMLElement,
  options: { start?: string; end?: string; pinSpacing?: boolean } = {}
) {
  const { start = 'top top', end = '+=100%', pinSpacing = true } = options;
  return ScrollTrigger.create({
    trigger: target,
    start,
    end,
    pin: true,
    pinSpacing,
  });
}

export function animateCounter(
  target: string | HTMLElement,
  end: number,
  duration: number = 2
) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  const obj = { val: 0 };

  return gsap.to(obj, {
    val: end,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.val).toLocaleString();
    },
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

export function magneticButton(button: HTMLElement) {
  const strength = 30;

  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(button, {
      x: x * (strength / rect.width),
      y: y * (strength / rect.height),
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  });
}

export function animateTextSplit(
  target: string | HTMLElement,
  options: AnimationOptions = {}
) {
  const { duration = 0.8, stagger = 0.04, delay = 0, ease = 'power4.out' } = options;

  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  const text = el.textContent || '';
  el.innerHTML = '';

  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    el.appendChild(span);
  });

  const chars = el.querySelectorAll('span');

  return gsap.fromTo(chars,
    { yPercent: 110, opacity: 0, rotateZ: -5 },
    {
      yPercent: 0,
      opacity: 1,
      rotateZ: 0,
      duration,
      stagger,
      delay,
      ease,
    }
  );
}

export function imageReveal(target: string | HTMLElement, options: AnimationOptions = {}) {
  const { duration = 1.2, delay = 0, ease = 'expo.out' } = options;

  return gsap.fromTo(target,
    { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
    {
      clipPath: 'inset(0 0 0% 0)',
      opacity: 1,
      duration,
      delay,
      ease,
      scrollTrigger: getTriggerConfig(target, options),
    }
  );
}

export function createHorizontalScroll(
  container: HTMLElement,
  sections: HTMLElement[],
  options: { start?: string; end?: string } = {}
) {
  const { start = 'top top', end = '+=300%' } = options;

  return gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      start,
      end,
      scrub: 1,
    },
  });
}

export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.killTweensOf('*');
  gsap.globalTimeline.clear();
}

export function blurInText(
  target: string | HTMLElement | HTMLElement[],
  options: AnimationOptions = {}
) {
  const { duration = 1.2, stagger = 0.08, delay = 0, ease = 'power4.out' } = options;

  return gsap.fromTo(target,
    { y: 80, opacity: 0, filter: 'blur(15px)', willChange: 'transform, opacity, filter' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration, stagger, delay, ease }
  );
}

export function heroBackgroundReveal(
  target: string | HTMLElement,
  options: { duration?: number; ease?: string } = {}
) {
  const { duration = 1.5, ease = 'power2.out' } = options;
  return gsap.fromTo(target,
    { scale: 1.08, opacity: 0 },
    { scale: 1, opacity: 1, duration, ease }
  );
}

export function ctaBounceIn(
  target: string | HTMLElement,
  options: { duration?: number; delay?: number; ease?: string } = {}
) {
  const { duration = 0.8, delay = 0, ease = 'back.out(1.7)' } = options;
  return gsap.fromTo(target,
    { y: 30, opacity: 0, scale: 0.92 },
    { y: 0, opacity: 1, scale: 1, duration, delay, ease }
  );
}

export function splitTextToWords(element: HTMLElement): HTMLElement[] {
  const text = element.textContent || '';
  element.innerHTML = '';
  const words = text.split(/(\s+)/);
  const spans: HTMLElement[] = [];

  words.forEach((word) => {
    if (word === '') return;
    const span = document.createElement('span');
    span.textContent = word;
    span.style.display = 'inline-block';
    if (word.trim() === '') {
      span.style.width = '0.3em';
    }
    element.appendChild(span);
    spans.push(span);
  });

  return spans;
}
