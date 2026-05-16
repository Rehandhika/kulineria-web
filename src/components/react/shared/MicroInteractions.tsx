import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MicroInteractionsProps {
  enabled?: boolean;
}

export default function MicroInteractions({ enabled = true }: MicroInteractionsProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!enabled || initializedRef.current) return;
    initializedRef.current = true;

    // Magnetic buttons
    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    magneticButtons.forEach((btn) => {
      const element = btn as HTMLElement;
      
      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
        });
      });

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.2;

        gsap.to(element, {
          x: x * strength,
          y: y * strength,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    // Ripple effect on buttons
    const rippleButtons = document.querySelectorAll('[data-ripple]');
    rippleButtons.forEach((btn) => {
      const element = btn as HTMLElement;

      element.addEventListener('click', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: translate(-50%, -50%);
          pointer-events: none;
        `;

        element.style.position = element.style.position || 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        gsap.to(ripple, {
          width: 200,
          height: 200,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        });
      });
    });

    // Tilt effect on cards
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach((card) => {
      const element = card as HTMLElement;

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const maxRotation = 8;

        gsap.to(element, {
          rotateY: x * maxRotation,
          rotateX: -y * maxRotation,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });

    // Cleanup
    return () => {
      magneticButtons.forEach((btn) => {
        const element = btn as HTMLElement;
        element.replaceWith(element.cloneNode(true));
      });
      rippleButtons.forEach((btn) => {
        const element = btn as HTMLElement;
        element.replaceWith(element.cloneNode(true));
      });
      tiltCards.forEach((card) => {
        const element = card as HTMLElement;
        element.replaceWith(element.cloneNode(true));
      });
    };
  }, [enabled]);

  return null;
}
