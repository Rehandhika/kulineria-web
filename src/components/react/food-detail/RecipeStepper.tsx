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
  const pathRef = useRef<SVGPathElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [pathHeight, setPathHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !stepsContainerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set height for SVG line
    setPathHeight(stepsContainerRef.current.offsetHeight);

    const stepElements = stepsContainerRef.current.querySelectorAll('.step-item');

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
      // Reveal items - use set + ScrollTrigger.create for safety
      const stepItems = containerRef.current!.querySelectorAll('.step-item');
      gsap.set(stepItems, { opacity: 0, x: 30 });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(stepItems, {
            opacity: 1, x: 0, stagger: 0.1, duration: 0.8, ease: 'expo.out',
          });
        },
      });

      // Safety fallback for step items
      setTimeout(() => {
        stepItems.forEach(item => {
          if (window.getComputedStyle(item).opacity === '0') {
            gsap.to(item, { opacity: 1, x: 0, duration: 0.3 });
          }
        });
      }, 4000);

      // SVG Line Draw Animation (Scrollytelling)
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          }
        });
      }
    }

    // Refresh scroll triggers when dimensions change
    const resizeObserver = new ResizeObserver(() => {
      if(stepsContainerRef.current) {
        setPathHeight(stepsContainerRef.current.offsetHeight);
        ScrollTrigger.refresh();
      }
    });
    resizeObserver.observe(stepsContainerRef.current);

    return () => { 
      resizeObserver.disconnect();
      ScrollTrigger.getAll().forEach(s => s.kill()); 
    };
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

        <div className="recipe-steps-wrapper" style={{ position: 'relative', display: 'flex', gap: '20px' }}>
          
          {/* Scrollytelling SVG Line */}
          <div className="recipe-progress-line hidden md:block" style={{ width: '4px', flexShrink: 0, paddingTop: '20px' }}>
             <svg width="4" height={pathHeight} style={{ overflow: 'visible' }}>
                {/* Background track */}
                <line x1="2" y1="0" x2="2" y2={pathHeight} stroke="var(--c-border-strong)" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 8" />
                {/* Animated fill line */}
                <path ref={pathRef} d={`M 2 0 L 2 ${pathHeight}`} stroke="var(--c-accent)" strokeWidth="4" strokeLinecap="round" fill="none" />
             </svg>
          </div>

          <div ref={stepsContainerRef} className="recipe-steps" style={{ flex: 1 }}>
            {steps.map((step, i) => (
              <div key={step.order} className={`step-item ${i === activeStep ? 'active' : ''}`}>
                <div className="step-header">
                  <span className="step-number" style={{ 
                    transition: 'all 0.4s ease', 
                    transform: i === activeStep ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: i === activeStep ? 'var(--sh-2)' : 'none'
                  }}>{step.order}</span>
                  <h3 className="step-title">{step.title}</h3>
                  {step.duration && <span className="step-duration">{Math.floor(step.duration / 60)}m</span>}
                </div>
                <p className="step-text">{step.text}</p>
                {step.tip && <p className="step-tip">💡 {step.tip}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}