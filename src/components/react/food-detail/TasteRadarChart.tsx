'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  scores: {
    manis: number;
    pedas: number;
    gurih: number;
    asam: number;
    asin: number;
  };
  regionColor: string;
}

const tastes = ['manis', 'pedas', 'gurih', 'asam', 'asin'] as const;
const labels = ['Manis', 'Pedas', 'Gurih', 'Asam', 'Asin'];

export default function TasteRadarChart({ scores }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const path = pathRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: { trigger: pathRef.current, start: 'top 85%' },
    });
  }, []);

  const cx = 120;
  const cy = 120;
  const maxR = 90;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  function getPoint(index: number, value: number) {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const dataPath = tastes.map((t, i) => {
    const p = getPoint(i, scores[t]);
    return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }).join(' ') + ' Z';

  return (
    <div className="radar-chart" role="img" aria-label="Taste profile radar chart">
      <svg ref={svgRef} viewBox="0 0 240 240" className="radar-svg">
        {/* Grid levels */}
        {levels.map((level) => {
          const points = tastes.map((_, i) => {
            const p = getPoint(i, level * 100);
            return `${p.x},${p.y}`;
          }).join(' ');
          return <polygon key={level} points={points} className="radar-grid" fill="none" />;
        })}

        {/* Axes */}
        {tastes.map((_, i) => {
          const p = getPoint(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} className="radar-axis" />;
        })}

        {/* Data polygon */}
        <path ref={pathRef} d={dataPath} className="radar-data" fill="none" />

        {/* Data points */}
        {tastes.map((_, i) => {
          const p = getPoint(i, scores[tastes[i]]);
          return <circle key={i} cx={p.x} cy={p.y} r="4" className="radar-dot" />;
        })}

        {/* Labels */}
        {tastes.map((_, i) => {
          const p = getPoint(i, 115);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="radar-label">
              {labels[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}