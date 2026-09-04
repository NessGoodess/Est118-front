export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "Neslink-theme";

export const THEME_MODES: ThemeMode[] = ["light", "dark"];

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}

/** Apply class on <html> to match globals.css (html.light / html.dark). */
export function applyThemeClass(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (theme === "light") root.classList.add("light");
  if (theme === "dark") root.classList.add("dark");
}

/** Stored preference, or light when nothing is saved (ignore OS preference). */
export function getStoredTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "light";
}

/**
 * Inline before paint — keep in sync with applyThemeClass / storage key.
 * Default is light (adds html.light) so prefers-color-scheme dark does not win
 * until the user explicitly chooses dark.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var r=document.documentElement;r.classList.remove("light","dark");if(t==="dark")r.classList.add("dark");else r.classList.add("light");}catch(e){try{document.documentElement.classList.add("light");}catch(_){}}})();`;
