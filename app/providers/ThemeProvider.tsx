"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const previousThemeRef = useRef<Theme | null>(null);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    document.cookie = `theme=${newTheme};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: newTheme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  useEffect(() => {
    // Skip first render - the inline script already set the correct class
    if (previousThemeRef.current === null) {
      previousThemeRef.current = theme;
      setTheme(theme === "light" ? "dark" : "light");
      return;
    }
    // Only update class when theme actually changes
    if (previousThemeRef.current !== theme) {
      previousThemeRef.current = theme;
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
