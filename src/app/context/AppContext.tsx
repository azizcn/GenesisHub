"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import translations, { type Locale } from "../i18n/translations";

export type Language = "javascript" | "python" | "csharp" | "none";
export type Theme = "dark" | "light";
export type View = "onboarding" | "hub" | "idea-agent";

export interface AppState {
  selectedLanguage: Language | null;
  currentView: View;
  completedModules: number[];
  currentModule: number;
  theme: Theme;
  locale: Locale;
}

interface AppContextType extends AppState {
  setLanguage: (lang: Language) => void;
  setView: (view: View) => void;
  setCurrentModule: (mod: number) => void;
  completeModule: (mod: number) => void;
  resetAll: () => void;
  toggleTheme: () => void;
  toggleLocale: () => void;
  t: (key: string, vars?: Record<string, string>) => string;
  languageLabel: string;
}

const AppContext = createContext<AppContextType | null>(null);

const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: "JavaScript",
  python: "Python",
  csharp: "C#",
  none: "None / HTML",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [currentView, setCurrentView] = useState<View>("onboarding");
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [currentModule, setCurrentModuleState] = useState(0);
  const [theme, setTheme] = useState<Theme>("dark");
  const [locale, setLocale] = useState<Locale>("en");

  // Apply theme to <html> — set CSS variables directly for bulletproof theming
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "light") {
      html.classList.add("light");
      html.classList.remove("dark");
      const vars: Record<string, string> = {
        "--background": "#f8fafc",
        "--foreground": "#1e293b",
        "--neon-green": "#059669",
        "--neon-purple": "#7c3aed",
        "--neon-yellow": "#d97706",
        "--card-bg": "rgba(255,255,255,0.85)",
        "--card-border": "rgba(148,163,184,0.3)",
        "--glass-bg": "rgba(255,255,255,0.9)",
        "--code-bg": "#f1f5f9",
        "--code-border": "rgba(148,163,184,0.3)",
        "--muted": "#64748b",
        "--muted-dim": "#94a3b8",
        "--surface": "rgba(0,0,0,0.03)",
        "--surface-hover": "rgba(0,0,0,0.06)",
        "--nav-bg": "rgba(255,255,255,0.92)",
        "--footer-bg": "rgba(248,250,252,0.8)",
      };
      Object.entries(vars).forEach(([k, v]) => html.style.setProperty(k, v));
    } else {
      html.classList.add("dark");
      html.classList.remove("light");
      // Remove inline overrides so :root defaults apply
      [
        "--background", "--foreground", "--neon-green", "--neon-purple", "--neon-yellow",
        "--card-bg", "--card-border", "--glass-bg", "--code-bg", "--code-border",
        "--muted", "--muted-dim", "--surface", "--surface-hover", "--nav-bg", "--footer-bg",
      ].forEach((k) => html.style.removeProperty(k));
    }
  }, [theme]);

  const setLanguage = useCallback((lang: Language) => {
    setSelectedLanguage(lang);
  }, []);

  const setView = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const setCurrentModule = useCallback((mod: number) => {
    setCurrentModuleState(mod);
  }, []);

  const completeModule = useCallback((mod: number) => {
    setCompletedModules((prev) => (prev.includes(mod) ? prev : [...prev, mod]));
  }, []);

  const resetAll = useCallback(() => {
    setSelectedLanguage(null);
    setCurrentView("onboarding");
    setCompletedModules([]);
    setCurrentModuleState(0);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "tr" : "en"));
  }, []);

  // Translation function with variable interpolation
  const t = useCallback(
    (key: string, vars?: Record<string, string>): string => {
      let text = translations[locale][key] || translations["en"][key] || key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        });
      }
      return text;
    },
    [locale]
  );

  const languageLabel = selectedLanguage ? LANGUAGE_LABELS[selectedLanguage] : "";

  return (
    <AppContext.Provider
      value={{
        selectedLanguage,
        currentView,
        completedModules,
        currentModule,
        theme,
        locale,
        setLanguage,
        setView,
        setCurrentModule,
        completeModule,
        resetAll,
        toggleTheme,
        toggleLocale,
        t,
        languageLabel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
