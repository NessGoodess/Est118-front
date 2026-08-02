"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { IconByName } from "@/components/ui/icons";

/** Switch light ↔ dark; knob slides and icon changes. */
export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        "relative inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full border border-border p-0.5",
        "transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDark ? "bg-surface-muted" : "bg-primary-soft",
      ].join(" ")}
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-1.5 flex items-center text-fg-muted"
        aria-hidden
      >
        <IconByName
          name="sun"
          className={`h-3.5 w-3.5 transition-opacity duration-200 ${
            isDark ? "opacity-40" : "opacity-0"
          }`}
        />
      </span>
      <span
        className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-fg-muted"
        aria-hidden
      >
        <IconByName
          name="moon"
          className={`h-3.5 w-3.5 transition-opacity duration-200 ${
            isDark ? "opacity-0" : "opacity-40"
          }`}
        />
      </span>

      <span
        className={[
          "relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-sm",
          "bg-surface-elevated text-foreground transition-transform duration-300 ease-out",
          isDark ? "translate-x-[1.35rem]" : "translate-x-0",
        ].join(" ")}
      >
        <IconByName name={isDark ? "moon" : "sun"} className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}
