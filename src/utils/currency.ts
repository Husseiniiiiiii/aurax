import type { Lang } from "../context/LanguageContext";

const SAR_TO_IQD = 350;
const ROUND_STEP = 250;

// Always use Latin digits (en-US locale) for numbers regardless of language
const NUMBER_LOCALE = "en-US";

export function toIqd(value: number): number {
  return Math.round((value * SAR_TO_IQD) / ROUND_STEP) * ROUND_STEP;
}

export function formatIqd(value: number, lang: Lang = "ar"): string {
  const iqd = toIqd(value);
  const formatted = iqd.toLocaleString(NUMBER_LOCALE);
  const currency = lang === "ar" ? "د.ع" : "IQD";
  return `${formatted} ${currency}`;
}

export function formatIqdNumber(value: number, _lang: Lang = "ar"): string {
  const iqd = toIqd(value);
  return iqd.toLocaleString(NUMBER_LOCALE);
}

export function currencyLabel(lang: Lang = "ar"): string {
  return lang === "ar" ? "د.ع" : "IQD";
}
