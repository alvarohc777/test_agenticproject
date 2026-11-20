import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import en from "../../content/i18n/en.json";
import de from "../../content/i18n/de.json";

export const LANGUAGES = ["en", "de"] as const;
export type Language = (typeof LANGUAGES)[number];
export type Messages = Record<Language, Record<string, string>>;

const shared: Messages = { en, de };

type I18n = { lang: Language; setLang: (l: Language) => void; t: (key: string) => string; locale: string };
const I18nContext = createContext<I18n | null>(null);

/**
 * Shared strings come from content/i18n; each feature brings its own strings
 * (namespaced by feature id) so translations never conflict between features.
 */
export function I18nProvider({ extra, children }: { extra: Messages; children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const value = useMemo<I18n>(() => {
    const dict = { ...shared.en, ...extra.en, ...shared[lang], ...extra[lang] };
    return {
      lang,
      setLang,
      t: (key) => dict[key] ?? key,
      locale: lang === "de" ? "de-CH" : "en-CH",
    };
  }, [lang, extra]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
