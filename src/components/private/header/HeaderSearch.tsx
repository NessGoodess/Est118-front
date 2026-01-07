"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { menuItems } from '../sidebar/sidebar.config';
import { MenuItem } from '../sidebar/sidebar.types';
import { getHeaderIcon } from './header.icons';

interface SearchResult {
  label: string;
  href: string;
  type: 'page' | 'section';
}

// Función para aplanar todos los items del menú (incluyendo children)
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

// Función de búsqueda
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
    .slice(0, 8); // Limitar a 8 resultados
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

  // Buscar cuando cambia el query
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

  // Manejar teclado
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
  }, [isOpen, results, selectedIndex]);

  // Cerrar al hacer click fuera
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

  const handleSelectResult = (result: SearchResult) => {
    router.push(result.href);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Buscar páginas..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
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

      {/* Dropdown de resultados */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-auto"
        >
          <div className="py-1">
            {results.map((result, index) => (
              <button
                key={`${result.href}-${index}`}
                onClick={() => handleSelectResult(result)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                  index === selectedIndex
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">
                    {result.type === 'section' ? '📁' : '📄'}
                  </span>
                  <span className="font-medium">{result.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {query.trim() && results.length === 0 && isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No se encontraron resultados para "{query}"
          </div>
        </div>
      )}
    </div>
  );
}

