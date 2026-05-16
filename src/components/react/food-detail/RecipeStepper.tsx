'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  order: number;
  title: string;
  text: string;
  image?: string;
  duration?: number;
  tip?: string;
}

interface Props {
  steps: Step[];
  servings?: number;
}

export default function RecipeStepper({ steps, servings }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const stepElements = containerRef.current.querySelectorAll('.step-item');

    stepElements.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveStep(i),
        onEnterBack: () => setActiveStep(i),
      });
    });

    if (!prefersReducedMotion) {
      gsap.fromTo('.step-item', { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
      });
    }

    return () => { ScrollTrigger.getAll().forEach(s => s.kill()); };
  }, [steps]);

  const activeImage = steps[activeStep]?.image;

  return (
    <section ref={containerRef} className="recipe-section" aria-label="Recipe steps">
      <h2 className="section-title">How to Make It</h2>
      {servings && <p className="recipe-servings">Serves: {servings}</p>}

      <div className="recipe-grid">
        <div className="recipe-image-sticky">
          {activeImage ? (
            <img src={activeImage} alt={`Step ${activeStep + 1}`} className="recipe-step-image" key={activeStep} />
          ) : (
            <div className="recipe-placeholder">Step {activeStep + 1}</div>
          )}
        </div>

        <div className="recipe-steps">
          {steps.map((step, i) => (
            <div key={step.order} className={`step-item ${i === activeStep ? 'active' : ''}`}>
              <div className="step-header">
                <span className="step-number">{step.order}</span>
                <h3 className="step-title">{step.title}</h3>
                {step.duration && <span className="step-duration">{Math.floor(step.duration / 60)}m</span>}
              </div>
              <p className="step-text">{step.text}</p>
              {step.tip && <p className="step-tip">💡 {step.tip}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}