import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroAnimation() {
  const words = document.querySelectorAll('.hero-manifesto .word');
  const subtitle = document.querySelector('.hero-manifesto .subtitle');

  if (words.length > 0) {
    gsap.from(words, {
      y: 60,
      opacity: 0,
      stagger: 0.08,
      duration: 1,
      ease: 'expo.out',
      delay: 0.3,
    });
  }

  if (subtitle) {
    gsap.from(subtitle, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      delay: 1,
    });
  }
}

export function initMissionAnimation() {
  const steps = document.querySelectorAll('.mission-step');

  steps.forEach((step) => {
    const text = step.querySelector('.mission-text');
    const image = step.querySelector('.mission-image');

    if (text) {
      gsap.from(text, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (image) {
      gsap.from(image, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      gsap.to(image.querySelector('.image-placeholder'), {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: step,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  });
}

export function initValuesAnimation() {
  const cards = document.querySelectorAll('.value-card');

  cards.forEach((card, i) => {
    gsap.from(card, {
      x: 60,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });
}

export function initTeamAnimation() {
  const cards = document.querySelectorAll('.team-card');

  cards.forEach((card, i) => {
    gsap.from(card, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  cards.forEach((card) => {
    card.addEventListener('mousemove', (ev) => {
      const e = ev as MouseEvent;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: x * 10,
        rotateX: -y * 10,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  });
}

export function initCTAAnimation() {
  const content = document.querySelector('.cta-content');
  if (content) {
    gsap.from(content, {
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });
  }
}