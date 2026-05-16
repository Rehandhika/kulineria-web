export const presets = {
  fadeUp: {
    from: { y: 40, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.9,
    ease: 'expo.out',
  },
  fadeDown: {
    from: { y: -30, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.8,
    ease: 'expo.out',
  },
  scaleIn: {
    from: { scale: 0.92, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: 0.8,
    ease: 'power3.out',
  },
  splitChars: {
    from: { yPercent: 100, opacity: 0 },
    stagger: 0.02,
    duration: 1,
    ease: 'expo.out',
  },
  splitWords: {
    from: { yPercent: 110, opacity: 0 },
    stagger: 0.05,
    duration: 1.1,
    ease: 'expo.out',
  },
  imageReveal: {
    from: { clipPath: 'inset(100% 0 0 0)' },
    to: { clipPath: 'inset(0% 0 0 0)' },
    duration: 1.2,
    ease: 'expo.out',
  },
  imageRevealLeft: {
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 0% 0 0)' },
    duration: 1.2,
    ease: 'expo.out',
  },
  hoverLift: {
    y: -4,
    duration: 0.3,
    ease: 'power2.out',
  },
  hoverScale: {
    scale: 1.03,
    duration: 0.3,
    ease: 'power2.out',
  },
  marquee: {
    xPercent: -100,
    duration: 30,
    ease: 'none',
    repeat: -1,
  },
  float: {
    y: -8,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  },
};
