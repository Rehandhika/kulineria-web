'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-boundary" role="alert">
          <div className="error-nara">
            <svg viewBox="0 0 100 100" className="error-nara-svg">
              <circle cx="50" cy="50" r="25" fill="var(--c-surface-1)" stroke="var(--c-error)" strokeWidth="2" />
              <path d="M 30 30 Q 35 25 40 30 M 60 30 Q 65 25 70 30" fill="none" stroke="var(--c-text-1)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 35 44 Q 50 38 65 44" fill="none" stroke="var(--c-text-1)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3>Something went wrong</h3>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="error-message">{this.state.error.message}</pre>
          )}
          <button className="error-retry" onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}