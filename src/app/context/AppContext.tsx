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

  // Apply theme class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "light") {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
      html.classList.remove("light");
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
