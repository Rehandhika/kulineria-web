'use client';

/**
 * Nara — Kulineria mascot component.
 *
 * Usage:
 *   <Nara expression="idle" size={120} />
 *   <Nara expression="excited" size={80} dialog="Coba Rendang!" />
 *
 * Expressions map to /img/nara/NARA {n}.png:
 *   idle      → 1   excited  → 2   thinking → 3
 *   sad       → 4   wave     → 5   point    → 6
 *   celebrate → 7   peek     → 8   sleep    → 9
 */

import { useState } from 'react';

export type NaraExpression =
  | 'idle'
  | 'excited'
  | 'thinking'
  | 'sad'
  | 'wave'
  | 'point'
  | 'celebrate'
  | 'peek'
  | 'sleep';

const EXPRESSION_MAP: Record<NaraExpression, number> = {
  idle:      1,
  excited:   2,
  thinking:  3,
  sad:       4,
  wave:      5,
  point:     6,
  celebrate: 7,
  peek:      8,
  sleep:     9,
};

interface NaraProps {
  expression?: NaraExpression;
  size?: number;
  dialog?: string;
  className?: string;
  /** If true, hovering switches to 'excited' expression */
  hoverExcited?: boolean;
  style?: React.CSSProperties;
}

export default function Nara({
  expression = 'idle',
  size = 100,
  dialog,
  className = '',
  hoverExcited = false,
  style,
}: NaraProps) {
  const [hovered, setHovered] = useState(false);

  const activeExpression = hoverExcited && hovered ? 'excited' : expression;
  const imgNum = EXPRESSION_MAP[activeExpression];
  const src = `/img/nara/NARA ${imgNum}.png`;

  return (
    <div
      className={`nara-wrapper ${className}`}
      style={{ width: size, flexShrink: 0, position: 'relative', ...style }}
      onMouseEnter={() => hoverExcited && setHovered(true)}
      onMouseLeave={() => hoverExcited && setHovered(false)}
    >
      <img
        src={src}
        alt={`Nara ${activeExpression}`}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          display: 'block',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          userSelect: 'none',
          WebkitUserDrag: 'none' as React.CSSProperties['userSelect'],
        } as React.CSSProperties}
        draggable={false}
        onError={(e) => {
          /* Fallback: hide broken image gracefully */
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
      {dialog && (
        <div className="nara-dialog" role="status" aria-live="polite">
          {dialog}
        </div>
      )}

      <style>{`
        .nara-wrapper { display: inline-flex; flex-direction: column; align-items: center; gap: 6px; }
        .nara-dialog {
          background: var(--c-surface);
          border: 1.5px solid var(--c-border);
          border-radius: var(--r-xl);
          padding: 6px 14px;
          font-size: var(--fs-xs);
          font-weight: 600;
          color: var(--c-text-1);
          white-space: nowrap;
          box-shadow: var(--sh-2);
          position: relative;
          max-width: 200px;
          text-align: center;
          line-height: 1.4;
        }
        .nara-dialog::before {
          content: '';
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-bottom-color: var(--c-border);
        }
        .nara-dialog::after {
          content: '';
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-bottom-color: var(--c-surface);
        }
      `}</style>
    </div>
  );
}
