'use client';

import { useEffect, useRef, useState } from 'react';

interface FoodItem {
  id: string;
  name: string;
  region: string;
  taste: string[];
  type: string;
  imageUrl: string;
}

export default function ResultsGrid({ results, query }: { results: FoodItem[]; query: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    setDisplayCount(12);
  }, [results]);

  const visibleResults = results.slice(0, displayCount);
  const hasMore = displayCount < results.length;

  return (
    <div className="results-grid">
      <div className="results-header">
        <span className="results-count">{results.length} results</span>
        {query && <span className="results-query">for "{query}"</span>}
      </div>

      <div ref={containerRef} className="results-grid-inner">
        {visibleResults.map((food, index) => (
          <a
            key={food.id}
            href={`/food/${food.id}`}
            className="result-card result-card-enter"
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            <div className="result-card-image">
              <img src={food.imageUrl} alt={food.name} loading="lazy" />
            </div>
            <div className="result-card-content">
              <h3>{food.name}</h3>
              <span className="result-card-region">{food.region}</span>
              <div className="result-card-tags">
                {food.taste.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
                <span className="tag type">{food.type}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setDisplayCount((prev) => prev + 12)}
          className="load-more"
        >
          Load more ({results.length - displayCount} remaining)
        </button>
      )}
    </div>
  );
}
