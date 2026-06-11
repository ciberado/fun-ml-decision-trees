import { ca } from "./ca.js";
import { en } from "./en.js";
import { es } from "./es.js";

const CATALOG = {
  en,
  es,
  ca
};

export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = Object.keys(CATALOG);
export const LOCALE_OPTIONS = SUPPORTED_LOCALES.map((locale) => ({
  value: locale,
  label: CATALOG[locale].meta.languageName
}));

const SESSION_LOCALE_KEY = "decision-lessons-locale";

export function resolveLocale(locale) {
  const normalized = String(locale ?? "")
    .trim()
    .toLowerCase()
    .split("-")[0];

  return CATALOG[normalized] ? normalized : DEFAULT_LOCALE;
}

export function getStoredLocale() {
  try {
    return sessionStorage.getItem(SESSION_LOCALE_KEY);
  } catch {
    return null;
  }
}

export function storeLocale(locale) {
  const resolvedLocale = resolveLocale(locale);

  try {
    sessionStorage.setItem(SESSION_LOCALE_KEY, resolvedLocale);
  } catch {
    // Session persistence is a convenience; the app still works without storage.
  }

  return resolvedLocale;
}

export function detectInitialLocale() {
  const storedLocale = getStoredLocale();

  if (storedLocale) {
    return resolveLocale(storedLocale);
  }

  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }

  return resolveLocale(navigator.language ?? navigator.languages?.[0]);
}

export function getMessages(locale) {
  return CATALOG[resolveLocale(locale)];
}

export function translateClassLabel(label, locale) {
  if (label == null) {
    return getMessages(locale).common.unknown;
  }

  return getMessages(locale).classes[label] ?? label;
}

export function translateFeatureLabel(featureName, locale) {
  return getMessages(locale).features[featureName] ?? featureName;
}
