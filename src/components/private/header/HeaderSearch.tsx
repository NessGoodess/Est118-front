"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { menuItems } from '../sidebar/sidebar.config';
import { MenuItem } from '../sidebar/sidebar.types';
import { getHeaderIcon } from './header.icons';

interface SearchResult {
  label: string;
  href: string;
  type: 'page' | 'section';
}

function flattenMenuItems(items: MenuItem[]): MenuItem[] {
  const flattened: MenuItem[] = [];

  for (const item of items) {
    if (item.href) {
      flattened.push(item);
    }
    if (item.children) {
      flattened.push(...flattenMenuItems(item.children));
    }
  }

  return flattened;
}

function searchItems(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const allItems = flattenMenuItems(menuItems);
  const lowerQuery = query.toLowerCase();

  return allItems
    .filter(item => {
      const name = item.name.toLowerCase();
      return name.includes(lowerQuery);
    })
    .map(item => ({
      label: item.name,
      href: item.href!,
      type: item.children ? 'section' : 'page',
    }))
    .slice(0, 8) as SearchResult[];
}

export function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const SearchIcon = getHeaderIcon('search');

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchItems(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSelectResult = useCallback((result: SearchResult) => {
    router.push(result.href);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  }, [router]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          inputRef.current?.blur();
          break;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, results, selectedIndex, handleSelectResult]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full max-w-md text-foreground">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-fg-muted" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Buscar páginas..."
          className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-surface-elevated text-foreground placeholder:text-fg-muted
               focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="w-4 h-4 text-fg-muted hover:text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-surface-elevated text-foreground rounded-lg shadow-card border border-border max-h-96 overflow-auto"
        >
          <div className="py-1">
            {results.map((result, index) => (
              <button
                key={`${result.href}-${index}`}
                type="button"
                onClick={() => handleSelectResult(result)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                  index === selectedIndex
                    ? 'bg-primary-soft text-primary'
                    : 'text-foreground hover:bg-surface-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-fg-muted text-xs">
                    {result.type === 'section' ? 'Sección' : 'Página'}
                  </span>
                  <span className="font-medium">{result.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {query.trim() && results.length === 0 && isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-surface-elevated rounded-lg shadow-card border border-border">
          <div className="px-4 py-3 text-sm text-fg-muted text-center">
            No se encontraron resultados para &quot;{query}&quot;
          </div>
        </div>
      )}
    </div>
  );
}
