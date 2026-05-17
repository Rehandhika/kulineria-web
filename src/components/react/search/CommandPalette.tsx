'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $searchQuery } from '@/lib/stores/search';
import { getSearchIndex } from '@/lib/data/search-index';

interface Suggestion {
  id: string;
  name: string;
  region: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const query = useStore($searchQuery);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    $searchQuery.set(val);
    setActiveIndex(0);

    if (val.length > 0) {
      const index = getSearchIndex();
      const results = index.search(val).slice(0, 8);
      setSuggestions(results.map(r => ({ id: r.id as string, name: r.name as string, region: r.region as string })));
    } else {
      setSuggestions([]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      $searchQuery.set(suggestions[activeIndex].name);
      setIsOpen(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="command-palette-backdrop">
      <div ref={modalRef} className="command-palette" role="dialog" aria-modal="true">
        <div className="command-palette-input">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search dishes..."
            aria-label="Search dishes"
          />
          <span className="shortcut-hint">ESC to close</span>
        </div>

        {suggestions.length > 0 && (
          <div className="command-palette-results">
            {suggestions.map((s, i) => (
              <button
                key={s.id}
                className={`command-result-item ${i === activeIndex ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  $searchQuery.set(s.name);
                  setIsOpen(false);
                }}
              >
                <span className="result-name">{s.name}</span>
                <span className="result-region">{s.region}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}