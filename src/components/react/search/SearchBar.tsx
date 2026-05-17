'use client';

import { useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $searchQuery } from '@/lib/stores/search';
import { getSearchIndex } from '@/lib/data/search-index';

interface Suggestion {
  id: string;
  name: string;
  region: string;
}

export default function SearchBar() {
  const query = useStore($searchQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    $searchQuery.set(val);
    setActiveIndex(-1);

    if (val.length > 0) {
      const index = getSearchIndex();
      const results = index.search(val).slice(0, 5);
      setSuggestions(results.map(r => ({ id: r.id as string, name: r.name as string, region: r.region as string })));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      $searchQuery.set(suggestions[activeIndex].name);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }

  function handleVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      $searchQuery.set(transcript);
    };
    recognition.start();
  }

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Cari hidangan, bahan, wilayah..."
          className="search-input"
          aria-label="Cari hidangan"
        />
        {query && (
          <button onClick={() => $searchQuery.set('')} className="search-clear" aria-label="Clear search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
        <button onClick={handleVoiceSearch} className="search-voice" aria-label="Voice search">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </button>
        <span className="search-shortcut">⌘K</span>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              className={`suggestion-item ${i === activeIndex ? 'active' : ''}`}
              onMouseDown={() => $searchQuery.set(s.name)}
            >
              <span className="suggestion-name">{s.name}</span>
              <span className="suggestion-region">{s.region}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}