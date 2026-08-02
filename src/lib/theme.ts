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

/** Get the stored theme from the localStorage if it exists, otherwise return "light" */
export function getStoredTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "light";
}

/** Inline before paint — keep in sync with applyThemeClass / storage key. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var r=document.documentElement;r.classList.remove("light","dark");if(t==="light")r.classList.add("light");else if(t==="dark")r.classList.add("dark");}catch(e){}})();`;
