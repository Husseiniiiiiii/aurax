import type { Lang } from "../context/LanguageContext";

// Always use Latin digits (en-US locale) for numbers regardless of language
const NUMBER_LOCALE = "en-US";

/**
 * Format a price value that is already stored in IQD.
 * No conversion needed — values come from the DB in IQD.
 */
export function formatIqd(value: number, lang: Lang = "ar"): string {
  const formatted = value.toLocaleString(NUMBER_LOCALE);
  const currency = lang === "ar" ? "د.ع" : "IQD";
  return `${formatted} ${currency}`;
}

export function formatIqdNumber(value: number, _lang: Lang = "ar"): string {
  return value.toLocaleString(NUMBER_LOCALE);
}

export function currencyLabel(lang: Lang = "ar"): string {
  return lang === "ar" ? "د.ع" : "IQD";
}
