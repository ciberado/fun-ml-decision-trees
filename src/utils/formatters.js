import { FEATURE_CONFIG } from "../domain/config.js";

export function formatCondition(condition) {
  const feature = FEATURE_CONFIG[condition.feature];
  return `${feature.label} ${condition.operator} ${condition.value}`;
}

export function formatPercent(value) {
  return `${Math.round(value * 1000) / 10}%`;
}

export function formatPrice(value) {
  return value == null ? "?" : `€${value}`;
}

export function formatPricePerM2(row) {
  if (row.price == null) {
    return "?";
  }

  return `€${(row.price / row.size).toFixed(2)}`;
}

export function describeFallback(reason) {
  if (reason === "tie") {
    return "Global majority fallback used because the leaf is tied.";
  }

  if (reason === "empty") {
    return "Global majority fallback used because the leaf has no known rows.";
  }

  return "Leaf uses a direct majority vote.";
}
