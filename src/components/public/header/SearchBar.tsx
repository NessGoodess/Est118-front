"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
    scrolled: boolean;
}

export default function SearchBar({ scrolled }: SearchBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Aquí puedes agregar la lógica de búsqueda
            console.log("Buscando:", searchQuery);
            // Ejemplo: router.push(`/busqueda?q=${searchQuery}`);
        }
    };

    return (
        <div className="relative">
            {/* Botón de búsqueda */}
            <button
                type="button"
                aria-label="Abrir búsqueda"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${
                    scrolled
                        ? "text-foreground hover:bg-surface-muted"
                        : "text-white hover:bg-surface-elevated/20"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </button>

            {/* Input de búsqueda expandible */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "auto" }}
                        exit={{ opacity: 0, x: -20, width: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute right-0 top-0"
                    >
                        <form onSubmit={handleSearch} className="flex items-center">
                            <input
                                type="search"
                                name="search"
                                id="header-search"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className={`h-10 px-4 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                                    scrolled
                                        ? "bg-surface-elevated text-foreground border-border focus:border-ring focus:ring-primary-soft"
                                        : "bg-surface-elevated/90 backdrop-blur-sm text-foreground border-white/30 focus:border-white focus:ring-white/30"
                                }`}
                                style={{ minWidth: "250px" }}
                            />
                            <button
                                type="submit"
                                aria-label="Buscar"
                                className={`ml-2 p-2 rounded-full transition-all ${
                                    scrolled
                                        ? "bg-primary hover:bg-primary-hover text-primary-foreground"
                                        : "bg-surface-elevated/90 hover:bg-surface-elevated text-foreground"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

