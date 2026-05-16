import { gsap } from 'gsap';

export function createMagnetic(
  element: HTMLElement,
  options: { strength?: number; radius?: number } = {}
) {
  const { strength = 0.3, radius = 100 } = options;

  const handleMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    if (distance < radius) {
      gsap.to(element, {
        x: deltaX * strength,
        y: deltaY * strength,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleLeave = () => {
    gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  };

  element.addEventListener('mousemove', handleMove);
  element.addEventListener('mouseleave', handleLeave);

  return () => {
    element.removeEventListener('mousemove', handleMove);
    element.removeEventListener('mouseleave', handleLeave);
  };
}
