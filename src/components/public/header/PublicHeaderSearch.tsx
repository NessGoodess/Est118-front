"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  getPublicSearchTypeLabel,
  searchPublicContent,
} from "@/lib/public-search/search";
import type { PublicSearchResult } from "@/lib/public-search/types";
import { IconByName } from "@/components/ui/icons";

interface PublicHeaderSearchProps {
  scrolled: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function fetchSearchResults(query: string): Promise<PublicSearchResult[]> {
  const response = await fetch(`/api/public-search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    return searchPublicContent(query, []);
  }
  const data = (await response.json()) as { results: PublicSearchResult[] };
  return data.results;
}

export default function PublicHeaderSearch({
  scrolled,
  open,
  onOpenChange,
}: PublicHeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = window.setTimeout(async () => {
      try {
        const nextResults = await fetchSearchResults(trimmed);
        setResults(nextResults);
        setSelectedIndex(-1);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [query, open]);

  const handleSelectResult = useCallback(
    (result: PublicSearchResult) => {
      if (result.href.startsWith("mailto:") || result.href.startsWith("tel:")) {
        window.location.href = result.href;
      } else if (result.href.startsWith("http")) {
        window.open(result.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(result.href);
      }
      close();
    },
    [router, close]
  );

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (results.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            event.preventDefault();
            handleSelectResult(results[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex, handleSelectResult, close]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current?.contains(event.target as Node)) return;
      close();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, close]);

  const showEmpty = query.trim().length > 0 && !isLoading && results.length === 0;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar búsqueda"
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar en el sitio"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className={`fixed left-0 right-0 top-24 z-[70] px-4 sm:px-6 lg:top-28 ${
              scrolled ? "lg:top-20" : "lg:top-32"
            }`}
          >
            <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface-elevated p-4 shadow-2xl">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (selectedIndex >= 0 && results[selectedIndex]) {
                    handleSelectResult(results[selectedIndex]);
                  } else if (results[0]) {
                    handleSelectResult(results[0]);
                  }
                }}
              >
                <div className="relative">
                  <IconByName
                    name="search"
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-muted"
                  />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar páginas, avisos, eventos, galería..."
                    className="w-full rounded-xl border border-border bg-surface-app py-3 pl-12 pr-12 text-sm text-foreground placeholder:text-fg-muted focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                  <button
                    type="button"
                    aria-label="Cerrar"
                    onClick={close}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-fg-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    <IconByName name="x" className="h-5 w-5" />
                  </button>
                </div>
              </form>

              <div className="mt-3 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <p className="px-2 py-3 text-sm text-fg-muted">Buscando...</p>
                ) : null}

                {!isLoading && results.length > 0 ? (
                  <ul className="space-y-1">
                    {results.map((result, index) => (
                      <li key={result.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectResult(result)}
                          className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                            index === selectedIndex
                              ? "bg-primary-soft text-primary"
                              : "hover:bg-surface-muted"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {result.label}
                              </p>
                              {result.description ? (
                                <p className="mt-0.5 line-clamp-2 text-xs text-fg-muted">
                                  {result.description}
                                </p>
                              ) : null}
                            </div>
                            <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fg-muted">
                              {getPublicSearchTypeLabel(result.type)}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {showEmpty ? (
                  <p className="px-2 py-3 text-center text-sm text-fg-muted">
                    No se encontraron resultados para &quot;{query.trim()}&quot;
                  </p>
                ) : null}

                {!query.trim() ? (
                  <p className="px-2 py-3 text-sm text-fg-muted">
                    Busca avisos, eventos, galería, preinscripciones, ubicación y más.
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
