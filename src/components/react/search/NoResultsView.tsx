'use client';

import { $searchQuery } from '@/lib/stores/search';

const SUGGESTIONS = ['rendang', 'soto', 'nasi goreng', 'gado-gado', 'sate'];

export default function NoResultsView() {
  return (
    <div className="no-results-view" style={{ textAlign: 'center', maxWidth: 440, margin: 'var(--sp-12) auto' }}>
      {}
      <div style={{ marginBottom: 'var(--sp-5)', display: 'flex', justifyContent: 'center' }}>
        <img
          src="/img/nara/NARA 4.png"
          alt="Nara sedih"
          width="120"
          height="120"
          style={{ objectFit: 'contain', userSelect: 'none' }}
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--c-text-1)', marginBottom: 'var(--sp-2)', letterSpacing: '-0.02em' }}>
        Hmm, nggak ketemu
      </h2>

      <p style={{ fontSize: 'var(--fs-base)', color: 'var(--c-text-2)', lineHeight: 1.65, marginBottom: 'var(--sp-6)', fontWeight: 400 }}>
        Coba ubah kata kunci atau filter. Atau mulai dari salah satu ini:
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-6)' }}>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            className="duo-badge"
            style={{ cursor: 'pointer' }}
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
