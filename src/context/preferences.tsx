"use client";
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import type { Language } from "@/types/profile";
import { translations } from "@/i18n/translations";
import { profiles } from "@/data/profile";

interface PreferencesValue {
  language: Language;
  setLanguage: (value: Language) => void;
  theme: string;
  toggleTheme: () => void;
}
const Preferences = createContext<PreferencesValue | null>(null);
let memoryLanguage: Language = "nl";
function subscribe(callback: () => void) {
  window.addEventListener("lk-preferences", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("lk-preferences", callback);
    window.removeEventListener("storage", callback);
  };
}
function readLanguage(): Language {
  try {
    return localStorage.getItem("lk-language") === "en" ? "en" : "nl";
  } catch {
    return memoryLanguage;
  }
}
function readTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = useSyncExternalStore(
    subscribe,
    readLanguage,
    () => "nl" as Language,
  );
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light");
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  function changeLanguage(value: Language) {
    memoryLanguage = value;
    try {
      localStorage.setItem("lk-language", value);
    } catch {
      /* Keep the in-memory preference when storage is unavailable. */
    }
    window.dispatchEvent(new Event("lk-preferences"));
  }
  function toggleTheme() {
    const value = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = value;
    try {
      localStorage.setItem("lk-theme", value);
    } catch {
      /* The current page still changes theme. */
    }
    window.dispatchEvent(new Event("lk-preferences"));
  }
  return (
    <Preferences.Provider
      value={{ language, setLanguage: changeLanguage, theme, toggleTheme }}
    >
      {children}
    </Preferences.Provider>
  );
}
export function usePreferences() {
  const context = useContext(Preferences);
  if (!context) throw new Error("PreferencesProvider is required");
  return {
    ...context,
    t: translations[context.language],
    profile: profiles[context.language],
  };
}
