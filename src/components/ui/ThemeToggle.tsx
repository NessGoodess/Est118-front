"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { IconByName } from "@/components/ui/icons";
import type { ThemeMode } from "@/lib/theme";

const OPTIONS: {
  value: ThemeMode;
  label: string;
  icon: "sun" | "moon";
}[] = [
  { value: "light", label: "Claro", icon: "sun" },
  { value: "dark", label: "Oscuro", icon: "moon" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerIcon = theme === "dark" ? "moon" : "sun";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-fg-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Cambiar tema"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <IconByName name={triggerIcon} className="h-5 w-5" />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Tema de apariencia"
          className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-surface-elevated py-1 shadow-card"
        >
          {OPTIONS.map((opt) => {
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? "bg-primary-soft text-primary font-medium"
                    : "text-foreground hover:bg-surface-muted"
                }`}
              >
                <IconByName name={opt.icon} className="h-4 w-4 shrink-0" />
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
