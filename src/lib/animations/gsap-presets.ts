import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
}

// Page entrance animation
export function animatePageEntrance(container: HTMLElement | null, options: AnimationOptions = {}) {
  if (!container) return;

  const { duration = 0.8, stagger = 0.08, ease = 'expo.out' } = options;

  const elements = container.querySelectorAll('.anim-enter');

  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease,
    }
  );
}

// Scroll reveal animation
export function scrollReveal(
  target: string | HTMLElement | HTMLElement[],
  animation: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scaleIn' | 'rotateIn' = 'fadeUp',
  options: AnimationOptions = {}
) {
  const { duration = 0.8, delay = 0, ease = 'expo.out' } = options;

  const animations: Record<string, { from: any }> = {
    fadeUp: { from: { opacity: 0, y: 40 } },
    fadeDown: { from: { opacity: 0, y: -40 } },
    fadeLeft: { from: { opacity: 0, x: -40 } },
    fadeRight: { from: { opacity: 0, x: 40 } },
    scaleIn: { from: { opacity: 0, scale: 0.9 } },
    rotateIn: { from: { opacity: 0, rotation: -3, scale: 0.95 } },
  };

  const anim = animations[animation] || animations.fadeUp;

  return gsap.fromTo(
    target,
    anim.from,
    {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotation: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: target,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// Stagger children animation
export function staggerChildren(
  parent: string | HTMLElement,
  options: AnimationOptions = {}
) {
  const { duration = 0.6, stagger = 0.1, delay = 0, ease = 'expo.out' } = options;

  const parentEl = typeof parent === 'string' ? document.querySelector(parent) : parent;
  if (!parentEl) return;

  const children = parentEl.children;

  return gsap.fromTo(
    children,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease,
      scrollTrigger: {
        trigger: parentEl,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// Parallax effect
export function parallax(
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

// Pin section animation
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

// Counter animation
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

// Magnetic button effect
export function magneticButton(button: HTMLElement) {
  const strength = 30;

  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * (strength / rect.width),
      y: y * (strength / rect.height),
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  });
}

// Text split animation (manual char split)
export function animateTextSplit(
  target: string | HTMLElement,
  options: AnimationOptions = {}
) {
  const { duration = 0.6, stagger = 0.03, delay = 0, ease = 'expo.out' } = options;

  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  const text = el.textContent || '';
  el.innerHTML = '';

  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px)';
    el.appendChild(span);
  });

  const chars = el.querySelectorAll('span');

  return gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    delay,
    ease,
  });
}

// Cleanup all ScrollTriggers
export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.killTweensOf('*');
}
