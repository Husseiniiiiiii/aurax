import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations, type TranslationKey } from "../i18n/translations";

export type Lang = "ar" | "en";

interface LanguageContextValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  toggleLang: () => void;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "aurax-lang";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "ar";
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored === "ar" || stored === "en") return stored;
  return "ar";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", dir);
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const toggleLang = useCallback(
    () => setLangState((p) => (p === "ar" ? "en" : "ar")),
    []
  );
  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: TranslationKey) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] ?? entry.ar ?? key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, dir, toggleLang, setLang, t }),
    [lang, dir, toggleLang, setLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
