'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}

export default function LoadingSpinner({ size = 'md', color, label = 'Loading' }: LoadingSpinnerProps) {
  const sizes = { sm: 20, md: 32, lg: 48 };
  const s = sizes[size];

  return (
    <div className="loading-spinner" role="status" aria-label={label}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 40 40"
        fill="none"
        style={{ color: color || 'var(--c-accent)' }}
      >
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.2" />
        <path
          d="M 20 4 A 16 16 0 0 1 36 20"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}