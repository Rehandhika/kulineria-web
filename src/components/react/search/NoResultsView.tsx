'use client';

import { $searchQuery } from '@/lib/stores/search';

const SUGGESTIONS = ['rendang', 'soto', 'nasi goreng', 'gado-gado', 'satay'];

export default function NoResultsView() {
  return (
    <div className="no-results-view" style={{ textAlign: 'center', maxWidth: 480, margin: 'var(--sp-10) auto' }}>
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <svg width="88" height="88" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto' }}>
          <circle cx="50" cy="50" r="48" fill="var(--c-surface-2)" stroke="var(--c-border)" strokeWidth="1.5" />
          <ellipse cx="35" cy="40" rx="6" ry="8" fill="var(--c-text-1)" />
          <circle cx="35" cy="38" r="2" fill="var(--c-surface)" />
          <ellipse cx="65" cy="40" rx="6" ry="8" fill="var(--c-text-1)" />
          <circle cx="65" cy="38" r="2" fill="var(--c-surface)" />
          <path d="M 35 60 Q 50 50 65 60" stroke="var(--c-text-1)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="52" r="3" fill="var(--c-text-3)" opacity="0.3" />
        </svg>
      </div>

      <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-2xl)', fontWeight: 900, color: 'var(--c-text-1)', marginBottom: 'var(--sp-2)' }}>
        Hmm... nggak ketemu
      </h2>

      <p style={{ fontSize: 'var(--fs-base)', color: 'var(--c-text-2)', fontFamily: 'var(--ff-body)', marginBottom: 'var(--sp-6)' }}>
        Coba ubah pencarian atau filter, atau mulai dari sini:
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-6)' }}>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            className="duo-badge"
            onClick={() => $searchQuery.set(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        className="duo-btn duo-btn-outline"
        style={{ fontSize: 'var(--fs-sm)', padding: '8px 20px', minHeight: 0 }}
        onClick={() => $searchQuery.set('')}
      >
        Hapus pencarian
      </button>
    </div>
  );
}
