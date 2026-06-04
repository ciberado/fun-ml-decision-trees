import { getMessages, translateFeatureLabel } from "../i18n/index.js";

export function formatCondition(condition, locale = "en") {
  return `${translateFeatureLabel(condition.feature, locale)} ${condition.operator} ${condition.value}`;
}

export function formatPercent(value, locale = "en") {
  return new Intl.NumberFormat(getMessages(locale).meta.intlLocale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPrice(value, locale = "en") {
  if (value == null) {
    return getMessages(locale).common.unknown;
  }

  return new Intl.NumberFormat(getMessages(locale).meta.intlLocale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPricePerM2(row, locale = "en") {
  if (row.price == null) {
    return getMessages(locale).common.unknown;
  }

  return new Intl.NumberFormat(getMessages(locale).meta.intlLocale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(row.price / row.size);
}

export function describeFallback(reason, locale = "en") {
  const messages = getMessages(locale);

  if (reason === "tie") {
    return messages.fallback.tie;
  }

  if (reason === "empty") {
    return messages.fallback.empty;
  }

  return messages.fallback.majority;
}
