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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} menit`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}j ${rem}m` : `${hrs} jam`;
  };

  return (
    <div className="recipe-timeline" aria-label="Langkah-langkah resep">
      {servings && (
        <div className="recipe-meta-row">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>{servings} porsi</span>
        </div>
      )}

      <div className="recipe-steps-list">
        {steps.map((step, idx) => {
          const isOpen = openStep === step.order;
          const isLast = idx === steps.length - 1;
          return (
            <div
              key={step.order}
              className={`recipe-step-item ${isOpen ? 'recipe-step-item--open' : ''} ${isLast ? 'recipe-step-item--last' : ''}`}
            >
              {/* Track: badge + connector line */}
              <div className="recipe-step-track">
                <button
                  className="recipe-step-badge"
                  onClick={() => setOpenStep(isOpen ? null : step.order)}
                  aria-expanded={isOpen}
                  aria-label={`Langkah ${step.order}: ${step.title}`}
                >
                  {isOpen ? (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="recipe-step-badge-num">{step.order}</span>
                  )}
                </button>
                {!isLast && <div className="recipe-step-connector" />}
              </div>

              {/* Content card */}
              <div className="recipe-step-content">
                <button
                  className="recipe-step-trigger"
                  onClick={() => setOpenStep(isOpen ? null : step.order)}
                  aria-expanded={isOpen}
                >
                  <div className="recipe-step-header-inner">
                    <span className="recipe-step-label">Langkah {step.order}</span>
                    <h3 className="recipe-step-title">{step.title}</h3>
                  </div>
                  <div className="recipe-step-meta">
                    {step.duration && (
                      <span className="recipe-step-duration">
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formatDuration(step.duration)}
                      </span>
                    )}
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="recipe-step-chevron"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
                        flexShrink: 0,
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="recipe-step-body">
                    <p className="recipe-step-text">{step.text}</p>
                    {step.tip && (
                      <div className="recipe-step-tip">
                        <span className="recipe-step-tip-icon">
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                          </svg>
                        </span>
                        <p className="recipe-step-tip-text">{step.tip}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
