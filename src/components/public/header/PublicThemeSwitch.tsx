"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { IconByName } from "@/components/ui/icons";

type Props = {
  className?: string;
};

/**
 * Toggle ThemeSwitch; public theme switch.
 */
export default function PublicThemeSwitch({ className = "" }: Props) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        "group relative inline-flex h-6 w-11 shrink-0 items-center rounded-full cursor-pointer",
        "border border-public-glass-border bg-public-glass p-0.5",
        "transition-colors duration-300",
        "hover:bg-public-glass-strong/25",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-public-on-media/35",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-1 flex items-center text-public-on-media/55"
        aria-hidden
      >
        <IconByName
          name="sun"
          className={`h-3 w-3 transition-opacity duration-200 ${isDark ? "opacity-50" : "opacity-0"}`}
        />
      </span>
      <span
        className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-public-on-media/55"
        aria-hidden
      >
        <IconByName
          name="moon"
          className={`h-3 w-3 transition-opacity duration-200 ${isDark ? "opacity-0" : "opacity-50"}`}
        />
      </span>

      <span
        className={[
          "relative z-10 flex h-4 w-4 items-center justify-center rounded-full",
          "bg-public-on-media text-brand-900 shadow-sm",
          "transition-transform duration-300 ease-out",
          "group-hover:scale-105",
          isDark ? "translate-x-[1.2rem]" : "translate-x-0",
        ].join(" ")}
      >
        <IconByName name={isDark ? "moon" : "sun"} className="h-2.5 w-2.5" />
      </span>
    </button>
  );
}
