'use client';

import { $searchQuery } from '@/lib/stores/search';

const SUGGESTIONS = ['rendang', 'soto', 'nasi goreng', 'gado-gado', 'satay'];

export default function NoResultsView() {
  return (
    <div className="no-results-view">
      <div className="no-results-nara">
        <div className="nara-face">
          <div className="nara-eyes">
            <div className="eye sad" />
            <div className="eye sad" />
          </div>
          <div className="nara-mouth sad" />
        </div>
      </div>

      <h2>No dishes found</h2>
      <p>Try adjusting your search or filters, or explore these popular dishes:</p>

      <div className="no-results-suggestions">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            className="suggestion-chip"
            onClick={() => $searchQuery.set(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={() => $searchQuery.set('')}
        className="clear-search-btn"
      >
        Clear search
      </button>
    </div>
  );
}