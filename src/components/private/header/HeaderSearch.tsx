"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { menuItems } from "../sidebar/sidebar.config";
import { MenuItem } from "../sidebar/sidebar.types";
import { IconByName } from "@/components/ui/icons";

interface SearchResult {
  label: string;
  href: string;
  type: "page" | "section";
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
    .filter((item) => item.name.toLowerCase().includes(lowerQuery))
    .map((item) => ({
      label: item.name,
      href: item.href!,
      type: item.children ? "section" : "page",
    }))
    .slice(0, 8) as SearchResult[];
}

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopShellRef = useRef<HTMLDivElement>(null);
  const mobileShellRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setQuery("");
    setIsOpen(false);
    setResults([]);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchItems(query);
      setResults(searchResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    if (!mobileOpen) return;
    const id = window.setTimeout(() => mobileInputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [mobileOpen]);

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      router.push(result.href);
      setQuery("");
      setIsOpen(false);
      setMobileOpen(false);
      inputRef.current?.blur();
      mobileInputRef.current?.blur();
    },
    [router]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileOpen) {
          e.preventDefault();
          closeMobile();
          return;
        }
        setIsOpen(false);
        setQuery("");
        inputRef.current?.blur();
        return;
      }

      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelectResult, mobileOpen, closeMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDesktop = desktopShellRef.current?.contains(target);
      const insideMobile = mobileShellRef.current?.contains(target);
      const insideTrigger = triggerRef.current?.contains(target);
      if (insideDesktop || insideMobile || insideTrigger) return;

      setIsOpen(false);
      if (mobileOpen) closeMobile();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen, closeMobile]);

  const handleFocus = () => {
    if (query.trim()) setIsOpen(true);
  };

  const resultsDropdown = (
    <>
      {isOpen && results.length > 0 ? (
        <div className="absolute z-50 mt-1 max-h-96 w-full overflow-auto rounded-lg border border-border bg-surface-elevated text-foreground shadow-card">
          <div className="py-1">
            {results.map((result, index) => (
              <button
                key={`${result.href}-${index}`}
                type="button"
                onClick={() => handleSelectResult(result)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors duration-150 ${
                  index === selectedIndex
                    ? "bg-primary-soft text-primary"
                    : "text-foreground hover:bg-surface-muted"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-fg-muted">
                    {result.type === "section" ? "Sección" : "Página"}
                  </span>
                  <span className="font-medium">{result.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {query.trim() && results.length === 0 && isOpen ? (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-surface-elevated shadow-card">
          <div className="px-4 py-3 text-center text-sm text-fg-muted">
            No se encontraron resultados para &quot;{query}&quot;
          </div>
        </div>
      ) : null}
    </>
  );

  const renderField = (ref: React.RefObject<HTMLInputElement | null>) => (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <IconByName name="search" className="h-5 w-5 text-fg-muted" />
      </div>
      <input
        ref={ref}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleFocus}
        placeholder="Buscar páginas..."
        className="block w-full rounded-lg border border-border bg-surface-elevated py-2 pl-10 pr-3 text-sm leading-5 text-foreground placeholder:text-fg-muted focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );

  return (
    <>
      <div
        ref={desktopShellRef}
        className="relative hidden w-full flex-1 lg:mx-2 lg:max-w-sm 2xl:max-w-md md:block"
      >
        {renderField(inputRef)}
        {resultsDropdown}
      </div>

      {!mobileOpen ? (
        <button
          ref={triggerRef}
          type="button"
          className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          aria-label="Buscar"
          onClick={() => setMobileOpen(true)}
        >
          <IconByName name="search" className="h-5 w-5" />
        </button>
      ) : null}

      {mobileOpen ? (
        <div
          ref={mobileShellRef}
          className="absolute inset-0 z-40 flex items-center bg-surface-header px-1 md:hidden"
        >
          <div className="relative w-full min-w-0">
            {renderField(mobileInputRef)}
            {resultsDropdown}
          </div>
        </div>
      ) : null}
    </>
  );
}
