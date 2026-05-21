'use client';

import { useState } from 'react';

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
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <div className="recipe-accordion" aria-label="Langkah-langkah resep">
      {servings && <p className="recipe-servings">Porsi: {servings}</p>}
      {steps.map((step) => {
        const isOpen = openStep === step.order;
        return (
          <div key={step.order} className={`recipe-step ${isOpen ? 'recipe-step--open' : ''}`}>
            <button
              className="recipe-step-header"
              onClick={() => setOpenStep(isOpen ? null : step.order)}
              aria-expanded={isOpen}
            >
              <span className="recipe-step-number">{step.order}</span>
              <span className="recipe-step-title">{step.title}</span>
              {step.duration && <span className="recipe-step-duration">{Math.floor(step.duration / 60)}m</span>}
              <span className="recipe-step-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="recipe-step-body">
                <p className="recipe-step-text">{step.text}</p>
                {step.tip && <p className="recipe-step-tip">💡 {step.tip}</p>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
